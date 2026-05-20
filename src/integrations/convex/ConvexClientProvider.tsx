import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Suppress known console noise from Convex placeholder
const originalWarn = console.warn;
const originalError = console.error;
console.warn = function filterWarn(...args: unknown[]) {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('development keys') || msg.includes('Attempting reconnect') || msg.includes('CONVEX')) return;
  originalWarn.apply(console, args);
};
console.error = function filterError(...args: unknown[]) {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('CONVEX') || msg.includes('WebSocket') || msg.includes('reconnect') || msg.includes('failed') || msg.includes('placeholder')) return;
  originalError.apply(console, args);
};

// Convex is disabled by default until functions are deployed.
// To enable: set VITE_CONVEX_FUNCTIONS_DEPLOYED=true in Coolify.
const rawUrl = (import.meta.env.VITE_CONVEX_URL || "").trim();
const hasUrl = rawUrl.length > 0 && rawUrl.startsWith("http");
const functionsDeployed =
  (import.meta.env.VITE_CONVEX_FUNCTIONS_DEPLOYED ?? "").trim().toLowerCase() === "true";
const isDisabled = !hasUrl || !functionsDeployed;

/**
 * A fake WebSocket constructor that immediately closes.
 * Prevents Convex from establishing real connections while allowing
 * the provider to render (useQuery hooks return undefined).
 */
function noopWebSocket(this: WebSocket, _url: string | URL, _protocols?: string | string[]): void {
  setTimeout(() => {
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code: 1000, wasClean: true }));
    }
  }, 0);
}
(noopWebSocket as any).CLOSED = 3;
(noopWebSocket as any).CLOSING = 2;
(noopWebSocket as any).CONNECTING = 0;
(noopWebSocket as any).OPEN = 1;

function createClient(): ConvexReactClient {
  if (!isDisabled) {
    try {
      return new ConvexReactClient(rawUrl, { skipConvexDeploymentUrlCheck: true });
    } catch (err) {
      console.warn("Convex connection failed, using placeholder:", err);
    }
  }
  // Silent placeholder with noop WebSocket — never actually connects
  try {
    return new ConvexReactClient("https://placeholder.convex.cloud", {
      skipConvexDeploymentUrlCheck: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      webSocketConstructor: noopWebSocket as any,
      unsavedChangesWarning: false,
    });
  } catch {
    // If even the placeholder fails (e.g. Convex client version change),
    // return a minimal client that won't throw
    return new ConvexReactClient("https://placeholder.convex.cloud", {
      skipConvexDeploymentUrlCheck: true,
      unsavedChangesWarning: false,
    });
  }
}

interface Props { children: ReactNode; }

export function ConvexClientProvider({ children }: Props) {
  const client = useMemo(() => createClient(), []);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
