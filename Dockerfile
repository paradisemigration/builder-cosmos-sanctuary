FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3 make g++ \
    && npm install -g npm@latest --unsafe-perm=true --allow-root \
    && apk del python3 make g++

RUN npm install --only=production --legacy-peer-deps

COPY . .

RUN npm run build:client

RUN mkdir -p dist/server
RUN cp server/*.db dist/server/ 2>/dev/null || echo "No database files found"

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["npm", "run", "prod"]
