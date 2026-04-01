#!/bin/sh
set -eu

# Runtime/init job script for Coolify:
# - Deploy Convex functions/schema
# - Optionally run article seed
# This is intentionally separate from Docker image build.

EFFECTIVE_KEY="${CONVEX_DEPLOY_KEY:-${CONVEX_DEPLOYMENT_KEYS:-}}"
RUN_ARTICLE_SEED="${RUN_ARTICLE_SEED:-true}"
MAX_ATTEMPTS="${CONVEX_DEPLOY_MAX_ATTEMPTS:-6}"

if [ -z "$EFFECTIVE_KEY" ]; then
  echo "No CONVEX_DEPLOY_KEY/CONVEX_DEPLOYMENT_KEYS provided; skipping Convex init."
  exit 0
fi

attempt=1
while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
  echo "Convex deploy attempt ${attempt}/${MAX_ATTEMPTS}"
  if output="$(CONVEX_DEPLOY_KEY="$EFFECTIVE_KEY" npx convex deploy --yes 2>&1)"; then
    echo "$output"
    break
  fi
  echo "$output"
  if echo "$output" | grep -E -q "Schema was overwritten by another push\.|fetch failed|ETIMEDOUT|ECONNRESET|ENOTFOUND|EAI_AGAIN|network|upstream"; then
    if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
      sleep_time=$((attempt * 5))
      echo "Retryable deploy error. Retrying in ${sleep_time}s..."
      sleep "$sleep_time"
      attempt=$((attempt + 1))
      continue
    fi
  fi
  echo "Convex deploy failed with non-retryable error."
  exit 1
done

if [ "$attempt" -gt "$MAX_ATTEMPTS" ]; then
  echo "Convex deploy failed after ${MAX_ATTEMPTS} attempts."
  exit 1
fi

if [ "$RUN_ARTICLE_SEED" = "true" ]; then
  seed_attempt=1
  seed_max_attempts="${CONVEX_SEED_MAX_ATTEMPTS:-3}"
  while [ "$seed_attempt" -le "$seed_max_attempts" ]; do
    echo "Article seed attempt ${seed_attempt}/${seed_max_attempts}"
    if seed_output="$(CONVEX_DEPLOY_KEY="$EFFECTIVE_KEY" npx convex run seedSmartHomeArticles:seedSmartHomeArticles 2>&1)"; then
      echo "$seed_output"
      exit 0
    fi
    echo "$seed_output"
    if [ "$seed_attempt" -lt "$seed_max_attempts" ]; then
      sleep_time=$((seed_attempt * 3))
      echo "Seed failed. Retrying in ${sleep_time}s..."
      sleep "$sleep_time"
      seed_attempt=$((seed_attempt + 1))
      continue
    fi
    break
  done
  echo "Article seed failed after ${seed_max_attempts} attempts."
  exit 1
fi

echo "RUN_ARTICLE_SEED is false. Convex init completed."
