import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "visaconsult.db");
const db = new Database(dbPath);

console.log("🔧 Adding image columns to businesses table...");

try {
  // Check if columns exist first
  const columns = db.prepare("PRAGMA table_info(businesses)").all();
  const columnNames = columns.map((col) => col.name);

  console.log("Existing columns:", columnNames);

  if (!columnNames.includes("logo")) {
    console.log("Adding logo column...");
    db.exec("ALTER TABLE businesses ADD COLUMN logo TEXT");
  } else {
    console.log("logo column already exists");
  }

  if (!columnNames.includes("coverImage")) {
    console.log("Adding coverImage column...");
    db.exec("ALTER TABLE businesses ADD COLUMN coverImage TEXT");
  } else {
    console.log("coverImage column already exists");
  }

  if (!columnNames.includes("gallery")) {
    console.log("Adding gallery column...");
    db.exec("ALTER TABLE businesses ADD COLUMN gallery TEXT");
  } else {
    console.log("gallery column already exists");
  }

  console.log("✅ Migration completed successfully!");

  // Verify columns were added
  const newColumns = db.prepare("PRAGMA table_info(businesses)").all();
  console.log(
    "Final columns:",
    newColumns.map((col) => col.name),
  );
} catch (error) {
  console.error("❌ Migration failed:", error);
} finally {
  db.close();
}
