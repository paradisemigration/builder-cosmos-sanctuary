import fetch from "node-fetch";
import { uploadToS3 } from "./storage-s3.js";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database connection
const dbPath = path.join(__dirname, "visaconsult.db");
const database = new Database(dbPath);

// Curated business-appropriate images from Unsplash
const businessLogos = [
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center", // Office building
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop&crop=center", // Modern office
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop&crop=center", // Business center
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=400&fit=crop&crop=center", // Office space
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop&crop=center", // Professional office
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop&crop=center", // Business building
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop&crop=center", // Corporate office
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=center", // Team meeting
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center", // Professional workspace
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=center", // Business consultation
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center", // Glass building
  "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=400&h=400&fit=crop&crop=center", // Modern workspace
  "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=400&h=400&fit=crop&crop=center", // Business handshake
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=400&fit=crop&crop=center", // Professional meeting
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop&crop=center", // Business consultation
];

const businessCoverImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop&crop=center", // Business center
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=600&fit=crop&crop=center", // Office interior
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop&crop=center", // Modern office
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop&crop=center", // Professional office
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop&crop=center", // Office building
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop&crop=center", // Business building
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop&crop=center", // Corporate office
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&crop=center", // Team meeting
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop&crop=center", // Professional workspace
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=600&fit=crop&crop=center", // Business consultation
  "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=1200&h=600&fit=crop&crop=center", // Modern workspace
  "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=1200&h=600&fit=crop&crop=center", // Business handshake
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&h=600&fit=crop&crop=center", // Professional meeting
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop&crop=center", // Business consultation
  "https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=1200&h=600&fit=crop&crop=center", // Office meeting
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

        // Update business in database
        const updateQuery = `
          UPDATE businesses
          SET logo = ?, coverImage = ?, updatedAt = ?
          WHERE id = ?
        `;

        database
          .prepare(updateQuery)
          .run(logoUrl, coverImageUrl, new Date().toISOString(), business.id);

        successCount++;
        console.log(`✅ Updated business: ${business.name}`);

        // Add small delay to avoid overwhelming the image service
        await new Promise((resolve) => setTimeout(resolve, 500));
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

export async function assignAllBusinessImages() {
  console.log("🚀 Starting complete bulk image assignment for all businesses");

  try {
    // Get total count of businesses
    const totalCount = database
      .prepare("SELECT COUNT(*) as count FROM businesses")
      .get().count;
    console.log(`📊 Total businesses in database: ${totalCount}`);

    const batchSize = 50; // Process in smaller batches for stability
    let offset = 0;
    let totalProcessed = 0;
    let totalSuccess = 0;
    let totalErrors = 0;

    while (offset < totalCount) {
      console.log(
        `\n📦 Processing batch ${Math.floor(offset / batchSize) + 1} (businesses ${offset + 1}-${Math.min(offset + batchSize, totalCount)})`,
      );

      const result = await assignBulkBusinessImages({
        limit: batchSize,
        offset: offset,
        updateExisting: false, // Only update businesses with placeholder images
      });

      totalProcessed += result.processed;
      totalSuccess += result.successCount;
      totalErrors += result.errorCount;

      offset += batchSize;

      // Progress update
      console.log(
        `📈 Progress: ${totalProcessed}/${totalCount} businesses processed (${Math.round((totalProcessed / totalCount) * 100)}%)`,
      );

      // Break if no more businesses to process
      if (result.processed < batchSize) {
        break;
      }

      // Add delay between batches
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

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
    console.error("❌ Complete bulk assignment failed:", error);
    throw error;
  }
}
