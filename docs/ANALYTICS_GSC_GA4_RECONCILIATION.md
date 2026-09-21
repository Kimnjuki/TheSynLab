# TheSynLab — GSC vs GA4 reconciliation: why GA4 "grew" and Search Console didn't

**Report date:** 2026-09-21 · **GA4 window:** 2026-08-24 → 2026-09-20 (28 days) · **GSC window:** last 7 days (2026-09-13 → 2026-09-19)
**Inputs:** `Reports_snapshot.csv` (GA4 Reports snapshot export) + `https://thesynlab.com_-Performance-on-Search-2026-09-21/` (GSC Performance export: Chart, Queries, Pages, Countries, Devices, Search appearance, Filters)
**Reproduce:** `node scripts/ga4-gsc-reconcile.mjs <GA4.csv> <GSC-folder>`

---

## 0. Verdict in six lines

1. **The two reports do not show the same growth — they cannot, because they measure different universes.** GSC only reports *Google Search*; GA4's growth is **99.96 % `(direct) / (none)`**, a channel Search Console is structurally blind to.
2. GA4 reports **14,047 users / 15,883 sessions / 78,424 events** in 28 days, of which **14,040 first users are direct** and **5 are organic (2 google + 3 bing) = 0.036 %**.
3. GSC reports **1 click / 906 impressions / average position ~34** in 7 days, with impressions **falling** 169 → 104 (−38 %) across the window.
4. The GA4 series is **not human demand**: 0.17 s average engagement per user, 99.7 % of users land on `/` and nowhere else, a 2.5× "growth" step from external supply, two consecutive days at exactly 0 new users mid-month, and a geographic fingerprint made of bot-farm/datacenter cities (New York, Singapore, Tehran, Yalta, Simferopol, Ashburn, Council Bluffs, Secaucus…).
5. **Instrumentation defects in this repository made the reports un-reconcilable even for legitimate traffic** — two GA4 measurement IDs live in the build (AN-1), page views are double-counted (AN-2), `engagement_time_msec: 1` was hand-written into events (AN-3), localhost/dev hits reach the production property (AN-4), and the consent bus is split in two which also silently disabled **every AdSense ad unit** (AN-5).
6. **All of the above are now fixed in code** (§5). The bot traffic itself has to be stopped at the edge + filtered in GA4 (§6) — no client-side change can un-count a bot that runs JavaScript from a residential proxy.

**Answer to "why do the two reports reflect the same growth?"**
They don't. If they *look* like they agree, it is one of these three illusions:

| Illusion | What is really happening |
|---|---|
| "GA4 users grew, GSC impressions grew" | Both are moving in **different** windows/units: GSC impressions are *Google-Search-only* and currently **declining** (−38 % within the week), GA4 users are 99.96 % **direct**. The only genuinely common number — organic — is ~5 users/1 click in both. |
| "Two GA4 reports show the same growth" | Two properties are being populated by one site (AN-1). They trend together (same visits) but their totals never match (one gets SPA page views, the other only initial loads). Two properties sharing one traffic source always look "correlated but unequal". |
| "Growth in both = the growth is real" | Correlation here is **not** confirmation: GA4's growth is unattributable direct traffic that GSC cannot see, and — as §3 shows — every statistical property of that traffic (engagement 0.17 s, homepage-only, day-level cut-offs, datacenter geography) says **bot**, not audience. |

---

## 1. The numbers, reconciled

### 1.1 GA4 property totals (28 days)

| Metric | Value | Derived |
|---|---|---|
| Active users | 14,047 | — |
| New users | 14,197 | 101 % of active users (a pure-arbitrage traffic profile) |
| Sessions | 15,883 | **1.13 sessions / user** |
| Events | 78,424 | **5.58 events / user**, 4.94 events / session |
| Average engagement time per active user | **0.173 s** | humans produce 20–90 s; this is machine-scale |
| Homepage views | 44,116 | 2.78 views / session, **56 % of all events** |
| Homepage title share of users | 14,006 / 14,047 | **99.7 % of all users never leave `/`** |
| Homepage bounce rate | 11.1 % | artefact: every session gets ≥2 page views (see AN-2), so GA4 flags it "engaged" |

