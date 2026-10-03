# Adsterra ad platform — integration & placement rules

Adsterra is the second demand source in the ad stack (after Google AdSense).
Everything about it lives in one place:

| Concern | File |
|---|---|
| Keys, srcs, unit resolution, tag mounting | `src/lib/adsterra.ts` |
| Shared policy (route guard, consent gating) | `src/lib/adNetworks.ts` |
| Site-wide popunder tag (consent-gated) | `src/components/ads/AdsterraScript.tsx` |
| In-slot units — Native Banner *and* Display Banner (routing, lazy load, viewability) | `src/components/ads/AdSlot.tsx` |
| One unit per key per pageview | `src/hooks/useAdUnitClaim.ts` |

## 1. The three tags

### Native Banner (in-slot)

```html
<script async="async" data-cfasync="false"
        src="https://pl31590134.profitableratecpmnetwork.com/6c361a6751ca12f38bc29d1189826773/invoke.js"></script>
<div id="container-6c361a6751ca12f38bc29d1189826773"></div>
```

Two consequences of that contract, both handled in code:

1. **The container id is part of the contract.** Adsterra looks up `#container-<KEY>`, so
   `AdSlot` renders that element itself (with the reserved IAB height, so there is no CLS)
   rather than letting the network inject one. Only one slot may own a given key — see §3.
2. **`data-cfasync="false"` is mandatory.** Without it Cloudflare Rocket Loader rewrites the
   tag and the unit never fills. It is set on every tag this module creates.

### Display Banner (in-slot, sandboxed iframe) — CURRENTLY DISABLED

> 2026-10-03 reinstall: the account only has the Native Banner + Popunder tags
> above. The numeric ids `31489400` / `31489635` are those units' dashboard ids —
> **not** `atOptions` Display Banner keys. They were previously wired as banner
> fallbacks, which made `review_sidebar` and `hub_hero_below` render
> `highperformanceformat.com` iframes with keys that never fill (blank boxes). The
> banner path is kept in code but has **no committed key**: it activates only when
> an explicit env key is set (`VITE_ADSTERRA_BANNER_SLOT_*` or sized
> `VITE_ADSTERRA_BANNER_300X250_KEY` / `VITE_ADSTERRA_BANNER_728X90_KEY`). To
> re-enable, paste the real snippet from Adsterra → Websites → Banner code:
>
> ```html
> <script type="text/javascript">
>   atOptions = { 'key' : '<BANNER_KEY>', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };
> </script>
> <script type="text/javascript"
>         src="https://www.highperformanceformat.com/<BANNER_KEY>/invoke.js"></script>
> ```
>
> Until then every slot falls through to the Native Banner div above.

Unlike the Native Banner there is **no container div** — the loader reads the global
`atOptions`, which collides when two units share one React SPA pageview. `AdSlot`
therefore never injects this tag into the main document: `buildAdsterraBannerSrcDoc()`
renders the exact dashboard snippet (`atOptions` + `invoke.js`, with
`data-cfasync="false"`) into an **isolated `srcdoc` iframe, one per slot**, sandboxed
(`allow-scripts allow-popups allow-popups-to-escape-sandbox`, no `allow-same-origin`).
Which format a slot renders is decided by size match + `VITE_ADSTERRA_SLOT_*_PREFER`
(see §2): a 300×250 slot gets the `31489400` banner, a 728×90 slot the `31489635`
leaderboard, anything else keeps the Native Banner div.

### Popunder (site-wide)

```html
<script src="https://pl31589899.profitableratecpmnetwork.com/43/2b/19/432b19cb46f5e384280a7ece2773593a.js"></script>
```

Mounted by `AdsterraScript`: after advertising-cookie consent, once per document load, and
only on content routes.

## 2. Configuration

| Env var | Default | Purpose |
|---|---|---|
| `VITE_ADSTERRA_ENABLED` | enabled | `0` disables the whole network (both formats). |
| `VITE_ADSTERRA_NATIVE_KEY` | `6c361a6751ca12f38bc29d1189826773` | Native Banner key. |
| `VITE_ADSTERRA_NATIVE_SRC` | the `invoke.js` URL above | Native Banner loader. |
| `VITE_ADSTERRA_POPUNDER` | enabled | `0` disables only the popunder. |
| `VITE_ADSTERRA_POPUNDER_SRC` | the popunder URL above | Popunder tag. |
| `VITE_ADSTERRA_SLOT_<SLOTNAME>` | — | Native Banner key for one slot, when the account has several banners. |
| `VITE_ADSTERRA_SLOT_<SLOTNAME>_SRC` | derived | Only when that banner lives on a different `pl<id>` host. |

Slot names (`SLOTNAME`) mirror the AdSense slot map: `REVIEW_SIDEBAR`,
`HOME_LEADERBOARD`, `COMPARE_INLINE`, `COMPARE_SIDEBAR`, `HUB_HERO_BELOW`,
`FORUM_IN_ARTICLE_1`.

