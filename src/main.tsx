import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import App from "./App.tsx";
import { initGA } from "@/lib/analytics";
import { installConsoleGuard } from "@/lib/consoleGuard";
import "./index.css";

// Initialise Google Analytics 4 (ID from VITE_GA4_MEASUREMENT_ID in .env)
initGA();

// Central, idempotent console hygiene (replaces the ad-hoc console.error
// monkey-patch that used to live here). Only the documented benign Convex
// signatures are suppressed — see src/lib/consoleGuard.ts.
installConsoleGuard();

// Error boundary that silently recovers from missing Convex functions
class RootBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    const msg = error?.message || "";
    if (msg.includes("Could not find public function")) {
      // Convex functions not deployed — silently recover. App works with mock data.
      this.setState({ hasError: false });
      return;
    }
    console.error("App render error:", error);
  }
  render() {
    return this.props.children;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

try {
  createRoot(rootEl).render(
    <RootBoundary>
      <App />
    </RootBoundary>
  );
} catch (err) {
  console.error("Failed to mount app:", err);
}
