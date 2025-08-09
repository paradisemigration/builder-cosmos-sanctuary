FROM node:20.6.1-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Upgrade npm to latest compatible with Node 20, no force needed here
RUN npm install -g npm@11.5.2 --unsafe-perm=true --allow-root

# Install dependencies with legacy-peer-deps to avoid conflicts
RUN npm install --legacy-peer-deps

RUN apk del python3 make g++

COPY . .

RUN npm run build:client
RUN npm run copy:database

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["npm", "run", "prod"]
