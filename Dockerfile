FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create dist/server directory if it doesn't exist
RUN mkdir -p ./dist/server/

# Copy database files to the correct location
RUN cp server/visaconsult.db ./dist/server/ || echo "Database file will be created"
RUN cp server/database.sqlite.js ./dist/server/

# Install only production dependencies
RUN npm ci --only=production

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
