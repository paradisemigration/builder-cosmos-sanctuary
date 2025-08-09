# 🌐 DNS Setup for thevisabay.com

## Your Fly.io App IP Address ✅
**IPv4**: `66.241.125.129`
**App Name**: `thevisabay`

## Step 1: Add SSL Certificates
```bash
fly certs create thevisabay.com --app thevisabay
fly certs create www.thevisabay.com --app thevisabay
```

## Step 2: Configure DNS Records
Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these **exact** DNS records:

### DNS Records to Add:
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

## Step 3: Add AWS Secrets (Fix Image Uploads)
```bash
fly secrets set AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO --app thevisabay
fly secrets set AWS_SECRET_ACCESS_KEY=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 --app thevisabay
fly secrets set AWS_REGION=us-east-1 --app thevisabay
fly secrets set AWS_S3_BUCKET_NAME=visaconsult-images --app thevisabay
```

## Step 4: Check Status
```bash
fly status --app thevisabay
fly certs list --app thevisabay
```

## Expected Results After 5-30 Minutes:
✅ https://thevisabay.com → Your app
✅ https://www.thevisabay.com → Your app
✅ Image uploads working
✅ All 1,572+ consultants visible
✅ All features working

## Your App Will Show:
- ✅ 1,572+ Verified Consultants
- ✅ 7,707+ Customer Reviews
- ✅ 19+ Cities Covered
- ✅ Perfect search functionality
- ✅ Working admin panel

**Your domain will be live at thevisabay.com!** 🚀
