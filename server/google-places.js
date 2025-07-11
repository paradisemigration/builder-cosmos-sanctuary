import fetch from "node-fetch";
import { uploadToGCS } from "./storage.js";
import { uploadToS3 } from "./storage-s3.js";

class GooglePlacesAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://maps.googleapis.com/maps/api/place";
  }

  // Search for businesses by query and location
  async searchPlaces(query, location, radius = 5000, type = null) {
    try {
      const searchParams = new URLSearchParams({
        query: `${query} ${location}`,
        key: this.apiKey,
        radius: radius.toString(),
        ...(type && { type }),
      });

      const response = await fetch(
        `${this.baseUrl}/textsearch/json?${searchParams}`,
      );

      if (!response.ok) {
        throw new Error(`Places API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        throw new Error(
          `Places API error: ${data.status} - ${data.error_message || "Unknown error"}`,
        );
      }

      return data.results || [];
    } catch (error) {
      console.error("Search places error:", error);
      throw error;
    }
  }

  // Get detailed place information
  async getPlaceDetails(placeId) {
    try {
      const fields = [
        "place_id",
        "name",
        "formatted_address",
        "formatted_phone_number",
        "international_phone_number",
        "website",
        "business_status",
        "rating",
        "user_ratings_total",
        "reviews",
        "photos",
        "geometry",
        "types",
        "opening_hours",
        "price_level",
        "permanently_closed",
        "plus_code",
        "url",
      ].join(",");

      const response = await fetch(
        `${this.baseUrl}/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`,
      );

      if (!response.ok) {
        throw new Error(`Place details API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(
          `Place details error: ${data.status} - ${data.error_message || "Unknown error"}`,
        );
      }

      return data.result;
    } catch (error) {
      console.error("Get place details error:", error);
      throw error;
    }
  }

  // Download and upload photo to Google Cloud Storage
  async downloadAndStorePhoto(
    photoReference,
    maxWidth = 800,
    folder = "google-places",
  ) {
    try {
      const photoUrl = `${this.baseUrl}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;

      const response = await fetch(photoUrl);
      if (!response.ok) {
        throw new Error(`Photo download error: ${response.status}`);
      }

      // Convert response to buffer
      const buffer = await response.buffer();

      // Create a file-like object for upload
      const file = {
        originalname: `google-place-${photoReference}.jpg`,
        buffer: buffer,
        mimetype: "image/jpeg",
        size: buffer.length,
      };

      // Upload to Google Cloud Storage
      const result = await uploadToGCS(file, folder);
      return result.publicUrl;
    } catch (error) {
      console.error("Photo download/upload error:", error);
      return null;
    }
  }

  // Download and store a photo in AWS S3 for scraped businesses
  async downloadAndStorePhotoToS3(photoReference, placeId, imageIndex) {
    try {
      console.log(
        `📸 Downloading image ${imageIndex + 1} for place: ${placeId}`,
      );

      // Get the full-size photo URL from Google Places
      const photoUrl = `${this.baseUrl}/photo?maxwidth=800&photoreference=${photoReference}&key=${this.apiKey}`;

      // Download the image
      const response = await fetch(photoUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const imageBuffer = await response.buffer();

      // Create file object for S3 upload
      const file = {
        buffer: imageBuffer,
        originalname: `scraped_${placeId}_${imageIndex + 1}.jpg`,
        mimetype: "image/jpeg",
        size: imageBuffer.length,
      };

      // Determine folder based on image index
      const folder =
        imageIndex === 0 ? "logos" : imageIndex === 1 ? "covers" : "gallery";

      // Upload to S3
      const s3Result = await uploadToS3(file, folder);

      console.log(
        `✅ Image ${imageIndex + 1} uploaded to S3: ${s3Result.publicUrl}`,
      );
      return s3Result.publicUrl;
    } catch (error) {
      console.error(
        `❌ Error downloading/storing photo ${imageIndex + 1}:`,
        error,
      );
      return null;
    }
  }

  // Process and extract business data
  async extractBusinessData(placeData, category = "Immigration Services") {
    try {
      const {
        place_id,
        name,
        formatted_address,
        formatted_phone_number,
        international_phone_number,
        website,
        rating,
        user_ratings_total,
        reviews = [],
        photos = [],
        geometry,
        types = [],
        opening_hours,
        business_status,
      } = placeData;

      // Extract city from address
      const addressParts = formatted_address?.split(",") || [];
      const city = this.extractCityFromAddress(addressParts);

      // Download and store photos in AWS S3
      const imageUrls = [];
      const imagesForDB = [];
      let logo = null;

      // Process up to 5 photos
      const photosToProcess = photos.slice(0, 5);
      for (let i = 0; i < photosToProcess.length; i++) {
        const photo = photosToProcess[i];
        const imageUrl = await this.downloadAndStorePhotoToS3(
          photo.photo_reference,
          place_id,
          i,
        );
        if (imageUrl) {
          if (i === 0) {
            logo = imageUrl; // First image as logo
          }
          imageUrls.push(imageUrl);

          // Format image data for SQLite database
          imagesForDB.push({
            photoReference: photo.photo_reference,
            height: photo.height,
            width: photo.width,
            htmlAttributions: photo.html_attributions || [],
            cloudStorageUrl: imageUrl, // GCS URL
          });
        }

        // Add delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Process ALL reviews (no limit)
      const processedReviews = reviews.map((review, index) => ({
        id: `google_${place_id}_${index}`,
        userId: `google_user_${review.author_name?.replace(/\s+/g, "_").toLowerCase()}`,
        userName: review.author_name || "Anonymous",
        userAvatar: review.profile_photo_url || null,
        rating: review.rating || 0,
        comment: review.text || "",
        isVerified: true,
        date: new Date(review.time * 1000).toISOString().split("T")[0],
        source: "google_places",
      }));

      // Create business object
      const businessData = {
        // Core info
        googlePlaceId: place_id,
        name: name || "Unknown Business",
        category,
        description: this.generateDescription(name, types, city),

        // Contact info
        address: formatted_address || "",
        city: city || "Unknown",
        state: this.extractStateFromAddress(addressParts),
        pincode: this.extractPincodeFromAddress(formatted_address),
        phone: formatted_phone_number || international_phone_number || "",
        email: "", // Not available from Places API
        website: website || "",

        // Media - with AWS S3 storage
        logo: logo || "/api/placeholder/80/80",
        coverImage: imageUrls[1] || "/api/placeholder/800/400",
        gallery: JSON.stringify(imageUrls.slice(2) || []), // Store gallery as JSON string

        // Ratings & Reviews
        rating: rating || 0,
        reviewCount: user_ratings_total || 0,
        reviews: processedReviews,

        // Images for SQLite database
        images: imagesForDB,

        // Location
        coordinates: geometry?.location
          ? {
              lat: geometry.location.lat,
              lng: geometry.location.lng,
            }
          : { lat: 0, lng: 0 },

        // Business details
        services: this.generateServices(types, category),
        languages: ["Hindi", "English"],
        specializations: this.generateSpecializations(types),
        countriesServed: ["India", "USA", "Canada", "UK", "Australia"],

        // Status
        isVerified: business_status === "OPERATIONAL",
        isFeatured: rating >= 4.5,
        plan: rating >= 4.0 ? "premium" : "free",

        // Hours
        openingHours: this.processOpeningHours(opening_hours),

        // Meta
        source: "google_places",
        importedAt: new Date().toISOString(),
        googleMapsUrl: `https://maps.google.com/place/?q=place_id:${place_id}`,
      };

      return businessData;
    } catch (error) {
      console.error("Extract business data error:", error);
      throw error;
    }
  }

  // Extract ALL available reviews for a business
  // Note: Google Places API limits to ~5 reviews max per place by design
  async extractAllReviews(placeId) {
    try {
      console.log(`🔍 Fetching ALL available reviews for place ID: ${placeId}`);

      const placeDetails = await this.getPlaceDetails(placeId);
      const { reviews = [], user_ratings_total = 0 } = placeDetails;

      console.log(
        `📝 Found ${reviews.length} reviews for place ${placeId} (Google API limit: max ~5 reviews, business has ${user_ratings_total} total reviews)`,
      );

      // Process ALL available reviews (Google API provides max ~5)
      const processedReviews = reviews.map((review, index) => ({
        id: `google_${placeId}_${index}`,
        authorName: review.author_name || "Anonymous",
        authorUrl: review.author_url || null,
        language: review.language || "en",
        profilePhotoUrl: review.profile_photo_url || null,
        rating: review.rating || 0,
        relativeTimeDescription: review.relative_time_description || "",
        text: review.text || "",
        time: review.time || Date.now() / 1000,
        source: "google_places_api",
      }));

      return {
        placeId,
        totalReviews: processedReviews.length,
        businessTotalReviews: user_ratings_total,
        reviews: processedReviews,
        note: `Retrieved ${processedReviews.length} reviews (Google API maximum) out of ${user_ratings_total} total reviews for this business`,
      };
    } catch (error) {
      console.error(`Error extracting all reviews for ${placeId}:`, error);
      return {
        placeId,
        totalReviews: 0,
        reviews: [],
        error: error.message,
      };
    }
  }

  // Helper methods
  extractCityFromAddress(addressParts) {
    // Look for common Indian city patterns
    for (let part of addressParts) {
      const cleaned = part.trim();
      // Check if it's likely a city (not a state or country)
      if (
        cleaned &&
        !cleaned.includes("India") &&
        !cleaned.match(/^\d+/) && // Not a pincode
        cleaned.length > 2 &&
        cleaned.length < 30
      ) {
        return cleaned;
      }
    }
    return "Unknown";
  }

  extractStateFromAddress(addressParts) {
    const indianStates = [
      "Delhi",
      "Maharashtra",
      "Karnataka",
      "Tamil Nadu",
      "West Bengal",
      "Gujarat",
      "Rajasthan",
      "Punjab",
      "Haryana",
      "Uttar Pradesh",
      "Madhya Pradesh",
      "Bihar",
      "Odisha",
      "Telangana",
      "Andhra Pradesh",
      "Kerala",
      "Jharkhand",
      "Assam",
      "Chhattisgarh",
      "Uttarakhand",
    ];

    for (let part of addressParts) {
      const cleaned = part.trim();
      if (indianStates.some((state) => cleaned.includes(state))) {
        return cleaned;
      }
    }
    return "Unknown";
  }

  extractPincodeFromAddress(address) {
    const pincodeMatch = address?.match(/\b\d{6}\b/);
    return pincodeMatch ? pincodeMatch[0] : "";
  }

  generateDescription(name, types, city) {
    const businessTypes = types
      .filter((type) => !["establishment", "point_of_interest"].includes(type))
      .map((type) => type.replace(/_/g, " "));

    return `${name} is a trusted ${businessTypes.join(", ")} located in ${city}. We provide professional visa and immigration services to help you achieve your international travel and settlement goals.`;
  }

  generateServices(types, category) {
    const serviceMap = {
      "Immigration Services": [
        "Visa Consultation",
        "Document Preparation",
        "Application Processing",
        "Immigration Guidance",
      ],
      "Student Visa Consultants": [
        "Student Visa Assistance",
        "University Applications",
        "Scholarship Guidance",
        "Study Abroad Consulting",
      ],
      "Work Visa Consultants": [
        "Work Permit Processing",
        "Employment Visa",
        "Job Placement Assistance",
        "Corporate Immigration",
      ],
    };

    return (
      serviceMap[category] || [
        "Visa Services",
        "Immigration Consultation",
        "Document Assistance",
        "Travel Planning",
      ]
    );
  }

  generateSpecializations(types) {
    if (types.includes("travel_agency")) {
      return ["Travel Planning", "Tour Packages", "Visa Processing"];
    }
    if (types.includes("lawyer")) {
      return ["Legal Immigration", "Visa Appeals", "Legal Consultation"];
    }
    return ["Visa Processing", "Immigration Services", "Document Assistance"];
  }

  processOpeningHours(openingHours) {
    if (!openingHours || !openingHours.weekday_text) {
      return {
        Monday: "9:00 AM - 6:00 PM",
        Tuesday: "9:00 AM - 6:00 PM",
        Wednesday: "9:00 AM - 6:00 PM",
        Thursday: "9:00 AM - 6:00 PM",
        Friday: "9:00 AM - 6:00 PM",
        Saturday: "10:00 AM - 4:00 PM",
        Sunday: "Closed",
      };
    }

    const hours = {};
    openingHours.weekday_text.forEach((dayText) => {
      const [day, ...timeParts] = dayText.split(": ");
      hours[day] = timeParts.join(": ") || "Closed";
    });

    return hours;
  }
}

export default GooglePlacesAPI;
