FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk update && apk add --no-cache python3 make g++

RUN npm install --legacy-peer-deps --unsafe-perm

RUN apk del python3 make g++

COPY . .

RUN npm run build:client
RUN npm run copy:database

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["npm", "run", "prod"]
