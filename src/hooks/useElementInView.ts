import { useEffect, useState } from "react";

type Options = {
  /** How far outside the viewport a slot starts loading (ad lazy-load margin). */
  rootMargin?: string;
  /** Fraction of the element that must be visible to count as an impression. */
  confirmRatio?: number;
  /** How long the element must stay visible before the impression is confirmed (ms). */
  confirmMs?: number;
};

/**
 * Progressive-visibility hook used by the ad slots.
 *
 * `inView`      → the element came within `rootMargin` of the viewport. Used to *load*
 *                 an ad only when it can actually be seen, instead of pushing every
 *                 unit on mount (wasted requests, CPU, and poor viewability).
 * `confirmed`   → the element was at least `confirmRatio` visible for `confirmMs`
 *                 milliseconds (IAB viewability: 50% / 1s). Used to *count* the ad
 *                 impression, so stacked below-the-fold units are not inflated.
 *
 * Uses a callback ref so elements that mount later (e.g. after consent) are observed.
 */
export function useElementInView<T extends Element>({
  rootMargin = "300px 0px",
  confirmRatio = 0.5,
  confirmMs = 1000,
}: Options = {}) {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // Very old browsers: no lazy loading possible, treat as visible.
      setInView(true);
      setConfirmed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, rootMargin]);

  useEffect(() => {
    if (!node || !inView || confirmed) return;
    if (typeof IntersectionObserver === "undefined") return;

    let timer: number | undefined;
    const clear = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const ratio = entries[0]?.intersectionRatio ?? 0;
        if (ratio >= confirmRatio) {
          if (timer === undefined) {
            timer = window.setTimeout(() => setConfirmed(true), confirmMs);
          }
        } else {
          clear();
        }
      },
      { threshold: [0, confirmRatio, Math.min(1, confirmRatio + 0.25)] }
    );
    observer.observe(node);
    return () => {
      clear();
      observer.disconnect();
    };
  }, [node, inView, confirmed, confirmRatio, confirmMs]);

  return { ref: setNode, inView, confirmed };
}
