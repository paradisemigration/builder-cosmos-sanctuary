import { scraper } from "./scraper.js";
import { sqliteDatabase } from "./sqlite-database.js";

// Indian cities configuration for comprehensive data collection
const INDIAN_CITIES_CONFIG = {
  cities: [
    "Delhi",
    "Mumbai",
    "Chennai",
    "Bangalore",
    "Gurgaon",
    "Noida",
    "Ahmedabad",
    "Pune",
    "Kochi",
    "Chandigarh",
    "Hyderabad",
    "Jaipur",
  ],
  categories: [
    "Immigration naturalization service",
    "Work Visa Consultants",
    "MARA Agent",
    "Canada Immigration Consultants",
    "Europe Work Visa Agent",
  ],
  maxResultsPerSearch: 60, // Maximum results per category per city
  delay: 200, // Fast collection - 200ms between requests
  totalSearches: 0,
  totalBusinesses: 0,
  totalDuplicates: 0,
};

// Calculate total searches
INDIAN_CITIES_CONFIG.totalSearches =
  INDIAN_CITIES_CONFIG.cities.length * INDIAN_CITIES_CONFIG.categories.length;

async function collectIndianCitiesData() {
  console.log("🚀 Starting Indian cities visa consultant data collection...");
  console.log(`📍 Cities: ${INDIAN_CITIES_CONFIG.cities.length}`);
  console.log(`📋 Categories: ${INDIAN_CITIES_CONFIG.categories.length}`);
  console.log(`🔢 Total searches: ${INDIAN_CITIES_CONFIG.totalSearches}`);

  const startTime = Date.now();

  try {
    // Create comprehensive category list with cities
    const searchCategories = [];

    for (const city of INDIAN_CITIES_CONFIG.cities) {
      for (const category of INDIAN_CITIES_CONFIG.categories) {
        searchCategories.push(`${category} ${city}`);
      }
    }

    // Use the scraper.scrapeBusinesses method for consistency
    const scrapingConfig = {
      cities: INDIAN_CITIES_CONFIG.cities,
      categories: searchCategories,
      maxResultsPerSearch: INDIAN_CITIES_CONFIG.maxResultsPerSearch,
      delay: INDIAN_CITIES_CONFIG.delay,
      jobId: `indian-cities-${Date.now()}`,
      useS3Upload: true, // Enable S3 image upload
    };

    console.log(
      `🔧 Starting scraping job with ${searchCategories.length} search terms...`,
    );

    const result = await scraper.scrapeBusinesses(scrapingConfig);

    const endTime = Date.now();
    const durationMinutes = Math.round((endTime - startTime) / 1000 / 60);

    console.log(`\n🎉 Indian cities data collection completed!`);
    console.log(`📊 Final Results:`);
    console.log(
      `   • Total searches performed: ${result.totalSearches || searchCategories.length}`,
    );
    console.log(
      `   • Total new businesses collected: ${result.totalBusinesses || 0}`,
    );
    console.log(
      `   • Total duplicates skipped: ${result.duplicatesSkipped || 0}`,
    );
    console.log(`   • Cities processed: ${INDIAN_CITIES_CONFIG.cities.length}`);
    console.log(
      `   • Categories per city: ${INDIAN_CITIES_CONFIG.categories.length}`,
    );
    console.log(`   • Duration: ${durationMinutes} minutes`);
    console.log(`   • Errors: ${result.errors?.length || 0}`);

    return {
      success: true,
      totalSearches: result.totalSearches || searchCategories.length,
      totalBusinesses: result.totalBusinesses || 0,
      totalDuplicates: result.duplicatesSkipped || 0,
      citiesProcessed: INDIAN_CITIES_CONFIG.cities.length,
      durationMinutes: durationMinutes,
      errors: result.errors || [],
    };
  } catch (error) {
    console.error("❌ Indian cities data collection failed:", error);
    throw error;
  }
}

// Export the function for API use
export { collectIndianCitiesData, INDIAN_CITIES_CONFIG };

// Run directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await collectIndianCitiesData();
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  }
}
