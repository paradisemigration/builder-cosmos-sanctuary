FROM node:20-alpine

WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Upgrade npm to latest and install dependencies with legacy-peer-deps to avoid conflicts
RUN npm install -g npm@latest --unsafe-perm=true --allow-root
RUN npm install --legacy-peer-deps

# Remove build tools after install to keep image slim
RUN apk del python3 make g++

# Copy all source files
COPY . .

# Build the client app and copy database files
RUN npm run build:client
RUN npm run copy:database

# Expose app port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the production server
CMD ["npm", "run", "prod"]
