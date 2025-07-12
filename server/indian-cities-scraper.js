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
  let currentSearch = 0;

  try {
    // Initialize database connection
    await sqliteDatabase.initialize();

    for (const city of INDIAN_CITIES_CONFIG.cities) {
      console.log(`\n🏙️ Processing city: ${city}`);

      for (const category of INDIAN_CITIES_CONFIG.categories) {
        currentSearch++;
        const searchTerm = `${category} ${city}`;
        const progressPercent = Math.round(
          (currentSearch / INDIAN_CITIES_CONFIG.totalSearches) * 100,
        );

        console.log(
          `\n🔍 Search ${currentSearch}/${INDIAN_CITIES_CONFIG.totalSearches} (${progressPercent}%)`,
        );
        console.log(`📝 Query: "${searchTerm}" in ${city}`);

        try {
          // Perform the search and scraping
          const searchConfig = {
            query: searchTerm,
            location: city,
            maxResults: INDIAN_CITIES_CONFIG.maxResultsPerSearch,
            delay: INDIAN_CITIES_CONFIG.delay,
            useS3Upload: true, // Enable S3 image upload
            targetCity: city,
            category: category,
          };

          const results = await scraper.scrapeGooglePlaces(searchConfig);

          if (results && results.businesses) {
            const newBusinesses = results.businesses.filter(
              (b) => !b.isDuplicate,
            ).length;
            const duplicates = results.businesses.filter(
              (b) => b.isDuplicate,
            ).length;

            INDIAN_CITIES_CONFIG.totalBusinesses += newBusinesses;
            INDIAN_CITIES_CONFIG.totalDuplicates += duplicates;

            console.log(
              `✅ Found ${results.businesses.length} places (${newBusinesses} new, ${duplicates} duplicates)`,
            );
          } else {
            console.log(`⚠️ No results for "${searchTerm}" in ${city}`);
          }

          // Progress summary every 10 searches
          if (currentSearch % 10 === 0) {
            console.log(`\n📊 Progress Update:`);
            console.log(
              `   • Searches completed: ${currentSearch}/${INDIAN_CITIES_CONFIG.totalSearches}`,
            );
            console.log(
              `   • Total new businesses: ${INDIAN_CITIES_CONFIG.totalBusinesses}`,
            );
            console.log(
              `   • Total duplicates: ${INDIAN_CITIES_CONFIG.totalDuplicates}`,
            );
            console.log(
              `   • Cities processed: ${Math.ceil(currentSearch / INDIAN_CITIES_CONFIG.categories.length)}/${INDIAN_CITIES_CONFIG.cities.length}`,
            );
          }
        } catch (searchError) {
          console.error(
            `❌ Error searching "${searchTerm}" in ${city}:`,
            searchError.message,
          );
          // Continue with next search instead of failing completely
        }

        // Small delay between searches to respect API limits
        await new Promise((resolve) =>
          setTimeout(resolve, INDIAN_CITIES_CONFIG.delay),
        );
      }

      // Longer delay between cities
      console.log(`✅ Completed ${city} - Taking a short break...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const endTime = Date.now();
    const durationMinutes = Math.round((endTime - startTime) / 1000 / 60);

    console.log(`\n🎉 Indian cities data collection completed!`);
    console.log(`📊 Final Results:`);
    console.log(`   • Total searches performed: ${currentSearch}`);
    console.log(
      `   • Total new businesses collected: ${INDIAN_CITIES_CONFIG.totalBusinesses}`,
    );
    console.log(
      `   • Total duplicates skipped: ${INDIAN_CITIES_CONFIG.totalDuplicates}`,
    );
    console.log(`   • Cities processed: ${INDIAN_CITIES_CONFIG.cities.length}`);
    console.log(
      `   • Categories per city: ${INDIAN_CITIES_CONFIG.categories.length}`,
    );
    console.log(`   • Duration: ${durationMinutes} minutes`);

    return {
      success: true,
      totalSearches: currentSearch,
      totalBusinesses: INDIAN_CITIES_CONFIG.totalBusinesses,
      totalDuplicates: INDIAN_CITIES_CONFIG.totalDuplicates,
      citiesProcessed: INDIAN_CITIES_CONFIG.cities.length,
      durationMinutes: durationMinutes,
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