### 1.2 GA4 acquisition vs GSC — the reconciliation table

| Channel (GA4, first user) | Users (28 d) | GSC counterpart | GSC (7 d) |
|---|---|---|---|
| `(direct) / (none)` | **14,040 (99.95 %)** | *not reported by Search Console* | — |
| `google / organic` | **2** | Clicks / impressions | **1 click / 906 impressions** |
| `bing / organic` | **3** | (Bing is not in GSC) | — |
| Total | 14,047 | Total | 1 click |

*Session-scoped view is identical: direct 15,877 of 15,883 sessions (99.96 %), organic 6.*

**Reading of this table**

* The organic sub-total of GA4 (5 users) and GSC (1 click, 7 days) are consistent to within the known GSC↔GA4 differences (clicks vs sessions, consent/cookieless, ad-blockers, JS-blocked clients, time-zone edges, different date ranges). **Both reports agree that organic search is ≈ 0.**
* 99.95 % of GA4's traffic has no GSC analogue. Therefore **any GA4 growth metric that includes direct traffic cannot be validated by Search Console at all** — the two reports are not "agreeing", they are describing disjoint traffic.
* GSC's own trend is *down*, not up:

| Date | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| 2026-09-13 | 0 | 169 | 0 % | 36.3 |
| 2026-09-14 | 1 | 165 | 0.61 % | 37.8 |
| 2026-09-15 | 0 | 127 | 0 % | 35.3 |
| 2026-09-16 | 0 | 127 | 0 % | 31.0 |
| 2026-09-17 | 0 | 101 | 0 % | 33.0 |
| 2026-09-18 | 0 | 113 | 0 % | 35.6 |
| 2026-09-19 | 0 | 104 | 0 % | 30.5 |

*Demand (impressions) is trending down inside the week, while GA4 "users" trend up. Two opposite directions — a second proof that the GA4 rise is not search-driven.*

### 1.3 The GA4 "growth" step, day by day (Nth-day table from the export)

| Window | New users | Returning | Share of total |
|---|---|---|---|
| Days 0–13 (Aug 24 – Sep 6) | 4,019 | 285 | 28 % |
| Days 14–27 (Sep 7 – Sep 20) | 10,179 | 1,356 | 72 % |

