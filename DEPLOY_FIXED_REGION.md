# Fixed Deployment - Avoid Mumbai Region

## The Issue
"no capacity available in bom" = Mumbai region is full

## Solution
I've updated your configuration to use Singapore region instead.

## Deploy Commands
```bash
# Option 1: Deploy to Singapore region
fly deploy --app thevisabay --region sin

# Option 2: Deploy to US East (more capacity)
fly deploy --app thevisabay --region iad

# Option 3: Let Fly choose best region
fly deploy --app thevisabay
```

## If Still Issues, Try Different Regions:
```bash
# US East (Virginia) - Usually has capacity
fly deploy --app thevisabay --region iad

# US West (California)
fly deploy --app thevisabay --region lax

# Europe (Amsterdam)
fly deploy --app thevisabay --region ams
```

## After Successful Deploy - Add AWS Secrets:
```bash
fly secrets set AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO --app thevisabay
fly secrets set AWS_SECRET_ACCESS_KEY=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 --app thevisabay
fly secrets set AWS_REGION=us-east-1 --app thevisabay
fly secrets set AWS_S3_BUCKET_NAME=visaconsult-images --app thevisabay
```

## Regions with Usually Good Capacity:
- `iad` - US East (Virginia) ⭐ Best choice
- `sin` - Singapore  
- `lax` - US West
- `ams` - Amsterdam

Mumbai (bom) region is having capacity issues - avoiding it completely!
