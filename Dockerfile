# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies required for native modules and build tools
RUN apk add --no-cache libc6-compat

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy full application source
COPY . .

# Build-time environment arguments (with working defaults from project setup)
ARG VITE_SUPABASE_URL="https://uvnrldvfyzbwizqqzdxa.supabase.co"
ARG VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_Qd2D9EM_GtWdtPu-xboWJw_aOJBHi06"
ARG VITE_SUPABASE_PROJECT_ID="uvnrldvfyzbwizqqzdxa"
ARG SUPABASE_URL="https://uvnrldvfyzbwizqqzdxa.supabase.co"
ARG SUPABASE_PUBLISHABLE_KEY="sb_publishable_Qd2D9EM_GtWdtPu-xboWJw_aOJBHi06"
ARG SUPABASE_PROJECT_ID="uvnrldvfyzbwizqqzdxa"

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
ENV VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_PUBLISHABLE_KEY=${SUPABASE_PUBLISHABLE_KEY}
ENV SUPABASE_PROJECT_ID=${SUPABASE_PROJECT_ID}

# Instruct Nitro to produce a standalone Node.js production server
ENV NITRO_PRESET=node-server
ENV NODE_ENV=production

# Compile client bundle and standalone SSR server into .output
RUN npm run build

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Run container as non-root user
USER node

# Copy only the compiled standalone bundle (no node_modules needed!)
COPY --from=builder --chown=node:node /app/.output ./.output

EXPOSE 3000

# Health check to ensure server responds
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# Start Nitro Node.js standalone server
CMD ["node", ".output/server/index.mjs"]
