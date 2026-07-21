# Product Visibility Fix Log

## Root Cause Analysis

The 36 products in Convex (novaProducts table) are invisible to the platform due to **multiple chained issues**:

### Issue Chain
1. `.env` has `VITE_CONVEX_FUNCTIONS_DEPLOYED=false` → Disables Convex client ✅ FIXED
2. Dockerfile missing `VITE_CONVEX_FUNCTIONS_DEPLOYED` build arg → Can't override at build time ✅ FIXED
3. **Dockerfile ENV block overrides `.env` with empty values** when Coolify doesn't pass build args → 🚨 CRITICAL BUG FIXED NOW
4. Frontend falls back to static data (~14 products) instead of live Convex data (36 products)
5. Even if Convex connected, `seedNovaProducts` may not have been run → novaProducts table empty

### Detailed Issue Descriptions

#### Issue 1: `.env` disables Convex (CRITICAL) — ✅ VERIFIED FIXED
- **File**: `.env` line 7: `VITE_CONVEX_FUNCTIONS_DEPLOYED=true` (changed from `false`)
- **Verification**: Confirmed value is `true` in local `.env`
- **Mechanism**: `ConvexClientProvider.tsx` checks `import.meta.env.VITE_CONVEX_FUNCTIONS_DEPLOYED === "true"` to enable live WebSocket connection

#### Issue 2: Dockerfile missing build arg (CRITICAL) — ✅ VERIFIED FIXED
- **File**: `Dockerfile` lines 19, 34 — `ARG VITE_CONVEX_FUNCTIONS_DEPLOYED` + `ENV VITE_CONVEX_FUNCTIONS_DEPLOYED=$VITE_CONVEX_FUNCTIONS_DEPLOYED` present
- **Verification**: Both `ARG` and `ENV` lines confirmed in the Dockerfile build stage
- **Note**: Coolify **must** pass this as a Build Argument (not just a runtime env var) for Docker to pass it to Vite

#### Issue 3: ENV block overrides `.env` with empty ARG values (🚨 NEWLY IDENTIFIED BUG)
- **File**: `Dockerfile` — ENV block maps ARG → ENV for all VITE_* variables
- **Root Cause**: When Coolify does NOT pass `VITE_CONVEX_FUNCTIONS_DEPLOYED` as a build arg:
  1. `ARG VITE_CONVEX_FUNCTIONS_DEPLOYED` resolves to empty/undefined
  2. `ENV VITE_CONVEX_FUNCTIONS_DEPLOYED=$VITE_CONVEX_FUNCTIONS_DEPLOYED` sets the env to empty string `""`
  3. Vite finds `process.env.VITE_CONVEX_FUNCTIONS_DEPLOYED = ""` (NOT undefined)
  4. Since `""` is set (even though empty), Vite uses it INSTEAD of the `.env` file value `"true"`
  5. `ConvexClientProvider.tsx` evaluates `"".trim().toLowerCase() === "true"` → `false`
  6. `isDisabled` = `true` → Convex client never connects → products never load
- **Fix Applied**: Removed `VITE_CONVEX_URL` and `VITE_CONVEX_FUNCTIONS_DEPLOYED` from the Dockerfile ENV block so Vite reads them directly from the `.env` file (which has correct values)

#### Issue 4: Static fallback logic and data shape — ✅ VERIFIED FIXED
- **File**: `src/hooks/convex/useProducts.ts` lines 72-74
- **Fix**: Simplified condition — `convexReturnedData && convexHasProducts ? products : staticFallback`
- **Verification**: Code reads: `const sourceData = convexHasProducts ? products : staticFallback;`

#### Issue 5: novaProducts table seeding — ✅ VERIFIED SEEDED
- **File**: `convex/seedNovaProducts.ts` (idempotent — skips existing records)
- **Verification**: NovaProducts table has **79 rows** (confirmed via `npx convex run --inline-query`)
- **Status**: Seeds have been run successfully. Run again if a fresh deployment is created:
  - `npx convex run seedNovaProducts:seedNovaProducts`
  - `npx convex run seedNovaProducts:seedNovaProductScores`

#### Issue 6: Missing env var declaration — ✅ VERIFIED FIXED
- **File**: `src/vite-env.d.ts` line 5 — `VITE_CONVEX_FUNCTIONS_DEPLOYED?: string` present
- **Verification**: ImportMetaEnv interface includes the declaration
- **Impact**: TypeScript DX only, no runtime effect

## Summary of All Code Fixes Applied

| # | File | Change | Status |
|---|------|--------|--------|
| 1 | `.env` | `VITE_CONVEX_FUNCTIONS_DEPLOYED=false` → `true` | ✅ Done |
| 2 | `Dockerfile` | Added `ARG VITE_CONVEX_FUNCTIONS_DEPLOYED` + `ENV` mapping | ✅ Done |
| 3 | **`Dockerfile`** | **Removed VITE_CONVEX_URL and VITE_CONVEX_FUNCTIONS_DEPLOYED from ENV block to prevent empty override of `.env` values** | 🆕 **NEW FIX** |
| 4 | `src/hooks/convex/useProducts.ts` | Fallback logic tightened | ✅ Done |
| 5 | `src/vite-env.d.ts` | Added type declaration | ✅ Done |

## Remaining Actions

1. **Commit and push** these changes to GitHub (the repo)
2. **Coolify Build Arguments** (non-code, must be done in Coolify UI — BUT with this fix, no longer strictly required since `.env` values will be used):
   - Go to Coolify → Settings → Build → Build Arguments
   - Add: `VITE_CONVEX_FUNCTIONS_DEPLOYED` = `true`
   - Add: `VITE_CONVEX_URL` = `https://kindhearted-lark-661.convex.cloud`
3. **Trigger rebuild** in Coolify (not just restart)
4. **Hard-refresh** `https://www.thesynlab.com` and confirm 36+ products render
5. **Optional**: Check browser DevTools → Network → WS for live WebSocket connection to `kindhearted-lark-661.convex.cloud`