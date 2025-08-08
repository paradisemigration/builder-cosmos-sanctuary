# 🚀 Fly.dev Custom Domain Setup for TheVisaBay.com

## 📋 **Current Status**

- ✅ Already deployed on Fly.dev
- 🔗 Current URL: `https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`
- 🎯 Goal: Deploy on your custom domain (e.g., `thevisabay.com`)

---

## 🛠 **Step 1: Install Fly CLI (if not installed)**

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows PowerShell
iwr https://fly.io/install.ps1 -useb | iex

# Verify installation
fly version
```

## 🔐 **Step 2: Login to Fly.dev**

```bash
fly auth login
```

## 📂 **Step 3: Navigate to Your Project**

```bash
cd /path/to/thevisabay-project
```

## 🌐 **Step 4: Add Your Custom Domain**

### Option A: Add Domain to Existing App

```bash
# Get your current app name
fly apps list

# Add your domain (replace with your actual domain)
fly certs add thevisabay.com
fly certs add www.thevisabay.com

# Check certificate status
fly certs list
```

### Option B: Create New App with Custom Name

```bash
# Create new app with better name
fly apps create thevisabay --org personal

# Update fly.toml
# Change app name in fly.toml file
```

## 📝 **Step 5: Update fly.toml Configuration**

Create or update your `fly.toml`:

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

  # Custom domain configuration
  [[http_service.http_checks]]
    interval = "10s"
    grace_period = "5s"
    method = "get"
    path = "/api/health"
    protocol = "http"
    timeout = "2s"
    tls_skip_verify = false

[env]
  NODE_ENV = "production"
  PORT = "3001"

[[mounts]]
  source = "data"
  destination = "/app/data"

[deploy]
  release_command = "npm run build"

# Custom domains
[[http_service.concurrency]]
  type = "connections"
  hard_limit = 25
  soft_limit = 20

# Environment-specific configuration
[env]
  DATABASE_PATH = "/app/data/visaconsult.db"
```

## 🔧 **Step 6: Configure DNS at Your Domain Provider**

At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add these DNS records:

```dns
# A Records (IPv4)
A     thevisabay.com      →  149.248.161.93  (Fly.dev IPv4)
A     www.thevisabay.com  →  149.248.161.93

# AAAA Records (IPv6)
AAAA  thevisabay.com      →  2a09:8280:1::1:1  (Fly.dev IPv6)
AAAA  www.thevisabay.com  →  2a09:8280:1::1:1

# CNAME Alternative (if preferred)
CNAME thevisabay.com      →  a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev
CNAME www.thevisabay.com  →  a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev
```

## 🚀 **Step 7: Deploy with Custom Domain**

```bash
# Deploy current version
fly deploy

# Or if creating new app
fly launch --no-deploy
fly deploy

# Check deployment status
fly status
fly logs
```

## 🔍 **Step 8: Verify SSL Certificates**

```bash
# Check certificate status
fly certs list

# View certificate details
fly certs show thevisabay.com

# Check if certificates are ready
curl -I https://thevisabay.com
```

## 📊 **Step 9: Test Your Domain**

```bash
# Test domain resolution
nslookup thevisabay.com

# Test website response
curl -I https://thevisabay.com
curl https://thevisabay.com/api/stats

# Check SSL
openssl s_client -connect thevisabay.com:443 -servername thevisabay.com
```

---

## 🔧 **Advanced Configuration**

### Set Environment Variables:

```bash
fly secrets set GOOGLE_PLACES_API_KEY="your-api-key"
fly secrets set DATABASE_PATH="/app/data/visaconsult.db"
fly secrets set NODE_ENV="production"
```

### Scale Resources:

```bash
# Scale up for production
fly scale count 2
fly scale memory 1024
fly scale vm shared-cpu-2x
```

### Create Volume for Database:

```bash
fly volumes create data --size 5 --region iad
```

---

## 🛠 **Troubleshooting**

### Certificate Issues:

```bash
# Remove and re-add certificate
fly certs remove thevisabay.com
fly certs add thevisabay.com

# Check DNS propagation
dig thevisabay.com
dig www.thevisabay.com
```

### App Issues:

```bash
# Check app logs
fly logs

# Check app status
fly status

# Restart app
fly restart
```

### DNS Issues:

- Wait 24-48 hours for DNS propagation
- Use online DNS checker tools
- Verify records with your domain provider

---

## 📱 **Domain Provider Specific Guides**

### GoDaddy:

1. Go to DNS Management
2. Add A record: `@` → `149.248.161.93`
3. Add A record: `www` → `149.248.161.93`

### Cloudflare:

1. Go to DNS section
2. Add A record: `thevisabay.com` → `149.248.161.93`
3. Add CNAME: `www` → `thevisabay.com`
4. Set SSL to "Full"

### Namecheap:

1. Go to Advanced DNS
2. Add A record: `@` → `149.248.161.93`
3. Add A record: `www` → `149.248.161.93`

---

## ✅ **Final Checklist**

- [ ] Fly CLI installed and authenticated
- [ ] Custom domain added with `fly certs add`
- [ ] DNS records configured at domain provider
- [ ] fly.toml updated with correct app name
- [ ] App deployed with `fly deploy`
- [ ] SSL certificates verified
- [ ] Website accessible at custom domain
- [ ] All API endpoints working
- [ ] Database properly mounted

---

## 🎯 **Expected Results**

After setup completion:

- ✅ `https://thevisabay.com` → Your website
- ✅ `https://www.thevisabay.com` → Your website
- ✅ SSL certificates automatically managed
- ✅ Global CDN through Fly.dev
- ✅ Same performance as current deployment
- ✅ Professional domain for your business

**Estimated setup time: 30 minutes + DNS propagation (24-48 hours)**
