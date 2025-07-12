import fetch from "node-fetch";
import { uploadToS3 } from "./storage-s3.js";
import sqliteDatabase from "./database.sqlite.js";

class BulkImageFetcher {
  constructor() {
    this.db = sqliteDatabase;
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
    this.isRunning = false;
    this.progress = {
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
    };
  }

  async fetchAllBusinessImages() {
    if (this.isRunning) {
      throw new Error("Image fetching is already running");
    }

    this.isRunning = true;
    this.progress = {
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
    };

    try {
      console.log("🚀 Starting SUPER FAST bulk image fetching process...");

      // Get all businesses that need image processing
      const businesses = await this.getBusinessesNeedingImages();
      this.progress.total = businesses.length;

      console.log(
        `📊 Found ${businesses.length} businesses that need image processing`,
      );

      // Process in parallel batches of 10 for super fast processing
      const BATCH_SIZE = 10;
      const batches = [];

      for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
        batches.push(businesses.slice(i, i + BATCH_SIZE));
      }

      console.log(
        `🔥 Processing ${batches.length} parallel batches of ${BATCH_SIZE} businesses each`,
      );

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];

        console.log(
          `\n🚀 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} businesses)`,
        );

        // Process entire batch in parallel
        const batchPromises = batch.map(async (business, businessIndex) => {
          try {
            if (!business.googlePlaceId) {
              this.progress.skipped++;
              return;
            }

            // Check if business already has all images
            if (this.hasAllImages(business)) {
              this.progress.skipped++;
              this.progress.processed++;
              return;
            }

            // Fetch place details to get photos
            const placeDetails = await this.fetchPlaceDetails(
              business.googlePlaceId,
            );

            if (
              !placeDetails ||
              !placeDetails.photos ||
              placeDetails.photos.length === 0
            ) {
              this.progress.failed++;
              this.progress.processed++;
              return;
            }

            // Process photos (logo, cover, gallery)
            const imageUrls = await this.processBusinessPhotos(
              business,
              placeDetails.photos,
            );

            // Update database with image URLs
            await this.updateBusinessImages(business.id, imageUrls);

            this.progress.successful++;
            this.progress.processed++;

            console.log(
              `  ✅ [${batchIndex * BATCH_SIZE + businessIndex + 1}] ${business.name}`,
            );
          } catch (error) {
            console.error(
              `  ❌ [${batchIndex * BATCH_SIZE + businessIndex + 1}] ${business.name}:`,
              error.message,
            );
            this.progress.failed++;
            this.progress.processed++;
          }
        });

        // Wait for entire batch to complete
        await Promise.all(batchPromises);

        // Minimal delay between batches (reduced from 100ms per business to 50ms per batch)
        await this.delay(50);

