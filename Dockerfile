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

# Build-time env (frontend only)
ARG VITE_CONVEX_URL

ENV VITE_CONVEX_URL=$VITE_CONVEX_URL

RUN npm run build

# Optional one-off runtime init image target for Convex deploy/seed:
# docker build --target convex-init ...
FROM node:20-alpine AS convex-init
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
CMD ["sh", "./scripts/convex-init.sh"]

# Production stage
FROM nginx:alpine

# Remove default config and use our SPA config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
