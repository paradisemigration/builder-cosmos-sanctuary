import express from "express";
import cors from "cors";
import {
  uploadMiddleware,
  uploadToGCS,
  uploadMultipleToGCS,
  deleteFromGCS,
} from "./storage.js";

const app = express();

// Middleware
app.use(cors());
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
