import AWS from "aws-sdk";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Multer memory storage for temporary file handling
const storage = multer.memoryStorage();

const multerConfig = {
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        ),
      );
    }
  },
};

export const uploadMiddleware = multer(multerConfig);

/**
 * Upload a single file to S3
 * @param {Object} file - Multer file object
 * @param {string} folder - Folder name in S3 bucket
 * @returns {Promise<Object>} Upload result with file URL
 */
export async function uploadToS3(file, folder = "images") {
  try {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Make file publicly accessible
    };

    const result = await s3.upload(uploadParams).promise();

    console.log(`✅ File uploaded to S3: ${fileName}`);

    return {
      success: true,
      fileName: fileName,
      publicUrl: result.Location,
      size: file.size,
      mimetype: file.mimetype,
    };
  } catch (error) {
    console.error("❌ S3 upload error:", error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

/**
 * Upload multiple files to S3
 * @param {Array} files - Array of Multer file objects
 * @param {string} folder - Folder name in S3 bucket
 * @returns {Promise<Array>} Array of upload results
 */
export async function uploadMultipleToS3(files, folder = "images") {
  try {
    const uploadPromises = files.map((file) => uploadToS3(file, folder));
    const results = await Promise.all(uploadPromises);

    console.log(`✅ ${files.length} files uploaded to S3`);

    return results;
  } catch (error) {
    console.error("❌ S3 multiple upload error:", error);
    throw new Error(`S3 multiple upload failed: ${error.message}`);
  }
}

/**
 * Delete a file from S3
 * @param {string} fileName - File name/key in S3
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteFromS3(fileName) {
  try {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileName,
    };

    await s3.deleteObject(deleteParams).promise();

    console.log(`✅ File deleted from S3: ${fileName}`);

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("❌ S3 delete error:", error);
    throw new Error(`S3 delete failed: ${error.message}`);
  }
}

/**
 * Check if S3 is properly configured
 * @returns {Promise<boolean>} Configuration status
 */
export async function checkS3Configuration() {
  try {
    // Try to list bucket contents (just check if we have access)
    await s3.headBucket({ Bucket: bucketName }).promise();

    console.log("✅ S3 configuration is valid");
    return true;
  } catch (error) {
    console.error("❌ S3 configuration error:", error);
    return false;
  }
}

/**
 * Get file info from S3
 * @param {string} fileName - File name/key in S3
 * @returns {Promise<Object>} File metadata
 */
export async function getFileInfo(fileName) {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    const result = await s3.headObject(params).promise();

    return {
      success: true,
      fileName: fileName,
      size: result.ContentLength,
      lastModified: result.LastModified,
      contentType: result.ContentType,
      publicUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    };
  } catch (error) {
    console.error("❌ S3 file info error:", error);
    throw new Error(`Failed to get file info: ${error.message}`);
  }
}

// Export default configuration
export default {
  uploadToS3,
  uploadMultipleToS3,
  deleteFromS3,
  checkS3Configuration,
  getFileInfo,
  uploadMiddleware,
  bucketName,
};
