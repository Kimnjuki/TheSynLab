/**
 * Append Amazon Associates tracking where applicable. Set VITE_AMAZON_ASSOCIATES_TAG in production.
 */
export function applyAffiliateOutboundUrl(rawUrl: string | undefined | null): string | undefined {
  if (!rawUrl?.trim()) return undefined;
  const tag = (import.meta.env.VITE_AMAZON_ASSOCIATES_TAG as string | undefined)?.trim();
  if (!tag) return rawUrl;

  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return rawUrl;
  }

  const host = url.hostname.toLowerCase();
  if (!host.includes("amazon.")) return rawUrl;

  if (!url.searchParams.has("tag")) {
    url.searchParams.set("tag", tag);
  }
  return url.toString();
}

export function isAmazonProductUrl(url: string | undefined | null): boolean {
  if (!url?.trim()) return false;
  try {
    const u = new URL(url.trim());
    const h = u.hostname.toLowerCase();
    if (!h.includes("amazon.")) return false;
    return u.pathname.includes("/dp/") || u.pathname.includes("/gp/product/");
  } catch {
    return false;
  }
}
