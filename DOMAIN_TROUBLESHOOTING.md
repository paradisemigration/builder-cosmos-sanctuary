# 🔧 Custom Domain Troubleshooting

## Your App Status

✅ **Working perfectly**: `https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/`  
❌ **Custom domain not working**: Need to troubleshoot

## Step 1: Check Certificate Status

```bash
# Check if certificates were created successfully
flyctl certs list --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e

# Check specific certificate details (replace yourdomain.com)
flyctl certs show yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

## Step 2: Verify DNS Configuration

Check if your DNS records are correct. Your domain should have:

**DNS Records Required:**

```
Type: A
Name: @
Value: 66.241.124.44

Type: A
Name: @
Value: 66.241.125.44

Type: CNAME
Name: www
Value: yourdomain.com
```

**Check DNS propagation:**

- Visit: https://dnschecker.org
- Enter your domain
- Check if A records point to Fly.io IPs

## Step 3: Common Issues & Solutions

### Issue 1: DNS Not Propagated

**Symptoms**: Domain shows "This site can't be reached"  
**Solution**: Wait 5-60 minutes for DNS propagation

### Issue 2: SSL Certificate Pending

**Symptoms**: "Your connection is not secure" warning  
**Solution**:

```bash
# Check certificate status
flyctl certs show yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e

# If showing "Pending", wait for DNS to propagate first
```

### Issue 3: Wrong DNS Records

**Symptoms**: Domain goes to wrong site or shows error  
**Solution**: Verify DNS records match exactly:

- A records: `66.241.124.44` and `66.241.125.44`
- No extra CNAME for @ (root domain)

### Issue 4: Certificate Failed

**Symptoms**: Certificate shows "Failed" status  
**Solution**:

```bash
# Delete and recreate certificate
flyctl certs delete yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
flyctl certs create yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

## Step 4: Test Your Domain

**Manual Tests:**

1. **Ping test**: `ping yourdomain.com` (should show Fly.io IP)
2. **DNS lookup**: `nslookup yourdomain.com`
3. **Browser test**: Visit `https://yourdomain.com`

**Online Tools:**

- DNS Check: https://dnschecker.org
- SSL Check: https://www.ssllabs.com/ssltest/
- Domain Health: https://www.whatsmydns.net

## Step 5: Force SSL Certificate Renewal

If certificate is stuck:

```bash
# Delete current certificate
flyctl certs delete yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e

# Wait 5 minutes

# Create new certificate
flyctl certs create yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

## Expected Timeline

- **DNS Records Setup**: 5 minutes
- **DNS Propagation**: 5-60 minutes worldwide
- **SSL Certificate**: 5-15 minutes after DNS
- **Total Time**: Usually 10-75 minutes

## What to Check Right Now

Run these commands and share the output:

```bash
# 1. Check certificate status
flyctl certs list --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e

# 2. Check specific domain
flyctl certs show yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

This will tell us exactly what's wrong! 🔍
