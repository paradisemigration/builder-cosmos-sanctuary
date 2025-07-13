import fetch from "node-fetch";
import sqliteDatabase from "../database.sqlite.js";
import s3Service from "./s3-enhanced-service.js";
import { EventEmitter } from "events";

class UltraFastSyncEngine extends EventEmitter {
  constructor() {
    super();
    this.isRunning = false;
    this.currentBatch = 0;
    this.totalBatches = 0;
    this.stats = {
      totalBusinesses: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      startTime: null,
      endTime: null,
      errors: [],
    };

    // Configuration
    this.config = {
      concurrencyLimit: 25, // 25 simultaneous uploads
      batchSize: 100, // 100 items per batch
      timeout: 5000, // 5-second timeout
      retryAttempts: 3,
      retryDelay: 1000, // 1 second delay between retries
    };

    this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
  }

  async initialize() {
    try {
      console.log("🚀 Initializing Ultra-Fast Sync Engine...");

      // Initialize S3 service
      await s3Service.initialize();

      console.log("✅ Ultra-Fast Sync Engine ready");
      console.log(`⚡ Concurrency: ${this.config.concurrencyLimit}`);
      console.log(`📦 Batch Size: ${this.config.batchSize}`);
      console.log(`⏱️ Timeout: ${this.config.timeout}ms`);

      return { success: true };
    } catch (error) {
      console.error("❌ Sync Engine initialization failed:", error);
      throw error;
    }
  }

  async startSync(options = {}) {
    if (this.isRunning) {
      throw new Error("Sync is already running");
    }

    try {
      this.isRunning = true;
      this.stats = {
        totalBusinesses: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        skipped: 0,
        startTime: new Date(),
        endTime: null,
        errors: [],
      };

      // Override config with options
      this.config = { ...this.config, ...options };

      console.log("🚀 Starting Ultra-Fast S3 Sync...");
      this.emit("syncStarted", { stats: this.stats, config: this.config });

      // Get businesses that need sync
      const businesses = await this.getBusinessesForSync();
      this.stats.totalBusinesses = businesses.length;

      if (businesses.length === 0) {
        console.log("✅ No businesses need syncing");
        this.isRunning = false;
        this.emit("syncCompleted", { stats: this.stats });
        return { success: true, message: "No businesses need syncing" };
      }

      console.log(`📊 Found ${businesses.length} businesses requiring sync`);

      // Process in batches
      const batches = this.createBatches(businesses, this.config.batchSize);
      this.totalBatches = batches.length;

      console.log(
        `📦 Processing ${batches.length} batches with ${this.config.concurrencyLimit} concurrent uploads`,
      );

      for (let i = 0; i < batches.length; i++) {
        if (!this.isRunning) {
          console.log("⏹️ Sync stopped by user");
          break;
        }

        this.currentBatch = i + 1;
        const batch = batches[i];

        console.log(
          `🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} businesses)`,
        );

        await this.processBatch(batch);

        // Emit progress update
        this.emit("progress", {
          batch: this.currentBatch,
          totalBatches: this.totalBatches,
          stats: this.stats,
        });

        // Small delay between batches to prevent overwhelming APIs
        if (i < batches.length - 1) {
          await this.delay(200);
        }
      }

      this.stats.endTime = new Date();
      this.isRunning = false;

      const duration = this.stats.endTime - this.stats.startTime;
      console.log(
        `🎉 Ultra-Fast Sync completed in ${Math.round(duration / 1000)}s`,
      );
      console.log(`📊 Final Stats:`, this.stats);

      this.emit("syncCompleted", { stats: this.stats });

      return {
        success: true,
        stats: this.stats,
        duration: duration,
      };
    } catch (error) {
      console.error("❌ Sync failed:", error);
      this.isRunning = false;
      this.emit("syncError", { error: error.message, stats: this.stats });
      throw error;
    }
  }

  async processBatch(businesses) {
    // Create semaphore for concurrency control
    const semaphore = this.createSemaphore(this.config.concurrencyLimit);

    const batchPromises = businesses.map(async (business) => {
      return semaphore(async () => {
        await this.processBusiness(business);
      });
    });

    await Promise.all(batchPromises);
  }

  async processBusiness(business) {
    try {
      // Update status to processing
      await this.updateSyncStatus(business.id, "processing");

      // Check if business already has S3 images
      if (this.hasS3Images(business)) {
        console.log(`⏭️ Skipping ${business.name} - already has S3 images`);
        this.stats.skipped++;
        await this.updateSyncStatus(business.id, "completed");
        return;
      }

      // Get Google Places photos
      const photos = await this.getGooglePlacesPhotos(business.googlePlaceId);

      if (!photos || photos.length === 0) {
        console.log(`⚠️ No photos found for ${business.name}`);
        this.stats.failed++;
        await this.updateSyncStatus(business.id, "failed", "No photos found");
        return;
      }

      // Download and upload to S3
      const s3Results = await this.uploadPhotosToS3(business, photos);

      // Update database with S3 URLs
      await this.updateBusinessWithS3URLs(business.id, s3Results);

      console.log(
        `✅ Synced ${business.name} - ${s3Results.successful} photos uploaded`,
      );
      this.stats.successful++;
      await this.updateSyncStatus(business.id, "completed");
    } catch (error) {
      console.error(`❌ Failed to process ${business.name}:`, error.message);
      this.stats.failed++;
      this.stats.errors.push({
        businessId: business.id,
        businessName: business.name,
        error: error.message,
        timestamp: new Date(),
      });
      await this.updateSyncStatus(business.id, "failed", error.message);
    } finally {
      this.stats.processed++;
    }
  }

