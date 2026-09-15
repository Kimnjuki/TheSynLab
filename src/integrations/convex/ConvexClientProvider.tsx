import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";
import { CANONICAL_CONVEX_URL, resolveConvexUrl } from "@/config/convex";
import { createConvexLogger, installConsoleGuard } from "@/lib/consoleGuard";

// Central, idempotent console hygiene. This replaces the ad-hoc global
// console.warn/console.error monkey-patching that previously lived here and in
// main.tsx: only the documented, provably-benign signatures are suppressed and
// everything else passes through untouched. See src/lib/consoleGuard.ts.
installConsoleGuard();

// Convex is disabled by default until functions are deployed.
// To enable: set VITE_CONVEX_FUNCTIONS_DEPLOYED=true in Coolify.
const configuredUrl = (import.meta.env.VITE_CONVEX_URL || "").trim();
// Validate the configured URL against this project's canonical deployment so a
// typo cannot silently produce a WebSocket connection to a host that does not
// resolve (see src/config/convex.ts).
const { url: rawUrl, usedFallback, reason } = resolveConvexUrl(configuredUrl);
const functionsDeployed =
  (import.meta.env.VITE_CONVEX_FUNCTIONS_DEPLOYED ?? "").trim().toLowerCase() === "true";
// Fully disabled only when nothing was configured at all or the functions are
// not deployed — preserves local-dev behaviour (non-connecting placeholder).
const isDisabled = configuredUrl.length === 0 || !functionsDeployed;

// Always visible: this signature matches no suppressed snippet, so a
// misconfigured backend URL can never be silent. This is the guard that catches
// the "kindheart-lark-661" class of typo before it becomes an endless reconnect
// loop. (console.error is only filtered for the documented benign signatures.)
if (usedFallback && configuredUrl.length > 0) {
  console.error(
    `[TheSynLab] Backend URL misconfigured — ${reason}. ` +
      `Falling back to ${CANONICAL_CONVEX_URL}. ` +
      "Fix VITE_CONVEX_URL in your build environment (Coolify → Environment Variables) and redeploy."
  );
}

interface WebSocketStatics {
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;
}

/**
 * A fake WebSocket constructor that immediately closes.
 * Prevents Convex from establishing a real connection while allowing
 * the provider to render (useQuery hooks return undefined).
 */
function noopWebSocket(this: WebSocket): void {
  setTimeout(() => {
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code: 1000, wasClean: true }));
    }
  }, 0);
}
// readyState constants Convex reads off the WebSocket constructor.
const noopStatics = noopWebSocket as unknown as WebSocketStatics;
noopStatics.CONNECTING = 0;
noopStatics.OPEN = 1;
noopStatics.CLOSING = 2;
noopStatics.CLOSED = 3;

const NOOP_WEBSOCKET = noopWebSocket as unknown as typeof WebSocket;

function createClient(): ConvexReactClient {
  if (!isDisabled) {
    try {
      // A custom logger collapses repeated connection chatter (e.g. a backend
      // outage) to one line per signature instead of an endless reconnect flood,
      // while still forwarding every first-of-its-kind message to the console.
      return new ConvexReactClient(rawUrl, {
        skipConvexDeploymentUrlCheck: true,
        logger: createConvexLogger(),
      });
    } catch (err) {
      console.warn("Convex connection failed, using placeholder:", err);
    }
  }
  // Silent placeholder with noop WebSocket — never actually connects, so there
  // is nothing actionable to log; silence the client entirely (logger: false).
  try {
    return new ConvexReactClient("https://placeholder.convex.cloud", {
      skipConvexDeploymentUrlCheck: true,
      webSocketConstructor: NOOP_WEBSOCKET,
      unsavedChangesWarning: false,
      logger: false,
    });
  } catch {
    // If even the placeholder fails (e.g. Convex client version change),
    // return a minimal client that won't throw
    return new ConvexReactClient("https://placeholder.convex.cloud", {
      skipConvexDeploymentUrlCheck: true,
      unsavedChangesWarning: false,
      logger: false,
    });
  }
}

interface Props { children: ReactNode; }

export function ConvexClientProvider({ children }: Props) {
  const client = useMemo(() => createClient(), []);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