Sum of new users across the 28 days = **14,198** (matches the report's 14,197 to rounding). So the "growth" is a **2.53× step in the second half of the window** — and it lands *entirely* in the direct channel (organic users are constant at ≈5 for the whole month).

Internal anomalies that no human audience produces:

| Day | New | Returning | Why it matters |
|---|---|---|---|
| 0009 | 0 | 0 | A publication with 700–1,000 daily new users does not drop to literally zero while the week's other days run 670–1,117. |
| 0010 | 0 | 0 | Two consecutive zero-days = the *source* stopped, not the audience. |
| 0011 | 1 | 2 | Restart ramp, one user at a time. |
| 0017 | 40 | 2 | Collapse to 40 then straight back to 827 — a batch job hiccup, not behaviour. |
| 0019–0026 | 665 → 1,117/day | ~100/day | Perfectly stable machine-rate delivery; ~10 % "returning" is cookie-reuse by the same bots. |

---

## 2. Why the two reports can never agree (by design)

| Report | Counting unit | Universe | Bot handling | Consent effect |
|---|---|---|---|---|
| **Search Console** | *Clicks* on a Google result (one per result click, Google Search only) | Google Search (web, by country/device/query/page) | Google removes known bots/self-clicks | None (server-side logs) |
| **GA4** | *Users / sessions / events* measured by a JS tag in the browser | Every client that loads the page and runs JS, from any source | **Only** IAB-list "known bots" are excluded; you cannot see how much was dropped and you cannot turn it on/off ([Google, *Known bot-traffic exclusion*](https://support.google.com/analytics/answer/9888366)) | EEA/UK/CH cookieless pings, blocked tags, consent-mode modelling |

Consequences that apply to this property:

1. **Unit mismatch.** 1 GSC click ≠ 1 GA4 session ≠ 1 GA4 user. GSC clicks that bounce before the tag runs are invisible to GA4; GA4 `(direct)` sessions (bookmarks, apps, QR codes, PDFs, ad blockers stripping referrers) are invisible to GSC. Official `(direct)` causes: missing UTM/referrer, redirects & shorteners stripping parameters, direct URL entry/offline documents, ad blockers ([Google, *Understand (direct)/(none)*](https://support.google.com/analytics/answer/15258820)).
2. **GA4 has no bot filter you control.** Everything that is not on the IAB known-bot list — headless Chrome, render farms, residential-proxy botnets, SEO/uptime/screenshot tools — is counted as a *user*. That is how this property shows 14 k "users" while GSC sees one click.
3. **GSC can never corroborate direct traffic.** "Direct" is definitionally not search, so a direct-channel spike can only be validated with server/WAF logs and GA4 device fingerprints — never with Search Console.

---

## 3. Root cause of the GA4 "growth": automated traffic (evidence-ranked)

### 3.1 The fingerprint

| Signal | Observation | Human-audience expectation |
|---|---|---|
| Traffic source | 99.95 % `(direct) / (none)`, no UTM, no referrer | Mixed: Google, social, referrals, email UTMs |
| Landing page | 99.7 % of users only ever see `/` (44,116 of 44,116 top-title views) | Long-tail content pages (the site has 662 prerendered URLs) |
| Engagement | **0.173 s** average engagement / user | 20–90 s for a review site |
| Views per session | 2.78 — all on the same homepage | Several distinct pages per session |
| New-user ratio | 14,197 new of 14,047 active (101 %) | Returning readership grows through a month |
| Rate stability | ~700–1,100/day, near-identical daily, interrupted by exactly-0 days | Weekly rhythm (weekend dips), news spikes |
| Catalogue coverage | `sitemap.xml` = 735 URLs; GSC shows impressions for ~64 pages | Crawlers fan out across the catalogue |
| Geography | New York 2,304 · Singapore 1,175 · **Tehran 1,148** · Warsaw 301 · Simferopol 279 · Yalta 172 · Moscow 213 · Ashburn 38 · Council Bluffs 6 · Mountain View 73 · Secaucus 6 · Piscataway 2 · Santa Clara 13 · Tukwila 17 (plus dense Japan/Korea/Taiwan/Indonesia/Pakistan/Bangladesh/Brazil tails and an ungeolocated `69125` bucket) | Traffic geography should mirror the *search* geography |

**Geo cross-check (the decisive test).** GA4 reports 1,175 users from Singapore and 1,148 from Tehran. GSC's country report — real Google Search demand — shows **Singapore: 2 impressions; Iran: absent entirely**. Conversely the United States is 645 of 906 GSC impressions but only ~4,200 of 14,047 GA4 users. **The two geographies are essentially disjoint**, so the GA4 volume is neither search traffic nor an audience that also searches for these topics.

### 3.2 Hypotheses, ranked, with the test that decided each

| # | Hypothesis | Verdict | Evidence / test |
|---|---|---|---|
| **H1** | **Automated traffic (botnet / render farm / paid "SEO traffic" service) hitting the homepage** | **ACCEPTED (primary cause)** | 0.17 s engagement, homepage-only, 99.95 % direct, exact-zero days, machine-rate stability, datacenter + residential-proxy geography, ~10 % cookie-reuse "returning", no GSC counterpart. |
| H2 | A second GA4 property is mixing another site's data in (copied/leaked template measurement ID) | **REJECTED** | If another site fired this ID, its titles would appear under "Page title and screen class". 44,116 of 44,116 views carry TheSynLab titles; the largest non-homepage title is 86 views. The tag fires **only** on our pages. |
| H3 | Cross-domain hits: the tag runs on extra hosts (Lovable preview / staging / IP) sharing the property | **Possible — must be excluded by hand** | Check GA4 → Engagement → *Pages and screens* with the **Hostname** dimension (plus *Tech details → Platform/device*). Our `og:image` still points at a `…lovable.app` preview CDN, so an old preview may still be live. If foreign hostnames appear: **Admin → Data collection → Data filters → Web hostname traffic**. |
| H4 | Internal/QA traffic (localhost, staging, repeated manual testing) | **Not the main driver, but real** | It cannot produce Tehran/Yalta/Singapore volumes; the dev-host leak *is* real (AN-4) and is now gated in code. |
| H5 | Googlebot/other crawlers inflating the tag | **REJECTED** | Googlebot does not fetch `google-analytics.com` and known bots are excluded anyway; search-crawler activity appears in GSC, which is ~900 impressions/week — three orders of magnitude below 44 k page views. |
| H6 | Ad blockers / attribution stripping turning real organic into `(direct)` | **REJECTED** | Cannot produce 44 k homepage loads at 0.17 s, and GSC clicks would still be ≥ the GA4 organic count. |
| H7 | Consent-mode modelling / cookieless pings inflating users | **Not the cause here; a live risk going forward** | There was **no consent default at all** before this fix (AN-6), so no modelling occurred. After the fix, keep in mind that `analytics_storage: denied` identifies a client per page load — one reason denial is scoped to EEA/UK/CH only. |

### 3.3 The instrumentation bugs that also made the metrics untrustworthy

Independently of the bot traffic, these defects would have distorted any report:

* **Double page views (AN-2):** GA4 sends `page_view` automatically on load **and on browser-history changes**, while `RouteTracker` sent a second one on mount and on every navigation through react-ga4. Google's own guidance is to disable automatic page views before sending manual ones *"to avoid duplicate pageviews"* ([Measure pageviews](https://developers.google.cn/analytics/devguides/collection/ga4/views)). Duplicated views inflate "Views", **deflate "Bounce rate"** (2 views ⇒ "engaged") and corrupt views/session — exactly the export's pattern: 11 % bounce with 0.17 s engagement.
* **`engagement_time_msec: 1` (AN-3):** `useViewTracking` attached a hardcoded 1 ms engagement to every `content_view`/conversion event, overriding GA4's automatic measurement ([User engagement](https://support.google.com/analytics/answer/11109416)). `0.17348900121022282` is the signature of that override, not of visitor behaviour.
* **Two properties (AN-1):** `index.html` shipped `G-NC8K7M5LRX`, while `src/lib/analytics.ts` initialised react-ga4 with `VITE_GA4_MEASUREMENT_ID=G-XMGRJBSN5Y`; the build plugin's `%VITE_GA4_MEASUREMENT_ID%` placeholder no longer existed in `index.html`, so the Coolify build arg had **no effect**. Every SPA navigation was recorded in a *different property* than the one that produced this export ⇒ "same trend, different totals" whenever two GA4 screenshots are compared.
* **No consent default (AN-6):** Consent Mode `default` was never sent before `config`, so the tag started with storage granted in the EEA — a Google-policy/GDPR problem *and* the reason the tag fired for every bot before consent was possible.
* **Broken consent bus (AN-5):** the mounted banner (`CookieBanner`) published to its own storage key, while `AnalyticsScripts`, `AdSlotProvider` and the footer button listened on `@/lib/consent`, which nothing ever emitted. Effects: Ahrefs/GTM never loaded, **`canLoadAds` stayed `false` so every `<AdSlot>` rendered a placeholder instead of a real ad unit (silent 100 % ad-revenue loss)**, and the footer "Cookie Settings" button did nothing.
---

## 4. Defect register (everything found, with impact)

| ID | Defect | Location (before fix) | Measurable impact | Status |
|---|---|---|---|---|
| **AN-1** | Two GA4 measurement IDs in one build; the build placeholder was missing so the env var was dead | `index.html` (hardcoded `G-NC8K7M5LRX`) vs `src/lib/analytics.ts` (react-ga4 → `VITE_GA4_MEASUREMENT_ID=G-XMGRJBSN5Y`) vs `vite.config.ts` `injectGa4Plugin` fallback `G-TJ1VXE91NE` | One session counted in two properties; SPA page views never reached the property in this export; two GA4 screenshots always disagree ⇒ the "two reports, same growth" illusion | **Fixed** (single injected ID + build-time guard) |
| **AN-2** | Manual `page_view` on mount **and** every navigation, on top of GA4's automatic load *and* history-change page views | `src/App.tsx` `RouteTracker` → `trackPageView` → `ReactGA.send({hitType:"pageview"})` | Inflated Views (2.78/session), artificially low bounce rate (11.1 %), broken views/session | **Fixed** (landing URL deduped; only unseen SPA routes are sent) |
| **AN-3** | Hand-written `engagement_time_msec: 1` on `content_view` and conversion events | `src/hooks/useViewTracking.ts` (2 call sites) | Average engagement time collapsed to 0.17 s across the whole property; every engagement report invalid | **Fixed** (parameter removed; helper forbids it) |
| **AN-4** | Dev/localhost and automated clients hit the production property | `index.html`, `src/main.tsx` `initGA()` | QA traffic and headless renders counted as users | **Fixed** (local hosts + bot UAs gated at the tag loader; all helpers no-op when inactive) |
| **AN-5** | Split consent bus: mounted banner never emitted the canonical consent event | `src/components/CookieBanner.tsx` vs `src/lib/consent.ts`, consumed by `AnalyticsScripts.tsx`, `AdSlotProvider.tsx`, `Footer.tsx` | Ahrefs/GTM never loaded; **every `<AdSlot>` rendered a placeholder (`canLoadAds` always false) = 100 % ad-revenue loss**; footer "Cookie Settings" dead; ads/marketing consent never propagated | **Fixed** (banner now emits canonical consent; footer button opens the sheet) |
| **AN-6** | No Consent Mode v2 `default` before `config` | `index.html` | Storage granted by default in EEA/UK/CH (GDPR/DMA + AdSense policy exposure); bots were cookied pre-consent | **Fixed** (regional default denied + global ad denial) |
| **AN-7** | `react-ga4` initialised a second gtag instance and `cookie_flags: "SameSite=None;Secure"` (a UA-era flag) | `src/lib/analytics.ts` | Duplicate `js`/`config` calls, cross-site cookie flag on GA4 cookies | **Fixed** (module now wraps the single tag; dependency left installed but unused) |
| **AN-8** | Two competing CMP components and two consent schemas | `src/components/CookieConsent.tsx` (unmounted but listened for the footer's `open-cookie-settings` event) vs `src/components/CookieBanner.tsx` | Dead code path, inconsistent consent state, confusion for every future reader | **Partially fixed** (banner handles the event + canonical schema; file left in place — see §8) |
| **AN-9** | `(window as any).gtag` used in three modules (`no-explicit-any` risk, no bot/consent gating) | `src/hooks/useViewTracking.ts`, `src/lib/abTest.ts` | Events bypassed every guard; typed API drift | **Fixed** (all go through `@/lib/analytics`) |
| **AN-10** | `nginx.conf` per-location `add_header` blocks silently drop the server-level security headers (HSTS, Referrer-Policy, Permissions-Policy, CSP) because a nested `add_header` disables inheritance — and the CSP itself is missing `pagead2.googlesyndication.com`, Clerk API origins and regional analytics endpoints | `nginx.conf` (`location /`, `/blog`, `/hub`, `/products`, `/tools/*`) | Security headers absent on the pages that matter; if the CSP were applied as written it would block AdSense and possibly auth/analytics calls | **Documented, deliberately not applied** — see §8 (needs a CSP rewrite first) |
| **AN-11** | `VITE_NVIDIA_API_KEY` has a real default value committed in the Dockerfile | `Dockerfile` | Secret is in git history; rotate and move to a build secret | **Flagged** — see §8 |

---

## 5. Fixes applied in this change set

| File | Change | Why |
|---|---|---|
| `index.html` | Google tag block rewritten: `%VITE_GA4_MEASUREMENT_ID%` placeholder instead of a hardcoded ID; tag loader skips automated clients (`navigator.webdriver`, crawler/render-tool UAs) and local/private hosts; Consent Mode v2 `default` (EEA/UK/CH denied, RoW analytics granted, ads denied everywhere) sent **before** `config`; the tag JS is appended dynamically so nothing is fetched for gated clients | AN-1, AN-4, AN-6 |
| `src/lib/analytics.ts` | Rewritten as a thin, typed wrapper over the single tag: no react-ga4, no second `config`, no `cookie_flags` misuse; `isAnalyticsEnabled()` gate on every helper; `trackPageView()` skips the landing URL (already counted by the automatic page view) and dedupes repeats; `trackEvent()` can never carry `engagement_time_msec` | AN-1, AN-2, AN-3, AN-4, AN-7 |
| `src/hooks/useViewTracking.ts` | `engagement_time_msec: 1` removed; events routed through `trackEvent`; `any` casts removed; storage access wrapped in try/catch; empty slugs ignored | AN-3, AN-9 |
| `src/lib/abTest.ts` | `(window as any).gtag` replaced with the shared helper + typed `dataLayer` push | AN-9 |
| `src/components/CookieBanner.tsx` | Publishes consent to the canonical bus (`emitConsentUpdated`) with the canonical flag schema; emits the denied default on first visit; listens for `open-cookie-settings` so the footer button works; duplicate global `Window.gtag` declaration removed (declared once in `lib/analytics.ts`) | AN-5, AN-8 |
| `vite.config.ts` | `injectGa4Plugin` now validates the ID format and **throws** if `index.html` stops containing the placeholder; fallback corrected from `G-TJ1VXE91NE` to the property documented in `.env.example` | AN-1 (build-time guard) |
| `.env`, `.env.example` | One documented measurement ID (`G-NC8K7M5LRX`, property 531573397) with an explicit "change all three places together" instruction | AN-1 |
| `scripts/ga4-gsc-reconcile.mjs` | New: parses the GA4 snapshot export + the GSC folder and prints the reconciliation (channel mix, organic share, daily GA4 trend, GSC trend, bot fingerprint) so the analysis here is reproducible | tooling |
| `docs/ANALYTICS_GSC_GA4_RECONCILIATION.md` | This document | evidence |

> **Decision required by the owner:** this change set makes `G-NC8K7M5LRX` (property 531573397) the single property — the tag that was actually deployed, i.e. the one behind the attached report. If the intended property is the other ID that sat in `.env` (`G-XMGRJBSN5Y`), change it in **all three** places (`.env`, `.env.example`, `GA4_FALLBACK_ID` in `vite.config.ts`) and ignore the other property, so exactly one property ever receives data.

---

## 6. Still required — actions that cannot be done in code

### 6.1 Verify the bot hypothesis (≈5 minutes in the GA4 UI)

1. **Reports → Engagement → Pages and screens** → add **Hostname** as a secondary dimension, plus a comparison for `Session default channel group = Direct`.
2. **Reports → Tech → Tech details** → check *Platform / device category / browser / operating system / screen resolution*. Headless Chrome looks like "desktop · Chrome · 1280×720 · Linux".
3. **Reports → User attributes → Demographics details (City)** → confirm the datacenter/hostile-network pattern.
4. **Reports → Engagement → Events** → confirm which events carry the volume (`page_view`, `scroll`, `click`); a render-only bot produces `page_view` + `scroll` and nothing else.
5. **Realtime sanity check:** run a headless render yourself — `npx lighthouse https://thesynlab.com --only-categories=performance --chrome-flags="--headless=new"` — and confirm it no longer shows up in Realtime (the new loader blocks `lighthouse`/headless UAs by design).
6. **Server logs** (strongest proof, on the host):
   `docker logs <nginx-container> --since 24h | awk '{print $1, $12, $13}' | sort | uniq -c | sort -rn | head -40`
   Look for one range hitting `/` hundreds of times with bot UAs, or thousands of distinct IPs hitting `/` once each (botnet).
7. **AdSense → Ad serving → Invalid traffic:** monitor the same window. 44 k ad-bearing bot page views are an **invalid-traffic risk to the AdSense account**, not just a reporting nuisance.

### 6.2 Filter / stop the traffic

| Layer | Action | Notes |
|---|---|---|
| Edge (best) | Put Cloudflare (or the Coolify proxy) in front; enable **Bot Fight Mode / WAF rules** blocking headless and datacenter ASNs on `/` | A distributed botnet cannot be stopped with per-IP limits; only the edge removes it *before* it becomes an ad request |
| nginx | Add `limit_req_zone` + `limit_req` for `location = /` — the zone must be declared in the `http {}` context, so it belongs in the container's `http` include, not this server block | Slows floods from single IPs; does not stop distributed traffic |
| GA4 | **Admin → Data collection and modification → Data filters → Internal traffic** (own/staging IPs), **Developer traffic** (debug mode), **Web hostname traffic** (any non-`thesynlab.com` host) | Filters apply to future data only and cannot be undone ([Data filters](https://support.google.com/analytics/answer/10108813)) |
| GA4 reporting | Build an Exploration `Real users` = sessions where `Session default channel group ≠ Direct` **or** engagement time ≥ 10 s; a second one excluding pure-datacenter cities | Honest numbers while the edge work lands |
| GA4 | Add an **annotation** on 2026-09-07 ("direct-traffic anomaly begins") | So the spike is never again mistaken for growth |

### 6.3 Align GA4 property settings with the new tag

1. **Admin → Data streams → (web stream) → Enhanced measurement → ⚙️ → "Page changes based on browser history events": leave ON.** GA4's automatic page views are now the primary source; the client helper only adds page views it has not sent, so double counting is impossible either way.
2. **Admin → Mark as key events:** mark the funnel events the code already emits — `affiliate_click`, `pricing_link_click`, `email_signup`, `stack_builder_completed`, `comparison_started`, `content_view` (the Admin growth checklist still lists this as open).
3. **Data retention → 14 months** so next year's year-over-year comparison is possible.
4. **Internal traffic filter** for the office/home IP and any staging IP.
5. Keep `send_page_view: true` on the single `config` call and never add a second `config` for the same property anywhere in code.

---

## 7. Verification runbook

```bash
# 1. Reconcile the exports (reproduces every number in §1)
node scripts/ga4-gsc-reconcile.mjs \
  "../Downloads/Reports_snapshot.csv" \
  "../Downloads/https___thesynlab.com_-Performance-on-Search-2026-09-21"

# 2. Prove the build no longer ships two GA4 properties / a stale ID
npm run build
grep -o "G-[A-Z0-9]\{8,\}" dist/index.html | sort | uniq -c   # expect exactly one ID, twice (config + script URL)
grep -c "%VITE_GA4_MEASUREMENT_ID%" dist/index.html            # expect 0 (placeholder substituted)

# 3. Prove the prerendered pages kept their SEO contract
node scripts/seo-crawl-audit.mjs                               # expect "✅ No problems found."
```

In the browser, after deploy:

| Check | Expected |
|---|---|
| DevTools → Console on `https://thesynlab.com` | `window.__tslGaActive === true` |
| DevTools → Network → filter `gtag` | one request to `googletagmanager.com/gtag/js?id=G-…`; one `collect` per page view, **not two for the same URL** |
| Navigate `/ → /blog → /tools`, then check `Reports → Realtime` | exactly one `page_view` per URL (no duplicates) |
| `Reports → Engagement → Pages and screens` after 24–48 h on a consented browser | views/session ≈ distinct pages visited; engagement time in seconds-to-minutes, not 0.17 s |
| `Reports → Tech → Tech details` on a Lighthouse run | **no new session** appears (headless is gated out) |
| Cookie banner → *Accept All* → reload | Consent Mode update fires (`ad_storage: granted`), Ahrefs script appears in `<head>`, ad slots contain `<ins class="adsbygoogle">` instead of the "Advertisement" placeholder |

---

## 8. Residual risks & deliberately unfixed items

1. **AdSense ad units were rendering placeholders (AN-5).** Fixed in code, but only effective on the next deploy — check `AdSlot` output and AdSense *Ad serving → Requests* after deploying; if requests do not appear, verify `VITE_ADSENSE_CLIENT` / `VITE_ADSENSE_SLOT_*` are set as build args (they are optional in `.env` and unset in this checkout).
2. **`nginx.conf` header inheritance (AN-10).** A nested `add_header` cancels the server-level headers, so HSTS/Referrer-Policy/Permissions-Policy/CSP are not sent on `/`, `/blog`, `/hub`, `/products`, `/tools/*`. Do **not** simply re-add the current CSP: it is missing `pagead2.googlesyndication.com` (AdSense), Clerk API origins (auth) and regional GA endpoints (`region1.google-analytics.com`). Rewrite the CSP to a known-good policy, put it in an `include`d snippet, then apply it in every location.
3. **`src/components/CookieConsent.tsx` is dead code** (never imported) and duplicates the banner with a different schema. Left in place because deleting it is outside this analytics fix; the mounted `CookieBanner` now handles the event it used to serve. Recommend deleting it in a follow-up so only one CMP exists.
4. **`react-ga4` is still a dependency** but no longer imported; remove it on the next dependency refresh (removing it here would require regenerating `package-lock.json` / `bun.lock`).
5. **`VITE_NVIDIA_API_KEY` default in `Dockerfile` (AN-11):** a live key is committed. Rotate it and inject it as a build secret only.
6. **GSC side:** the docs reference `www.thesynlab.com/sitemap.xml` while the property is apex. After the next deploy re-submit `https://thesynlab.com/sitemap.xml` and use **URL Inspection → Request indexing** on the five pages with real demand (`/blog/choose-clickup-vs-asana`, `/blog/best-socialpilot-alternatives-2026`, `/blog/password-manager-comparison`, `/tool/opensign`, `/blog/alexa-vs-google-home-privacy-comparison`) — they sit at positions 8–45, the cheapest wins available.
7. **The reports will still not be equal after this fix — and they should not be.** Once bots are filtered, expect GA4 organic sessions ≈ GSC clicks ±10–20 % (clicks vs sessions, consent, blocking, time-zone edges). Anything larger means a new instrumentation defect, not a new audience.

---

## Appendix A — measured daily GA4 new/returning users (Nth-day export)

```
day  new  ret      day  new  ret      day  new  ret      day  new  ret
 00    0    2       07  671   60       14  447   74       21 1006  118
 01    0    1       08  388   49       15  703  104       22  738  107
 02    3    1       09    0    0       16  970  118       23 1117  125
 03  393    1       10    0    0       17   40    2       24  882  127
 04  272    2       11    1    2       18  232   21       25  819  127
 05  859   19       12  279   42       19  827  123       26  878  111
 06  767   51       13  386   55       20  665  101       27  855   98
```

## Appendix B — sources

* Google Analytics Help — [Understand (direct) / (none) traffic](https://support.google.com/analytics/answer/15258820)
* Google Analytics Help — [Known bot-traffic exclusion](https://support.google.com/analytics/answer/9888366) (IAB list only; not configurable, and you cannot see what was excluded)
* Google Analytics Help — [User engagement](https://support.google.com/analytics/answer/11109416) (`engagement_time_msec` is measured, not set by the site)
* Google Analytics Help — [Data filters](https://support.google.com/analytics/answer/10108813) (internal / developer / hostname)
* Google Analytics Developers — [Measure pageviews](https://developers.google.cn/analytics/devguides/collection/ga4/views) (automatic page views on load *and* history change; disable before sending manual ones)
* Google Analytics Developers — [Measure single-page applications](https://developers.google.cn/analytics/devguides/collection/ga4/single-page-applications) ("without virtual page views … Google Analytics treats the SPA as a single page, leading to skewed metrics")
* Google Analytics Developers — [Measure sessions and user engagement](https://developers.google.cn/analytics/devguides/collection/ga4/sessions) (engagement by tab visibility; raise the session timeout instead of scripting around it)








