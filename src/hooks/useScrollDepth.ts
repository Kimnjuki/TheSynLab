/**
 * useScrollDepth — fires a single `scroll_75_percent` growth event per page
 * when the reader has scrolled past 75% of the document. Re-arms on route
 * change so each page gets exactly one engagement data point.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { scrollDepth75 } from "@/lib/growthEvents";

export function useScrollDepth(threshold = 0.75): void {
  const { pathname } = useLocation();
  const firedRef = useRef(false);

  // Re-arm when the route changes.
  useEffect(() => {
    firedRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (firedRef.current) return;

    const onScroll = () => {
      if (firedRef.current) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = window.scrollY / scrollable;
      if (progress >= threshold) {
        firedRef.current = true;
        scrollDepth75(pathname);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, threshold]);
}

export default useScrollDepth;
