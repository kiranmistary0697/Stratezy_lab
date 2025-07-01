# Stage 1: Build the React App
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to leverage layer caching
COPY package.json package-lock.json ./

# Install dependencies (this layer will be cached if dependencies don't change)
RUN npm install
# Copy necessary configuration files for Tailwind and PostCSS
COPY tailwind.config.js postcss.config.js ./
#Copy environment variables file
COPY .env* ./
# Copy necessary application files, including index.html
COPY ./src ./src
COPY ./public ./public
COPY ./index.html ./index.html
COPY ./index.html ./public/index.html
COPY ./src/index.css ./index.css
COPY ./src/index.css ./public/assets/index.css
COPY /src/assets ./public/assets
COPY /src/V2/assets ./public/assets

# Build the React app
RUN npm run build

# Stage 2: Setup NGINX to serve the React app
FROM nginx:stable-alpine

# Set timezone
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
    echo "Asia/Kolkata" > /etc/timezone

# Create a directory for SSL certificates (if needed in the future)
RUN mkdir -p /etc/nginx/ssl

# Copy build files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
