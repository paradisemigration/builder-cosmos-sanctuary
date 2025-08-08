# 🔧 Fix Fly.io Volume Capacity Issue

## Error
❌ **Issue**: No capacity available in bom (Mumbai) region  
✅ **Solution**: Use alternative region or retry

## Solution 1: Use Singapore Region (Recommended)
Your fly.toml is configured for Singapore, let's stick with that:

```bash
# Create volume in Singapore region
flyctl volumes create thevisabay_data --region sin --size 3 --app thevisabay
```

## Solution 2: Try Alternative Regions
If Singapore is also full, try these regions:

```bash
# Tokyo (close to Singapore)
flyctl volumes create thevisabay_data --region nrt --size 3 --app thevisabay

# Or Frankfurt (Europe)
flyctl volumes create thevisabay_data --region fra --size 3 --app thevisabay

# Or Sydney (Asia-Pacific)
flyctl volumes create thevisabay_data --region syd --size 3 --app thevisabay
```

## Solution 3: Skip Volume Creation (Temporary)
For quick deployment without persistent storage:

```bash
# Comment out volume mount in fly.toml temporarily
# [[mounts]]
# source = "thevisabay_data" 
# destination = "/data"

# Then deploy
flyctl deploy --app thevisabay
```

## Solution 4: Wait and Retry
Capacity issues are often temporary:

```bash
# Wait 10-15 minutes and retry original command
flyctl volumes create thevisabay_data --region sin --size 3 --app thevisabay
```

## Complete Deploy Commands
```bash
# 1. Create app (if not done)
flyctl apps create thevisabay --org personal

# 2. Create volume in Singapore
flyctl volumes create thevisabay_data --region sin --size 3 --app thevisabay

# 3. Set secrets
flyctl secrets set NODE_ENV=production --app thevisabay
flyctl secrets set PORT=8080 --app thevisabay

# 4. Deploy
cd code
flyctl deploy --app thevisabay
```

Try Solution 1 first - Singapore region should work!
