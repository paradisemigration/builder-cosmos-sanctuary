import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database file path
const DB_PATH = path.join(__dirname, "../visaconsult.db");

class S3ColumnsMigration {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error("Error opening database:", err);
          reject(err);
        } else {
          console.log("✅ Connected to SQLite database for migration");
          resolve();
        }
      });
    });
  }

  async addS3Columns() {
    const columns = [
      {
        name: "logo_s3_url",
        type: "TEXT",
        description: "S3 URL for business logo",
      },
      {
        name: "cover_s3_url",
        type: "TEXT",
        description: "S3 URL for business cover image",
      },
      {
        name: "photos_s3_urls",
        type: "TEXT",
        description: "JSON array of S3 URLs for business photos",
      },
      {
        name: "s3_sync_status",
        type: 'TEXT DEFAULT "pending"',
        description: "Sync status: pending, processing, completed, failed",
      },
      {
        name: "s3_sync_date",
        type: "DATETIME",
        description: "Timestamp when S3 sync was completed",
      },
      {
        name: "s3_photo_count",
        type: "INTEGER DEFAULT 0",
        description: "Number of photos synced to S3",
      },
    ];

    for (const column of columns) {
      try {
        await this.addColumnIfNotExists("businesses", column.name, column.type);
        console.log(`✅ Added column: ${column.name} - ${column.description}`);
      } catch (error) {
        if (error.message.includes("duplicate column name")) {
          console.log(`ℹ️ Column ${column.name} already exists`);
        } else {
          console.error(`❌ Error adding column ${column.name}:`, error);
          throw error;
        }
      }
    }
  }

  async addColumnIfNotExists(tableName, columnName, columnType) {
    return new Promise((resolve, reject) => {
      const sql = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`;

      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async createIndexes() {
    const indexes = [
      {
        name: "idx_s3_sync_status",
        sql: "CREATE INDEX IF NOT EXISTS idx_s3_sync_status ON businesses(s3_sync_status)",
      },
      {
        name: "idx_s3_sync_date",
        sql: "CREATE INDEX IF NOT EXISTS idx_s3_sync_date ON businesses(s3_sync_date)",
      },
    ];

    for (const index of indexes) {
      try {
        await this.executeSQL(index.sql);
        console.log(`✅ Created index: ${index.name}`);
      } catch (error) {
        console.error(`❌ Error creating index ${index.name}:`, error);
      }
    }
  }

  async executeSQL(sql) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async verifyColumns() {
    return new Promise((resolve, reject) => {
      const sql = "PRAGMA table_info(businesses)";

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const s3Columns = rows.filter(
            (row) =>
              row.name.includes("s3") ||
              row.name.includes("logo_s3") ||
              row.name.includes("cover_s3") ||
              row.name.includes("photos_s3"),
          );

          console.log("\n📋 S3 Columns Status:");
          s3Columns.forEach((col) => {
            console.log(
              `  ✅ ${col.name} (${col.type}) - ${col.dflt_value ? "Default: " + col.dflt_value : "No default"}`,
            );
          });

          resolve(s3Columns);
        }
      });
    });
  }

  async runMigration() {
    try {
      await this.init();

      console.log("\n🚀 Starting S3 Columns Migration...");

      // Add S3 columns
      await this.addS3Columns();

      // Create performance indexes
      await this.createIndexes();

      // Verify migration
      await this.verifyColumns();

      console.log("\n🎉 S3 Columns Migration completed successfully!");

      return {
        success: true,
        message: "S3 columns migration completed successfully",
      };
    } catch (error) {
      console.error("\n❌ Migration failed:", error);
      throw error;
    } finally {
      if (this.db) {
        this.db.close();
      }
    }
  }
}

// Export for use in other modules
export default S3ColumnsMigration;

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new S3ColumnsMigration();
  migration
    .runMigration()
    .then((result) => {
      console.log("\n✅ Migration script completed:", result.message);
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Migration script failed:", error);
      process.exit(1);
    });
}
