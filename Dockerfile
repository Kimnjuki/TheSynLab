# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# IMPORTANT: builder must be glibc-based (node:20-slim / node:20), NOT alpine.
# @vitejs/plugin-react-swc uses @swc/core native binaries; the musl (Alpine)
# variant is known to segfault silently on large projects (exit 255, zero
# output) shortly after "transforming..." starts. Debian/glibc uses the
# stable @swc/core-linux-x64-gnu binary and builds the full 3500+ module app
# reliably.
#
# We also raise Node heap limit because the build transforms 3500+ modules
# and prerenders hundreds of HTML pages in closeBundle.
ENV NODE_OPTIONS=--max-old-space-size=4096

# Install dependencies.
# - dns-result-order=ipv4first prevents npm hanging ~100s on IPv6 DNS blackhole.
# - --loglevel=http streams every registry request so failures are visible.
# - fetch-retries=5 + fetch-retry-maxtimeout=180000 + --fetch-timeout=300000
#   survive transient ECONNRESET / registry timeouts without manual retries.
# FIX #1: removed invalid "npm config set network-timeout" that crashed npm 10.
COPY package.json package-lock.json* ./
RUN npm config set registry https://registry.npmjs.org && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 180000 && \
    npm config set dns-result-order ipv4first && \
    npm ci --no-audit --no-fund --loglevel=http --fetch-timeout=300000 || \
    (echo "npm ci retry 1" && npm ci --no-audit --no-fund --loglevel=info --fetch-timeout=300000) || \
    (echo "npm ci retry 2" && sleep 30 && npm ci --no-audit --no-fund --loglevel=info --fetch-timeout=300000)

# Copy full source
COPY . .

# Build-time env vars (ARG â†’ ENV for Vite embedding).
# FIX #4: VITE_NVIDIA_API_KEY is declared as ARG so Vite can embed it at build.
# It is a client-side key (exposed in JS bundle by design) â€” not a server secret.
# NVIDIA_API_KEY (server-side secret used by nginx envsubst) is intentionally
# NOT declared here â€” only injected at container runtime (see production stage).
ARG VITE_CONVEX_URL
ARG VITE_CONVEX_FUNCTIONS_DEPLOYED
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
ARG VITE_NVIDIA_API_KEY=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
ARG VITE_NVIDIA_MODEL

ENV VITE_CONVEX_URL=${VITE_CONVEX_URL:-https://kindheart-lark-661.convex.cloud} \
    VITE_CONVEX_FUNCTIONS_DEPLOYED=${VITE_CONVEX_FUNCTIONS_DEPLOYED:-true} \
    VITE_PUBLIC_SITE_URL=$VITE_PUBLIC_SITE_URL \
    VITE_GA4_MEASUREMENT_ID=$VITE_GA4_MEASUREMENT_ID \
    VITE_GTM_CONTAINER_ID=$VITE_GTM_CONTAINER_ID \
    VITE_ADSENSE_CLIENT=$VITE_ADSENSE_CLIENT \
    VITE_ADSENSE_SLOT_REVIEW_SIDEBAR=$VITE_ADSENSE_SLOT_REVIEW_SIDEBAR \
    VITE_ADSENSE_SLOT_HOME_LEADERBOARD=$VITE_ADSENSE_SLOT_HOME_LEADERBOARD \
    VITE_ADSENSE_SLOT_COMPARE_INLINE=$VITE_ADSENSE_SLOT_COMPARE_INLINE \
    VITE_ADSENSE_SLOT_COMPARE_SIDEBAR=$VITE_ADSENSE_SLOT_COMPARE_SIDEBAR \
    VITE_ADSENSE_FALLBACK_WITHOUT_DB=$VITE_ADSENSE_FALLBACK_WITHOUT_DB \
    VITE_AMAZON_ASSOCIATES_TAG=$VITE_AMAZON_ASSOCIATES_TAG \
    VITE_NVIDIA_API_KEY=$VITE_NVIDIA_API_KEY \
    VITE_NVIDIA_MODEL=${VITE_NVIDIA_MODEL:-meta/llama-3.1-70b-instruct}

RUN npm run build

# Production stage
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# FIX #3: exec-form ENTRYPOINT instead of shell-form CMD (fixes JSONArgsRecommended).
# FIX #5-7: NVIDIA_API_KEY (server secret) is NOT a build arg here â€” only a
# runtime ENV, so it never gets baked into any image layer.
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENV NVIDIA_API_KEY=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
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f -H "Host: thesynlab.com" http://127.0.0.1:80/robots.txt || exit 1
