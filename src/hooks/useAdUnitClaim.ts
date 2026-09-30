import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * One live ad unit per `(network, unit id)` per pageview.
 *
 * Both non-AdSense networks render into a *named element that the page must own*:
 *   • Adsterra Native Banner → `<div id="container-<key>">`
 *   • Adnium in-slot zone    → `<div id="adn-<zoneId>">`
 *
 * Two slots sharing a key would emit duplicate element ids: the network fills the first
 * and double- or zero-counts the second, and the second slot renders an empty hole. Slots
 * claim their unit here first; a slot whose claim is refused falls through to the next
 * candidate network (see `AdSlot`).
 *
 * Claims are recorded per pageview as `unit → owning slot`. The same slot re-claiming its
 * own unit always succeeds (React StrictMode double-invocation, re-mounts, re-renders),
 * while a *different* slot claiming an already-claimed unit is refused and falls through
 * to the next candidate network.
 */
const claimsByPath = new Map<string, Map<string, string>>();

function claim(pathname: string, unit: string, owner: string): boolean {
  let claimed = claimsByPath.get(pathname);
  if (!claimed) {
    claimed = new Map<string, string>();
    claimsByPath.set(pathname, claimed);
  }
  const existing = claimed.get(unit);
  if (existing === undefined) {
    claimed.set(unit, owner);
    return true;
  }
  return existing === owner;
}

/** Test/debug helper: clears every pageview's claims. */
export function resetAdUnitClaims(): void {
  claimsByPath.clear();
}

/**
 * @param network  e.g. `"adsterra"` or `"adnium"`
 * @param unitId   the network's unit identity (native key, zone id); null when unset
 * @param active   whether this network is a candidate for the slot at all. Inactive
 *                 networks never consume a claim, so they cannot block another slot.
 * @param owner    stable slot identity (e.g. `slotName:position`)
 */
export function useAdUnitClaim(
  network: string,
  unitId: string | null | undefined,
  active: boolean,
  owner: string
): boolean {
  const { pathname } = useLocation();
  const unit = unitId ? `${network}:${unitId}` : null;
  const [allowed, setAllowed] = useState(() =>
    unit !== null && active ? claim(pathname, unit, owner) : false
  );

  useEffect(() => {
    if (unit === null || !active) return;
    setAllowed(claim(pathname, unit, owner));
  }, [pathname, unit, active, owner]);

  return unit !== null && allowed;
}

export default useAdUnitClaim;
