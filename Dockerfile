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

# Deploy Convex schema + functions to the cloud backend, then build the Vite frontend.
# Uses CONVEX_DEPLOY_KEY if set; otherwise falls back to CONVEX_DEPLOYMENT_KEYS (Coolify format).
# Retries transient Convex concurrency conflict: "Schema was overwritten by another push."
RUN EFFECTIVE_KEY="${CONVEX_DEPLOY_KEY:-$CONVEX_DEPLOYMENT_KEYS}"; \
    if [ -n "$EFFECTIVE_KEY" ]; then \
        echo "Deploying Convex backend (schema + functions)..." && \
        attempt=1; \
        max_attempts=5; \
        while [ "$attempt" -le "$max_attempts" ]; do \
          echo "Convex deploy attempt ${attempt}/${max_attempts}"; \
          output="$(CONVEX_DEPLOY_KEY="$EFFECTIVE_KEY" npx convex deploy --yes 2>&1)" && { echo "$output"; break; }; \
          echo "$output"; \
          if echo "$output" | grep -q "Schema was overwritten by another push."; then \
            if [ "$attempt" -lt "$max_attempts" ]; then \
              sleep_time=$((attempt * 3)); \
              echo "Convex schema conflict detected. Retrying in ${sleep_time}s..."; \
              sleep "$sleep_time"; \
              attempt=$((attempt + 1)); \
              continue; \
            fi; \
          fi; \
          echo "Convex deploy failed with non-retryable error."; \
          exit 1; \
        done; \
        if [ "$attempt" -gt "$max_attempts" ]; then \
          echo "Convex deploy failed after ${max_attempts} attempts."; \
          exit 1; \
        fi; \
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