        // Log progress every batch
        console.log(
          `📈 Batch ${batchIndex + 1}/${batches.length} completed - Total Progress: ${this.progress.processed}/${this.progress.total} (${Math.round((this.progress.processed / this.progress.total) * 100)}%)`,
        );
      }

      console.log("\n🎉 SUPER FAST bulk image fetching completed!");
      console.log(`📊 Final stats:`, this.progress);

      return {
        success: true,
        progress: this.progress,
        message: "Super fast bulk image fetching completed successfully",
      };
    } catch (error) {
      console.error("❌ Bulk image fetching failed:", error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  async getBusinessesNeedingImages() {
    return new Promise((resolve, reject) => {
      // Get businesses that don't have logo, coverImage, or gallery
      const sql = `
        SELECT id, googlePlaceId, name, logo, coverImage, gallery
        FROM businesses
        WHERE googlePlaceId IS NOT NULL
        AND (logo IS NULL OR logo = '' OR coverImage IS NULL OR coverImage = '' OR gallery IS NULL OR gallery = '')
        ORDER BY createdAt DESC
      `;

      this.db.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  hasAllImages(business) {
    return (
      business.logo &&
      business.logo.trim() !== "" &&
      business.coverImage &&
      business.coverImage.trim() !== "" &&
      business.gallery &&
      business.gallery.trim() !== ""
    );
  }

  async fetchPlaceDetails(placeId) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(
          `Google Places API error: ${data.status} - ${data.error_message || "Unknown error"}`,
        );
      }

      return data.result;
    } catch (error) {
      console.error("Error fetching place details:", error);
      throw error;
    }
  }

  async processBusinessPhotos(business, photos) {
    const imageUrls = {
      logo: null,
      coverImage: null,
      gallery: [],
    };

    try {
      // Process up to 5 photos (1 for logo, 1 for cover, 3 for gallery) IN PARALLEL
      const maxPhotos = Math.min(photos.length, 5);

      // Create all photo processing promises simultaneously for parallel execution
      const photoPromises = photos.slice(0, maxPhotos).map(async (photo, i) => {
        try {
          // Download photo from Google Places
          const photoUrl = this.getPhotoUrl(photo.photo_reference, 800); // Max width 800px
          const imageBuffer = await this.downloadImage(photoUrl);

          // Create file object for S3 upload
          const file = {
            buffer: imageBuffer,
            originalname: `${business.name.replace(/[^a-zA-Z0-9]/g, "_")}_${i}.jpg`,
            mimetype: "image/jpeg",
            size: imageBuffer.length,
          };

          // Upload to S3
          const uploadResult = await uploadToS3(file, "business-images");

          return {
            index: i,
            url: uploadResult.publicUrl,
            success: true,
          };
        } catch (error) {
          console.error(
            `  ❌ Failed to process photo ${i + 1}:`,
            error.message,
          );
          return {
            index: i,
            success: false,
            error: error.message,
          };
        }
      });

      // Wait for all photos to process in parallel
      const results = await Promise.all(photoPromises);

      // Assign results to appropriate fields
      results.forEach((result) => {
        if (result.success) {
          if (result.index === 0 && !business.logo) {
            imageUrls.logo = result.url;
          } else if (result.index === 1 && !business.coverImage) {
            imageUrls.coverImage = result.url;
          } else {
            imageUrls.gallery.push(result.url);
          }
        }
      });

      const successCount = results.filter((r) => r.success).length;
      console.log(
        `  ✅ Uploaded ${successCount}/${maxPhotos} images in parallel`,
      );
    } catch (error) {
      console.error("Error processing business photos:", error);
    }

    return imageUrls;
  }

  async getPhotoUrl(photoReference, maxWidth = 800) {
    return `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=${maxWidth}&key=${this.apiKey}`;
  }

  async downloadImage(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.buffer();
      return buffer;
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error;
    }
  }

  async updateBusinessImages(businessId, imageUrls) {
    return new Promise((resolve, reject) => {
      const updates = [];
      const params = [];

      if (imageUrls.logo) {
        updates.push("logo = ?");
        params.push(imageUrls.logo);
      }

      if (imageUrls.coverImage) {
        updates.push("coverImage = ?");
        params.push(imageUrls.coverImage);
      }

      if (imageUrls.gallery && imageUrls.gallery.length > 0) {
        updates.push("gallery = ?");
        params.push(JSON.stringify(imageUrls.gallery));
      }

      if (updates.length === 0) {
        resolve();
        return;
      }

      params.push(new Date().toISOString()); // updatedAt
      params.push(businessId);

      const sql = `
        UPDATE businesses
        SET ${updates.join(", ")}, updatedAt = ?
        WHERE id = ?
      `;

      this.db.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getProgress() {
    return {
      isRunning: this.isRunning,
      progress: this.progress,
    };
  }

  async stop() {
    if (this.isRunning) {
      this.isRunning = false;
      console.log("⏹️ Bulk image fetching stopped by user");
      return { success: true, message: "Image fetching stopped" };
    }
    return { success: false, message: "No image fetching process running" };
  }
}

// Export the class and create a singleton instance
const bulkImageFetcher = new BulkImageFetcher();
export default bulkImageFetcher;
export { BulkImageFetcher };
