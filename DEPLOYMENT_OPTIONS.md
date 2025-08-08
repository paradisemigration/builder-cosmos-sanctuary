# 🚀 TheVisaBay.com Deployment Guide

_For project with 1,572 businesses, 7,707 reviews, 1,926 images_

## 📊 **Current Data Size**

- **Businesses:** 1,572
- **Cities:** 19
- **Categories:** ~48
- **Images:** 1,926
- **Reviews:** 7,707
- **Average Rating:** 4.74
- **Database Size:** ~50-100MB
- **Total Project Size:** ~500MB-1GB

---

## 🏆 **Recommended Deployment Platforms**

### 1. **Fly.dev** ⭐ (Current - Best Choice)

```bash
# Cost: $15-30/month
# Perfect for your data size

fly volumes create data --size 2 --app thevisabay
fly deploy
```

**✅ Pros:**

- Already configured and working
- Excellent SQLite support with volumes
- Global edge deployment (fast worldwide)
- Built-in SSL, monitoring
- Perfect for Node.js + SQLite
- Handles your image storage well

**💰 Cost Breakdown:**

- App: $10/month (shared-cpu-1x)
- Volume: $2/month (2GB)
- Bandwidth: $3-15/month
- **Total: ~$15-30/month**

---

### 2. **Railway** 🚄 (Great Alternative)

```bash
npm install -g @railway/cli
railway login
railway deploy
```

**✅ Pros:**

- Extremely simple deployment
- Built-in PostgreSQL (better than SQLite for your size)
- Automatic SSL, monitoring
- Great developer experience
- $5 hobby plan covers your needs

**Migration Needed:**

- Convert SQLite → PostgreSQL
- Modify database queries
- Update connection strings

**💰 Cost:** $5-20/month

---

### 3. **Vercel + PlanetScale** ⚡ (Most Scalable)

```bash
# Frontend on Vercel (free)
# Database on PlanetScale
# Images on Vercel/Cloudinary

npm install -g vercel
vercel
```

**✅ Pros:**

- Vercel frontend: FREE
- PlanetScale database: FREE (up to 1GB)
- Global CDN included
- Infinitely scalable
- Perfect for your data size

**Setup Required:**

- Convert SQLite → MySQL
- Setup PlanetScale database
- Configure serverless functions

**💰 Cost:** $0-20/month

---

### 4. **DigitalOcean App Platform** 🌊

```bash
# Simple deployment via GitHub
# Managed database included
```

**✅ Pros:**

- Predictable pricing: $12/month
- Managed PostgreSQL included
- Built-in CDN
- Simple scaling

**💰 Cost:** $12-25/month

---

## 🛠 **Quick Migration Commands**

### For Current Fly.dev Setup:

```bash
# Just redeploy with more resources
fly scale memory 1024
fly volumes extend data 5 # Increase to 5GB
```

### For Railway Migration:

```bash
# 1. Export data from SQLite
node scripts/export-to-sql.js

# 2. Deploy to Railway
railway login
railway new thevisabay
railway add postgresql
railway deploy

# 3. Import data
railway run node scripts/import-data.js
```

### For Vercel + PlanetScale:

```bash
# 1. Setup PlanetScale
pscale auth login
pscale database create thevisabay
pscale branch create thevisabay main

# 2. Export and import data
node scripts/sqlite-to-mysql.js

# 3. Deploy to Vercel
vercel --prod
```

---

## 📦 **Backup & Restore Process**

### Create Complete Backup:

```bash
# Run the backup script
node scripts/create-backup.js

# This creates:
# - thevisabay-backup-2025-08-08.zip
# - Contains all data, images, config
# - Ready for any platform deployment
```

### Restore on New Platform:

```bash
# 1. Download backup ZIP
# 2. Extract files
# 3. Copy database: visaconsult.db
# 4. Copy images to appropriate folder
# 5. Set environment variables
# 6. Deploy
```

---

## 🔧 **Environment Variables Needed**

```bash
# Required for all platforms
NODE_ENV=production
GOOGLE_PLACES_API_KEY=your_api_key_here

# Database (varies by platform)
DATABASE_URL=your_database_url_here
DATABASE_PATH=./visaconsult.db  # For SQLite platforms

# Optional
PORT=3000
SESSION_SECRET=your_secret_here
```

---

## 📈 **Performance Recommendations**

For your data size (1,572 businesses):

1. **Database Indexing:**

   ```sql
   CREATE INDEX idx_city ON businesses(city);
   CREATE INDEX idx_category ON businesses(category);
   CREATE INDEX idx_rating ON businesses(rating);
   ```

2. **Image Optimization:**

   - Use WebP format
   - Implement lazy loading
   - Consider CDN (Cloudinary/AWS CloudFront)

3. **Caching:**
   - Redis for frequent queries
   - Static file caching
   - API response caching

---

## 🎯 **Recommendation for You**

Based on your current setup and data size:

**🏆 BEST CHOICE: Stick with Fly.dev**

- Already working perfectly
- Just increase volume size to 5GB
- Add Redis for caching
- Estimated cost: $20-35/month

**🥈 ALTERNATIVE: Railway**

- If you want simpler management
- Better database (PostgreSQL)
- Slightly more expensive but easier

**Commands to optimize current Fly.dev:**

```bash
fly scale memory 1024
fly volumes extend data 5
fly redis create
```

---

## 🚀 **Next Steps**

1. **Create Backup:** `node scripts/create-backup.js`
2. **Choose Platform:** Fly.dev (recommended)
3. **Optimize Current Setup:** Scale up resources
4. **Monitor Performance:** Setup monitoring
5. **Plan Scaling:** Prepare for growth

Your project is perfectly sized for modern deployment platforms! 🎉
