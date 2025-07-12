import GooglePlacesAPI from "./google-places.js";
import database from "./database.js";
import sqliteDatabase from "./database.sqlite.js";

class BusinessScraper {
  constructor(googleApiKey) {
    this.placesAPI = new GooglePlacesAPI(googleApiKey);
    this.isRunning = false;
    this.currentJob = null;
    this.shouldStop = false;
  }

  // Main scraping method
  async scrapeBusinesses(config) {
    const {
      cities = [],
      categories = [],
      maxResultsPerSearch = 20,
      delay = 500, // Delay between API calls
      jobId = null,
    } = config;

    if (this.isRunning) {
      throw new Error("Scraper is already running");
    }

    this.isRunning = true;
    this.shouldStop = false;
    this.currentJob = jobId;
    const totalSearches = cities.length * categories.length;
    let currentSearch = 0;
    let totalBusinesses = 0;
    let duplicatesSkipped = 0;
    let errors = [];

    try {
      // Update job status
      if (jobId) {
        await database.updateScrapingJob(jobId, {
          status: "running",
          startedAt: new Date().toISOString(),
          totalSearches,
          progress: 0,
        });
      }

      for (const city of cities) {
        // Check if scraping should stop
        if (this.shouldStop || !this.isRunning) {
          console.log("🛑 Scraping stopped by user request");
          break;
        }

        for (const category of categories) {
          // Check if scraping should stop
          if (this.shouldStop || !this.isRunning) {
            console.log("🛑 Scraping stopped by user request");
            break;
          }

          try {
            console.log(`🔍 Searching for ${category} in ${city}...`);

            // Search for places
            const places = await this.placesAPI.searchPlaces(
              category,
              city,
              10000, // 10km radius
              "establishment",
            );

            console.log(
              `📍 Found ${places.length} places for ${category} in ${city}`,
            );

            // Process each place
            const processedBusinesses = [];
            for (
              let i = 0;
              i < Math.min(places.length, maxResultsPerSearch);
              i++
            ) {
              // Check if scraping should stop
              if (this.shouldStop || !this.isRunning) {
                console.log("🛑 Scraping stopped by user request");
                break;
              }

              const place = places[i];

              try {
                // Get detailed information
                const placeDetails = await this.placesAPI.getPlaceDetails(
                  place.place_id,
                );

                // Extract and process business data with city information
                const businessData = await this.placesAPI.extractBusinessData(
                  placeDetails,
                  category,
                );

                // Enhanced business data with scraping metadata
                if (businessData && businessData.name) {
                  businessData.scrapedCity = city;
                  businessData.scrapedCategory = category;
                  businessData.scrapedAt = new Date().toISOString();

                  // Store ALL reviews (no limit)
                  businessData.reviewsNote = `Stored ${businessData.reviews?.length || 0} reviews (all available)`;
                }

                // Check if business already exists in SQLite database
                const existingBusiness = await sqliteDatabase.getBusinessById(
                  place.place_id,
                );
                if (existingBusiness) {
                  duplicatesSkipped++;
                  console.log(
                    `⏭️  Duplicate found: ${businessData.name} (${place.place_id}) - Skipping...`,
                  );
                  // Just count it but don't add to processed (to avoid duplicates in results)
                  continue;
                }

                // Save new business to both databases (SQLite primary, memory for jobs)
                const saveResult =
                  await sqliteDatabase.saveBusiness(businessData);
                const memoryResult = await database.saveBusiness(businessData);

                if (saveResult.success) {
                  processedBusinesses.push(saveResult.business);
                  totalBusinesses++;
                  console.log(
                    `✅ Saved to SQLite: ${businessData.name} | Reviews: ${businessData.reviews?.length || 0} | Images: ${businessData.images?.length || 0} (GCS) | City: ${city}`,
                  );
                } else {
                  console.error(
                    `❌ Failed to save to SQLite: ${businessData.name}`,
                    saveResult.error,
                  );
                  errors.push(
                    `Failed to save ${businessData.name}: ${saveResult.error}`,
                  );
                }

                // Respect API rate limits
                await this.delay(delay);
              } catch (error) {
                console.error(
                  `❌ Error processing place ${place.name}:`,
                  error.message,
                );
                errors.push(`Error processing ${place.name}: ${error.message}`);
              }
            }

            currentSearch++;
            const progress = Math.round((currentSearch / totalSearches) * 100);

            // Update job progress with detailed city-wise breakdown
            if (jobId) {
              const currentJob = database.getScrapingJob(jobId);
              const allResults = [
                ...(currentJob?.results || []),
                ...processedBusinesses,
              ];

              await database.updateScrapingJob(jobId, {
                progress,
                totalBusinesses,
                currentCity: city,
                currentCategory: category,
                errors: errors.slice(-10), // Keep last 10 errors
                results: allResults,
                currentCityBusinesses: processedBusinesses.length,
                totalBusinessesSaved: allResults.length,
                cityProgress: {
                  city,
                  category,
                  businessesFound: processedBusinesses.length,
                  timestamp: new Date().toISOString(),
                },
              });
            }

            console.log(
              `📊 Progress: ${progress}% (${currentSearch}/${totalSearches}) | ${city} ${category}: ${processedBusinesses.length} new businesses | Total: ${totalBusinesses} | Duplicates skipped: ${duplicatesSkipped}`,
            );
          } catch (error) {
            console.error(
              `❌ Error searching ${category} in ${city}:`,
              error.message,
            );
            errors.push(
              `Error searching ${category} in ${city}: ${error.message}`,
            );
          }
        }
        // Exit outer loop if stopped
        if (this.shouldStop || !this.isRunning) {
          break;
        }
      }

      // Complete the job
      if (jobId) {
        const finalStatus = this.shouldStop ? "cancelled" : "completed";
        await database.updateScrapingJob(jobId, {
          status: finalStatus,
          completedAt: new Date().toISOString(),
          progress: this.shouldStop
            ? Math.round((currentSearch / totalSearches) * 100)
            : 100,
          totalBusinesses,
          errors,
        });
      }

      const statusMessage = this.shouldStop
        ? `🛑 Scraping stopped! Added ${totalBusinesses} businesses before stopping`
        : `🎉 Scraping completed! Added ${totalBusinesses} new businesses, skipped ${duplicatesSkipped} duplicates`;

      console.log(statusMessage);

      return {
        success: true,
        totalBusinesses,
        duplicatesSkipped,
        totalSearches: currentSearch,
        errors,
        stopped: this.shouldStop,
      };
    } catch (error) {
      console.error("❌ Scraping failed:", error);

      if (jobId) {
        await database.updateScrapingJob(jobId, {
          status: "failed",
          error: error.message,
          completedAt: new Date().toISOString(),
        });
      }

      throw error;
    } finally {
      this.isRunning = false;
      this.currentJob = null;
      this.shouldStop = false;
    }
  }

