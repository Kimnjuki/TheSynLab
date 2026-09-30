/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL?: string;
  readonly VITE_CONVEX_FUNCTIONS_DEPLOYED?: string;
  readonly VITE_PUBLIC_SITE_URL?: string;
  readonly VITE_GTM_CONTAINER_ID?: string;
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly VITE_AMAZON_ASSOCIATES_TAG?: string;
  readonly VITE_ADSENSE_CLIENT?: string;
  readonly VITE_ADSENSE_SLOT_REVIEW_SIDEBAR?: string;
  readonly VITE_ADSENSE_SLOT_HOME_LEADERBOARD?: string;
  readonly VITE_ADSENSE_SLOT_COMPARE_INLINE?: string;
  readonly VITE_ADSENSE_SLOT_COMPARE_SIDEBAR?: string;
  readonly VITE_ADSENSE_SLOT_HUB_HERO_BELOW?: string;
  readonly VITE_ADSENSE_SLOT_FORUM_IN_ARTICLE_1?: string;
  readonly VITE_ADSENSE_FALLBACK_WITHOUT_DB?: string;

  // --- Adnium (second demand source; see src/lib/adnium.ts + docs/ADNIUM_INTEGRATION.md) ---
  /** "0" disables Adnium entirely. Default: enabled. */
  readonly VITE_ADNIUM_ENABLED?: string;
  /** Publisher key from adn_verify.txt. Default: ADN55c88d9c53ef4. */
  readonly VITE_ADNIUM_SITE_KEY?: string;
  /** "0" disables the site-wide popunder tag. Default: enabled. */
  readonly VITE_ADNIUM_POPUNDER?: string;
  /** Zone id for the site-wide popunder tag. */
  readonly VITE_ADNIUM_ZONE_ID?: string;
  /** Shared zone parameters (Adnium dashboard → Zones → Get code). */
  readonly VITE_ADNIUM_ZONE_PID?: string;
  readonly VITE_ADNIUM_ZONE_SID?: string;
  /** Zone type: 1 banner · 2 interstitial · 3 in-page push · 4 popunder. */
  readonly VITE_ADNIUM_ZONE_TYPE?: string;
  /** Zone type for in-slot backfill units. Default 1 (banner). */
  readonly VITE_ADNIUM_SLOT_TYPE?: string;
  readonly VITE_ADNIUM_ZONE_WIDTH?: string;
  readonly VITE_ADNIUM_ZONE_HEIGHT?: string;
  /** Space/comma separated CSS classes allowed to trigger a popunder. */
  readonly VITE_ADNIUM_TRIGGER_CLASSES?: string;
  /** Optional verbatim Adnium invitation URL with {id} {pid} {sid} {type} {width} {height} {key} {random}. */
  readonly VITE_ADNIUM_TAG_URL?: string;
  /** Zone id per AdSlot slotName (mirrors the AdSense slot map). */
  readonly VITE_ADNIUM_SLOT_REVIEW_SIDEBAR?: string;
  readonly VITE_ADNIUM_SLOT_HOME_LEADERBOARD?: string;
  readonly VITE_ADNIUM_SLOT_COMPARE_INLINE?: string;
  readonly VITE_ADNIUM_SLOT_COMPARE_SIDEBAR?: string;
  readonly VITE_ADNIUM_SLOT_HUB_HERO_BELOW?: string;
  readonly VITE_ADNIUM_SLOT_FORUM_IN_ARTICLE_1?: string;

  // --- Ad placement efficiency ---
  /** Max ad units per pageview (frequency cap). Default: 4. */
  readonly VITE_AD_UNITS_PER_PAGE?: string;
  /** "1" renders reserved-slot placeholders in production builds (debug only). */
  readonly VITE_ADS_DEBUG_PLACEHOLDERS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
