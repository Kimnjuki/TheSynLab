/**
 * Canonical Convex deployment for TheSynLab.
 *
 * Single source of truth for the backend deployment name and URLs.
 *
 * The build-time `VITE_CONVEX_URL` env var is validated against this so that a
 * typo (or a stale value) can never silently ship a bundle that opens a
 * WebSocket to a host that does not resolve. This is exactly what happened in
 * production: `kindheart-lark-661` (missing the "ed") was baked in as the
 * Dockerfile default, producing an endless
 * `wss://kindheart-lark-661.convex.cloud … ERR_NAME_NOT_RESOLVED` loop.
 *
 * If you ever migrate to a different Convex deployment, update
 * `CONVEX_DEPLOYMENT` here (and keep `CONVEX_DEPLOY.md` / `.env.example` in sync).
 */
export const CONVEX_DEPLOYMENT = "kindhearted-lark-661";

/** API/hosted-functions URL — the value ConvexReactClient expects. */
export const CANONICAL_CONVEX_URL = `https://${CONVEX_DEPLOYMENT}.convex.cloud`;

/** Hosted HTTP/site URL (used for Convex HTTP actions such as the RSS feed). */
export const CANONICAL_CONVEX_SITE_URL = `https://${CONVEX_DEPLOYMENT}.convex.site`;

/** Only real `.convex.cloud` deployment URLs are accepted for the client. */
const CONVEX_URL_PATTERN = /^https:\/\/([a-z0-9-]+)\.convex\.cloud\/?$/i;

export interface ConvexUrlResolution {
  /** A URL that is safe to hand to `new ConvexReactClient(...)`. */
  url: string;
  /** True when the configured env value was unusable and the canonical URL was used. */
  usedFallback: boolean;
  /** Human-readable reason for the fallback (undefined when the configured value is valid). */
  reason?: string;
}

/**
 * Validate a configured Convex URL, falling back to the canonical deployment.
 *
 * Accepts the configured value only when it is a well-formed `.convex.cloud`
 * URL for this project's own deployment. Anything else (empty, malformed, or
 * pointing at a different/typo'd deployment) falls back to
 * `CANONICAL_CONVEX_URL` with a reason so the caller can surface it loudly.
 */
export function resolveConvexUrl(configured?: string | null): ConvexUrlResolution {
  const value = (configured ?? "").trim();

  if (!value) {
    return {
      url: CANONICAL_CONVEX_URL,
      usedFallback: true,
      reason: "VITE_CONVEX_URL is not set",
    };
  }

  const match = CONVEX_URL_PATTERN.exec(value);
  if (!match) {
    return {
      url: CANONICAL_CONVEX_URL,
      usedFallback: true,
      reason: `VITE_CONVEX_URL is not a valid Convex cloud URL ("${value}")`,
    };
  }

  const deployment = match[1].toLowerCase();
  if (deployment !== CONVEX_DEPLOYMENT) {
    return {
      url: CANONICAL_CONVEX_URL,
      usedFallback: true,
      reason: `VITE_CONVEX_URL points at "${deployment}" but this project deploys to "${CONVEX_DEPLOYMENT}"`,
    };
  }

  return { url: value, usedFallback: false };
}