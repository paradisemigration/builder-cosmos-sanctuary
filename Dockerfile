FROM node:20-alpine

WORKDIR /app

# Install build dependencies (python3, dev headers, build tools)
RUN apk add --no-cache python3 python3-dev build-base libc6-compat

# Install distutils for Python3 manually
RUN python3 -m ensurepip \
    && python3 -m pip install --upgrade pip setuptools wheel

COPY package*.json ./

RUN npm install --legacy-peer-deps --only=production

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
