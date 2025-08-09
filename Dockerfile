FROM node:20-alpine

WORKDIR /app

# Install build dependencies and pip properly for Alpine
RUN apk add --no-cache python3 py3-pip make g++ gcc libc6-compat \
    && pip3 install --upgrade pip setuptools wheel

COPY package*.json ./

RUN npm install --legacy-peer-deps --only=production

COPY . .

RUN npm run build:client

RUN mkdir -p dist/server \
    && cp server/*.db dist/server/ 2>/dev/null || echo "No database files found"

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["npm", "run", "prod"]
