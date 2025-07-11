import express from "express";
import cors from "cors";
import {
  uploadMiddleware,
  uploadToGCS,
  uploadMultipleToGCS,
  deleteFromGCS,
} from "./storage.js";
import BusinessScraper from "./scraper.js";
import database from "./database.js";
import sqliteDatabase from "./database.sqlite.js";

const app = express();

// Initialize business scraper
const scraper = new BusinessScraper(process.env.GOOGLE_PLACES_API_KEY);

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

      const result = await uploadToGCS(
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
  uploadMiddleware.multiple("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const results = await uploadMultipleToGCS(
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
        const logoResult = await uploadToGCS(req.files.logo[0], "logos");
        businessData.logo = logoResult.publicUrl;
      }

      // Upload cover image if provided
      if (req.files?.coverImage?.[0]) {
        const coverResult = await uploadToGCS(
          req.files.coverImage[0],
          "covers",
        );
        businessData.coverImage = coverResult.publicUrl;
      }

      // Upload gallery images if provided
      if (req.files?.gallery?.length > 0) {
        const galleryResults = await uploadMultipleToGCS(
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
        const logoResult = await uploadToGCS(req.files.logo[0], "logos");
        businessData.logo = logoResult.publicUrl;
      }

      if (req.files?.coverImage?.[0]) {
        const coverResult = await uploadToGCS(
          req.files.coverImage[0],
          "covers",
        );
        businessData.coverImage = coverResult.publicUrl;
      }

      if (req.files?.gallery?.length > 0) {
        const galleryResults = await uploadMultipleToGCS(
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
    await deleteFromGCS(req.params.fileName);

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

// ============ GOOGLE PLACES SCRAPING ENDPOINTS ============

// Start a new scraping job
app.post("/api/scraping/start", async (req, res) => {
  try {
    const {
      cities = [],
      categories = [],
      maxResultsPerSearch = 15,
      delay = 1500,
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

// Get scraping statistics
app.get("/api/scraping/stats", (req, res) => {
  try {
    const stats = database.getStatistics();
    const scrapingStatus = scraper.getStatus();

    res.json({
      success: true,
      stats: {
        ...stats,
        scraping: scrapingStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get scraped businesses with filters from SQLite database
app.get("/api/scraped-businesses", async (req, res) => {
  try {
    const result = await sqliteDatabase.getBusinesses(req.query);

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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
