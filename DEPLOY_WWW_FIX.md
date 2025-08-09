# Fix for www.thevisabay.com 404 Error

## Problem Fixed ✅
Added `https://www.thevisabay.com` to CORS allowed origins in both:
- `server/api.js` 
- `server-static.js`

## Deploy the Fix
```bash
# Deploy updated code to your existing working app
fly deploy --app a4b9f79f9f7045e490b1cf64b782d096

# Or if you have build issues, just add the domain to environment
fly secrets set ALLOWED_ORIGINS="https://thevisabay.com,https://www.thevisabay.com,https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev" --app a4b9f79f9f7045e490b1cf64b782d096
```

## After Deploy
1. Wait 2-3 minutes for deployment
2. Test both domains:
   - https://thevisabay.com ✅
   - https://www.thevisabay.com ✅
   - Original URL: https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/ ✅

## Alternative Quick Fix (No Deploy Needed)
If you don't want to redeploy, add this environment variable:

```bash
fly secrets set CORS_ORIGIN="https://thevisabay.com,https://www.thevisabay.com" --app a4b9f79f9f7045e490b1cf64b782d096
```

The www subdomain will work after this fix!
