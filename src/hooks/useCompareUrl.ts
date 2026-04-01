import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import { toast } from "sonner";

export function useCompareUrl() {
  const [searchParams, setSearchParams] = useSearchParams();

  const slugs = (searchParams.get("products") ?? "").split(",").filter(Boolean);
  const activeSection = searchParams.get("section") ?? "overview";

  const setProducts = useCallback(
    (newSlugs: string[]) => {
      const params: Record<string, string> = {};
      if (newSlugs.length) params.products = newSlugs.join(",");
      const sec = searchParams.get("section");
      if (sec) params.section = sec;
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const setSection = useCallback(
    (section: string) => {
      const params: Record<string, string> = {};
      const prods = searchParams.get("products");
      if (prods) params.products = prods;
      params.section = section;
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const shareUrl = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied!"));
  }, []);

  const shareOnTwitter = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this product comparison on TheSynLab!");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  }, []);

  const shareOnLinkedIn = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  }, []);

  const generateEmbedCode = useCallback(() => {
    const envBase = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined;
    const origin = envBase?.replace(/\/$/, "") || window.location.origin;
    const path = `${window.location.pathname}${window.location.search || ""}`;
    const sep = path.includes("?") ? "&" : "?";
    const src = `${origin}${path}${sep}embed=true`;
    return `<iframe src="${src}" width="800" height="600" frameborder="0" style="border:none;border-radius:12px;" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  }, []);

  return {
    slugs,
    activeSection,
    setProducts,
    setSection,
    shareUrl,
    shareOnTwitter,
    shareOnLinkedIn,
    generateEmbedCode,
  };
}
