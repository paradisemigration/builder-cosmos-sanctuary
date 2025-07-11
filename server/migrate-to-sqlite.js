import Database from "./database.js"; // Current in-memory database
import SQLiteDatabase from "./database.sqlite.js";

class DataMigration {
  async migrate() {
    console.log("🚀 Starting data migration to SQLite database...");

    try {
      // Get all businesses from current in-memory database
      const result = await Database.getBusinesses({});
      const businesses = result.businesses || [];

      console.log(`📊 Found ${businesses.length} businesses to migrate`);

      if (businesses.length === 0) {
        console.log("⚠️ No businesses found in memory database");
        return;
      }

      let migrated = 0;
      let errors = 0;

      // Migrate each business to SQLite
      for (const business of businesses) {
        try {
          const result = await SQLiteDatabase.saveBusiness(business);
          if (result.success) {
            migrated++;
            console.log(`✅ Migrated: ${business.name}`);
          } else {
            errors++;
            console.error(
              `❌ Failed to migrate: ${business.name}`,
              result.error,
            );
          }
        } catch (error) {
          errors++;
          console.error(`❌ Error migrating ${business.name}:`, error.message);
        }
      }

      console.log(`\n🎉 Migration completed!`);
      console.log(`✅ Successfully migrated: ${migrated} businesses`);
      console.log(`❌ Errors: ${errors}`);
      console.log(`📊 Total processed: ${businesses.length}`);

      // Update statistics
      await SQLiteDatabase.updateStatistics();
      const stats = await SQLiteDatabase.getStatistics();
      console.log(`\n📈 Database Statistics:`);
      console.log(`- Total Businesses: ${stats.totalBusinesses}`);
      console.log(`- Total Reviews: ${stats.totalReviews}`);
      console.log(`- Total Images: ${stats.totalImages}`);
      console.log(`- Average Rating: ${stats.averageRating?.toFixed(2)}`);
      console.log(`- Cities Count: ${stats.citiesCount}`);
    } catch (error) {
      console.error("❌ Migration failed:", error);
    }
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new DataMigration();
  migration
    .migrate()
    .then(() => {
      console.log("🏁 Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration script failed:", error);
      process.exit(1);
    });
}

export default DataMigration;
