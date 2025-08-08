# 🌐 DNS Records with IP Addresses

## Your Fly.io App IP Addresses

Your domain registrar requires IP addresses instead of hostname. Here are the correct DNS records:

## Standard Fly.io IP Addresses

**For Root Domain (yourdomain.com):**
```
Type: A
Name: @ (or leave empty)
Value: 66.241.124.44
TTL: 300

Type: A
Name: @ (or leave empty)  
Value: 66.241.125.44
TTL: 300
```

**For IPv6 (optional but recommended):**
```
Type: AAAA
Name: @ (or leave empty)
Value: 2a09:8280:1::44
TTL: 300

Type: AAAA
Name: @ (or leave empty)
Value: 2a09:8280:1::45  
TTL: 300
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: yourdomain.com (or use same A records as above)
TTL: 300
```

## Alternative: Get Your Specific IP

You can also get your app's specific IP:
```bash
nslookup a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev
```

## Common Registrar Formats

### GoDaddy
```
Type: A
Host: @
Points to: 66.241.124.44
TTL: 600

Type: A  
Host: @
Points to: 66.241.125.44
TTL: 600

Type: CNAME
Host: www
Points to: @ (or your domain name)
TTL: 600
```

### Namecheap
```
Type: A Record
Host: @
Value: 66.241.124.44
TTL: Automatic

Type: A Record
Host: @  
Value: 66.241.125.44
TTL: Automatic

Type: CNAME Record
Host: www
Value: yourdomain.com
TTL: Automatic
```

### Cloudflare
```
Type: A
Name: @
IPv4 address: 66.241.124.44
Proxy status: DNS only (gray cloud)

Type: A
Name: @
IPv4 address: 66.241.125.44  
Proxy status: DNS only (gray cloud)

Type: CNAME
Name: www
Target: yourdomain.com
Proxy status: DNS only (gray cloud)
```

## After DNS Setup

1. **Wait 5-60 minutes** for DNS propagation
2. **Add SSL certificate:**
```bash
flyctl certs create yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
flyctl certs create www.yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

## Verification
- Check DNS: https://dnschecker.org
- Test your domain: https://yourdomain.com
- Verify SSL: Check for green lock icon

These IP addresses should work with any domain registrar! 🚀