  // Scrape specific business by place ID
  async scrapeBusinessById(placeId, category = "Immigration Services") {
    try {
      console.log(`🔍 Fetching business details for place ID: ${placeId}`);

      const placeDetails = await this.placesAPI.getPlaceDetails(placeId);
      const businessData = await this.placesAPI.extractBusinessData(
        placeDetails,
        category,
      );

      const saveResult = await database.saveBusiness(businessData);

      if (saveResult.success) {
        console.log(`✅ Successfully scraped and saved: ${businessData.name}`);
        return saveResult;
      } else {
        throw new Error(saveResult.error);
      }
    } catch (error) {
      console.error("❌ Single business scraping failed:", error);
      throw error;
    }
  }

  // Fetch ALL reviews for existing businesses
  async fetchAllReviewsForExistingBusinesses() {
    try {
      console.log(
        "🔍 Starting to fetch ALL reviews for existing businesses...",
      );

      // Get all businesses from SQLite database
      const allBusinessesResult = await sqliteDatabase.getBusinesses({
        limit: 9999,
      });
      const businesses = allBusinessesResult.businesses || [];

      console.log(
        `📊 Found ${businesses.length} businesses to fetch reviews for`,
      );

      if (businesses.length === 0) {
        return {
          success: true,
          message: "No businesses found in database",
          totalBusinesses: 0,
          totalReviews: 0,
        };
      }

      let totalReviewsFetched = 0;
      let businessesUpdated = 0;
      const errors = [];

      for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i];

        try {
          if (!business.googlePlaceId) {
            console.log(`⏭️ Skipping ${business.name} - No Google Place ID`);
            continue;
          }

          console.log(
            `🔄 [${i + 1}/${businesses.length}] Fetching reviews for: ${business.name}`,
          );

          // Extract ALL reviews for this business
          const reviewsData = await this.placesAPI.extractAllReviews(
            business.googlePlaceId,
          );

          if (reviewsData.reviews.length > 0) {
            // Save reviews to database (will replace existing reviews)
            await sqliteDatabase.saveReviews(business.id, reviewsData.reviews);

            totalReviewsFetched += reviewsData.reviews.length;
            businessesUpdated++;

            console.log(
              `✅ Updated ${business.name} with ${reviewsData.reviews.length} reviews`,
            );
          } else {
            console.log(`📝 No reviews found for ${business.name}`);
          }

          // Add delay to respect API rate limits
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(
            `❌ Error fetching reviews for ${business.name}:`,
            error.message,
          );
          errors.push(`${business.name}: ${error.message}`);
        }
      }

