import express from "express";
import cors from "cors";
import {
  uploadMiddleware,
  uploadToS3,
  uploadMultipleToS3,
  deleteFromS3,
  checkS3Configuration,
} from "./storage-s3.js";
import BusinessScraper from "./scraper.js";
import GooglePlaces from "./google-places.js";
import database from "./database.js";
import sqliteDatabase from "./database.sqlite.js";
import DataMigration from "./migrate-to-sqlite.js";

const app = express();

// Initialize business scraper and Google Places API
const scraper = new BusinessScraper(process.env.GOOGLE_PLACES_API_KEY);
const googlePlaces = new GooglePlaces(process.env.GOOGLE_PLACES_API_KEY);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// In-memory storage for demo (replace with database)
let businesses = [];
let businessIdCounter = 1;

// Upload single image
app.post(
  "/api/upload/single",
  uploadMiddleware.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const result = await uploadToS3(
        req.file,
        req.body.folder || "businesses",
      );

      res.json({
        success: true,
        data: result,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Upload multiple images
app.post(
  "/api/upload/multiple",
  uploadMiddleware.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const results = await uploadMultipleToS3(
        req.files,
        req.body.folder || "businesses",
      );

      res.json({
        success: true,
        data: results,
        message: `${results.length} images uploaded successfully`,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Upload business with images
app.post(
  "/api/businesses",
  uploadMiddleware.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const businessData = JSON.parse(req.body.businessData);

      // Upload logo if provided
      if (req.files?.logo?.[0]) {
        const logoResult = await uploadToS3(req.files.logo[0], "logos");
        businessData.logo = logoResult.publicUrl;
      }

      // Upload cover image if provided
      if (req.files?.coverImage?.[0]) {
        const coverResult = await uploadToS3(req.files.coverImage[0], "covers");
        businessData.coverImage = coverResult.publicUrl;
      }

      // Upload gallery images if provided
      if (req.files?.gallery?.length > 0) {
        const galleryResults = await uploadMultipleToS3(
          req.files.gallery,
          "gallery",
        );
        businessData.gallery = galleryResults.map((result) => result.publicUrl);
      }

      // Add business to storage (replace with database insert)
      const newBusiness = {
        ...businessData,
        id: businessIdCounter++,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      businesses.push(newBusiness);

      res.json({
        success: true,
        data: newBusiness,
        message: "Business created successfully",
      });
    } catch (error) {
      console.error("Business creation error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Get all businesses
app.get("/api/businesses", (req, res) => {
  const { page = 1, limit = 20, city, category, search } = req.query;

  let filteredBusinesses = [...businesses];

  // Filter by city
  if (city) {
    filteredBusinesses = filteredBusinesses.filter((b) =>
      b.city.toLowerCase().includes(city.toLowerCase()),
    );
  }

  // Filter by category
  if (category) {
    filteredBusinesses = filteredBusinesses.filter((b) =>
      b.category.toLowerCase().includes(category.toLowerCase()),
    );
  }

  // Search functionality
  if (search) {
    filteredBusinesses = filteredBusinesses.filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedBusinesses,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(filteredBusinesses.length / limit),
      totalRecords: filteredBusinesses.length,
      hasNext: endIndex < filteredBusinesses.length,
      hasPrev: startIndex > 0,
    },
  });
});

// Get single business
app.get("/api/businesses/:id", (req, res) => {
  const business = businesses.find((b) => b.id === parseInt(req.params.id));

  if (!business) {
    return res.status(404).json({
      success: false,
      error: "Business not found",
    });
  }

  res.json({
    success: true,
    data: business,
  });
});

// Update business
app.put(
  "/api/businesses/:id",
  uploadMiddleware.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const businessIndex = businesses.findIndex(
        (b) => b.id === parseInt(req.params.id),
      );

      if (businessIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Business not found",
        });
      }

      const businessData = JSON.parse(req.body.businessData);
      const existingBusiness = businesses[businessIndex];

      // Handle file uploads similar to create
      if (req.files?.logo?.[0]) {
        const logoResult = await uploadToS3(req.files.logo[0], "logos");
        businessData.logo = logoResult.publicUrl;
      }

      if (req.files?.coverImage?.[0]) {
        const coverResult = await uploadToS3(req.files.coverImage[0], "covers");
        businessData.coverImage = coverResult.publicUrl;
      }

      if (req.files?.gallery?.length > 0) {
        const galleryResults = await uploadMultipleToS3(
          req.files.gallery,
          "gallery",
        );
        businessData.gallery = galleryResults.map((result) => result.publicUrl);
      }

      // Update business
      businesses[businessIndex] = {
        ...existingBusiness,
        ...businessData,
        updatedAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        data: businesses[businessIndex],
        message: "Business updated successfully",
      });
    } catch (error) {
      console.error("Business update error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Delete business
app.delete("/api/businesses/:id", async (req, res) => {
  try {
    const businessIndex = businesses.findIndex(
      (b) => b.id === parseInt(req.params.id),
    );

    if (businessIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Business not found",
      });
    }

    const business = businesses[businessIndex];

    // TODO: Delete associated images from Google Cloud Storage
    // This would require tracking file names in the database

    businesses.splice(businessIndex, 1);

    res.json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Business deletion error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete image
app.delete("/api/images/:fileName", async (req, res) => {
  try {
    await deleteFromS3(req.params.fileName);

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Image deletion error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Test upload endpoint
app.get("/api/test-upload", (req, res) => {
  res.json({
    success: true,
    message: "Upload endpoint is ready",
    config: {
      maxFileSize: "10MB",
      allowedTypes: "images",
      googleCloudConfigured: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
    },
  });
});

// Verify image storage status with detailed GCS info
app.get("/api/images/status", async (req, res) => {
  try {
    console.log("🖼️ Loading image status...");

    const stats = await sqliteDatabase.getStatistics();
    console.log("✅ Stats loaded for image status");

    // Get sample businesses with images to check GCS status
    const businessResult = await sqliteDatabase.getBusinesses({ limit: 10 });
    const businesses = businessResult.businesses || [];
    console.log(`✅ Found ${businesses.length} businesses for image analysis`);

    // Count images with and without cloud storage URLs
    let totalImagesWithGCS = 0;
    let totalImagesWithoutGCS = 0;
    let sampleGCSUrl = null;
    let sampleBusinessWithImages = null;

    for (const business of businesses) {
      if (
        business.images &&
        Array.isArray(business.images) &&
        business.images.length > 0
      ) {
        sampleBusinessWithImages = business;
        for (const image of business.images) {
          if (
            image.cloudStorageUrl &&
            image.cloudStorageUrl !== null &&
            image.cloudStorageUrl !== ""
          ) {
            totalImagesWithGCS++;
            if (!sampleGCSUrl) {
              sampleGCSUrl = image.cloudStorageUrl;
            }
          } else {
            totalImagesWithoutGCS++;
          }
        }
      }
    }

    console.log(
      `📊 Image analysis: ${totalImagesWithGCS} with GCS, ${totalImagesWithoutGCS} without GCS`,
    );

    const response = {
      success: true,
      imageStorage: {
        totalImages: stats.totalImages || 0,
        totalBusinesses: stats.totalBusinesses || 0,
        imagesWithGCS: totalImagesWithGCS,
        imagesWithoutGCS: totalImagesWithoutGCS,
        gcsPercentage:
          stats.totalImages > 0
            ? Math.round((totalImagesWithGCS / stats.totalImages) * 100)
            : 0,
        storageType: "Google Cloud Storage",
        bucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME,
        sampleGCSUrl: sampleGCSUrl,
        sampleBusiness: sampleBusinessWithImages
          ? {
              name: sampleBusinessWithImages.name,
              imageCount: sampleBusinessWithImages.images?.length || 0,
              imagesWithGCS:
                sampleBusinessWithImages.images?.filter(
                  (img) =>
                    img.cloudStorageUrl &&
                    img.cloudStorageUrl !== null &&
                    img.cloudStorageUrl !== "",
                )?.length || 0,
            }
          : null,
        isConfigured: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
        configuration: {
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
            ? "✅ Set"
            : "❌ Missing",
          keyFile: process.env.GOOGLE_CLOUD_KEY_FILE ? "✅ Set" : "��� Missing",
          bucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME
            ? "✅ Set"
            : "❌ Missing",
        },
      },
    };

    console.log("🖼️ Sending image status response");
    res.json(response);
  } catch (error) {
    console.error("❌ Image status error:", error.message);
    console.error("❌ Full error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Database diagnostic endpoint
app.get("/api/database/diagnostic", async (req, res) => {
  try {
    const sqliteStats = await sqliteDatabase.getStatistics();

    // Get businesses with no limit to check actual count
    const allBusinessesResult = await sqliteDatabase.getBusinesses({
      limit: 9999,
    });

    res.json({
      success: true,
      diagnostic: {
        sqliteStats,
        actualBusinessCount: allBusinessesResult.businesses.length,
        totalFromQuery: allBusinessesResult.total,
        firstBusiness: allBusinessesResult.businesses[0]
          ? {
              name: allBusinessesResult.businesses[0].name,
              city: allBusinessesResult.businesses[0].city,
              id: allBusinessesResult.businesses[0].id,
            }
          : null,
        lastBusiness:
          allBusinessesResult.businesses.length > 0
            ? {
                name: allBusinessesResult.businesses[
                  allBusinessesResult.businesses.length - 1
                ].name,
                city: allBusinessesResult.businesses[
                  allBusinessesResult.businesses.length - 1
                ].city,
                id: allBusinessesResult.businesses[
                  allBusinessesResult.businesses.length - 1
                ].id,
              }
            : null,
      },
    });
  } catch (error) {
    console.error("Database diagnostic error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Check for duplicates in database
app.get("/api/database/duplicates", async (req, res) => {
  try {
    const duplicates = await sqliteDatabase.findDuplicates();

    res.json({
      success: true,
      duplicates: duplicates || [],
      count: duplicates?.length || 0,
      message:
        duplicates?.length > 0
          ? `Found ${duplicates.length} potential duplicates`
          : "No duplicates found",
    });
  } catch (error) {
    console.error("Find duplicates error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Simple server health check
app.get("/api/health", (req, res) => {
  try {
    res.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      env: process.env.NODE_ENV || "development",
      services: {
        database: "connected",
        api: "running",
        storage: "AWS S3",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// S3 Storage health check endpoint
app.get("/api/storage-health", async (req, res) => {
  try {
    const isConfigured = await checkS3Configuration();

    res.json({
      success: true,
      status: isConfigured ? "healthy" : "misconfigured",
      storage: "AWS S3",
      configured: isConfigured,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "error",
      storage: "AWS S3",
      configured: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ============ GOOGLE PLACES SCRAPING ENDPOINTS ============

// Start a new scraping job
app.post("/api/scraping/start", async (req, res) => {
  try {
    const {
      cities = [],
      categories = [],
      maxResultsPerSearch = 15,
      delay = 500,
    } = req.body;

    if (!cities.length || !categories.length) {
      return res.status(400).json({
        success: false,
        error: "Cities and categories are required",
      });
    }

    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Google Places API key not configured",
      });
    }

    // Create scraping job
    const jobResult = await database.createScrapingJob({
      cities,
      categories,
      maxResultsPerSearch,
      delay,
      totalSearches: cities.length * categories.length,
    });

    if (!jobResult.success) {
      return res.status(500).json(jobResult);
    }

    const jobId = jobResult.job.id;

    // Start scraping in background
    scraper
      .scrapeBusinesses({
        cities,
        categories,
        maxResultsPerSearch,
        delay,
        jobId,
      })
      .catch((error) => {
        console.error("Background scraping error:", error);
      });

    res.json({
      success: true,
      jobId,
      message: "Scraping job started successfully",
      estimatedTime: `${Math.ceil((cities.length * categories.length * delay) / 60000)} minutes`,
    });
  } catch (error) {
    console.error("Start scraping error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get scraping job status
app.get("/api/scraping/job/:jobId", async (req, res) => {
  try {
    const job = await database.getScrapingJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job status error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all scraping jobs
app.get("/api/scraping/jobs", async (req, res) => {
  try {
    const jobs = await database.getScrapingJobs();

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Stop current scraping job
app.post("/api/scraping/stop", async (req, res) => {
  try {
    const result = await scraper.stopScraping();
    res.json(result);
  } catch (error) {
    console.error("Stop scraping error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Stop specific scraping job by ID
app.post("/api/scraping/job/:jobId/stop", async (req, res) => {
  try {
    const { jobId } = req.params;

    // Update job status to stopped
    const result = await database.updateScrapingJob(jobId, {
      status: "stopped",
      stoppedAt: new Date().toISOString(),
    });

    if (result.success) {
      // Also try to stop the scraper if it's running
      try {
        await scraper.stopScraping();
      } catch (e) {
        console.log("Scraper was not running");
      }

      res.json({
        success: true,
        message: "Scraping job stopped successfully",
        jobId,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
  } catch (error) {
    console.error("Stop job error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get scraping recommendations
app.get("/api/scraping/recommendations", (req, res) => {
  try {
    const configs = scraper.getRecommendedConfigs();
    res.json({
      success: true,
      configs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Validate Google Places API key
app.get("/api/scraping/validate-api", async (req, res) => {
  try {
    const validation = await scraper.validateApiKey();
    res.json({
      success: true,
      validation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Fetch ALL reviews (unlimited) for existing businesses
app.post("/api/scraping/fetch-all-reviews", async (req, res) => {
  try {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Google Places API key not configured",
      });
    }

    console.log(
      "🚀 Starting to fetch ALL reviews (unlimited) for existing businesses...",
    );

    // Start the review fetching process in the background
    scraper
      .fetchAllReviewsForExistingBusinesses()
      .then((result) => {
        console.log("✅ ALL reviews fetching completed:", result);
      })
      .catch((error) => {
        console.error("❌ Review fetching failed:", error);
      });

    res.json({
      success: true,
      message:
        "Review fetching started successfully (Google API maximum ~5 reviews per business)",
      note: "Process is running in the background. Note: Google Places API limits reviews to ~5 per business by design. Check console logs for progress.",
    });
  } catch (error) {
    console.error("Fetch all reviews error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Refresh review counts from Google Places API for all businesses
app.post("/api/refresh-review-counts-from-google", async (req, res) => {
  try {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Google Places API key not configured",
      });
    }

    console.log("🚀 Refreshing review counts from Google Places API...");

    // Get all businesses from database
    const result = await sqliteDatabase.getBusinesses({ limit: 9999 });
    const businesses = result.businesses;

    let updatedCount = 0;
    let totalProcessed = 0;
    const errors = [];

    // Process businesses in batches to avoid API rate limits
    const batchSize = 10;
    for (let i = 0; i < businesses.length; i += batchSize) {
      const batch = businesses.slice(i, i + batchSize);

      for (const business of batch) {
        try {
          if (!business.googlePlaceId) {
            console.log(`⏭️ Skipping ${business.name} - no Google Place ID`);
            continue;
          }

          console.log(`🔍 Fetching review count for: ${business.name}`);

          // Get place details from Google Places API
          const placeDetails = await googlePlaces.getPlaceDetails(
            business.googlePlaceId,
          );
          const { user_ratings_total = 0 } = placeDetails;

          // Update review count in database if different
          if (business.reviewCount !== user_ratings_total) {
            await new Promise((resolve, reject) => {
              sqliteDatabase.db.run(
                "UPDATE businesses SET reviewCount = ? WHERE id = ?",
                [user_ratings_total, business.id],
                function (err) {
                  if (err) {
                    reject(err);
                  } else {
                    console.log(
                      `✅ Updated ${business.name}: ${business.reviewCount} → ${user_ratings_total} reviews`,
                    );
                    updatedCount++;
                    resolve();
                  }
                },
              );
            });
          } else {
            console.log(
              `✓ ${business.name}: ${user_ratings_total} reviews (no change)`,
            );
          }

          totalProcessed++;

          // Small delay to respect API rate limits
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (error) {
          console.error(
            `��� Error processing ${business.name}:`,
            error.message,
          );
          errors.push({ business: business.name, error: error.message });
        }
      }
    }

    res.json({
      success: true,
      message: `Review counts refreshed from Google Places API`,
      totalBusinesses: businesses.length,
      processed: totalProcessed,
      updated: updatedCount,
      errors: errors.length,
      sampleErrors: errors.slice(0, 3),
    });
  } catch (error) {
    console.error("Refresh review counts error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Fix reviewCount for all businesses to match actual review count
app.post("/api/fix-review-counts", async (req, res) => {
  try {
    console.log("🚀 Fixing reviewCount for all businesses using SQL...");

    // Use SQL to directly update reviewCount based on actual review count
    const updateSql = `
      UPDATE businesses
      SET reviewCount = (
        SELECT COUNT(*)
        FROM reviews
        WHERE reviews.businessId = businesses.id
      )
    `;

    await new Promise((resolve, reject) => {
      sqliteDatabase.db.run(updateSql, function (err) {
        if (err) {
          console.error("Error updating review counts:", err);
          reject(err);
        } else {
          console.log(`✅ Updated reviewCount for ${this.changes} businesses`);
          resolve(this.changes);
        }
      });
    });

    // Get updated stats
    const result = await sqliteDatabase.getBusinesses({ limit: 5 });
    const sampleBusinesses = result.businesses.slice(0, 3).map((b) => ({
      name: b.name,
      oldReviewCount: b.reviewCount,
      actualReviews: b.reviews?.length || 0,
    }));

    res.json({
      success: true,
      message: "Review counts synced with actual review data",
      sampleBusinesses,
    });
  } catch (error) {
    console.error("Fix review counts error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Migrate data from memory to SQLite database
app.post("/api/migrate-to-sqlite", async (req, res) => {
  try {
    console.log("🚀 Starting migration API endpoint...");
    const migration = new DataMigration();
    await migration.migrate();

    res.json({
      success: true,
      message: "Data migration completed successfully",
    });
  } catch (error) {
    console.error("Migration API error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get scraping statistics
app.get("/api/scraping/stats", async (req, res) => {
  try {
    console.log("📊 Loading scraping stats...");

    const sqliteStats = await sqliteDatabase.getStatistics();
    console.log("✅ SQLite stats loaded:", sqliteStats);

    const memoryStats = database.getStatistics();
    console.log("✅ Memory stats loaded:", memoryStats);

    const scrapingStatus = scraper.getStatus();
    console.log("✅ Scraping status loaded:", scrapingStatus);

    const response = {
      success: true,
      stats: {
        // Use SQLite stats as primary, fallback to memory
        totalBusinesses:
          sqliteStats.totalBusinesses || memoryStats.totalBusinesses || 0,
        totalGooglePlaces:
          sqliteStats.totalGooglePlaces || memoryStats.totalGooglePlaces || 0,
        totalImages: sqliteStats.totalImages || memoryStats.totalImages || 0,
        totalReviews: sqliteStats.totalReviews || memoryStats.totalReviews || 0,
        averageRating:
          sqliteStats.averageRating || memoryStats.averageRating || 0,
        citiesCount: sqliteStats.citiesCount || memoryStats.citiesCount || 0,
        lastUpdated: sqliteStats.lastUpdated || memoryStats.lastUpdated,
        // Scraping info from memory
        scraping: scrapingStatus,
        // Database info
        database: {
          sqlite: sqliteStats,
          memory: memoryStats,
        },
      },
    };

    console.log("📊 Sending stats response");
    res.json(response);
  } catch (error) {
    console.error("❌ Get scraping stats error:", error.message);
    console.error("�� Full error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Get scraped businesses with filters from SQLite database
app.get("/api/scraped-businesses", async (req, res) => {
  try {
    const result = await sqliteDatabase.getBusinesses(req.query);

    // Add debug logging
    console.log(
      `API Request: page=${req.query.page || 1}, limit=${req.query.limit || 1000}`,
    );
    console.log(
      `Database returned: ${result.businesses.length} businesses, total: ${result.total}`,
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get scraped businesses error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete scraped business
app.delete("/api/scraped-businesses/:id", async (req, res) => {
  try {
    const result = await database.deleteBusiness(req.params.id);

    if (result.success) {
      res.json({
        success: true,
        message: "Business deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Business not found",
      });
    }
  } catch (error) {
    console.error("Delete business error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Export scraped data
app.get("/api/scraping/export", (req, res) => {
  try {
    const format = req.query.format || "json";
    const data = database.exportData(format);

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="scraped-businesses-${Date.now()}.json"`,
    );
    res.send(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Bulk image assignment endpoints
import {
  assignBulkBusinessImages,
  assignAllBusinessImages,
  setDatabase,
  getBulkProgress,
  stopBulkAssignment,
} from "./bulk-image-assignment.js";

// Set database context for bulk operations
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "visaconsult.db");
const bulkDatabase = new Database(dbPath);
setDatabase(bulkDatabase);

// Assign images to all businesses (batch processing)
app.post("/api/admin/assign-all-business-images", async (req, res) => {
  try {
    console.log("🚀 Starting bulk image assignment for all businesses");

    // Run in background to avoid timeout
    assignAllBusinessImages()
      .then((result) => {
        console.log("✅ Bulk image assignment completed:", result);
      })
      .catch((error) => {
        console.error("❌ Bulk image assignment failed:", error);
      });

    res.json({
      success: true,
      message:
        "Bulk image assignment started in background. Check server logs for progress.",
    });
  } catch (error) {
    console.error("Bulk image assignment error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Assign images to specific batch of businesses
app.post("/api/admin/assign-business-images-batch", async (req, res) => {
  try {
    const { limit = 50, offset = 0, updateExisting = false } = req.body;

    const result = await assignBulkBusinessImages({
      limit: parseInt(limit),
      offset: parseInt(offset),
      updateExisting: Boolean(updateExisting),
    });

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Batch image assignment error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get bulk assignment status
app.get("/api/admin/business-images-status", async (req, res) => {
  try {
    const totalBusinesses = bulkDatabase
      .prepare("SELECT COUNT(*) as count FROM businesses")
      .get();
    const withImages = bulkDatabase
      .prepare(
        `
      SELECT COUNT(*) as count FROM businesses
      WHERE logo IS NOT NULL
      AND logo NOT LIKE '%placeholder%'
      AND coverImage IS NOT NULL
      AND coverImage NOT LIKE '%placeholder%'
      AND gallery IS NOT NULL
      AND gallery != '[]'
    `,
      )
      .get();
    const withPlaceholders = bulkDatabase
      .prepare(
        `
      SELECT COUNT(*) as count FROM businesses
      WHERE logo LIKE '%placeholder%'
      OR coverImage LIKE '%placeholder%'
      OR logo IS NULL
      OR coverImage IS NULL
      OR gallery IS NULL
      OR gallery = '[]'
    `,
      )
      .get();

    // Count total gallery images across all businesses
    const totalGalleryImages = bulkDatabase
      .prepare(
        `
      SELECT COUNT(*) as count FROM businesses
      WHERE gallery IS NOT NULL
      AND gallery != '[]'
      AND gallery != 'null'
    `,
      )
      .get();

    res.json({
      success: true,
      stats: {
        totalBusinesses: totalBusinesses.count,
        withRealImages: withImages.count,
        withPlaceholders: withPlaceholders.count,
        withGalleryPhotos: totalGalleryImages.count,
        completionRate: Math.round(
          (withImages.count / totalBusinesses.count) * 100,
        ),
      },
    });
  } catch (error) {
    console.error("Image status error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get bulk assignment progress
app.get("/api/admin/bulk-assignment-progress", async (req, res) => {
  try {
    const progress = getBulkProgress();
    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Bulk progress error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Stop bulk assignment
app.post("/api/admin/stop-bulk-assignment", async (req, res) => {
  try {
    const result = stopBulkAssignment();
    res.json(result);
  } catch (error) {
    console.error("Stop bulk assignment error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get S3 image upload statistics
app.get("/api/admin/s3-image-stats", async (req, res) => {
  try {
    const dbPath = path.join(__dirname, "visaconsult.db");
    const statsDb = new Database(dbPath);

    // Get total businesses
    const totalBusinesses = statsDb
      .prepare("SELECT COUNT(*) as count FROM businesses")
      .get().count;

    // Get businesses with S3 logos
    const businessesWithLogos = statsDb
      .prepare(
        "SELECT COUNT(*) as count FROM businesses WHERE logo IS NOT NULL AND logo != '' AND logo LIKE '%s3%'",
      )
      .get().count;

    // Get businesses with S3 cover images
    const businessesWithCovers = statsDb
      .prepare(
        "SELECT COUNT(*) as count FROM businesses WHERE coverImage IS NOT NULL AND coverImage != '' AND coverImage LIKE '%s3%'",
      )
      .get().count;

    // Get businesses with S3 gallery images
    const businessesWithGallery = statsDb
      .prepare(
        "SELECT COUNT(*) as count FROM businesses WHERE gallery IS NOT NULL AND gallery != '[]' AND gallery LIKE '%s3%'",
      )
      .get().count;

    // Get total S3 images (approximate count from gallery JSON)
    const galleryImages = statsDb
      .prepare(
        "SELECT gallery FROM businesses WHERE gallery IS NOT NULL AND gallery != '[]' AND gallery LIKE '%s3%'",
      )
      .all();
    let totalGalleryImages = 0;
    galleryImages.forEach((row) => {
      try {
        const gallery = JSON.parse(row.gallery);
        totalGalleryImages += gallery.length;
      } catch (e) {
        // Skip invalid JSON
      }
    });

    const totalS3Images =
      businessesWithLogos + businessesWithCovers + totalGalleryImages;

    statsDb.close();

    res.json({
      success: true,
      stats: {
        totalBusinesses,
        businessesWithLogos,
        businessesWithCovers,
        businessesWithGallery,
        totalGalleryImages,
        totalS3Images,
        completionPercentage:
          totalBusinesses > 0
            ? Math.round((businessesWithLogos / totalBusinesses) * 100)
            : 0,
      },
    });
  } catch (error) {
    console.error("S3 stats error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============ BACKUP ENDPOINTS ============

// Download database backup
app.get("/api/admin/backup/database", async (req, res) => {
  try {
    const dbPath = path.join(__dirname, "visaconsult.db");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `visaconsult_database_backup_${timestamp}.sqlite`;

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Stream the database file
    const fs = await import("fs");
    const fileStream = fs.createReadStream(dbPath);
    fileStream.pipe(res);

    console.log(`📦 Database backup downloaded: ${filename}`);
  } catch (error) {
    console.error("Database backup error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Download full website backup (zip)
app.get("/api/admin/backup/full", async (req, res) => {
  try {
    const { default: archiver } = await import("archiver");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `visaconsult_full_backup_${timestamp}.zip`;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    archive.pipe(res);

    // Add database
    archive.file(path.join(__dirname, "visaconsult.db"), {
      name: "database/visaconsult.db",
    });

    // Add server files
    archive.directory(__dirname, "server");

    // Add client files (if accessible)
    const clientPath = path.join(__dirname, "../client");
    const fs = await import("fs");
    if (fs.existsSync(clientPath)) {
      archive.directory(clientPath, "client");
    }

    // Add package files
    const packagePath = path.join(__dirname, "../package.json");
    if (fs.existsSync(packagePath)) {
      archive.file(packagePath, { name: "package.json" });
    }

    archive.finalize();

    console.log(`📦 Full backup downloaded: ${filename}`);
  } catch (error) {
    console.error("Full backup error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get backup history (mock for now - can be enhanced with actual file tracking)
app.get("/api/admin/backup/history", async (req, res) => {
  try {
    // This is a mock response - in production, you'd track actual backup files
    const mockHistory = [
      {
        filename: `visaconsult_database_backup_${new Date().toISOString().split("T")[0]}.sqlite`,
        created: new Date().toISOString(),
        size: "2.4 MB",
        type: "database",
        downloadUrl: "/api/admin/backup/database",
      },
      {
        filename: `visaconsult_full_backup_${new Date().toISOString().split("T")[0]}.zip`,
        created: new Date().toISOString(),
        size: "15.8 MB",
        type: "full",
        downloadUrl: "/api/admin/backup/full",
      },
    ];

    res.json({
      success: true,
      backups: mockHistory.slice(0, 10), // Last 10 backups
    });
  } catch (error) {
    console.error("Backup history error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Configuration for automatic S3 image upload during scraping
let autoS3ImageUpload = true; // Default to enabled

// Get automatic S3 upload configuration
app.get("/api/admin/auto-s3-config", (req, res) => {
  try {
    res.json({
      success: true,
      config: {
        autoS3ImageUpload,
        description: "Automatically upload scraped business images to AWS S3",
      },
    });
  } catch (error) {
    console.error("Get auto S3 config error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update automatic S3 upload configuration
app.post("/api/admin/auto-s3-config", (req, res) => {
  try {
    const { enabled } = req.body;
    autoS3ImageUpload = Boolean(enabled);

    console.log(
      `🔧 Auto S3 image upload ${autoS3ImageUpload ? "ENABLED" : "DISABLED"}`,
    );

    res.json({
      success: true,
      config: {
        autoS3ImageUpload,
        message: `Automatic S3 image upload ${autoS3ImageUpload ? "enabled" : "disabled"}`,
      },
    });
  } catch (error) {
    console.error("Update auto S3 config error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Export the configuration for use in scraper
export { autoS3ImageUpload };

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
