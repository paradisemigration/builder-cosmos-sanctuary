import express from "express";
import syncEngine from "./services/ultra-fast-sync-engine.js";
import s3Service from "./services/s3-enhanced-service.js";
import sseService from "./services/sse-progress-service.js";
import S3ColumnsMigration from "./migrations/add-s3-columns.js";
import sqliteDatabase from "./database.sqlite.js";

const router = express.Router();

// Simple test endpoint
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Ultra-Fast S3 Sync API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Initialize services on startup
let servicesInitialized = false;

async function initializeServices() {
  if (servicesInitialized) return;

  try {
    console.log("🔧 Initializing Ultra-Fast S3 Sync services...");

    // Run database migration
    try {
      const migration = new S3ColumnsMigration();
      await migration.runMigration();
      console.log("✅ Database migration completed");
    } catch (migrationError) {
      console.log("⚠️ Database migration warning:", migrationError.message);
    }

    // Initialize S3 service first
    try {
      await s3Service.initialize();
      console.log("✅ S3 Service initialized successfully");
    } catch (s3Error) {
      console.log("⚠️ S3 Service initialization failed:", s3Error.message);
      console.log("📸 Photo uploads will be skipped, but sync will continue");
    }

    // Initialize sync engine
    await syncEngine.initialize();

    // Connect SSE service to sync engine events
    syncEngine.on("syncStarted", (data) => sseService.onSyncStarted(data));
    syncEngine.on("progress", (data) => sseService.onProgress(data));
    syncEngine.on("syncCompleted", (data) => sseService.onSyncCompleted(data));
    syncEngine.on("syncError", (data) => sseService.onSyncError(data));
    syncEngine.on("syncStopped", (data) => sseService.onSyncStopped(data));

    servicesInitialized = true;
    console.log("✅ Ultra-Fast S3 Sync services initialized");
  } catch (error) {
    console.error("❌ Failed to initialize services:", error);
    throw error;
  }
}

// SSE endpoint for real-time progress
router.get("/progress-stream", (req, res) => {
  console.log("📡 SSE connection request received");

  // Set SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // Send initial connection event
  res.write(
    `data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`,
  );

  try {
    const clientId = sseService.addClient(res);
    console.log(`📡 New SSE connection established: Client ${clientId}`);
  } catch (error) {
    console.error("SSE service error:", error.message);
    // Fallback: manual SSE handling if service fails
    res.write(
      `data: ${JSON.stringify({ type: "error", message: "SSE service unavailable" })}\n\n`,
    );
  }

  // Handle client disconnect
  req.on("close", () => {
    console.log("📡 SSE client disconnected");
  });
});

