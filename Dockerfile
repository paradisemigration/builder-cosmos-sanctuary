FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Copy database files
COPY server/visaconsult.db ./dist/server/
COPY server/database.sqlite.js ./dist/server/

# Expose port
EXPOSE 8080

# Start the application (both frontend and backend)
CMD ["npm", "start"]
