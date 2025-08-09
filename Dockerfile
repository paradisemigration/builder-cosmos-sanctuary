FROM node:20-alpine

WORKDIR /app

# Install Python3, pip, and build tools needed for native modules
RUN apk add --no-cache python3 py3-pip make g++ gcc libc6-compat \
    && pip3 install --upgrade pip setuptools wheel

# Copy package files first for better caching
COPY package*.json ./

# Install only production dependencies, ignoring peer dependency conflicts
RUN npm install --legacy-peer-deps --only=production

# Copy all source code
COPY . .

# Build the client application
RUN npm run build:client

# Prepare server dist folder and copy any database files if present
RUN mkdir -p dist/server \
    && cp server/*.db dist/server/ 2>/dev/null || echo "No database files found"

# Expose the port your app runs on
EXPOSE 8080

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=8080

# Start the production server
CMD ["npm", "run", "prod"]
