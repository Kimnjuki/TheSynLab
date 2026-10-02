# External Services – Free & Paid Tiers

All features work **with zero API keys** (free tier). Optional paid/upgraded keys improve quality or enable live external data.

Configure in Convex: **Settings → Environment Variables**.

---

## ML Predictions (S1: Predictive Scores)

| Tier | Variable | Description |
|------|----------|-------------|
| **FREE** | *(none)* | Built-in heuristic uses reviews, trust/integration scores, price. No external calls. |
| PAID | `ML_API_URL` | External ML service (FastAPI/XGBoost). `POST /predict-reliability` with `{ features, productId }`, returns `{ predictedScore, confidence, modelVersion }`. |

---

## Blockchain (S3: Verified Reviews)

| Tier | Variable | Description |
|------|----------|-------------|
| **FREE** | *(none)* | Simulated verification: deterministic SHA-256 hash + local tx ID. Full audit trail, no chain cost. |
| FREE+ | `ALCHEMY_API_KEY` | Alchemy free tier: 30M CUs/month. Sign up at [alchemy.com](https://alchemy.com). Real Polygon submission. |
| FREE+ | `ALCHEMY_FROM_ADDRESS` | Wallet address for chain writes (requires funded wallet for gas). |
| FREE+ | `ALCHEMY_API_URL` | Override RPC URL (default: `https://polygon-mainnet.g.alchemy.com/v2`). |

---

## Translation (S9: Multi-Language)

| Tier | Variable | Description |
|------|----------|-------------|
| **FREE** | *(none)* | MyMemory API – no key. ~5k chars/day. Good quality from EU/UN translation memory. |
| FREE+ | `MYMEMORY_EMAIL` | Email for MyMemory `de` param – raises limit to ~50k chars/day (still free). |
| PAID | `ANTHROPIC_API_KEY` | Claude translation – higher quality, paid per token. |

---

## Affiliate Prices (S10: Dynamic Pricing)

| Tier | Variable | Description |
|------|----------|-------------|
| **FREE** | *(none)* | Uses product base price ± random variance. No external API. |
| PAID | `AFFILIATE_PRICE_API_URL` | Custom price API: `POST /price` with `{ linkId, productId }`, returns `{ price }`. |

---

## Passive revenue: ad networks

| Tier | Variable | Description |
|------|----------|-------------|
| FREE | `VITE_ADSENSE_CLIENT` + `VITE_ADSENSE_SLOT_*` | Google AdSense publisher client and per-slot ad-unit ids. |
| FREE | `VITE_ADSTERRA_NATIVE_KEY` / `_SRC` | Adsterra Native Banner key and loader URL (in-slot). |
| FREE | `VITE_ADSTERRA_BANNER_300X250_KEY` / `_728X90_KEY` | Adsterra Display Banner keys (`atOptions` + `invoke.js`, sandboxed per slot). |
| FREE | `VITE_ADSTERRA_SLOT_*` / `VITE_ADSTERRA_BANNER_SLOT_*` | Per-slot Native/Display Banner overrides (key, width, height, src). |
| FREE | `VITE_ADSTERRA_POPUNDER` / `VITE_ADSTERRA_POPUNDER_SRC` | Site-wide popunder tag (one per document load, content routes only). |
| FREE | `VITE_ADSTERRA_ENABLED=0` | Kill switch for the whole Adsterra network. |
| FREE | `VITE_AD_UNITS_PER_PAGE` | Ad frequency cap per pageview (default 4). |

Full setup, routing and placement rules: [`docs/ADSTERRA_INTEGRATION.md`](./ADSTERRA_INTEGRATION.md).

There is exactly one popunder tag (`VITE_ADSTERRA_POPUNDER`), so a single click can never
open two windows. In-slot units from AdSense and Adsterra coexist.

---

## Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `refreshAllMlPredictions` | Weekly (Sun 02:00 UTC) | Run predictions for active products |
| `refreshAffiliatePrices` | Every 6 hours | Update affiliate link prices |
| `processTranslationQueue` | Hourly | Translate approved reviews to fr, de, es, pt |
