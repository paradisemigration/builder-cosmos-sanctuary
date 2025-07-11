import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database file path
const DB_PATH = path.join(__dirname, "visaconsult.db");

class SQLiteDatabase {
  constructor() {
    this.db = null;
    this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error("Error opening database:", err);
          reject(err);
        } else {
          console.log("✅ Connected to SQLite database");
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  getAddColumnSQL(tableName, columnName, columnType) {
    return `
      ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType};
    `;
  }

  async createTables() {
    const sql = `
      -- Businesses table
      CREATE TABLE IF NOT EXISTS businesses (
        id TEXT PRIMARY KEY,
        googlePlaceId TEXT UNIQUE,
        name TEXT NOT NULL,
        category TEXT,
        scrapedCategory TEXT,
        description TEXT,
        phone TEXT,
        website TEXT,
        address TEXT,
        city TEXT,
        scrapedCity TEXT,
        state TEXT,
        rating REAL DEFAULT 0,
        reviewCount INTEGER DEFAULT 0,
        isVerified BOOLEAN DEFAULT 1,
        businessHours TEXT,
        priceLevel INTEGER,
        logo TEXT,
        coverImage TEXT,
        gallery TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        scrapedAt TEXT
      );

      -- Reviews table
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        businessId TEXT,
        authorName TEXT,
        authorUrl TEXT,
        language TEXT,
        profilePhotoUrl TEXT,
        rating INTEGER,
        relativeTimeDescription TEXT,
        text TEXT,
        time INTEGER,
        createdAt TEXT,
        FOREIGN KEY (businessId) REFERENCES businesses (id)
      );

      -- Images table
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        businessId TEXT,
        photoReference TEXT,
        height INTEGER,
        width INTEGER,
        htmlAttributions TEXT,
        cloudStorageUrl TEXT,
        createdAt TEXT,
        FOREIGN KEY (businessId) REFERENCES businesses (id)
      );

      -- Scraping jobs table
      CREATE TABLE IF NOT EXISTS scraping_jobs (
        id TEXT PRIMARY KEY,
        cities TEXT,
        categories TEXT,
        maxResultsPerSearch INTEGER,
        delay INTEGER,
        totalSearches INTEGER,
        status TEXT,
        progress INTEGER DEFAULT 0,
        errors TEXT,
        createdAt TEXT,
        startedAt TEXT,
        completedAt TEXT
      );

      -- Statistics table
      CREATE TABLE IF NOT EXISTS statistics (
        id INTEGER PRIMARY KEY,
        totalBusinesses INTEGER DEFAULT 0,
        totalImages INTEGER DEFAULT 0,
        totalReviews INTEGER DEFAULT 0,
        totalGooglePlaces INTEGER DEFAULT 0,
        averageRating REAL DEFAULT 0,
        citiesCount INTEGER DEFAULT 0,
        lastUpdated TEXT,
        isRunning BOOLEAN DEFAULT 0,
        currentJob TEXT
      );

      -- Insert initial statistics row if not exists
      INSERT OR IGNORE INTO statistics (id, lastUpdated) VALUES (1, datetime('now'));
    `;

    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) {
          console.error("Error creating tables:", err);
          reject(err);
        } else {
          console.log("✅ Database tables created successfully");
          // Add missing columns if they don't exist
          this.addMissingColumns().then(resolve).catch(reject);
        }
      });
    });
  }

  async addMissingColumns() {
    return new Promise((resolve, reject) => {
      try {
        // Check if columns exist and add them if missing
        const addColumnIfNotExists = (tableName, columnName, columnType) => {
          try {
            this.db.exec(
              `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`,
            );
            console.log(`✅ Added column ${columnName} to ${tableName}`);
          } catch (error) {
            if (error.message.includes("duplicate column name")) {
              console.log(
                `ℹ️ Column ${columnName} already exists in ${tableName}`,
              );
            } else {
              throw error;
            }
          }
        };

        addColumnIfNotExists("businesses", "logo", "TEXT");
        addColumnIfNotExists("businesses", "coverImage", "TEXT");
        addColumnIfNotExists("businesses", "gallery", "TEXT");

        console.log("✅ Column migration completed");
        resolve();
      } catch (error) {
        console.error("❌ Column migration failed:", error);
        reject(error);
      }
    });
  }

  // Business operations
  async saveBusiness(businessData) {
    try {
      const id =
        businessData.googlePlaceId || businessData.id || this.generateId();
      const timestamp = new Date().toISOString();

      const business = {
        id,
        googlePlaceId: businessData.googlePlaceId,
        name: businessData.name,
        category: businessData.category,
        scrapedCategory: businessData.scrapedCategory,
        description: businessData.description,
        phone: businessData.phone,
        website: businessData.website,
        address: businessData.address,
        city: businessData.city,
        scrapedCity: businessData.scrapedCity,
        state: businessData.state,
        rating: businessData.rating || 0,
        reviewCount:
          businessData.reviews?.length || businessData.reviewCount || 0,
        isVerified: businessData.isVerified ? 1 : 0,
        businessHours: JSON.stringify(businessData.businessHours || {}),
        priceLevel: businessData.priceLevel || null,
        createdAt: businessData.createdAt || timestamp,
        updatedAt: timestamp,
        scrapedAt: businessData.scrapedAt || timestamp,
      };

      return new Promise((resolve, reject) => {
        const sql = `
          INSERT OR REPLACE INTO businesses (
            id, googlePlaceId, name, category, scrapedCategory, description,
            phone, website, address, city, scrapedCity, state, rating,
            reviewCount, isVerified, businessHours, priceLevel,
            createdAt, updatedAt, scrapedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        this.db.run(
          sql,
          [
            business.id,
            business.googlePlaceId,
            business.name,
            business.category,
            business.scrapedCategory,
            business.description,
            business.phone,
            business.website,
            business.address,
            business.city,
            business.scrapedCity,
            business.state,
            business.rating,
            business.reviewCount,
            business.isVerified,
            business.businessHours,
            business.priceLevel,
            business.createdAt,
            business.updatedAt,
            business.scrapedAt,
          ],
          async (err) => {
            if (err) {
              console.error("Error saving business:", err);
              reject(err);
            } else {
              // Save reviews
              if (businessData.reviews && businessData.reviews.length > 0) {
                await this.saveReviews(business.id, businessData.reviews);
              }

              // Save images
              if (businessData.images && businessData.images.length > 0) {
                await this.saveImages(business.id, businessData.images);
              }

              await this.updateStatistics();
              resolve({ success: true, id: business.id, business });
            }
          },
        );
      });
    } catch (error) {
      console.error("Save business error:", error);
      return { success: false, error: error.message };
    }
  }

  async saveReviews(businessId, reviews) {
    return new Promise((resolve, reject) => {
      // First, delete existing reviews for this business
      this.db.run(
        "DELETE FROM reviews WHERE businessId = ?",
        [businessId],
        (err) => {
          if (err) {
            console.error("Error deleting old reviews:", err);
            reject(err);
            return;
          }

          // Insert new reviews
          const sql = `
          INSERT INTO reviews (
            businessId, authorName, authorUrl, language, profilePhotoUrl,
            rating, relativeTimeDescription, text, time, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

          const stmt = this.db.prepare(sql);
          const timestamp = new Date().toISOString();

          reviews.forEach((review) => {
            stmt.run([
              businessId,
              review.authorName,
              review.authorUrl,
              review.language,
              review.profilePhotoUrl,
              review.rating,
              review.relativeTimeDescription,
              review.text,
              review.time,
              timestamp,
            ]);
          });

          stmt.finalize((err) => {
            if (err) {
              console.error("Error saving reviews:", err);
              reject(err);
            } else {
              // Update the business reviewCount to match actual review count
              this.db.run(
                "UPDATE businesses SET reviewCount = ? WHERE id = ?",
                [reviews.length, businessId],
                (updateErr) => {
                  if (updateErr) {
                    console.error("Error updating reviewCount:", updateErr);
                  } else {
                    console.log(
                      `✅ Updated reviewCount to ${reviews.length} for business ${businessId}`,
                    );
                  }
                  resolve();
                },
              );
            }
          });
        },
      );
    });
  }

  async saveImages(businessId, images) {
    return new Promise((resolve, reject) => {
      // First, delete existing images for this business
      this.db.run(
        "DELETE FROM images WHERE businessId = ?",
        [businessId],
        (err) => {
          if (err) {
            console.error("Error deleting old images:", err);
            reject(err);
            return;
          }

          // Insert new images
          const sql = `
          INSERT INTO images (
            businessId, photoReference, height, width, htmlAttributions,
            cloudStorageUrl, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

          const stmt = this.db.prepare(sql);
          const timestamp = new Date().toISOString();

          images.forEach((image) => {
            stmt.run([
              businessId,
              image.photoReference,
              image.height,
              image.width,
              JSON.stringify(image.htmlAttributions || []),
              image.cloudStorageUrl,
              timestamp,
            ]);
          });

          stmt.finalize((err) => {
            if (err) {
              console.error("Error saving images:", err);
              reject(err);
            } else {
              resolve();
            }
          });
        },
      );
    });
  }

  async getBusinesses(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT b.*,
               GROUP_CONCAT(DISTINCT r.id) as reviewIds,
               GROUP_CONCAT(DISTINCT i.id) as imageIds
        FROM businesses b
        LEFT JOIN reviews r ON b.id = r.businessId
        LEFT JOIN images i ON b.id = i.businessId
      `;

      const conditions = [];
      const params = [];

      // Text search across multiple fields
      if (filters.q) {
        conditions.push(
          "(LOWER(b.name) LIKE ? OR LOWER(b.description) LIKE ? OR LOWER(b.category) LIKE ? OR LOWER(b.scrapedCategory) LIKE ?)",
        );
        const searchTerm = `%${filters.q.toLowerCase()}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (filters.city) {
        conditions.push(
          "(LOWER(b.city) LIKE ? OR LOWER(b.scrapedCity) LIKE ?)",
        );
        params.push(
          `%${filters.city.toLowerCase()}%`,
          `%${filters.city.toLowerCase()}%`,
        );
      }

      if (filters.category) {
        conditions.push(
          "(LOWER(b.category) LIKE ? OR LOWER(b.scrapedCategory) LIKE ?)",
        );
        params.push(
          `%${filters.category.toLowerCase()}%`,
          `%${filters.category.toLowerCase()}%`,
        );
      }

      if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
      }

      sql += " GROUP BY b.id ORDER BY b.rating DESC, b.reviewCount DESC";

      // Pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 1000;
      const offset = (page - 1) * limit;

      sql += ` LIMIT ${limit} OFFSET ${offset}`;

      this.db.all(sql, params, async (err, rows) => {
        if (err) {
          console.error("Error getting businesses:", err);
          reject(err);
        } else {
          // Transform results and add reviews/images
          const businesses = await Promise.all(
            rows.map(async (row) => {
              const business = {
                id: row.id,
                googlePlaceId: row.googlePlaceId,
                name: row.name,
                category: row.category,
                scrapedCategory: row.scrapedCategory,
                description: row.description,
                phone: row.phone,
                website: row.website,
                address: row.address,
                city: row.city,
                scrapedCity: row.scrapedCity,
                state: row.state,
                rating: row.rating,
                reviewCount: row.reviewCount,
                isVerified: Boolean(row.isVerified),
                businessHours: JSON.parse(row.businessHours || "{}"),
                priceLevel: row.priceLevel,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                scrapedAt: row.scrapedAt,
                reviews: await this.getBusinessReviews(row.id),
                images: await this.getBusinessImages(row.id),
              };

              return business;
            }),
          );

          // Get total count for pagination
          const countSql = `SELECT COUNT(*) as total FROM businesses b ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}`;
          this.db.get(countSql, params, (err, countRow) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                businesses,
                total: countRow.total,
                page,
                totalPages: Math.ceil(countRow.total / limit),
              });
            }
          });
        }
      });
    });
  }

  async getBusinessById(googlePlaceId) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM businesses WHERE googlePlaceId = ? OR id = ?";
      this.db.get(sql, [googlePlaceId, googlePlaceId], (err, row) => {
        if (err) {
          console.error("Error getting business by ID:", err);
          resolve(null);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getBusinessReviews(businessId) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM reviews WHERE businessId = ? ORDER BY rating DESC";
      this.db.all(sql, [businessId], (err, rows) => {
        if (err) {
          console.error("Error getting reviews:", err);
          resolve([]);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getBusinessImages(businessId) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM images WHERE businessId = ? LIMIT 10";
      this.db.all(sql, [businessId], (err, rows) => {
        if (err) {
          console.error("Error getting images:", err);
          resolve([]);
        } else {
          resolve(
            rows.map((row) => ({
              ...row,
              htmlAttributions: JSON.parse(row.htmlAttributions || "[]"),
            })),
          );
        }
      });
    });
  }

  async updateStatistics() {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE statistics SET
          totalBusinesses = (SELECT COUNT(*) FROM businesses),
          totalImages = (SELECT COUNT(*) FROM images),
          totalReviews = (SELECT COUNT(*) FROM reviews),
          totalGooglePlaces = (SELECT COUNT(*) FROM businesses WHERE googlePlaceId IS NOT NULL),
          averageRating = (SELECT AVG(rating) FROM businesses WHERE rating > 0),
          citiesCount = (SELECT COUNT(DISTINCT COALESCE(scrapedCity, city)) FROM businesses),
          lastUpdated = datetime('now')
        WHERE id = 1
      `;

      this.db.run(sql, (err) => {
        if (err) {
          console.error("Error updating statistics:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async findDuplicates() {
    return new Promise((resolve, reject) => {
      // Find businesses with same googlePlaceId or same name+city combination
      const sql = `
        SELECT
          googlePlaceId,
          name,
          city,
          COUNT(*) as count,
          GROUP_CONCAT(id) as business_ids
        FROM businesses
        WHERE googlePlaceId IS NOT NULL
        GROUP BY googlePlaceId
        HAVING COUNT(*) > 1
        UNION
        SELECT
          'name_city_duplicate' as googlePlaceId,
          name,
          city,
          COUNT(*) as count,
          GROUP_CONCAT(id) as business_ids
        FROM businesses
        GROUP BY LOWER(name), LOWER(city)
        HAVING COUNT(*) > 1
      `;

      this.db.all(sql, (err, rows) => {
        if (err) {
          console.error("Error finding duplicates:", err);
          resolve([]);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async getStatistics() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM statistics WHERE id = 1";
      this.db.get(sql, (err, row) => {
        if (err) {
          console.error("Error getting statistics:", err);
          reject(err);
        } else {
          resolve(row || {});
        }
      });
    });
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error("Error closing database:", err);
          } else {
            console.log("✅ Database connection closed");
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export default new SQLiteDatabase();
