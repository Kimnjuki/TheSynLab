/**
 * lazyWithRetry — drop-in replacement for React.lazy that survives deploys.
 *
 * Problem: Vite emits hashed chunks (BlogArticle-<hash>.js) and each Docker
 * image only contains the current build's files. A tab left open across a
 * deploy holds the old entry bundle; when it lazy-loads a route, the old
 * chunk URL 404s ("Failed to fetch dynamically imported module"). React.lazy
 * caches the rejected promise, so without a full page reload the route can
 * never resolve — the ErrorBoundary fallback is a dead end.
 *
 * This wrapper catches a chunk-load failure on FIRST attempt and performs a
 * full `location.reload()` (once per cooldown window, tracked in
 * sessionStorage so a genuinely missing chunk can't loop). After the reload
 * the tab runs the fresh index.html + chunk map and the route resolves.
 */
import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "tsl-stale-chunk-reload-at";
const COOLDOWN_MS = 60_000;

export const STALE_CHUNK_RE =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading chunk [\w-]+ failed|ChunkLoadError/i;

export function isStaleChunkFailure(error: unknown): boolean {
  if (!error) return false;
  if ((error as { name?: string }).name === "ChunkLoadError") return true;
  const msg =
    (error as { message?: unknown }).message ??
    (typeof error === "string" ? error : "");
  return typeof msg === "string" && STALE_CHUNK_RE.test(msg);
}

function shouldReloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < COOLDOWN_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    return true;
  } catch {
    // sessionStorage unavailable (some private modes) — reload anyway; the
    // fresh page will either resolve or surface the boundary UI.
    return true;
  }
}

export function lazyWithRetry<T extends ComponentType<unknown>>(
  importer: () => Promise<{ default: T }>
) {
  return lazy(() =>
    importer().catch((error: unknown) => {
      if (isStaleChunkFailure(error) && navigator.onLine !== false) {
        if (shouldReloadOnce()) {
          window.location.reload();
          // Return a never-resolving promise so React stays in Suspense
          // until the reload tears the page down (avoids flashing the
          // error boundary for a few frames).
          return new Promise<{ default: T }>(() => {});
        }
      }
      throw error;
    })
  );
}
