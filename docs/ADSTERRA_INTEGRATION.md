# Adsterra ad platform — integration & placement rules

Adsterra is the third demand source in the ad stack (after Google AdSense and Adnium).
Everything about it lives in one place:

| Concern | File |
|---|---|
| Keys, srcs, unit resolution, tag mounting | `src/lib/adsterra.ts` |
| Shared policy (route guard, popunder arbitration) | `src/lib/adNetworks.ts` |
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

### Display Banner (in-slot, sandboxed iframe)

```html
<script type="text/javascript">
  atOptions = { 'key' : '31489400', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };
</script>
<script type="text/javascript"
        src="https://www.highperformanceformat.com/31489400/invoke.js"></script>
```

Live units (from the dashboard): `31489400` (300×250) and `31489635` (728×90).

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

Mounted by `AdsterraScript`: after advertising-cookie consent, once per document load, only
on content routes, and only when `VITE_POPUNDER_NETWORK` says Adsterra owns the popunder.

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
| `VITE_POPUNDER_NETWORK` | `adsterra` | Which popunder tag may run: `adsterra` · `adnium` · `both` · `none`. |

Slot names (`SLOTNAME`) mirror the AdSense/Adnium maps: `REVIEW_SIDEBAR`,
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
VITE_ADSTERRA_SLOT_* set?  →  AdSense (if configured)  →  Adsterra Native Banner  →  Adnium
adNetworkTag = "adsterra" / "native" (Convex)  →  Adsterra only
adNetworkTag = "adnium"                        →  Adnium only
adNetworkTag = "adsense"                       →  AdSense, then the normal backfill order
```

Adsterra sits ahead of Adnium in the default order because its configured format *is* an
in-slot format (native banner), while Adnium's in-slot zones are optional extras. Pin
`adNetworkTag` per template in Convex to override that for any slot.

**One unit per key per pageview.** `useAdUnitClaim` records which slot owns
`adsterra:<key>` (or `adnium:<zoneId>`) for the current pageview. Claims are keyed by
`unit → owning slot`, so the same slot re-claiming its own unit always succeeds
(StrictMode double-invocation, re-mounts) while a *different* slot is refused and falls
through to the next candidate network. Without that, two slots sharing a key would emit
duplicate element ids and Adsterra would fill one and double-count the other.

**Impression telemetry** in `adComplianceAuditLog` now carries
`{ iabFormat, position, network, adsterraKey?, adniumZone?, viewable: true }`, so fill
share per network per template is measurable without touching the network dashboards.

## 4. Popunder arbitration (shared with Adnium)

`src/lib/adNetworks.ts` owns `VITE_POPUNDER_NETWORK`. A popunder tag hijacks the first
qualifying click in the document, so two live tags mean **one click opens two windows** —
the classic cause of browser pop-up blocks and of AdSense policy violations. Exactly one
network therefore owns the popunder unless a deployment deliberately sets `both`:

| Value | Effect |
|---|---|
| `adsterra` (default) | Adsterra popunder only; Adnium keeps its in-slot zones. |
| `adnium` | Adnium popunder only; Adsterra keeps its Native Banners. |
| `both` | Both tags load — only if you knowingly want two pop-unders per click. |
| `none` | No popunder at all; every in-slot unit still serves. |

Each network also keeps its own hard kill switch (`VITE_ADSTERRA_POPUNDER=0`,
`VITE_ADNIUM_POPUNDER=0`).

## 5. Infrastructure touch-points

- **`nginx.conf`** — CSP `script-src`, `connect-src` and `frame-src` now allow
  `*.profitableratecpmnetwork.com` and `*.highperformanceformat.com`. A blocked tag fails
  silently: the ad simply never appears and no build error is raised.
- **`index.html`** — `preconnect` to the Native Banner host and `dns-prefetch` to both
  Adsterra hosts, so the handshake overlaps first paint.
- **`Dockerfile`** — every `VITE_ADSTERRA_*` and `VITE_POPUNDER_NETWORK` var is an
  `ARG` → `ENV`; the native key and both popunder/arbitration defaults are committed, so a
  build with no Coolify args still serves Adsterra.
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
- **Display banner format not implemented.** Adsterra's classic display banner uses an
  `atOptions` object instead of the container div. There is no banner unit in the account
  yet, so only the two formats you supplied are wired; adding one is a small extension to
  `src/lib/adsterra.ts`.
- **`public/ads.txt`** — add a line only if the Adsterra dashboard states one for this
  site; a wrong line can invalidate the file for every other network too.
- **`TheSynLab-deploy/`** is a separate git submodule; changes are not mirrored there.

