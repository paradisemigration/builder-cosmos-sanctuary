FROM node:20-alpine

WORKDIR /app

# Install python3, dev headers and build tools (no py3-distutils here)
RUN apk add --no-cache python3 python3-dev build-base libc6-compat

# Upgrade pip, setuptools, wheel which include distutils
RUN python3 -m ensurepip \
    && python3 -m pip install --upgrade pip setuptools wheel

COPY package*.json ./

RUN npm install --legacy-peer-deps --only=production

COPY . .

RUN npm run build:client

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["npm", "run", "prod"]
