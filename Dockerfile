# Multi-Stage Build Dockerfile for Smart Campus Complaint Portal

# -----------------------------------------------------------------------------
# Stage 1: Build Stage
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install clean, frozen dependencies
RUN npm ci

# Copy application source code and configuration files
COPY . .

# Build the production single-page application into /app/dist
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime Stage
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Remove default nginx static html files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration for SPA routing & compression
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check to ensure Nginx is healthy and serving requests
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
