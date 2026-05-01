/**
 * Affiliate Link Builder
 * Centralizes affiliate link generation for Impact, ShareASale, etc.
 * Update these IDs when you sign up for new affiliate programs.
 */

// Affiliate network IDs
export const AFFILIATE_CONFIG = {
  // Impact Radius / Impact.com
  IMPACT_ACCOUNT_ID: '7254854',
  IMPACT_SID: 'thesynlab', // Sub ID / Site ID
  
  // ShareASale – add your SS ID here
  SHAREASALE_MERCHANT_ID: '',
  
  // Default affiliate tag appended as query param
  DEFAULT_TAG: 'ref=thesynlab',
  
  // Impact ClickID parameter (used by some programs)
  IMPACT_CLICK_PARAM: 'irclickid',
};

/**
 * Wraps a URL with the site's affiliate tracking parameters.
 * For Impact: appends ?irclickid=...&irgwc=1
 * For direct programs: appends ?ref=thesynlab
 */
export function buildAffiliateUrl(officialUrl: string): string {
  if (!officialUrl) return '';
  
  const url = new URL(officialUrl);
  
  // Add Impact tracking ID as a ref parameter
  if (!url.searchParams.has('ref')) {
    url.searchParams.set('ref', AFFILIATE_CONFIG.DEFAULT_TAG.split('=')[1]);
  }
  
  return url.toString();
}

/**
 * Get the best available URL: affiliate link > official website > fallback search
 */
export function getPurchaseUrl(
  affiliateUrl?: string | null,
  officialWebsite?: string | null,
  productName?: string
): string {
  const url = affiliateUrl || officialWebsite;
  if (url) return buildAffiliateUrl(url);
  
  // Fallback: Google search
  if (productName) {
    return `https://www.google.com/search?q=${encodeURIComponent(productName + ' pricing')}`;
  }
  
  return '';
}
