import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

// Suppress console noise from Convex placeholder (no functions deployed)
const origError = console.error;
console.error = function (...args: unknown[]) {
  const msg = String(args[0] || "");
  if (msg.includes("Could not find public function") || msg.includes("[CONVEX Q(")) return;
  origError.apply(console, args);
};

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
