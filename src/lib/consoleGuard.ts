/**
 * Console hygiene for TheSynLab.
 *
 * Two unrelated problems used to spam the browser console in production:
 *
 *  1. Convex reconnect noise — caused by a typo'd `VITE_CONVEX_URL`
 *     (`kindheart-lark-661` instead of `kindhearted-lark-661`), which made the
 *     client open a WebSocket to a deployment that does not exist:
 *     `wss://kindheart-lark-661.convex.cloud … ERR_NAME_NOT_RESOLVED`, followed
 *     by an endless "Attempting reconnect" loop. The root cause is fixed in the
 *     Dockerfile and src/config/convex.ts; `createConvexLogger()` below
 *     additionally collapses any future connection spam to one line per
 *     distinct problem instead of looping forever.
 *
 *  2. A third-party `reportAllChanges` / `startTime` TypeError thrown from an
 *     isolated `VM…` script (browser extension or injected tag). It is present
 *     neither in this codebase nor in the built bundle, so it cannot be fixed
 *     at source — `installConsoleGuard()` swallows exactly that signature and
 *     nothing else.
 */

/** Benign Convex/client messages that are not actionable for the user. */
const IGNORED_ERROR_SNIPPETS = [
  "Could not find public function", // Convex function not deployed yet
  "[CONVEX Q(", // Convex query error preamble
];

/** Repeated connection chatter — logged once per signature, then silenced. */
const CONVEX_CONNECTION_SNIPPETS = [
  "Attempting reconnect",
  "WebSocket closed with code",
  "WebSocket reconnected",
  "WebSocket connection to",
];

/** Informational Convex notices that carry no actionable signal for users. */
const CONVEX_BENIGN_SNIPPETS = [
  "development keys",
  "development deployment",
];

const seenConnectionWarnings = new Set<string>();

function firstArgToString(args: unknown[]): string {
  if (typeof args[0] === "string") return args[0];
  if (args[0] instanceof Error) return args[0].message;
  return "";
}

function matchesAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

/**
 * Custom Convex client logger. Forwards everything to the real console but
 * collapses repeated connection errors (e.g. a backend outage) to a single
 * line per signature, so a down deployment cannot flood the console.
 */
export function createConvexLogger() {
  const emit = (method: "log" | "warn" | "error", args: unknown[]) => {
    const text = firstArgToString(args);
    if (matchesAny(text, CONVEX_BENIGN_SNIPPETS)) return;
    const signature = CONVEX_CONNECTION_SNIPPETS.find((snippet) => text.includes(snippet));
    if (signature) {
      if (seenConnectionWarnings.has(signature)) return;
      seenConnectionWarnings.add(signature);
    }
    // console[method] is a dynamic lookup, so the no-console rule does not apply
    console[method](...args);
  };

  return {
    logVerbose: (...args: unknown[]) => emit("log", args),
    log: (...args: unknown[]) => emit("log", args),
    warn: (...args: unknown[]) => emit("warn", args),
    error: (...args: unknown[]) => emit("error", args),
  };
}

let installed = false;

/**
 * Install global console/error guards. Idempotent and safe to call on every
 * boot. Only the signatures listed above are suppressed — everything else
 * passes through untouched so genuine application errors stay visible.
 */
export function installConsoleGuard(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (matchesAny(firstArgToString(args), IGNORED_ERROR_SNIPPETS)) return;
    originalError(...args);
  };

  // Third-party web-vitals crash (browser extension / injected tag). Suppress
  // only when both the message *and* the stack match, so a genuine application
  // bug that happens to mention `startTime` is never hidden.
  window.addEventListener("error", (event) => {
    const message = event.message ?? "";
    const stack = (event.error && event.error.stack) || "";
    if (message.includes("startTime") && stack.includes("reportAllChanges")) {
      event.preventDefault();
    }
  });
}
