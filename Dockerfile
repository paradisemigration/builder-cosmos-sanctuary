FROM node:20-alpine

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 py3-distutils make g++ gcc libc6-compat

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --only=production

# Copy source code
COPY . .

# Build the client application
RUN npm run build:client

# Create necessary directories and copy database
RUN mkdir -p dist/server
RUN cp server/*.db dist/server/ 2>/dev/null || echo "No database files found"

# Expose the port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the production server
CMD ["npm", "run", "prod"]
