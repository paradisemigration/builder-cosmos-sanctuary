FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build:client

# Copy database file
RUN mkdir -p dist/server && cp server/*.db dist/server/ 2>/dev/null || echo "No database files to copy"

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "prod"]
