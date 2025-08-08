import BackupSystem from "./backup-system.js";

// Add this to your server/api.js file

// Backup endpoint - Add this route to your API
export const addBackupEndpoint = (app) => {
  // Create complete backup
  app.post("/api/admin/create-backup", async (req, res) => {
    try {
      console.log("🔄 Starting backup process...");

      const backupSystem = new BackupSystem();
      const result = await backupSystem.createCompleteBackup();

      res.json({
        success: true,
        message: "Backup created successfully",
        backup: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Backup error:", error);
      res.status(500).json({
        success: false,
        message: "Backup failed",
        error: error.message,
      });
    }
  });

  // Download backup file
  app.get("/api/admin/download-backup/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(__dirname, "backups", filename);

      if (fs.existsSync(filePath)) {
        res.download(filePath, filename);
      } else {
        res.status(404).json({ error: "Backup file not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // List available backups
  app.get("/api/admin/backups", (req, res) => {
    try {
      const backupsDir = path.join(__dirname, "backups");

      if (!fs.existsSync(backupsDir)) {
        return res.json({ backups: [] });
      }

      const files = fs
        .readdirSync(backupsDir)
        .filter((file) => file.endsWith(".zip"))
        .map((file) => {
          const stats = fs.statSync(path.join(backupsDir, file));
          return {
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
        .sort((a, b) => b.created - a.created);

      res.json({ backups: files });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
