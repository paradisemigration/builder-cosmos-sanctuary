import fetch from "node-fetch";
import { uploadToS3 } from "./storage-s3.js";

// We'll get the database instance from the API context when the functions are called
let database = null;

// Progress tracking for bulk operations
let bulkProgress = {
  isRunning: false,
  shouldStop: true,
  currentProgress: 0,
  totalItems: 0,
  processedItems: 0,
  successCount: 0,
  errorCount: 0,
  startTime: null,
  estimatedTimeRemaining: null,
  currentBatch: 0,
  totalBatches: 0,
};

function setDatabase(db) {
  database = db;
}

export function getBulkProgress() {
  return { ...bulkProgress };
}

export function stopBulkAssignment() {
  bulkProgress.shouldStop = true;
  bulkProgress.isRunning = false;
  console.log("🛑 Bulk assignment stop requested");
  return { success: true, message: "Bulk assignment stopped" };
}

function updateProgress(
  processed,
  total,
  success = 0,
  errors = 0,
  batch = 0,
  totalBatches = 0,
) {
  bulkProgress.processedItems = processed;
  bulkProgress.totalItems = total;
  bulkProgress.successCount = success;
  bulkProgress.errorCount = errors;
  bulkProgress.currentProgress =
    total > 0 ? Math.round((processed / total) * 100) : 0;
  bulkProgress.currentBatch = batch;
  bulkProgress.totalBatches = totalBatches;

  // Calculate estimated time remaining
  if (bulkProgress.startTime && processed > 0) {
    const elapsed = Date.now() - bulkProgress.startTime;
    const avgTimePerItem = elapsed / processed;
    const remaining = total - processed;
    bulkProgress.estimatedTimeRemaining = Math.round(
      (remaining * avgTimePerItem) / 1000,
    ); // in seconds
  }

  console.log(
    `📈 Progress Update: ${processed}/${total} (${bulkProgress.currentProgress}%) - Batch ${batch}/${totalBatches}`,
  );
}

// Optimized business-appropriate images from Unsplash (reduced size + compression)
const businessLogos = [
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Office building
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Modern office
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Business center
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Office space
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Professional office
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Business building
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Corporate office
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Team meeting
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Professional workspace
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Business consultation
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Glass building
  "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Modern workspace
  "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Business handshake
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Professional meeting
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=300&fit=crop&crop=center&q=80&auto=compress", // Business consultation
];

const businessCoverImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Business center
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Office interior
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Modern office
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Professional office
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Office building
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Business building
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Corporate office
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Team meeting
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Professional workspace
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Business consultation
  "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Modern workspace
  "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Business handshake
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Professional meeting
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Business consultation
  "https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=800&h=400&fit=crop&crop=center&q=80&auto=compress", // Office meeting
];

// Optimized business gallery photos for comprehensive business profiles
const businessGalleryImages = [
  // Office interiors and workspaces
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",

  // Business meetings and consultations
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",

  // Professional services and consultation
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",

  // Reception and waiting areas
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",

  // Business exteriors and buildings
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
  "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=600&h=400&fit=crop&crop=center&q=80&auto=compress",
];

async function downloadImageAsBuffer(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    return buffer;
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    throw error;
  }
}

async function uploadImageToS3(imageBuffer, filename, folder) {
  try {
    // Create a file-like object for S3 upload
    const file = {
      buffer: imageBuffer,
      originalname: filename,
      mimetype: "image/jpeg",
    };

    const result = await uploadToS3(file, folder);
    return result.publicUrl;
  } catch (error) {
    console.error(`Error uploading ${filename} to S3:`, error);
    throw error;
  }
}

