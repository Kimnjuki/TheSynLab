import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Convex is disabled by default until functions are deployed.
// To enable: set VITE_CONVEX_FUNCTIONS_DEPLOYED=true in Coolify.
const rawUrl = (import.meta.env.VITE_CONVEX_URL || "").trim();
const hasUrl = rawUrl.length > 0 && rawUrl.startsWith("http");
const functionsDeployed =
  (import.meta.env.VITE_CONVEX_FUNCTIONS_DEPLOYED ?? "").trim().toLowerCase() === "true";
const isDisabled = !hasUrl || !functionsDeployed;

function createClient(): ConvexReactClient {
  if (!isDisabled) {
    try {
      return new ConvexReactClient(rawUrl, { skipConvexDeploymentUrlCheck: true });
    } catch (err) {
      console.warn("Convex connection failed, using placeholder:", err);
    }
  }
  // Silent placeholder — never actually connects
  return new ConvexReactClient("https://placeholder.convex.cloud", {
    skipConvexDeploymentUrlCheck: true,
  });
}

interface Props { children: ReactNode; }

export function ConvexClientProvider({ children }: Props) {
  const client = useMemo(() => createClient(), []);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
