/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL?: string;
  readonly VITE_PUBLIC_SITE_URL?: string;
  readonly VITE_GTM_CONTAINER_ID?: string;
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly VITE_AMAZON_ASSOCIATES_TAG?: string;
  readonly VITE_ADSENSE_CLIENT?: string;
  readonly VITE_ADSENSE_SLOT_REVIEW_SIDEBAR?: string;
  readonly VITE_ADSENSE_SLOT_HOME_LEADERBOARD?: string;
  readonly VITE_ADSENSE_SLOT_COMPARE_INLINE?: string;
  readonly VITE_ADSENSE_SLOT_COMPARE_SIDEBAR?: string;
  readonly VITE_ADSENSE_FALLBACK_WITHOUT_DB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