export async function assignBulkBusinessImages(options = {}) {
  const {
    limit = 100, // Process in batches
    offset = 0,
    updateExisting = false, // Whether to update businesses that already have images
  } = options;

  console.log(
    `🎨 Starting bulk image assignment for businesses (limit: ${limit}, offset: ${offset})`,
  );

  try {
    // Get businesses that need images
    let query = `
      SELECT id, name, category, logo, coverImage
      FROM businesses
    `;

    if (!updateExisting) {
      query += ` WHERE (logo IS NULL OR logo LIKE '%placeholder%' OR coverImage IS NULL OR coverImage LIKE '%placeholder%')`;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const businesses = database.prepare(query).all();

    console.log(`📋 Found ${businesses.length} businesses to update`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < businesses.length; i++) {
      const business = businesses[i];
      console.log(
        `\n🔄 Processing business ${i + 1}/${businesses.length}: ${business.name}`,
      );

      try {
        let logoUrl = business.logo;
        let coverImageUrl = business.coverImage;

        // Assign logo if needed
        if (!logoUrl || logoUrl.includes("placeholder") || updateExisting) {
          const logoImageUrl = businessLogos[i % businessLogos.length];
          console.log(`📥 Downloading logo from: ${logoImageUrl}`);

          const logoBuffer = await downloadImageAsBuffer(logoImageUrl);
          logoUrl = await uploadImageToS3(
            logoBuffer,
            `logo_${business.id}.jpg`,
            "logos",
          );

          console.log(`✅ Logo uploaded to: ${logoUrl}`);
        }

        // Assign cover image if needed
        if (
          !coverImageUrl ||
          coverImageUrl.includes("placeholder") ||
          updateExisting
        ) {
          const coverImageImageUrl =
            businessCoverImages[i % businessCoverImages.length];
          console.log(`📥 Downloading cover image from: ${coverImageImageUrl}`);

          const coverBuffer = await downloadImageAsBuffer(coverImageImageUrl);
          coverImageUrl = await uploadImageToS3(
            coverBuffer,
            `cover_${business.id}.jpg`,
            "covers",
          );

          console.log(`✅ Cover image uploaded to: ${coverImageUrl}`);
        }

        // Assign gallery images (3-5 photos per business)
        let galleryUrls = [];
        try {
          if (business.gallery) {
            galleryUrls = JSON.parse(business.gallery);
          }
        } catch (e) {
          galleryUrls = [];
        }

        if (galleryUrls.length === 0 || updateExisting) {
          console.log(
            `📸 Adding gallery photos for business: ${business.name}`,
          );
          const numberOfGalleryImages = Math.floor(Math.random() * 3) + 3; // 3-5 images
          galleryUrls = [];

          for (let g = 0; g < numberOfGalleryImages; g++) {
            try {
              const galleryImageUrl =
                businessGalleryImages[
                  (i * numberOfGalleryImages + g) % businessGalleryImages.length
                ];
              console.log(
                `📥 Downloading gallery image ${g + 1}/${numberOfGalleryImages} from: ${galleryImageUrl}`,
              );

              const galleryBuffer =
                await downloadImageAsBuffer(galleryImageUrl);
              const galleryS3Url = await uploadImageToS3(
                galleryBuffer,
                `gallery_${business.id}_${g + 1}.jpg`,
                "gallery",
              );

              galleryUrls.push(galleryS3Url);
              console.log(
                `✅ Gallery image ${g + 1} uploaded to: ${galleryS3Url}`,
              );

              // Small delay between gallery uploads
              await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (galleryError) {
              console.error(
                `❌ Failed to upload gallery image ${g + 1}:`,
                galleryError,
              );
              // Continue with other gallery images
            }
          }

          console.log(
            `📸 Completed gallery upload: ${galleryUrls.length} images for ${business.name}`,
          );
        }

        // Update business in database
        const updateQuery = `
          UPDATE businesses
          SET logo = ?, coverImage = ?, gallery = ?, updatedAt = ?
          WHERE id = ?
        `;

        database
          .prepare(updateQuery)
          .run(
            logoUrl,
            coverImageUrl,
            JSON.stringify(galleryUrls),
            new Date().toISOString(),
            business.id,
          );

        successCount++;
        console.log(`✅ Updated business: ${business.name}`);

        // Add small delay to avoid overwhelming the image service
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing business ${business.name}:`, error);
        // Continue with next business
      }
    }

    console.log(`\n🎉 Bulk image assignment completed!`);
    console.log(`✅ Successfully updated: ${successCount} businesses`);
    console.log(`❌ Errors: ${errorCount} businesses`);

    return {
      success: true,
      processed: businesses.length,
      successCount,
      errorCount,
      nextOffset: offset + limit,
    };
  } catch (error) {
    console.error("❌ Bulk image assignment failed:", error);
    throw error;
  }
}

export { setDatabase };

export async function assignAllBusinessImages() {
  console.log("��� Starting complete bulk image assignment for all businesses");

  try {
    // Initialize progress tracking
    bulkProgress.isRunning = false;
    bulkProgress.startTime = Date.now();
    bulkProgress.currentProgress = 0;
    bulkProgress.processedItems = 0;
    bulkProgress.successCount = 0;
    bulkProgress.errorCount = 0;

    // Get total count of businesses
    const totalCount = database
      .prepare("SELECT COUNT(*) as count FROM businesses")
      .get().count;
    console.log(`📊 Total businesses in database: ${totalCount}`);

    const batchSize = 50; // Process in smaller batches for stability
    const totalBatches = Math.ceil(totalCount / batchSize);
    let offset = 0;
    let totalProcessed = 0;
    let totalSuccess = 0;
    let totalErrors = 0;
    let currentBatch = 0;

    // Initialize progress
    updateProgress(0, totalCount, 0, 0, 0, totalBatches);

    while (offset < totalCount && !bulkProgress.shouldStop) {
      currentBatch++;
      console.log(
        `\n📦 Processing batch ${currentBatch} (businesses ${offset + 1}-${Math.min(offset + batchSize, totalCount)})`,
      );

      // Check if stop requested
      if (bulkProgress.shouldStop) {
        console.log("🛑 Bulk assignment stopped by user request");
        break;
      }

      const result = await assignBulkBusinessImages({
        limit: batchSize,
        offset: offset,
        updateExisting: false, // Only update businesses with placeholder images
      });

      totalProcessed += result.processed;
      totalSuccess += result.successCount;
      totalErrors += result.errorCount;

      offset += batchSize;

      // Update progress
      updateProgress(
        totalProcessed,
        totalCount,
        totalSuccess,
        totalErrors,
        currentBatch,
        totalBatches,
      );

      // Break if no more businesses to process
      if (result.processed < batchSize) {
        break;
      }

      // Add delay between batches
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Mark as completed
    bulkProgress.isRunning = false;
    bulkProgress.currentProgress = 100;

    console.log(`\n🎉 ALL BUSINESSES PROCESSED!`);
    console.log(`📊 Final Statistics:`);
    console.log(`   Total Processed: ${totalProcessed}`);
    console.log(`   Successfully Updated: ${totalSuccess}`);
    console.log(`   Errors: ${totalErrors}`);
    console.log(
      `   Success Rate: ${Math.round((totalSuccess / totalProcessed) * 100)}%`,
    );

    return {
      success: true,
      totalProcessed,
      totalSuccess,
      totalErrors,
    };
  } catch (error) {
    // Mark as failed
    bulkProgress.isRunning = false;
    console.error("❌ Complete bulk assignment failed:", error);
    throw error;
  }
}