When a per-slot key is set, the loader URL is derived by swapping the key segment of the
default loader — which is exactly how additional Adsterra native banners on the same
account are addressed. A key that does not look like a key (a pasted `<script>` tag, an
empty value) is rejected rather than injected, so a misconfiguration degrades to "no ad"
instead of a broken page.

## 3. Placement & routing rules

`AdSlot` applies the same seven rules as before (consent → pageview budget → content
threshold → lazy load → viewability → routing → layout stability); Adsterra is the second
candidate in the routing order:

```
VITE_ADSTERRA_SLOT_* set?  →  AdSense (if configured)  →  Adsterra Native/Display Banner
adNetworkTag = "adsterra" / "native" (Convex)  →  Adsterra only
adNetworkTag = "adsense"                       →  AdSense, then the normal backfill order
```

Adsterra is the deepest backfill candidate because its configured format *is* an in-slot
format (native banner or display banner). Pin `adNetworkTag` per template in Convex to
override that for any slot. A tag naming a network this build does not serve is ignored
and the slot keeps the default order rather than rendering nothing — so a leftover
`adNetworkTag` in Convex from a decommissioned network degrades to AdSense → Adsterra
instead of blanking the slot. Consider clearing such rows in `adSlotConfigs` anyway.

**One unit per key per pageview.** `useAdUnitClaim` records which slot owns
`adsterra:<key>` (or `adsterra-banner:<key>` for display banners) for the current
pageview. Claims are keyed by `unit → owning slot`, so the same slot re-claiming its own
unit always succeeds (StrictMode double-invocation, re-mounts) while a *different* slot is
refused and falls through to the next candidate network. Without that, two slots sharing a
key would emit duplicate element ids and Adsterra would fill one and double-count the other.

**Impression telemetry** in `adComplianceAuditLog` carries
`{ iabFormat, position, network, adsterraKey?, adsterraFormat?, viewable: true }`, so fill
share per network per template is measurable without touching the network dashboards.

## 4. Popunder

A popunder tag hijacks the first qualifying click in the document. Running two of them on
one property means a single click opens two windows — the classic cause of browser pop-up
blocks and of AdSense policy violations — so the stack deliberately keeps exactly one.

Adsterra is now the only ad network besides AdSense, so there is nothing to arbitrate and
no cross-network switch: `VITE_ADSTERRA_POPUNDER=0` is the kill switch, and `AdsterraScript`
additionally waits for advertising consent and stays off `/admin`, `/auth`, `/profile`,
`/settings` and `/tasks`.

## 5. Infrastructure touch-points

- **`nginx.conf`** — CSP `script-src`, `connect-src` and `frame-src` now allow
  `*.profitableratecpmnetwork.com` and `*.highperformanceformat.com`. A blocked tag fails
  silently: the ad simply never appears and no build error is raised.
- **`index.html`** — `preconnect` to the Native Banner host and `dns-prefetch` to both
  Adsterra hosts, so the handshake overlaps first paint.
- **`Dockerfile`** — every `VITE_ADSTERRA_*` var is an `ARG` → `ENV`; the native key and
  the popunder defaults are committed, so a build with no Coolify args
  still serves Adsterra. Display Banner keys have NO committed default (see §1) —
  set them in Coolify only when a real Banner snippet exists.
- **`src/vite-env.d.ts`** — typed env surface (no `any`).

## 6. Verification

```bash
npm run build            # must stay green
# with advertising cookies accepted:
#   • DevTools → Network: one pl31590134… serverless invocation per filled slot, one
#     pl31589899… request per document load
#   • DevTools → Elements: <div id="container-6c361a6751ca12f38bc29d1189826773"> inside the
#     review/compare/hub/forum slot wrappers
#   • Convex → adComplianceAuditLog: rows carry network: "adsterra" + adsterraKey
```

## 7. Open items / caveats

- **Three networks share one property.** AdSense + two popunder-capable networks is
  aggressive monetization. Watch the AdSense policy centre, the Core Web Vitals report
  (Adsterra creatives are heavy) and session-bounce rate; `VITE_ADSTERRA_ENABLED=0`
  reverts instantly, no code change.
- **Display banner disabled (2026-10-03).** The account has no Banner-code unit yet,
  so the banner path carries no key and every slot renders the Native Banner div.
  To add one, paste the `atOptions` snippet from Adsterra → Websites → Banner code
  into `VITE_ADSTERRA_BANNER_*` (or per-slot `_PREFER=banner`).
- **`public/ads.txt`** — add a line only if the Adsterra dashboard states one for this
  site; a wrong line can invalidate the file for every other network too.
- **`TheSynLab-deploy/`** is a separate git submodule; changes are not mirrored there.

