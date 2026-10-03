# Multi-stage Dockerfile for Invoice Genius
# Optimized for Coolify, Docker Compose, and VPS deployment

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies if needed
RUN apk add --no-cache libc6-compat

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies required for vite & esbuild)
RUN npm ci --legacy-peer-deps

# Copy application source files
COPY . .

# Run production build (vite build for client + esbuild for server)
RUN npm run build

# ---- Stage 2: Production Runner ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 invoiceapp

# Copy dependency manifests and install production-only dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Copy compiled artifacts from builder stage
COPY --from=builder --chown=invoiceapp:nodejs /app/dist ./dist

# Switch to non-root user
USER invoiceapp

# Expose default application port
EXPOSE 5000

# Built-in Docker healthcheck for Coolify container monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
