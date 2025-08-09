FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (production only for smaller image)
RUN npm ci --only=production

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
