import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required environment variables
const requiredEnvVars = [
  "GOOGLE_CLOUD_PROJECT_ID",
  "GOOGLE_CLOUD_KEY_FILE",
  "GOOGLE_CLOUD_BUCKET_NAME",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn("⚠️  Missing environment variables:");
  missingEnvVars.forEach((envVar) => {
    console.warn(`   - ${envVar}`);
  });
  console.warn(
    "\n🔧 Please copy .env.example to .env and configure Google Cloud Storage credentials.",
  );
  console.warn(
    "📖 See GOOGLE_CLOUD_SETUP.md for detailed setup instructions.\n",
  );

  // Continue without throwing error to allow development
}

// Start the API server
import("./api.js").then(() => {
  console.log("✅ API server started");
  console.log(`🌐 API Base URL: http://localhost:${process.env.PORT || 3001}`);
  console.log("📝 See GOOGLE_CLOUD_SETUP.md for configuration instructions");
});
