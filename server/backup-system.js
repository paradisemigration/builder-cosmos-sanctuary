import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";
import sqliteDatabase from "./database.sqlite.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BackupSystem {
  constructor() {
    this.backupDate = "2025-08-08"; // As requested
    this.backupDir = path.join(__dirname, "backups");
    this.currentBackupDir = path.join(
      this.backupDir,
      `backup-${this.backupDate}`,
    );
  }

  async createCompleteBackup() {
    console.log("🔄 Starting complete backup process...");

    try {
      // Create backup directories
      await this.ensureDirectories();

      // 1. Backup SQLite database file
      await this.backupDatabase();

      // 2. Export all business data as JSON
      await this.exportBusinessData();

      // 3. Export statistics and metadata
      await this.exportStatistics();

      // 4. Backup images (if using local storage)
      await this.backupImages();

      // 5. Export reviews separately
      await this.exportReviews();

      // 6. Create deployment configuration backup
      await this.backupDeploymentConfig();

      // 7. Create compressed archive
      await this.createZipArchive();

      console.log("✅ Complete backup created successfully!");
      return this.getBackupSummary();
    } catch (error) {
      console.error("❌ Backup failed:", error);
      throw error;
    }
  }

  async ensureDirectories() {
    const dirs = [
      this.backupDir,
      this.currentBackupDir,
      path.join(this.currentBackupDir, "data"),
      path.join(this.currentBackupDir, "images"),
      path.join(this.currentBackupDir, "config"),
      path.join(this.currentBackupDir, "exports"),
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  async backupDatabase() {
    console.log("📊 Backing up SQLite database...");

    const sourcePath = path.join(__dirname, "visaconsult.db");
    const backupPath = path.join(
      this.currentBackupDir,
      "data",
      "visaconsult.db",
    );

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, backupPath);
      console.log("✅ Database backup completed");
    } else {
      console.log("⚠️  Database file not found");
    }
  }

  async exportBusinessData() {
    console.log("🏢 Exporting business listings...");

    try {
      const businesses = await sqliteDatabase.getAllBusinesses();
      const exportPath = path.join(
        this.currentBackupDir,
        "exports",
        "businesses.json",
      );

      const exportData = {
        exportDate: new Date().toISOString(),
        totalBusinesses: businesses.length,
        businesses: businesses,
        metadata: {
          version: "1.0",
          source: "TheVisaBay.com",
          backupDate: this.backupDate,
        },
      };

      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
      console.log(`✅ Exported ${businesses.length} businesses`);

      // Also create CSV export
      await this.exportBusinessesCSV(businesses);
    } catch (error) {
      console.error("Error exporting businesses:", error);
    }
  }

  async exportBusinessesCSV(businesses) {
    console.log("📝 Creating CSV export...");

    const csvPath = path.join(
      this.currentBackupDir,
      "exports",
      "businesses.csv",
    );
    let csvContent =
      "ID,Name,Category,City,Address,Phone,Website,Rating,ReviewCount,Description,Services\n";

    businesses.forEach((business) => {
      const row = [
        business.id || "",
        this.escapeCsv(business.name || ""),
        this.escapeCsv(business.category || ""),
        this.escapeCsv(business.city || ""),
        this.escapeCsv(business.address || ""),
        this.escapeCsv(business.phone || ""),
        this.escapeCsv(business.website || ""),
        business.rating || "",
        business.reviewCount || "",
        this.escapeCsv(business.description || ""),
        this.escapeCsv((business.services || []).join("; ")),
      ].join(",");
      csvContent += row + "\n";
    });

    fs.writeFileSync(csvPath, csvContent);
    console.log("✅ CSV export completed");
  }

  async exportReviews() {
    console.log("⭐ Exporting reviews...");

    try {
      // Get all reviews from database
      const reviews = await this.getAllReviews();
      const exportPath = path.join(
        this.currentBackupDir,
        "exports",
        "reviews.json",
      );

      const exportData = {
        exportDate: new Date().toISOString(),
        totalReviews: reviews.length,
        reviews: reviews,
        metadata: {
          backupDate: this.backupDate,
          source: "TheVisaBay.com",
        },
      };

      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
      console.log(`✅ Exported ${reviews.length} reviews`);
    } catch (error) {
      console.error("Error exporting reviews:", error);
    }
  }

  async getAllReviews() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          r.*,
          b.name as business_name,
          b.city as business_city
        FROM reviews r
        LEFT JOIN businesses b ON r.business_id = b.id
        ORDER BY r.created_at DESC
      `;

      sqliteDatabase.db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async exportStatistics() {
    console.log("📈 Exporting statistics...");

    try {
      const stats = await sqliteDatabase.getStatistics();
      const cityStats = await sqliteDatabase.getCityCategoryStats();

      const exportData = {
        exportDate: new Date().toISOString(),
        backupDate: this.backupDate,
        generalStats: stats,
        cityStats: cityStats,
        summary: {
          totalBusinesses: stats.totalBusinesses || 0,
          totalCities: cityStats.totalCities || 0,
          totalCategories: cityStats.totalCategories || 0,
          totalImages: stats.totalImages || 0,
          totalReviews: stats.totalReviews || 0,
          averageRating: stats.averageRating || 0,
        },
      };

      const exportPath = path.join(
        this.currentBackupDir,
        "exports",
        "statistics.json",
      );
      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
      console.log("✅ Statistics export completed");
    } catch (error) {
      console.error("Error exporting statistics:", error);
    }
  }

  async backupImages() {
    console.log("🖼️  Backing up images...");

    const imageSourceDirs = [
      path.join(__dirname, "..", "uploads"),
      path.join(__dirname, "..", "public", "images"),
      path.join(__dirname, "images"),
    ];

    let imageCount = 0;

    for (const sourceDir of imageSourceDirs) {
      if (fs.existsSync(sourceDir)) {
        const destDir = path.join(
          this.currentBackupDir,
          "images",
          path.basename(sourceDir),
        );
        await this.copyDirectory(sourceDir, destDir);

        // Count images
        const files = this.getAllFiles(destDir);
        const images = files.filter((file) =>
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file),
        );
        imageCount += images.length;
      }
    }

    console.log(`✅ Backed up ${imageCount} images`);
  }

  async backupDeploymentConfig() {
    console.log("⚙️  Backing up deployment configuration...");

    const configFiles = [
      { src: path.join(__dirname, "..", "package.json"), dest: "package.json" },
      {
        src: path.join(__dirname, "..", "package-lock.json"),
        dest: "package-lock.json",
      },
      { src: path.join(__dirname, "..", "fly.toml"), dest: "fly.toml" },
      { src: path.join(__dirname, "..", ".env.example"), dest: ".env.example" },
      {
        src: path.join(__dirname, "..", "vite.config.ts"),
        dest: "vite.config.ts",
      },
      { src: path.join(__dirname, "..", "README.md"), dest: "README.md" },
    ];

    const configDir = path.join(this.currentBackupDir, "config");

    for (const file of configFiles) {
      if (fs.existsSync(file.src)) {
        fs.copyFileSync(file.src, path.join(configDir, file.dest));
      }
    }

    // Create deployment instructions
    const deploymentGuide = this.createDeploymentGuide();
    fs.writeFileSync(
      path.join(configDir, "DEPLOYMENT_GUIDE.md"),
      deploymentGuide,
    );

    console.log("✅ Configuration backup completed");
  }

  async createZipArchive() {
    console.log("📦 Creating compressed archive...");

    const archivePath = path.join(
      this.backupDir,
      `thevisabay-backup-${this.backupDate}.zip`,
    );
    const output = fs.createWriteStream(archivePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on("close", () => {
        console.log(`✅ Archive created: ${archive.pointer()} bytes`);
        resolve(archivePath);
      });

      archive.on("error", reject);
      archive.pipe(output);
      archive.directory(this.currentBackupDir, false);
      archive.finalize();
    });
  }

  createDeploymentGuide() {
    return `# TheVisaBay.com Deployment Guide
