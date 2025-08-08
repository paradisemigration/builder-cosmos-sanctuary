# 🚀 Deploy TheVisaBay.com with Backup Protection

## 📦 **Step 1: Create Backup (CRITICAL - Do This First!)**

### Option A: Via API (Recommended)

```bash
# From your current Fly.dev deployment
curl -X POST https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/api/admin/create-complete-backup

# Check backup status
curl https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/api/admin/backup-status
```

### Option B: Via Script

```bash
# Run the backup script
node backup-now.js

# Or use the shell script
./create-backup.sh
```

### Option C: Manual Database Backup

```bash
# Copy the database file
cp server/visaconsult.db ./backup-$(date +%Y-%m-%d)-visaconsult.db

# Create code archive
tar -czf thevisabay-source-$(date +%Y-%m-%d).tar.gz . --exclude=node_modules --exclude=.git
```

---

## ���� **Step 2: Deployment Options**

### **Current Status:**

- ✅ Already deployed on Fly.dev
- 🔗 Current URL: `https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`
- 📊 Data: 1,572 businesses, 7,707 reviews, 1,926 images
- 💾 GitHub: `paradisemigration/builder-cosmos-sanctuary`

---

## 🛠 **Deployment Method 1: Update Current Fly.dev**

### 1. Install Fly CLI:

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### 2. Connect to Existing App:

```bash
# Find your app
fly apps list

# Connect to your current app
fly status
```

### 3. Deploy Updates:

```bash
# Deploy latest changes
fly deploy

# Scale resources (recommended for your data size)
fly scale memory 1024
fly scale count 2
```

---

## 🌐 **Deployment Method 2: Fresh Deployment with Custom Domain**

### 1. Create New App:

```bash
# Create new app with better name
fly apps create thevisabay --org personal

# Update fly.toml
```

### 2. Set Environment Variables:

```bash
fly secrets set GOOGLE_PLACES_API_KEY="your-api-key"
fly secrets set DATABASE_PATH="/app/data/visaconsult.db"
fly secrets set NODE_ENV="production"
```

### 3. Create Volume for Database:

```bash
fly volumes create data --size 5 --region iad
```

### 4. Deploy:

```bash
fly deploy
```

### 5. Add Custom Domain:

```bash
fly certs add thevisabay.com
fly certs add www.thevisabay.com
```

---

## 🔧 **Deployment Method 3: Alternative Platforms**

### **Railway (Easiest Alternative):**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway new thevisabay
railway add postgresql  # Better than SQLite for production
railway deploy
```

### **Vercel + PlanetScale (Most Scalable):**

```bash
# Frontend on Vercel
npm install -g vercel
vercel

# Database on PlanetScale
npm install -g @planetscale/cli
pscale auth login
pscale database create thevisabay
```

### **DigitalOcean App Platform:**

- Connect GitHub repo: `paradisemigration/builder-cosmos-sanctuary`
- Add managed PostgreSQL database
- Deploy via UI

---

## 📋 **Updated fly.toml Configuration**

```toml
# fly.toml app configuration file
app = "thevisabay"
primary_region = "iad"

[build]

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[env]
  NODE_ENV = "production"
  PORT = "3001"
  DATABASE_PATH = "/app/data/visaconsult.db"

[[mounts]]
  source = "data"
  destination = "/app/data"

[deploy]
  release_command = "npm run build"

# Health check
[[http_service.http_checks]]
  interval = "10s"
  grace_period = "5s"
  method = "get"
  path = "/api/health"
  protocol = "http"
  timeout = "2s"
```

---

## 🎯 **Recommended Deployment Plan**

### **For Your Current Setup:**

**✅ BEST OPTION: Update Current Fly.dev**

1. **Create backup** (via API or script)
2. **Scale current app** (`fly scale memory 1024`)
3. **Add custom domain** (`fly certs add yourdomain.com`)
4. **Keep same data** (1,572 businesses preserved)

**Cost**: ~$25-35/month
**Downtime**: ~5 minutes
**Risk**: Minimal (backup protects data)

---

## 🔄 **Step-by-Step Deployment Commands**

### **Right Now - Create Backup:**

```bash
curl -X POST https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/api/admin/create-complete-backup
```

### **Then Deploy:**

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh
fly auth login

# Scale current app
fly scale memory 1024
fly deploy

# Add custom domain (if you have one)
fly certs add yourdomain.com
```

---

## 🛡️ **Backup Verification**

### **Check Your Data:**

```bash
# Verify business count
curl https://your-app.fly.dev/api/scraping/stats

# Test API endpoints
curl https://your-app.fly.dev/api/city-category-stats

# Check database status
curl https://your-app.fly.dev/api/admin/backup-status
```

### **Expected Results:**

- ✅ **1,572 businesses** preserved
- ✅ **7,707 reviews** intact
- ✅ **1,926 images** available
- ✅ **All 19 cities** working
- ✅ **~48 categories** functional

---

## ⚡ **Emergency Rollback Plan**

If deployment fails:

```bash
# Rollback to previous version
fly releases

# Deploy specific release
fly deploy --image flyio/thevisabay:v123

# Or restore from backup
# (restore database from backup file)
```

**Your data is protected!** The backup ensures you can always restore your 1,572 businesses and 7,707 reviews. 🛡️

---

## 🎯 **I Cannot Deploy Directly, But I Can Guide You**

While I cannot access your Fly.dev account or deploy for you, I can:

- ✅ **Create deployment scripts and configs**
- ✅ **Provide exact commands to run**
- ✅ **Help troubleshoot any issues**
- ✅ **Guide you through each step**

**Run the backup command first, then follow the deployment steps above!** 🚀
