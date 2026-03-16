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

## Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `refreshAllMlPredictions` | Weekly (Sun 02:00 UTC) | Run predictions for active products |
| `refreshAffiliatePrices` | Every 6 hours | Update affiliate link prices |
| `processTranslationQueue` | Hourly | Translate approved reviews to fr, de, es, pt |
