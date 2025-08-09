#!/bin/bash

# Simple Fly.io deployment script for NodeJS app

echo "🚀 Deploying TheVisaBay to Fly.io..."

# Remove any existing Dockerfile to let Fly auto-detect NodeJS
rm -f Dockerfile

# Deploy using Fly's NodeJS buildpack
fly deploy --app thevisabay --no-cache

echo "✅ Deployment complete!"
echo "🔗 Your app: https://thevisabay.fly.dev"

# Add AWS secrets after successful deployment
echo "🔑 Adding AWS secrets..."
fly secrets set AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO --app thevisabay
fly secrets set AWS_SECRET_ACCESS_KEY=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 --app thevisabay
fly secrets set AWS_REGION=us-east-1 --app thevisabay
fly secrets set AWS_S3_BUCKET_NAME=visaconsult-images --app thevisabay

echo "✅ AWS secrets added - image uploads should now work!"
