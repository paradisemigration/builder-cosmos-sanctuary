# 🌐 DNS Records for Your Custom Domain

## For Your Existing Working App
**App URL**: `https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/`

## DNS Records to Add at Your Domain Registrar

### Option 1: CNAME Method (Recommended - Easier)

**For Root Domain (yourdomain.com):**
```
Type: CNAME
Name: @ (or leave empty)
Value: a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev
TTL: 300 (5 minutes)
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev
TTL: 300 (5 minutes)
```

### Option 2: A Record Method (If CNAME doesn't work for root)

First, get the IP addresses by running:
```bash
nslookup a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev
```

**Typical Fly.io IP addresses (verify with nslookup):**
```
Type: A
Name: @ (or leave empty)
Value: 66.241.124.44
TTL: 300

Type: A  
Name: @
Value: 66.241.125.44
TTL: 300

Type: AAAA (IPv6)
Name: @
Value: 2a09:8280:1::44
TTL: 300
```

**For WWW:**
```
Type: CNAME
Name: www
Value: yourdomain.com
TTL: 300
```

## SSL Certificate Setup

**After DNS is configured, add SSL certificate:**

```bash
# For your existing app
flyctl certs create yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e

# For www subdomain
flyctl certs create www.yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

## Domain Registrar Instructions

### Cloudflare
1. Go to DNS → Records
2. Add CNAME record: `@` → `a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`
3. Add CNAME record: `www` → `a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`

### GoDaddy
1. Go to DNS Management
2. Add CNAME: Name=`@`, Value=`a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`
3. Add CNAME: Name=`www`, Value=`a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`

### Namecheap
1. Go to Advanced DNS
2. Add CNAME: Host=`@`, Value=`a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`
3. Add CNAME: Host=`www`, Value=`a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`

## Verification Steps

1. **Wait for DNS propagation** (5-60 minutes)
2. **Check DNS propagation**: Use https://dnschecker.org
3. **Add SSL certificates** using flyctl commands above
4. **Test your domain**: Visit https://yourdomain.com

## Example for domain "thevisabay.com"

```bash
# DNS Records
CNAME @ → a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev
CNAME www → a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev

# SSL Commands
flyctl certs create thevisabay.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
flyctl certs create www.thevisabay.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

Your app is already working perfectly - you just need to point your domain to it! 🚀
