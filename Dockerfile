FROM node:18-alpine

# Install all required dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev \
    libc6-compat \
    vips-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Ensure database and required files are in place
RUN mkdir -p ./dist/server/
RUN if [ -f "server/visaconsult.db" ]; then cp server/visaconsult.db ./dist/server/; fi
RUN cp server/database.sqlite.js ./dist/server/

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
