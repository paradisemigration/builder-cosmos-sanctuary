# 🚂 Railway Deployment Guide - Step by Step

## Prerequisites

✅ **GitHub Repository**: `paradisemigration/builder-cosmos-sanctuary` (Connected)  
✅ **Working App**: Your app runs perfectly locally  
✅ **Database**: SQLite with 1,572+ businesses ready

## Step 1: Create Railway Account & Connect GitHub

### 1.1 Sign Up for Railway

1. Go to **https://railway.app**
2. Click **"Login"** in top right
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub account
5. You'll be redirected to Railway dashboard

### 1.2 Create New Project

1. Click **"New Project"** on Railway dashboard
2. Select **"Deploy from GitHub repo"**
3. Choose **"paradisemigration/builder-cosmos-sanctuary"**
4. Click **"Deploy Now"**

Railway will automatically:

- ✅ Detect it's a Node.js project
- ✅ Run `npm install`
- ✅ Start the build process

## Step 2: Configure Project Settings

### 2.1 Project Configuration

After deployment starts, click on your project to configure:

1. **Service Name**: Change to "thevisabay-app"
2. **Root Directory**: Leave as "/" (default)
3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`

### 2.2 Port Configuration

Railway will automatically detect port 8080 from your app, but verify:

- Go to **Settings** → **Environment**
- Ensure `PORT` is set to `8080` (should be automatic)

## Step 3: Environment Variables Setup

### 3.1 Add Required Environment Variables

Go to **Variables** tab and add these:

```
NODE_ENV=production
PORT=8080
AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=visaconsult-images
GOOGLE_PLACES_API_KEY=AIzaSyCLdVuLJI-sCmDe8dcQ5i8R_3rxWTzmxl8
```

### 3.2 How to Add Variables

1. Click **"New Variable"**
2. Enter **Key**: `NODE_ENV`
3. Enter **Value**: `production`
4. Click **"Add"**
5. Repeat for all variables above

## Step 4: Monitor Deployment

### 4.1 Check Build Logs

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Watch the build logs in real-time
4. Look for:
   - ✅ `npm install` completing
   - ✅ `npm run build` completing
   - ✅ Service starting successfully

### 4.2 Expected Build Process

```
✅ Installing dependencies...
✅ Building React frontend...
✅ Building server...
✅ Copying database files...
✅ Starting application on port 8080...
✅ Deployment successful!
```

## Step 5: Get Your Railway URL

### 5.1 Access Your App

1. Go to **"Settings"** → **"Environment"**
2. Copy the **"Public URL"** (something like `https://your-app-name.railway.app`)
3. Click the URL to test your deployment

### 5.2 Verify Features

Test these on your Railway deployment:

- ✅ Homepage loads with 1,572+ consultants
- ✅ Search functionality works
- ✅ Browse page shows businesses
- ✅ Admin panel accessible
- ✅ Database queries working

## Step 6: Configure Custom Domain

### 6.1 Add Custom Domain in Railway

1. Go to **"Settings"** → **"Domains"**
2. Click **"Custom Domain"**
3. Enter your domain: `thevisabay.com`
4. Click **"Add Domain"**

Railway will provide DNS records like:

```
Type: CNAME
Name: @
Value: your-app-name.railway.app

Type: CNAME
Name: www
Value: your-app-name.railway.app
```

### 6.2 Configure DNS at Your Registrar

Add these records at your domain registrar:

1. **Root domain (thevisabay.com)**:

   - Type: CNAME
   - Name: @ (or leave empty)
   - Value: `your-app-name.railway.app`

2. **WWW subdomain**:
   - Type: CNAME
   - Name: www
   - Value: `your-app-name.railway.app`

### 6.3 SSL Certificate

Railway automatically provides SSL certificates - no manual setup needed!

## Step 7: Final Verification

### 7.1 Test Everything

After DNS propagation (5-60 minutes):

1. Visit `https://thevisabay.com`
2. Visit `https://www.thevisabay.com`
3. Test all major features
4. Check image uploads work (AWS S3)
5. Verify admin panel access

### 7.2 Monitor Performance

Railway dashboard provides:

- ✅ Real-time metrics
- ✅ Build/deployment logs
- ✅ Resource usage
- ✅ Error tracking

## Common Issues & Solutions

### Issue 1: Build Fails

**Solution**: Check that `package.json` has correct scripts:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server && npm run copy:database",
    "start": "node dist/server/node-build.mjs"
  }
}
```

### Issue 2: Database Not Found

**Solution**: Ensure `server/visaconsult.db` is in your repository and `copy:database` script works.

### Issue 3: Environment Variables Not Working

**Solution**: Double-check all variables are added correctly in Railway dashboard.

## Why Railway is Perfect for Your App

- ✅ **No Docker issues** - Automatic Node.js detection
- ✅ **SQLite support** - Your database works perfectly
- ✅ **GitHub integration** - Automatic deploys on push
- ✅ **Custom domains** - Easy setup with auto-SSL
- ✅ **Environment variables** - Simple dashboard management
- ✅ **Monitoring** - Built-in logging and metrics

## Next Steps After Successful Deployment

1. **Update your repository** - Push any final changes
2. **Set up monitoring** - Railway provides built-in metrics
3. **Configure backups** - Your SQLite database should be backed up
4. **Performance optimization** - Monitor and optimize as needed

Your app will be live at both Railway URL and your custom domain! 🚀
