# Adnium ad platform — integration & placement rules

Adnium is the second demand source next to Google AdSense. Everything about the
integration lives in one place:

| Concern | File |
|---|---|
| Key, zones, tag URL builder, route guard | `src/lib/adnium.ts` |
| Site-wide popunder tag (consent-gated) | `src/components/ads/AdniumScript.tsx` |
| In-slot unit (routing + lazy load + viewability) | `src/components/ads/AdSlot.tsx` |
| Consent state shared with the slots | `src/components/ads/AdSlotProvider.tsx` |
| Consent bus / CMP | `src/lib/consent.ts`, `src/components/CookieBanner.tsx` |

## 1. Publisher key

```
ADN55c88d9c53ef4
```

Three places, all public:

1. **`public/adn_verify.txt`** → served at `https://thesynlab.com/adn_verify.txt`.
   **This is what Adnium's verifier actually reads** — it fetches the file at the domain
   root and compares the body against the key it issued. The file must be exactly the 16
   bytes `ADN55c88d9c53ef4`: no BOM, no trailing newline. Vite copies `public/` to `dist/`
   verbatim, so the file ships with every build.
2. `index.html` → `<meta name="adnium-site-verification" content="ADN55c88d9c53ef4">`
   (present in the prerendered HTML; belt-and-braces for the crawler).
3. `VITE_ADNIUM_SITE_KEY` → appended as `key=` on every Adnium tag
   (`src/lib/adnium.ts`, fallback constant `ADNIUM_KEY_FALLBACK`).

> **Failure mode worth knowing (this actually broke verification once):**
> without step 1, `https://thesynlab.com/adn_verify.txt` fell through to the SPA fallback
> and returned **HTTP 200 with `Content-Type: text/html`** — the homepage. A status-only
> check looks like success, so the submission silently failed. `nginx.conf` therefore has
> an exact-match `location = /adn_verify.txt` that sets `default_type text/plain` and
> `try_files $uri =404`, so a missing file is a *real* 404 instead of a masked one.

If Adnium issues a replacement key, change **`public/adn_verify.txt` +
`VITE_ADNIUM_SITE_KEY` + the meta tag + `.env.example`** together, keeping the file
BOM-free and newline-free. Never hardcode it a second time in a component.

## 2. Where the tag goes

Two placements, both driven by build-time env vars:

| Placement | Env vars | Behaviour |
|---|---|---|
| Site-wide popunder | `VITE_ADNIUM_ZONE_ID`, `VITE_ADNIUM_ZONE_PID`, `VITE_ADNIUM_ZONE_SID`, `VITE_ADNIUM_ZONE_TYPE=4`, `VITE_ADNIUM_TRIGGER_CLASSES` | `AdniumScript` injects one tag into a hidden container in `<body>` after advertising consent. |
| In-slot backfill | `VITE_ADNIUM_SLOT_<SLOTNAME>`, `VITE_ADNIUM_SLOT_TYPE` (default `1` banner, `3` = in-page push) | `AdSlot` renders `<div id="adn-<zoneId>">` and mounts the zone tag inside it, lazily. Slot names mirror the AdSense map: `REVIEW_SIDEBAR`, `HOME_LEADERBOARD`, `COMPARE_INLINE`, `COMPARE_SIDEBAR`, `HUB_HERO_BELOW`, `FORUM_IN_ARTICLE_1`. |

`VITE_ADNIUM_ZONE_ID` **empty means no popunder is injected** — the integration is
present, wired and safe, but inert until a zone id exists. Same for the in-slot vars.

### Custom / non-popunder zones

If Adnium hands you a tag that is not the popunder endpoint (in-page push, native,
interstitial), paste it verbatim into `VITE_ADNIUM_TAG_URL` with placeholders:

```
VITE_ADNIUM_TAG_URL=https://a.adnium.com/…?id={id}&pid={pid}&sid={sid}&tid={type}&w={width}&h={height}&key={key}&r={random}
```

Supported placeholders: `{id}` `{pid}` `{sid}` `{type}` `{width}` `{height}` `{key}`
`{random}`. When unset, the builder emits Adnium's published popunder endpoint:

```
https://a.adnium.com/popunder?fpt=1&ctu=1&tu=1&r=<rand>&id=<zone>&pid=<pid>&sid=<sid>&tid=<type>&w=<w>&h=<h>&key=ADN…
```

## 3. Google-compliance: `data-trigger-classes`

Adnium's own documentation ("Popunder code trigger class solution") is explicit that
popunders should be restricted to clicks on **non-navigation** elements, otherwise the
tag risks the Google/AdSense policy on the same property. Set:

```
VITE_ADNIUM_TRIGGER_CLASSES=article-body review-card product-thumb
```

…using real classes from this codebase, then let Adnium verify the placement. The list is
emitted as `data-trigger-classes` on both the site-wide tag and the in-slot tags. Leaving
it empty falls back to Adnium's default scope, which is the riskier setting.

