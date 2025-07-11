# Google Cloud Storage Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your PROJECT_ID

## Step 2: Enable Cloud Storage API

1. Go to "APIs & Services" > "Library"
2. Search for "Cloud Storage API"
3. Click "Enable"

## Step 3: Create Storage Bucket

1. Go to "Cloud Storage" > "Buckets"
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `visaconsult-india-images`)
4. Select region closest to your users
5. Choose "Standard" storage class
6. Set public access prevention to "Off"
7. Click "Create"

## Step 4: Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name: `visaconsult-storage`
4. Description: `Storage access for VisaConsult India`
5. Click "Create and Continue"
6. Grant role: "Storage Admin"
7. Click "Continue" > "Done"

## Step 5: Generate Key File

1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the key file
6. Save as `google-cloud-key.json` in your project root

## Step 6: Configure Environment

1. Copy `.env.example` to `.env`
2. Update with your values:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=./google-cloud-key.json
GOOGLE_CLOUD_BUCKET_NAME=visaconsult-india-images
```

## Step 7: Start API Server

```bash
npm run dev
```

This will start both frontend (port 5173) and API server (port 3001).

## Step 8: Test Upload

1. Go to Admin Panel > Media tab
2. Try uploading an image
3. Check your Google Cloud Storage bucket

## Bucket Permissions (Optional)

To make images publicly accessible:

1. Go to your bucket in Cloud Console
2. Click "Permissions" tab
3. Click "Add Principal"
4. Principal: `allUsers`
5. Role: "Storage Object Viewer"
6. Click "Save"

## Cost Estimation

- Storage: $0.02 per GB per month
- Operations: $0.004 per 10,000 operations
- Network egress: First 1GB free per month

For 10,000 images (~5GB): ~$0.10/month

## Security Best Practices

1. Restrict service account permissions
2. Use signed URLs for sensitive content
3. Implement rate limiting
4. Monitor storage usage
5. Set up billing alerts

## Troubleshooting

### Error: "Permission denied"

- Check service account has Storage Admin role
- Verify bucket name in .env

### Error: "Bucket not found"

- Ensure bucket name is correct
- Check project ID matches

### Error: "Key file not found"

- Verify path to google-cloud-key.json
- Check file permissions

## Scaling for Thousands of Images

### Storage Organization

```
your-bucket/
├── logos/           # Business logos
├── covers/          # Cover images
├── gallery/         # Gallery images
├── documents/       # PDF documents
└── thumbnails/      # Auto-generated thumbnails
```

### Performance Optimization

1. Use CDN (Cloud CDN)
2. Implement image resizing
3. Add caching headers
4. Use WebP format
5. Lazy loading on frontend

### Monitoring

1. Set up Cloud Monitoring
2. Track storage usage
3. Monitor API quotas
4. Set billing alerts

This setup can handle millions of images with proper optimization!
