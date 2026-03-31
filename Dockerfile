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
ARG RUN_ARTICLE_SEED=true
ARG CONVEX_DEPLOY_STRICT=false

ENV VITE_CONVEX_URL=$VITE_CONVEX_URL

# Deploy Convex schema + functions, then seed article content, then build the Vite frontend.
# Uses CONVEX_DEPLOY_KEY if set; otherwise falls back to CONVEX_DEPLOYMENT_KEYS (Coolify format).
# Network failures are retried and non-fatal by default so Coolify can still ship the frontend image.
# Set CONVEX_DEPLOY_STRICT=true to fail the image build when backend deploy/seed fails.
RUN EFFECTIVE_KEY="${CONVEX_DEPLOY_KEY:-$CONVEX_DEPLOYMENT_KEYS}"; \
    if [ -n "$EFFECTIVE_KEY" ]; then \
        echo "Deploying Convex backend (schema + functions)..." && \
        attempt=1; \
        max_attempts=6; \
        deploy_ok=0; \
        while [ "$attempt" -le "$max_attempts" ]; do \
          echo "Convex deploy attempt ${attempt}/${max_attempts}"; \
          output="$(CONVEX_DEPLOY_KEY="$EFFECTIVE_KEY" npx convex deploy --yes 2>&1)" && { echo "$output"; deploy_ok=1; break; }; \
          echo "$output"; \
          if echo "$output" | grep -E -q "Schema was overwritten by another push\.|fetch failed|ETIMEDOUT|ECONNRESET|ENOTFOUND|EAI_AGAIN|network|upstream"; then \
            if [ "$attempt" -lt "$max_attempts" ]; then \
              sleep_time=$((attempt * 5)); \
              echo "Convex deploy retryable error detected. Retrying in ${sleep_time}s..."; \
              sleep "$sleep_time"; \
              attempt=$((attempt + 1)); \
              continue; \
            fi; \
          fi; \
          break; \
        done; \
        if [ "$deploy_ok" -ne 1 ]; then \
          echo "Convex deploy did not complete successfully."; \
          if [ "$CONVEX_DEPLOY_STRICT" = "true" ]; then \
            echo "CONVEX_DEPLOY_STRICT=true so failing image build."; \
            exit 1; \
          fi; \
          echo "Continuing build (CONVEX_DEPLOY_STRICT=false)."; \
        fi; \
        if [ "$RUN_ARTICLE_SEED" = "true" ] && [ "$deploy_ok" -eq 1 ]; then \
          echo "Running article seed mutation..." && \
          seed_attempt=1; \
          seed_max_attempts=3; \
          seed_ok=0; \
          while [ "$seed_attempt" -le "$seed_max_attempts" ]; do \
            echo "Article seed attempt ${seed_attempt}/${seed_max_attempts}"; \
            seed_output="$(CONVEX_DEPLOY_KEY="$EFFECTIVE_KEY" npx convex run seedSmartHomeArticles:seedSmartHomeArticles 2>&1)" && { echo "$seed_output"; seed_ok=1; break; }; \
            echo "$seed_output"; \
            if [ "$seed_attempt" -lt "$seed_max_attempts" ]; then \
              sleep_time=$((seed_attempt * 3)); \
              echo "Article seed failed. Retrying in ${sleep_time}s..."; \
              sleep "$sleep_time"; \
              seed_attempt=$((seed_attempt + 1)); \
              continue; \
            fi; \
            break; \
          done; \
          if [ "$seed_ok" -ne 1 ] && [ "$CONVEX_DEPLOY_STRICT" = "true" ]; then \
            echo "Article seed failed and CONVEX_DEPLOY_STRICT=true; failing image build."; \
            exit 1; \
          fi; \
        else \
          echo "Skipping article seed (RUN_ARTICLE_SEED=false or backend deploy unavailable)."; \
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
