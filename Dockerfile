FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Copy database files (any .db files found)
COPY server/*.db ./dist/server/ 2>/dev/null || echo "No .db files found"
COPY server/database.sqlite.js ./dist/server/

# Expose port
EXPOSE 8080

# Start the application (both frontend and backend)
CMD ["npm", "start"]