  async getBusinessesForSync() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, googlePlaceId, name, logo_s3_url, cover_s3_url, photos_s3_urls, s3_sync_status
        FROM businesses 
        WHERE googlePlaceId IS NOT NULL 
        AND (s3_sync_status IS NULL OR s3_sync_status = 'pending' OR s3_sync_status = 'failed')
        ORDER BY id ASC
      `;

      sqliteDatabase.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  hasS3Images(business) {
    return (
      business.logo_s3_url ||
      business.cover_s3_url ||
      (business.photos_s3_urls && business.photos_s3_urls !== "[]")
    );
  }

  async getGooglePlacesPhotos(placeId) {
    if (!placeId || !this.apiKey) {
      throw new Error("Missing place ID or API key");
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${this.apiKey}`;

      const response = await fetch(url, { timeout: this.config.timeout });
      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      return data.result?.photos || [];
    } catch (error) {
      throw new Error(`Failed to get photos: ${error.message}`);
    }
  }

  async uploadPhotosToS3(business, photos) {
    const results = {
      logoUrl: null,
      coverUrl: null,
      photoUrls: [],
      successful: 0,
      failed: 0,
    };

    // Process up to 10 photos for better coverage
    const maxPhotos = Math.min(photos.length, 10);

    for (let i = 0; i < maxPhotos; i++) {
      try {
        const photo = photos[i];
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photo.photo_reference}&maxwidth=800&key=${this.apiKey}`;

        const s3Result = await s3Service.uploadImageFromUrl(
          photoUrl,
          "business-images",
        );

        if (i === 0 && !results.logoUrl) {
          results.logoUrl = s3Result.s3Url;
        } else if (i === 1 && !results.coverUrl) {
          results.coverUrl = s3Result.s3Url;
        } else {
          results.photoUrls.push(s3Result.s3Url);
        }

        results.successful++;
      } catch (error) {
        console.error(`Failed to upload photo ${i + 1}:`, error.message);
        results.failed++;
      }
    }

    return results;
  }

  async updateBusinessWithS3URLs(businessId, s3Results) {
    return new Promise((resolve, reject) => {
      const updates = [];
      const params = [];

      if (s3Results.logoUrl) {
        updates.push("logo_s3_url = ?");
        params.push(s3Results.logoUrl);
      }

      if (s3Results.coverUrl) {
        updates.push("cover_s3_url = ?");
        params.push(s3Results.coverUrl);
      }

      if (s3Results.photoUrls.length > 0) {
        updates.push("photos_s3_urls = ?");
        params.push(JSON.stringify(s3Results.photoUrls));
      }

      updates.push("s3_photo_count = ?");
      params.push(s3Results.successful);

      params.push(new Date().toISOString()); // updatedAt
      params.push(businessId);

      const sql = `
        UPDATE businesses 
        SET ${updates.join(", ")}, updatedAt = ?
        WHERE id = ?
      `;

      sqliteDatabase.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async updateSyncStatus(businessId, status, errorMessage = null) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE businesses 
        SET s3_sync_status = ?, s3_sync_date = ?, updatedAt = ?
        WHERE id = ?
      `;

      const params = [
        status,
        new Date().toISOString(),
        new Date().toISOString(),
        businessId,
      ];

      sqliteDatabase.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  createSemaphore(limit) {
    let running = 0;
    const queue = [];

    return (task) => {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        if (running < limit) {
          this.processSemaphoreQueue(
            queue,
            () => running--,
            () => running++,
          );
        }
      });
    };
  }

  async processSemaphoreQueue(queue, onComplete, onStart) {
    if (queue.length === 0) return;

    const { task, resolve, reject } = queue.shift();
    onStart();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      onComplete();
      // Process next item in queue
      if (queue.length > 0) {
        setImmediate(() =>
          this.processSemaphoreQueue(queue, onComplete, onStart),
        );
      }
    }
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  stopSync() {
    console.log("⏹️ Stopping Ultra-Fast Sync...");
    this.isRunning = false;
    this.emit("syncStopped", { stats: this.stats });
  }

  getProgress() {
    return {
      isRunning: this.isRunning,
      currentBatch: this.currentBatch,
      totalBatches: this.totalBatches,
      stats: this.stats,
      config: this.config,
    };
  }
}

// Export singleton instance
const syncEngine = new UltraFastSyncEngine();
export default syncEngine;
export { UltraFastSyncEngine };
