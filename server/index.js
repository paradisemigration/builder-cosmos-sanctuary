import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server directory
dotenv.config({ path: path.join(__dirname, ".env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required environment variables for AWS S3
const requiredEnvVars = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_S3_BUCKET_NAME",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn("⚠️  Missing AWS S3 environment variables:");
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
