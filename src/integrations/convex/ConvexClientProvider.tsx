import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Convex deployment URL - ensure this matches your npx convex dev/deploy output
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://kindhearted-lark-661.convex.cloud";

const convex = new ConvexReactClient(CONVEX_URL);

interface ConvexClientProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  // Using basic Convex without Clerk auth for Git Bash deployment
  // Mock auth is handled via AuthContext
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export { convex };
