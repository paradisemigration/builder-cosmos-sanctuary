# 🔧 Fix DNS Conflict Error

## The Problem ❌
You have existing CNAME record: `www` → `thevisabay.fly.dev.`
Cannot create A record for same name (www)

## The Solution ✅
Replace the CNAME with A records for both domains

## Step 1: Delete Existing CNAME Record
At your domain registrar, delete this record:
```
Type: CNAME
Name: www  
Value: thevisabay.fly.dev.
```

## Step 2: Add New A Records
Replace with these A records:
```
Type: A
Name: @
Value: 66.241.125.129
TTL: 3600

Type: A
Name: www
Value: 66.241.125.129  
TTL: 3600
```

## Step 3: SSL Certificates (Run These Commands)
```bash
fly certs create thevisabay.com --app thevisabay
fly certs create www.thevisabay.com --app thevisabay
```

## Step 4: Add AWS Secrets (Fix Image Uploads)
```bash
fly secrets set AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO --app thevisabay
fly secrets set AWS_SECRET_ACCESS_KEY=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 --app thevisabay
fly secrets set AWS_REGION=us-east-1 --app thevisabay
fly secrets set AWS_S3_BUCKET_NAME=visaconsult-images --app thevisabay
```

## Final Result (5-30 minutes after DNS change):
✅ https://thevisabay.com → Your app
✅ https://www.thevisabay.com → Your app
✅ All 1,572+ consultants working
✅ Image uploads working
✅ Perfect custom domain deployment

**Delete the CNAME first, then add the A records!**
