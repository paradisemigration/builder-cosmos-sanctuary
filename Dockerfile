FROM node:20-bullseye

WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies, skipping dev dependencies
RUN npm install --production --legacy-peer-deps

# Copy all source files
COPY . .

# Build client app
RUN npm run build:client

# Copy database or other assets if any
RUN mkdir -p dist/server
RUN cp server/*.db dist/server/ 2>/dev/null || echo "No database files found"

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the server
CMD ["npm", "run", "prod"]
