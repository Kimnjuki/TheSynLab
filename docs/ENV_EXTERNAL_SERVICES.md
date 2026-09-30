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
| FREE | `VITE_ADNIUM_SITE_KEY` | Adnium publisher key (`ADN55c88d9c53ef4`). Public; also emitted as a verification meta tag. |
| FREE | `VITE_ADNIUM_ZONE_ID` / `_PID` / `_SID` / `_TYPE` / `_SLOT_TYPE` | Site-wide Adnium zone and in-slot zone type. Empty zone id ⇒ no tag is injected. |
| FREE | `VITE_ADNIUM_SLOT_*` | Per-slot Adnium zones that backfill unfilled AdSense slots. |
| FREE | `VITE_ADNIUM_TRIGGER_CLASSES` | Non-navigation CSS classes allowed to fire a popunder (keeps the tag AdSense-compliant). |
| FREE | `VITE_ADNIUM_TAG_URL` | Verbatim Adnium tag URL override (`{id} {pid} {sid} {type} {width} {height} {key} {random}`). |
| FREE | `VITE_AD_UNITS_PER_PAGE` | Ad frequency cap per pageview (default 4). |
| FREE | `VITE_ADNIUM_ENABLED=0` / `VITE_ADNIUM_POPUNDER=0` | Kill switches for the whole network / for the popunder only. |

Full setup, routing and placement rules: [`docs/ADNIUM_INTEGRATION.md`](./ADNIUM_INTEGRATION.md)
and [`docs/ADSTERRA_INTEGRATION.md`](./ADSTERRA_INTEGRATION.md).

The two popunder tags are mutually exclusive: `VITE_POPUNDER_NETWORK`
(`adsterra` · `adnium` · `both` · `none`, default `adsterra`) decides which one runs, so a
single click can never open two windows. In-slot units from all three networks coexist.

---

## Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `refreshAllMlPredictions` | Weekly (Sun 02:00 UTC) | Run predictions for active products |
| `refreshAffiliatePrices` | Every 6 hours | Update affiliate link prices |
| `processTranslationQueue` | Hourly | Translate approved reviews to fr, de, es, pt |
