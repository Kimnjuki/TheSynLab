import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isStaleChunk: boolean;
}

/**
 * Matches the failures React.lazy produces when a hashed route chunk
 * (e.g. /assets/ToolsHub-<hash>.js) 404s because a new deploy replaced the
 * build this still-open page was loaded from. Vite rewrites every chunk name
 * per build and the previous files are deleted with the old container image,
 * so the old tab's import map can never resolve again — only a reload helps.
 * Browser spellings: Chrome "Failed to fetch dynamically imported module",
 * Firefox "error loading dynamically imported module", Safari
 * "Importing a module script failed", webpack legacy "Loading chunk … failed".
 */
const STALE_CHUNK_ERROR_RE =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading chunk [\w-]+ failed|ChunkLoadError/i;

const CHUNK_RELOAD_KEY = "tsl-stale-chunk-reload-at";
/** Cooldown between automatic reloads so a genuinely missing chunk can't loop. */
const CHUNK_RELOAD_COOLDOWN_MS = 60_000;

function isStaleChunkError(error: Error | null): boolean {
  if (!error) return false;
  return error.name === "ChunkLoadError" || STALE_CHUNK_ERROR_RE.test(error.message);
}

/**
 * Reloads at most once per cooldown window so the tab picks up the current
 * index.html and its chunk map. Returns false when a reload was already
 * attempted recently (or storage is unavailable) — the UI then offers a
 * manual refresh instead of looping.
 */
function tryReloadStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    if (Date.now() - last < CHUNK_RELOAD_COOLDOWN_MS) return false;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
    window.location.reload();
    return true;
  } catch {
    // sessionStorage throws in some private modes — fall back to the manual UI.
    return false;
  }
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, isStaleChunk: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, isStaleChunk: isStaleChunkError(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
    // Stale route chunk after a deploy → reload once for the fresh HTML/chunk
    // map. Skipped while offline (a reload couldn't fetch anything either).
    if (this.state.isStaleChunk && navigator.onLine !== false) {
      tryReloadStaleChunk();
    }
  }

  handleRetry = () => {
    if (this.state.isStaleChunk) {
      // React.lazy caches the rejected import — only a real reload recovers.
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: null, isStaleChunk: false });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const staleChunk = this.state.isStaleChunk;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 rounded-full bg-destructive/10 p-3 w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle>{staleChunk ? "Page needs a refresh" : "Something went wrong"}</CardTitle>
              <CardDescription>
                {staleChunk
                  ? "This page was loaded from an older version of the site. Refresh to continue."
                  : "An unexpected error occurred. Please try again."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="rounded-lg bg-muted p-3 text-xs font-mono text-muted-foreground overflow-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={this.handleGoHome} className="gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
                <Button onClick={this.handleRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {staleChunk ? "Refresh" : "Try Again"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for use with hooks
export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};
