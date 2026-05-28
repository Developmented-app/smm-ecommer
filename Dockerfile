# Dockerfile for Angkor SMM Panel
FROM node:18-alpine

WORKDIR /app

# Install build tools if any native modules need rebuilding
RUN apk add --no-cache python3 make g++

# Copy package configurations
COPY package*.json ./

# Install packages
RUN npm ci

# Copy full-stack SMM source files
COPY . .

# Build the react asset bundles and compile the esbuild CommonJS backend bundle
ENV NODE_ENV=production
RUN npm run build

# Port 3000 mapping
EXPOSE 3000

# Start compiled CJS Server
CMD ["npm", "start"]