      // Update statistics
      await sqliteDatabase.updateStatistics();

      console.log(
        `🎉 Review fetching completed! Updated ${businessesUpdated} businesses with ${totalReviewsFetched} total reviews`,
      );

      return {
        success: true,
        totalBusinesses: businesses.length,
        businessesUpdated,
        totalReviewsFetched,
        errors,
        message: `Successfully fetched ${totalReviewsFetched} reviews for ${businessesUpdated} businesses`,
      };
    } catch (error) {
      console.error("❌ Error fetching all reviews:", error);
      throw error;
    }
  }

  // Get scraping status
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentJob: this.currentJob,
    };
  }

  // Stop current scraping job
  async stopScraping() {
    console.log(
      `🛑 Stop scraping called. Current state: isRunning=${this.isRunning}, currentJob=${this.currentJob}`,
    );

    if (this.isRunning || this.currentJob) {
      // Set flags to stop the scraping process
      this.isRunning = false;
      this.shouldStop = true;

      if (this.currentJob) {
        try {
          await database.updateScrapingJob(this.currentJob, {
            status: "cancelled",
            completedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error updating job status:", error);
        }
        this.currentJob = null;
      }

      console.log("✅ Scraping stopped successfully");
      return { success: true, message: "Scraping stopped successfully" };
    }

    return { success: false, message: "No active scraping job" };
  }

  // Utility method for delays
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get recommended search configurations
  getRecommendedConfigs() {
    return {
      visa_consultants: {
        categories: [
          "visa consultant",
          "immigration lawyer",
          "travel agency",
          "immigration services",
          "study abroad consultant",
        ],
        cities: [
          "Delhi",
          "Mumbai",
          "Bangalore",
          "Chennai",
          "Hyderabad",
          "Kolkata",
          "Pune",
          "Ahmedabad",
          "Jaipur",
          "Lucknow",
        ],
        maxResultsPerSearch: 15,
        delay: 500,
      },
      student_visa: {
        categories: [
          "study abroad consultant",
          "education consultant",
          "student visa services",
          "overseas education",
        ],
        cities: [
          "Delhi",
          "Mumbai",
          "Bangalore",
          "Chennai",
          "Pune",
          "Hyderabad",
          "Chandigarh",
          "Jaipur",
          "Kochi",
        ],
        maxResultsPerSearch: 10,
        delay: 400,
      },
      immigration_lawyers: {
        categories: [
          "immigration lawyer",
          "immigration attorney",
          "legal services immigration",
          "visa lawyer",
        ],
        cities: [
          "Delhi",
          "Mumbai",
          "Bangalore",
          "Chennai",
          "Gurgaon",
          "Noida",
          "Pune",
          "Hyderabad",
        ],
        maxResultsPerSearch: 8,
        delay: 600,
      },
    };
  }

  // Validate Google Places API key
  async validateApiKey() {
    try {
      const testResult = await this.placesAPI.searchPlaces(
        "visa consultant",
        "Delhi",
        1000,
      );
      return { valid: true, message: "API key is valid" };
    } catch (error) {
      return {
        valid: false,
        message: error.message.includes("API")
          ? "Invalid API key"
          : "API connection failed",
      };
    }
  }
}

export default BusinessScraper;
