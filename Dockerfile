# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (retry + longer timeouts for flaky remote-builder networks)
COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    (npm ci || (echo "Retry 1..." && sleep 15 && npm ci) || (echo "Retry 2..." && sleep 30 && npm ci) || (echo "Retry 3..." && sleep 60 && npm ci))

# Copy full source
COPY . .

# Build-time env vars — set all VITE_* vars as build args so Coolify can inject them.
# In Coolify: Settings → Build → Build Arguments → add each var with its value.
ARG VITE_CONVEX_URL
ARG VITE_PUBLIC_SITE_URL
ARG VITE_GA4_MEASUREMENT_ID
ARG VITE_GTM_CONTAINER_ID
ARG VITE_ADSENSE_CLIENT
ARG VITE_ADSENSE_SLOT_REVIEW_SIDEBAR
ARG VITE_ADSENSE_SLOT_HOME_LEADERBOARD
ARG VITE_ADSENSE_SLOT_COMPARE_INLINE
ARG VITE_ADSENSE_SLOT_COMPARE_SIDEBAR
ARG VITE_ADSENSE_FALLBACK_WITHOUT_DB
ARG VITE_AMAZON_ASSOCIATES_TAG

ENV VITE_CONVEX_URL=$VITE_CONVEX_URL \
    VITE_PUBLIC_SITE_URL=$VITE_PUBLIC_SITE_URL \
    VITE_GA4_MEASUREMENT_ID=$VITE_GA4_MEASUREMENT_ID \
    VITE_GTM_CONTAINER_ID=$VITE_GTM_CONTAINER_ID \
    VITE_ADSENSE_CLIENT=$VITE_ADSENSE_CLIENT \
    VITE_ADSENSE_SLOT_REVIEW_SIDEBAR=$VITE_ADSENSE_SLOT_REVIEW_SIDEBAR \
    VITE_ADSENSE_SLOT_HOME_LEADERBOARD=$VITE_ADSENSE_SLOT_HOME_LEADERBOARD \
    VITE_ADSENSE_SLOT_COMPARE_INLINE=$VITE_ADSENSE_SLOT_COMPARE_INLINE \
    VITE_ADSENSE_SLOT_COMPARE_SIDEBAR=$VITE_ADSENSE_SLOT_COMPARE_SIDEBAR \
    VITE_ADSENSE_FALLBACK_WITHOUT_DB=$VITE_ADSENSE_FALLBACK_WITHOUT_DB \
    VITE_AMAZON_ASSOCIATES_TAG=$VITE_AMAZON_ASSOCIATES_TAG

RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default config and use our SPA config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