## 4. Placement & efficiency rules enforced in code

`AdSlot` is the single choke point; it enforces, in order:

1. **Consent first** — nothing is requested until `advertisingCookies` is true
   (`useAdConsent`). No consent ⇒ the slot renders nothing at all.
2. **Per-pageview budget** — `VITE_AD_UNITS_PER_PAGE` (default 4,
   `src/hooks/useAdSlotBudget.ts`). Slots claim budget in mount order, idempotently
   (StrictMode/re-mount safe). Protects average viewability on long pages.
3. **Content threshold** — `minContentLength` on the Convex `adSlotConfigs` row; slots
   never render next to thin content.
4. **Lazy load** — `useElementInView` (300 px rootMargin) only requests the unit when it
   is genuinely approaching the viewport: fewer wasted requests, less main-thread work,
   better LCP/TBT on mobile.
5. **Viewability-based impressions** — the audit impression is logged after 50 % of the
   unit has been visible for 1 s (IAB), so `adComplianceAuditLog` counts what was
   actually seen instead of what was mounted. Metadata records
   `{ iabFormat, position, network, adniumZone, viewable }`.
6. **Network routing** — `adSlotConfigs.adNetworkTag`:
   `adsense` → AdSense if configured, else Adnium backfills;
   `adnium` → Adnium only; unset → AdSense first, Adnium as backfill.
7. **Layout stability** — the reserved IAB height is kept while the unit loads (no CLS),
   and in production a slot with no fill renders **nothing** rather than the old visible
   "Reserved ad slot" box (`VITE_ADS_DEBUG_PLACEHOLDERS=1` restores it for layout work).

Also fixed as part of this work: `AdSlotProvider` used to append a *second*, client-less
`adsbygoogle.js` because it matched the loader by full `src` (including `?client=…`).
It now matches by prefix and reuses the tag shipped in `index.html`.

## 5. Infrastructure touch-points

The Adsterra integration (`docs/ADSTERRA_INTEGRATION.md`) reuses this module's patterns and
shares `src/lib/adNetworks.ts` with it. Two popunder tags are never live at once — see §4
there and `VITE_POPUNDER_NETWORK` below.

- **`nginx.conf`** — CSP `script-src`, `connect-src` and an explicit `frame-src` now
  allow `pagead2.googlesyndication.com`, `tpc.googlesyndication.com`,
  `googleads.g.doubleclick.net` and `a.adnium.com`. Without `frame-src` the policy fell
  back to `default-src 'self'` and silently blocked every ad frame.
- **`index.html`** — `preconnect` + `dns-prefetch` to `a.adnium.com` so the tag's TCP/TLS
  handshake overlaps first paint.
- **`Dockerfile`** — every `VITE_ADNIUM_*` var is an `ARG` → `ENV` so Coolify build
  arguments reach Vite. `VITE_ADNIUM_SITE_KEY` has a committed default;
  `VITE_ADNIUM_POPUNDER` defaults to `0` in container builds (opt in explicitly).
- **`src/vite-env.d.ts`** — typed env surface (no `any`).

## 6. Verification checklist

```bash
npm run build            # must stay green

# THE decisive check — must be 200, text/plain, and exactly "ADN55c88d9c53ef4":
curl -i https://thesynlab.com/adn_verify.txt
#   NOT "text/html" → the SPA fallback is masking a missing file; re-check public/
#   NOT 404 → public/adn_verify.txt is missing from the image; rebuild

# then, with advertising cookies accepted:
#   • DevTools → Network: one a.adnium.com request per page, only after consent
#   • DevTools → Elements: <meta name="adnium-site-verification" content="ADN55c88d9c53ef4">
#   • Convex dashboard → adComplianceAuditLog: rows carry network + viewable: true
```

## 7. Open items / caveats

- **AdSense + popunder policy.** Adnium provides popunder/redirect inventory. Keep
  `VITE_ADNIUM_TRIGGER_CLASSES` narrow and monitor the AdSense policy centre; if a
  violation appears, set `VITE_ADNIUM_POPUNDER=0` (keeps in-slot backfill only) or
  `VITE_ADNIUM_ENABLED=0`.
- **Publisher ids disagree in the repo.** `index.html` loads AdSense with
  `ca-pub-9278124025449370`, `public/ads.txt` declares `pub-1213461321881454`, and
  `AdSlot` reads `VITE_ADSENSE_CLIENT` (unset ⇒ the `<ins>` units never render). One
  publisher id across those three is required before AdSense units can serve.
- **`public/ads.txt`** — add an Adnium line only if the Adnium dashboard reports one for
  this site; do not invent entries (a wrong line can invalidate the whole file).
- **`TheSynLab-deploy/`** is a separate git submodule; these changes are not mirrored
  there.

