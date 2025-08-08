# 🚀 Quick Setup Commands - TheVisaBay.com

## 📦 **1. CREATE BACKUP NOW**

```bash
# Run this immediately to backup all your data
node backup-now.js

# Or trigger via your running server
curl -X POST https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/api/admin/create-complete-backup

# Check backup status
curl https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/api/admin/backup-status
```

## 🌐 **2. SETUP CUSTOM DOMAIN**

### A. Install Fly CLI (if needed):
```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### B. Add Your Domain:
```bash
# Replace 'thevisabay.com' with your actual domain
fly certs add thevisabay.com
fly certs add www.thevisabay.com

# Check status
fly certs list
```

### C. Configure DNS at Your Domain Provider:
Add these DNS records:
```
A     thevisabay.com      →  149.248.161.93
A     www.thevisabay.com  →  149.248.161.93
AAAA  thevisabay.com      →  2a09:8280:1::1:1
AAAA  www.thevisabay.com  →  2a09:8280:1::1:1
```

### D. Create Better App Name (Optional):
```bash
# Create new app with clean name
fly apps create thevisabay

# Update fly.toml (change app name)
# Then deploy
fly deploy
```

## 🔍 **3. VERIFY EVERYTHING WORKS**

```bash
# Test domain (after DNS propagation)
curl -I https://thevisabay.com

# Check certificates
fly certs show thevisabay.com

# View logs
fly logs

# Check current status
fly status
```

## 📊 **4. YOUR CURRENT DATA SUMMARY**

Your website currently has:
- 📈 **1,572 businesses**
- 🏙️ **19 cities** 
- 📂 **~48 categories**
- 🖼️ **1,926 images**
- ⭐ **7,707 reviews**
- 📊 **4.74 average rating**

All this data will be backed up and preserved during domain setup.

## ⚡ **5. IMMEDIATE ACTION PLAN**

1. **RIGHT NOW** - Create backup:
   ```bash
   node backup-now.js
   ```

2. **Buy/Configure Domain** - At your domain provider:
   - Add DNS A records pointing to `149.248.161.93`
   - Wait 24-48 hours for propagation

3. **Setup SSL** - Add certificates:
   ```bash
   fly certs add yourdomain.com
   ```

4. **Test & Go Live** - Verify everything works:
   ```bash
   curl https://yourdomain.com
   ```

## 🎯 **EXPECTED TIMELINE**

- ⚡ **Backup Creation**: 5-10 minutes
- 🌐 **Domain Setup**: 30 minutes  
- ⏰ **DNS Propagation**: 24-48 hours
- ✅ **Total Time to Live**: 1-2 days

Your site will remain accessible at the current Fly.dev URL during the entire process!
