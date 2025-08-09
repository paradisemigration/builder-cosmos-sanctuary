# Complete Domain Setup Guide for Fly.io

## Your Current Working App ✅

**Working URL**: https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/
**Target Domain**: thevisabay.com

## Step 1: Find Your App Name

```bash
fly apps list
```

You'll see your app name (probably something with the long hash like "a4b9f79f9f7045e490b1cf64b782d096")

## Step 2: Add SSL Certificates for Your Domain

Replace `YOUR_APP_NAME` with the actual app name from Step 1:

```bash
# Add certificate for main domain
fly certs create thevisabay.com --app YOUR_APP_NAME

# Add certificate for www subdomain
fly certs create www.thevisabay.com --app YOUR_APP_NAME

# Check certificate status
fly certs list --app YOUR_APP_NAME
```

## Step 3: Get Your App's IP Address

```bash
# Get the IP address for DNS records
fly ips list --app YOUR_APP_NAME
```

You'll get an IPv4 address (something like 66.241.125.44)

## Step 4: Configure DNS Records at Your Domain Registrar

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these DNS records:

### DNS Records to Add:

```
Type: A
Name: @
Value: [YOUR_FLY_IP_ADDRESS]  # From Step 3
TTL: 3600

Type: A
Name: www
Value: [YOUR_FLY_IP_ADDRESS]  # Same IP
TTL: 3600
```

### Example for Popular Registrars:

#### GoDaddy:

1. Login to GoDaddy
2. Go to "My Products" > "DNS"
3. Click "Manage" next to your domain
4. Add the A records above

#### Namecheap:

1. Login to Namecheap
2. Go to "Domain List" > "Manage"
3. Click "Advanced DNS"
4. Add the A records above

#### Cloudflare:

1. Login to Cloudflare
2. Select your domain
3. Go to "DNS" > "Records"
4. Add the A records above

## Step 5: Verify Certificate Status

```bash
# Check if certificates are ready
fly certs show thevisabay.com --app YOUR_APP_NAME
fly certs show www.thevisabay.com --app YOUR_APP_NAME
```

## Step 6: Test Your Domain

Wait 5-30 minutes for DNS propagation, then test:

1. **Main domain**: https://thevisabay.com
2. **WWW subdomain**: https://www.thevisabay.com
3. **Original URL still works**: https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/

## Complete Example Commands

Assuming your app name is "a4b9f79f9f7045e490b1cf64b782d096":

```bash
# 1. Add certificates
fly certs create thevisabay.com --app a4b9f79f9f7045e490b1cf64b782d096
fly certs create www.thevisabay.com --app a4b9f79f9f7045e490b1cf64b782d096

# 2. Get IP address
fly ips list --app a4b9f79f9f7045e490b1cf64b782d096

# 3. Check certificate status
fly certs list --app a4b9f79f9f7045e490b1cf64b782d096
```

## Troubleshooting

### If domain doesn't work after 30 minutes:

```bash
# Check certificate status
fly certs show thevisabay.com --app YOUR_APP_NAME

# If issues, try adding again
fly certs add thevisabay.com --app YOUR_APP_NAME
```

### Check DNS propagation:

```bash
# Check if DNS is working
nslookup thevisabay.com
dig thevisabay.com
```

## Expected Results ✅

After setup:

- ✅ https://thevisabay.com → Your app
- ✅ https://www.thevisabay.com → Your app
- ✅ Auto HTTPS redirect (HTTP → HTTPS)
- ✅ SSL certificate auto-renewed
- ✅ Original Fly URL still works

## Important Notes

1. **Your app is already working** - this just adds the domain
2. **DNS changes take 5-30 minutes** to propagate
3. **SSL certificates are free** and auto-renewed
4. **Both www and non-www** will work
5. **No code changes needed** - it's just DNS routing

Your app at https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/ will keep working while you add the domain!