// Get sync statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await new Promise((resolve, reject) => {
      const sql = `
        SELECT
          COUNT(*) as total_businesses,
          COUNT(CASE WHEN s3_sync_status = 'completed' THEN 1 END) as synced_businesses,
          COUNT(CASE WHEN s3_sync_status = 'pending' OR s3_sync_status IS NULL THEN 1 END) as pending_businesses,
          COUNT(CASE WHEN s3_sync_status = 'failed' THEN 1 END) as failed_businesses,
          COUNT(CASE WHEN logo_s3_url IS NOT NULL THEN 1 END) as businesses_with_logos,
          COUNT(CASE WHEN cover_s3_url IS NOT NULL THEN 1 END) as businesses_with_covers,
          COUNT(CASE WHEN photos_s3_urls IS NOT NULL AND photos_s3_urls != '[]' THEN 1 END) as businesses_with_photos,
          SUM(s3_photo_count) as total_s3_photos,
          MAX(s3_sync_date) as last_sync_date
        FROM businesses
        WHERE googlePlaceId IS NOT NULL
      `;

      sqliteDatabase.db.get(sql, [], (err, row) => {
        if (err) {
          console.log(
            "S3 columns not found, using fallback stats:",
            err.message,
          );
          // Fallback if S3 columns don't exist yet
          const fallbackSql = `SELECT COUNT(*) as total_businesses FROM businesses WHERE googlePlaceId IS NOT NULL`;
          sqliteDatabase.db.get(fallbackSql, [], (fallbackErr, fallbackRow) => {
            if (fallbackErr) reject(fallbackErr);
            else
              resolve({
                total_businesses: fallbackRow?.total_businesses || 0,
                synced_businesses: 0,
                pending_businesses: fallbackRow?.total_businesses || 0,
                failed_businesses: 0,
                businesses_with_logos: 0,
                businesses_with_covers: 0,
                businesses_with_photos: 0,
                total_s3_photos: 0,
                last_sync_date: null,
              });
          });
        } else {
          resolve(row);
        }
      });
    });

    // Get S3 storage stats
    const storageStats = await s3Service.getStorageStats();

    res.json({
      success: true,
      stats: {
        database: stats,
        storage: storageStats.success ? storageStats.stats : null,
        engine: syncEngine.getProgress(),
        sse: sseService.getStats(),
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start Ultra-Fast Sync
router.post("/start", async (req, res) => {
  try {
    // Try to initialize services, but don't fail if it doesn't work
    try {
      await initializeServices();
    } catch (initError) {
      console.log("⚠️ Service initialization failed:", initError.message);
    }

    if (syncEngine.isRunning) {
      return res.status(409).json({
        success: false,
        error: "Sync is already running",
      });
    }

    const options = {
      concurrencyLimit: req.body.concurrency || 25,
      batchSize: req.body.batchSize || 100,
      timeout: req.body.timeout || 5000,
    };

    console.log("🚀 Starting Ultra-Fast S3 Sync with options:", options);

    // Start sync in background
    syncEngine
      .startSync(options)
      .then((result) => {
        console.log("✅ Sync completed:", result);
      })
      .catch((error) => {
        console.error("❌ Sync failed:", error);
      });

    res.json({
      success: true,
      message: "Ultra-Fast S3 Sync started successfully",
      config: options,
      progress: syncEngine.getProgress(),
    });
  } catch (error) {
    console.error("Start sync error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Stop sync
router.post("/stop", async (req, res) => {
  try {
    if (!syncEngine.isRunning) {
      return res.status(409).json({
        success: false,
        error: "No sync is currently running",
      });
    }

    syncEngine.stopSync();

    res.json({
      success: true,
      message: "Ultra-Fast S3 Sync stopped successfully",
      finalStats: syncEngine.getProgress(),
    });
  } catch (error) {
    console.error("Stop sync error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get current progress
router.get("/progress", async (req, res) => {
  try {
    res.json({
      success: true,
      progress: syncEngine.getProgress(),
    });
  } catch (error) {
    console.error("Progress error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Run database migration
router.post("/migrate", async (req, res) => {
  try {
    const migration = new S3ColumnsMigration();
    const result = await migration.runMigration();

    res.json({
      success: true,
      message: "Database migration completed successfully",
      result,
    });
  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test S3 configuration
router.post("/test-s3", async (req, res) => {
  try {
    const result = await s3Service.initialize();

    res.json({
      success: true,
      message: "S3 configuration test successful",
      config: result,
    });
  } catch (error) {
    console.error("S3 test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get businesses needing sync
router.get("/businesses/pending", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const businesses = await new Promise((resolve, reject) => {
      const sql = `
        SELECT id, name, googlePlaceId, s3_sync_status, s3_sync_date, s3_photo_count
        FROM businesses
        WHERE googlePlaceId IS NOT NULL
        AND (s3_sync_status IS NULL OR s3_sync_status = 'pending' OR s3_sync_status = 'failed')
        ORDER BY id ASC
        LIMIT ?
      `;

      sqliteDatabase.db.all(sql, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.json({
      success: true,
      businesses,
      count: businesses.length,
    });
  } catch (error) {
    console.error("Pending businesses error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
