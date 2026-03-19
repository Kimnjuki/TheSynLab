# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (retry + longer timeouts for flaky Coolify/remote builder networks)
COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    (npm ci || (echo "Retry 1..." && sleep 15 && npm ci) || (echo "Retry 2..." && sleep 30 && npm ci) || (echo "Retry 3..." && sleep 60 && npm ci))

# Copy full source
COPY . .

# Build-time env — Coolify passes VITE_CONVEX_URL and CONVEX_DEPLOYMENT_KEYS as build args
ARG VITE_CONVEX_URL
ARG CONVEX_DEPLOY_KEY
ARG CONVEX_DEPLOYMENT_KEYS

ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
# Support both variable names: CONVEX_DEPLOY_KEY (standard) and CONVEX_DEPLOYMENT_KEYS (Coolify)
ENV CONVEX_DEPLOY_KEY=${CONVEX_DEPLOY_KEY}
ENV CONVEX_DEPLOYMENT_KEYS=${CONVEX_DEPLOYMENT_KEYS}

# Deploy Convex schema + functions to the cloud backend, then build the Vite frontend.
# Uses CONVEX_DEPLOY_KEY if set; otherwise falls back to CONVEX_DEPLOYMENT_KEYS (Coolify format).
RUN EFFECTIVE_KEY="${CONVEX_DEPLOY_KEY:-$CONVEX_DEPLOYMENT_KEYS}"; \
    if [ -n "$EFFECTIVE_KEY" ]; then \
        echo "Deploying Convex backend (schema + functions)..." && \
        CONVEX_DEPLOY_KEY="$EFFECTIVE_KEY" npx convex deploy --yes; \
    else \
        echo "No Convex deploy key found — skipping backend deploy (local/dev mode)"; \
    fi

RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default config and use our SPA config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
