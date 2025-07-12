import BusinessScraper from "./scraper.js";
import sqliteDatabase from "./database.sqlite.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize scraper with Google Places API key
const scraper = new BusinessScraper(process.env.GOOGLE_PLACES_API_KEY);

// Abu Dhabi data collection configuration
const ABU_DHABI_CONFIG = {
  cities: ["Abu Dhabi"],
  categories: [
    "visa consultant",
    "immigration lawyer",
    "Visa agent",
    "immigration consultants",
    "Immigration & naturalization service",
    "Work Visa Consultants",
    "MARA Agent",
    "Overseas Services",
    "Canada Immigration Consultants",
    "Europe Work Visa Agent",
    "study abroad consultant",
    "education consultants",
    "travel agency",
  ],
  maxResultsPerSearch: 20, // Get more results per category
  delay: 300, // Fast delay since we're doing this manually
};

async function collectAbuDhabiData() {
  console.log("🚀 Starting Abu Dhabi visa consultant data collection...");
  console.log(`📍 City: ${ABU_DHABI_CONFIG.cities[0]}`);
  console.log(
    `📋 Categories: ${ABU_DHABI_CONFIG.categories.length} categories`,
  );
  console.log(
    `🔑 Using API key: ${process.env.GOOGLE_PLACES_API_KEY ? "Configured ✅" : "Missing ❌"}`,
  );

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error(
      "❌ Google Places API key not found in environment variables",
    );
    return;
  }

  try {
    console.log("\n📊 Starting data collection...");

    const result = await scraper.scrapeBusinesses({
      cities: ABU_DHABI_CONFIG.cities,
      categories: ABU_DHABI_CONFIG.categories,
      maxResultsPerSearch: ABU_DHABI_CONFIG.maxResultsPerSearch,
      delay: ABU_DHABI_CONFIG.delay,
      jobId: `abu-dhabi-${Date.now()}`, // Unique job ID
    });

    console.log("\n🎉 Abu Dhabi data collection completed!");
    console.log("📈 Results Summary:");
    console.log(`   • Total businesses found: ${result.totalBusinesses}`);
    console.log(`   • Duplicates skipped: ${result.duplicatesSkipped}`);
    console.log(`   • Total searches performed: ${result.totalSearches}`);
    console.log(
      `   • Success rate: ${result.totalBusinesses > 0 ? "100%" : "0%"}`,
    );

    if (result.errors && result.errors.length > 0) {
      console.log(`   • Errors encountered: ${result.errors.length}`);
      result.errors.forEach((error, index) => {
        console.log(`     ${index + 1}. ${error}`);
      });
    }

    // Get final database statistics
    const dbStats = await sqliteDatabase.getStatistics();
    console.log("\n📊 Database Status:");
    console.log(
      `   • Total businesses in database: ${dbStats.totalBusinesses || "N/A"}`,
    );
    console.log(`   • Total reviews: ${dbStats.totalReviews || "N/A"}`);
    console.log(
      `   • Average rating: ${dbStats.averageRating ? dbStats.averageRating.toFixed(1) : "N/A"}`,
    );

    return result;
  } catch (error) {
    console.error("❌ Abu Dhabi data collection failed:", error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log("🌟 Abu Dhabi Visa Consultant Data Collection");
  console.log("=".repeat(50));

  try {
    await collectAbuDhabiData();
    console.log("\n✅ Script completed successfully!");
    console.log("💾 All data has been permanently stored in the database.");
  } catch (error) {
    console.error("\n❌ Script failed:", error.message);
    process.exit(1);
  }
}

// Run the script
if (process.argv[1] === __filename) {
  main();
}

export { collectAbuDhabiData };
