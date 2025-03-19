# Use Node.js 22.12 as the base image
FROM node:22.12-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json ./

# Set npm registry to avoid network issues and install dependencies
RUN npm config set registry https://registry.npmjs.org/ && \
    npm cache clean --force && \
    npm install --omit=dev

# Copy the rest of the project files
COPY . .

# Build the Next.js application
RUN npm run build

# Use Nginx to serve the built Next.js app
FROM nginx:alpine

# Copy built files to the Nginx directory
COPY --from=build /app/.next /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
