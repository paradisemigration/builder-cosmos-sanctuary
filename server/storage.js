import { Storage } from "@google-cloud/storage";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to service account key
});

const bucketName =
  process.env.GOOGLE_CLOUD_BUCKET_NAME || "visaconsult-india-images";
const bucket = storage.bucket(bucketName);

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Upload single file to Google Cloud Storage
export const uploadToGCS = async (file, folder = "businesses") => {
  try {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}-${file.originalname}`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        cacheControl: "public, max-age=31536000", // Cache for 1 year
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        reject(err);
      });

      blobStream.on("finish", async () => {
        try {
          // Make the file public
          await blob.makePublic();

          // Return the public URL
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          resolve({
            fileName,
            publicUrl,
            size: file.size,
            mimetype: file.mimetype,
          });
        } catch (error) {
          reject(error);
        }
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Upload multiple files
export const uploadMultipleToGCS = async (files, folder = "businesses") => {
  try {
    const uploadPromises = files.map((file) => uploadToGCS(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};

// Delete file from Google Cloud Storage
export const deleteFromGCS = async (fileName) => {
  try {
    await bucket.file(fileName).delete();
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

// Get signed URL for temporary access
export const getSignedUrl = async (
  fileName,
  action = "read",
  expires = Date.now() + 1000 * 60 * 60,
) => {
  try {
    const [url] = await bucket.file(fileName).getSignedUrl({
      action,
      expires,
    });
    return url;
  } catch (error) {
    throw new Error(`Signed URL generation failed: ${error.message}`);
  }
};

// Multer middleware
export const uploadMiddleware = {
  single: (fieldName) => upload.single(fieldName),
  multiple: (fieldName, maxCount = 10) => upload.array(fieldName, maxCount),
  fields: (fields) => upload.fields(fields),
};

// Image processing utilities
export const resizeAndOptimize = async (file, options = {}) => {
  // This would typically use Sharp or similar for image processing
  // For now, we'll return the original file
  return file;
};

export default {
  uploadToGCS,
  uploadMultipleToGCS,
  deleteFromGCS,
  getSignedUrl,
  uploadMiddleware,
  resizeAndOptimize,
};
