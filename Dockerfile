FROM node:18-alpine

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm ci --verbose

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Ensure database and required files are in place
RUN mkdir -p ./dist/server/
RUN if [ -f "server/visaconsult.db" ]; then cp server/visaconsult.db ./dist/server/; fi
RUN cp server/database.sqlite.js ./dist/server/

# Clean up build dependencies but keep production packages
RUN npm prune --production

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
