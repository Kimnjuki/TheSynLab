import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Per-pageview ad-unit budget ("ad frequency cap").
 *
 * Stacking every declared slot on one pageview cannibalises its own viewability —
 * Google measures viewable impressions, so the 4th unit on a short page lowers the
 * average and the reported RPM, while adding DOM and layout work. Slots are therefore
 * claimed first-come-first-served in tree order (hero/leaderboard slots mount before
 * sidebars and forum units) up to `VITE_AD_UNITS_PER_PAGE` (default 4).
 *
 * Claims are keyed by `pathname + slot key`, which makes them idempotent: React
 * StrictMode double-invocation and re-mounts of the same slot never consume budget
 * twice, and a re-render never evicts a slot that already won its claim.
 */
const DEFAULT_UNITS_PER_PAGE = 4;

const claimsByPath = new Map<string, Set<string>>();

function unitsPerPage(): number {
  const raw = (import.meta.env as unknown as Record<string, string | undefined>)
    .VITE_AD_UNITS_PER_PAGE;
  const parsed = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_UNITS_PER_PAGE;
  return parsed;
}

function claim(pathname: string, slotKey: string): boolean {
  let claimed = claimsByPath.get(pathname);
  if (!claimed) {
    claimed = new Set<string>();
    claimsByPath.set(pathname, claimed);
  }
  if (claimed.has(slotKey)) return true;
  if (claimed.size >= unitsPerPage()) return false;
  claimed.add(slotKey);
  return true;
}

/** Test/debug helper: clears every pageview's claims. */
export function resetAdSlotBudget(): void {
  claimsByPath.clear();
}

/**
 * Returns whether this slot may render a paid unit on the current pageview.
 * `slotKey` must be stable for the life of the slot (e.g. slotName + position).
 */
export function useAdSlotBudget(slotKey: string): boolean {
  const { pathname } = useLocation();
  const [allowed, setAllowed] = useState(() => claim(pathname, slotKey));

  useEffect(() => {
    setAllowed(claim(pathname, slotKey));
  }, [pathname, slotKey]);

  return allowed;
}

export default useAdSlotBudget;
