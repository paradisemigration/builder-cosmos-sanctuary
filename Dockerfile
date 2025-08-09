# Use Node 20 Alpine for latest Node & better compatibility
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies (no py3-distutils, upgrade pip & setuptools for distutils)
RUN apk add --no-cache python3 make g++ gcc libc6-compat \
    && python3 -m ensurepip \
    && python3 -m pip install --upgrade pip setuptools wheel

# Copy package files for caching dependencies
COPY package*.json ./

# Install production dependencies with legacy-peer-deps to avoid conflicts
RUN npm install --legacy-peer-deps --only=production

# Copy rest of source code
COPY . .

# Build client-side assets
RUN npm run build:client

# Create dist/server folder and copy database files if present
RUN mkdir -p dist/server \
    && cp server/*.db dist/server/ 2>/dev/null || echo "No database files found"

# Expose app port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the production server
CMD ["npm", "run", "prod"]