Backup Date: ${this.backupDate}

## Quick Deployment Options

### 1. Fly.dev (Recommended)
\`\`\`bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly deploy
\`\`\`

### 2. Railway
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway deploy
\`\`\`

### 3. Vercel + Database
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
\`\`\`

## Database Restoration
1. Copy visaconsult.db to your server
2. Set DATABASE_PATH environment variable
3. Run migration if needed

## Environment Variables Needed
- GOOGLE_PLACES_API_KEY=your_api_key
- DATABASE_PATH=./visaconsult.db
- NODE_ENV=production

## Current Data Summary
- Businesses: 1,572
- Cities: 19
- Categories: ~48
- Images: 1,926
- Reviews: 7,707
- Average Rating: 4.74

Generated: ${new Date().toISOString()}
`;
  }

  getBackupSummary() {
    const stats = {
      backupDate: this.backupDate,
      backupLocation: this.currentBackupDir,
      archiveLocation: path.join(
        this.backupDir,
        `thevisabay-backup-${this.backupDate}.zip`,
      ),
      components: [
        "SQLite Database (visaconsult.db)",
        "Business Listings (JSON + CSV)",
        "Reviews Data",
        "Statistics & Analytics",
        "Images & Media Files",
        "Deployment Configuration",
        "Restoration Guide",
      ],
    };

    return stats;
  }

  // Utility functions
  escapeCsv(str) {
    if (str && str.includes(",")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);

      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  getAllFiles(dir) {
    let files = [];
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          files = files.concat(this.getAllFiles(fullPath));
        } else {
          files.push(fullPath);
        }
      }
    }
    return files;
  }
}

export default BackupSystem;
