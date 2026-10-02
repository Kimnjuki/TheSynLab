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

  // --- Adsterra (native banner + display banners + popunder; see src/lib/adsterra.ts) ---
  /** "0" disables Adsterra entirely. Default: enabled. */
  readonly VITE_ADSTERRA_ENABLED?: string;
  /** "0" disables only the Adsterra popunder tag. Default: enabled. */
  readonly VITE_ADSTERRA_POPUNDER?: string;
  /** Native Banner key (`<key>` in `…/<key>/invoke.js`). */
  readonly VITE_ADSTERRA_NATIVE_KEY?: string;
  /** Native Banner loader URL. */
  readonly VITE_ADSTERRA_NATIVE_SRC?: string;
  /** Popunder tag URL. */
  readonly VITE_ADSTERRA_POPUNDER_SRC?: string;
  /** Per-slot Native Banner key / loader overrides. */
  readonly VITE_ADSTERRA_SLOT_REVIEW_SIDEBAR?: string;
  readonly VITE_ADSTERRA_SLOT_REVIEW_SIDEBAR_SRC?: string;
  readonly VITE_ADSTERRA_SLOT_HOME_LEADERBOARD?: string;
  readonly VITE_ADSTERRA_SLOT_HOME_LEADERBOARD_SRC?: string;
  readonly VITE_ADSTERRA_SLOT_COMPARE_INLINE?: string;
  readonly VITE_ADSTERRA_SLOT_COMPARE_INLINE_SRC?: string;
  readonly VITE_ADSTERRA_SLOT_COMPARE_SIDEBAR?: string;
  readonly VITE_ADSTERRA_SLOT_COMPARE_SIDEBAR_SRC?: string;
  readonly VITE_ADSTERRA_SLOT_HUB_HERO_BELOW?: string;
  readonly VITE_ADSTERRA_SLOT_HUB_HERO_BELOW_SRC?: string;
  readonly VITE_ADSTERRA_SLOT_FORUM_IN_ARTICLE_1?: string;
  readonly VITE_ADSTERRA_SLOT_FORUM_IN_ARTICLE_1_SRC?: string;
  /** Per-slot format preference: "banner" forces the display banner, "native" the div unit. */
  readonly VITE_ADSTERRA_SLOT_REVIEW_SIDEBAR_PREFER?: string;
  readonly VITE_ADSTERRA_SLOT_HOME_LEADERBOARD_PREFER?: string;
  readonly VITE_ADSTERRA_SLOT_COMPARE_INLINE_PREFER?: string;
  readonly VITE_ADSTERRA_SLOT_COMPARE_SIDEBAR_PREFER?: string;
  readonly VITE_ADSTERRA_SLOT_HUB_HERO_BELOW_PREFER?: string;
  readonly VITE_ADSTERRA_SLOT_FORUM_IN_ARTICLE_1_PREFER?: string;
  /** Display Banner `invoke.js` host override (dashboard default is committed). */
  readonly VITE_ADSTERRA_BANNER_SRC?: string;
  /** Display Banner unit keys (dashboard ids; committed defaults). Override to replace. */
  readonly VITE_ADSTERRA_BANNER_300X250_KEY?: string;
  readonly VITE_ADSTERRA_BANNER_300X250_WIDTH?: string;
  readonly VITE_ADSTERRA_BANNER_300X250_HEIGHT?: string;
  readonly VITE_ADSTERRA_BANNER_300X250_SRC?: string;
  readonly VITE_ADSTERRA_BANNER_728X90_KEY?: string;
  readonly VITE_ADSTERRA_BANNER_728X90_WIDTH?: string;
  readonly VITE_ADSTERRA_BANNER_728X90_HEIGHT?: string;
  readonly VITE_ADSTERRA_BANNER_728X90_SRC?: string;
  /** Explicit per-slot Display Banner key (+ optional _WIDTH/_HEIGHT/_SRC). */
  readonly VITE_ADSTERRA_BANNER_SLOT_REVIEW_SIDEBAR?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_REVIEW_SIDEBAR_WIDTH?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_REVIEW_SIDEBAR_HEIGHT?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_REVIEW_SIDEBAR_SRC?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_HOME_LEADERBOARD?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_HOME_LEADERBOARD_WIDTH?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_HOME_LEADERBOARD_HEIGHT?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_HOME_LEADERBOARD_SRC?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_COMPARE_INLINE?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_COMPARE_INLINE_WIDTH?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_COMPARE_INLINE_HEIGHT?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_COMPARE_INLINE_SRC?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_COMPARE_SIDEBAR?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_COMPARE_SIDEBAR_WIDTH?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_COMPARE_SIDEBAR_HEIGHT?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_COMPARE_SIDEBAR_SRC?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_HUB_HERO_BELOW?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_HUB_HERO_BELOW_WIDTH?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_HUB_HERO_BELOW_HEIGHT?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_HUB_HERO_BELOW_SRC?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_FORUM_IN_ARTICLE_1?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_FORUM_IN_ARTICLE_1_WIDTH?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_FORUM_IN_ARTICLE_1_HEIGHT?: string;
  readonly VITE_ADSTERRA_BANNER_SLOT_FORUM_IN_ARTICLE_1_SRC?: string;

  // --- Ad placement efficiency ---
  /** Max ad units per pageview (frequency cap). Default: 4. */
  readonly VITE_AD_UNITS_PER_PAGE?: string;
  /** "1" renders reserved-slot placeholders in production builds (debug only). */
  readonly VITE_ADS_DEBUG_PLACEHOLDERS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
