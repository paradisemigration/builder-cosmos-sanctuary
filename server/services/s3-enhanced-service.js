import AWS from "aws-sdk";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import path from "path";

class EnhancedS3Service {
  constructor() {
    this.s3 = null;
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    this.region = process.env.AWS_REGION || "us-east-1";
    this.isConfigured = false;
    this.configurationStatus = {
      credentials: false,
      region: false,
      bucket: false,
      permissions: false,
    };
  }

  async initialize() {
    try {
      console.log("🔧 Initializing Enhanced S3 Service...");

      // Configure AWS
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: this.region,
      });

      this.s3 = new AWS.S3();

      // Run comprehensive validation
      await this.validateConfiguration();

      console.log(`✅ Enhanced S3 Service initialized successfully`);
      console.log(`📍 Region: ${this.region}`);
      console.log(`🗃️ Bucket: ${this.bucketName}`);

      return {
        success: true,
        region: this.region,
        bucket: this.bucketName,
        status: this.configurationStatus,
      };
    } catch (error) {
      console.error("❌ S3 Service initialization failed:", error);
      throw error;
    }
  }

  async validateConfiguration() {
    console.log("🔍 Validating S3 Configuration...");

    // 1. Validate credentials with bucket access
    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      this.configurationStatus.credentials = true;
      console.log("  ✅ AWS Credentials valid");
    } catch (error) {
      console.error("  ❌ AWS Credentials invalid:", error.message);
      throw new Error("Invalid AWS credentials");
    }

    // 2. Auto-detect optimal region
    await this.detectOptimalRegion();

    // 3. Validate bucket access
    await this.validateBucketAccess();

    // 4. Test upload permissions
    await this.testUploadPermissions();

    this.isConfigured = true;
    console.log("✅ S3 Configuration validation completed");
  }

  async detectOptimalRegion() {
    try {
      console.log("🌍 Detecting optimal S3 region...");

      // First, try to get bucket region
      try {
        const bucketLocation = await this.s3
          .getBucketLocation({ Bucket: this.bucketName })
          .promise();

        const detectedRegion = bucketLocation.LocationConstraint || "us-east-1";

        if (detectedRegion !== this.region) {
          console.log(
            `📍 Auto-detected bucket region: ${detectedRegion} (was: ${this.region})`,
          );
          this.region = detectedRegion;

          // Reconfigure S3 with correct region
          AWS.config.update({ region: this.region });
          this.s3 = new AWS.S3();
        }

        this.configurationStatus.region = true;
        console.log(`  ✅ Using region: ${this.region}`);
      } catch (error) {
        console.log(
          `  ⚠️ Could not detect bucket region, using: ${this.region}`,
        );
        this.configurationStatus.region = true;
      }
    } catch (error) {
      console.error("❌ Region detection failed:", error);
      throw error;
    }
  }

  async validateBucketAccess() {
    try {
      console.log("🗃️ Validating bucket access...");

      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      this.configurationStatus.bucket = true;
      console.log(`  ✅ Bucket '${this.bucketName}' accessible`);
    } catch (error) {
      console.error(`  ❌ Bucket '${this.bucketName}' not accessible:`, error);
      throw new Error(`Bucket access failed: ${error.message}`);
    }
  }

  async testUploadPermissions() {
    try {
      console.log("🔑 Testing upload permissions...");

      const testKey = `test-permissions/${uuidv4()}.txt`;
      const testContent = "Ultra-Fast S3 Sync Permission Test";

      // Test upload
      await this.s3
        .putObject({
          Bucket: this.bucketName,
          Key: testKey,
          Body: testContent,
          ContentType: "text/plain",
        })
        .promise();

      // Test delete (cleanup)
      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: testKey,
        })
        .promise();

      this.configurationStatus.permissions = true;
      console.log("  ✅ Upload/Delete permissions confirmed");
    } catch (error) {
      console.error("  ❌ Upload permissions test failed:", error);
      throw new Error(`Upload permissions failed: ${error.message}`);
    }
  }

  async uploadImageFromUrl(imageUrl, folder = "business-images") {
    if (!this.isConfigured) {
      throw new Error("S3 Service not configured. Call initialize() first.");
    }

    try {
      // Download image from URL
      const response = await fetch(imageUrl, { timeout: 10000 });

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const imageBuffer = await response.buffer();
      const contentType = response.headers.get("content-type") || "image/jpeg";

      // Generate unique filename
      const fileExtension = this.getFileExtension(contentType);
      const fileName = `${folder}/${uuidv4()}${fileExtension}`;

      // Upload to S3
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: fileName,
          Body: imageBuffer,
          ContentType: contentType,
          ACL: "public-read",
        })
        .promise();

      return {
        success: true,
        s3Url: uploadResult.Location,
        key: fileName,
        size: imageBuffer.length,
        contentType: contentType,
      };
    } catch (error) {
      console.error("S3 upload error:", error);
      throw error;
    }
  }

  async uploadMultipleImages(imageUrls, folder = "business-images") {
    const results = [];

    // Process in batches of 10 for optimal performance
    const BATCH_SIZE = 10;
    for (let i = 0; i < imageUrls.length; i += BATCH_SIZE) {
      const batch = imageUrls.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map(async (url, index) => {
        try {
          const result = await this.uploadImageFromUrl(url, folder);
          return { index: i + index, url, result, success: true };
        } catch (error) {
          return {
            index: i + index,
            url,
            error: error.message,
            success: false,
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to avoid overwhelming the service
      if (i + BATCH_SIZE < imageUrls.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  getFileExtension(contentType) {
    const extensions = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/bmp": ".bmp",
      "image/tiff": ".tiff",
    };

    return extensions[contentType] || ".jpg";
  }

  async getStorageStats() {
    try {
      // Get bucket size and object count (this is an estimate)
      const listResult = await this.s3
        .listObjectsV2({
          Bucket: this.bucketName,
          Prefix: "business-images/",
          MaxKeys: 1000,
        })
        .promise();

      const totalObjects = listResult.KeyCount || 0;
      const totalSize = listResult.Contents?.reduce(
        (sum, obj) => sum + (obj.Size || 0),
        0,
      );

      return {
        success: true,
        stats: {
          totalObjects,
          totalSize: totalSize || 0,
          totalSizeFormatted: this.formatBytes(totalSize || 0),
          bucket: this.bucketName,
          region: this.region,
        },
      };
    } catch (error) {
      console.error("Failed to get storage stats:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  getStatus() {
    return {
      isConfigured: this.isConfigured,
      region: this.region,
      bucket: this.bucketName,
      status: this.configurationStatus,
    };
  }
}

// Export singleton instance
const s3Service = new EnhancedS3Service();
export default s3Service;
export { EnhancedS3Service };
