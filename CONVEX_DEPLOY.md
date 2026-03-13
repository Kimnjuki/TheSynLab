# Convex setup & deployment

This project uses **Convex** as the backend (realtime database + serverless functions). Supabase has been removed.

## Credentials

- **Deployment:** `kindhearted-lark-661`
- **Frontend URL (API):** `https://kindhearted-lark-661.convex.cloud` — set as `VITE_CONVEX_URL` in env.
- **Site URL (hosted auth/site):** `https://kindhearted-lark-661.convex.site`

## Local development

1. Copy env: `cp .env.example .env`
2. Set `VITE_CONVEX_URL=https://kindhearted-lark-661.convex.cloud` (or leave default in code).
3. For Convex CLI (dev/deploy), set your deployment key in `.env`:
   ```bash
   CONVEX_DEPLOY_KEY=dev:kindhearted-lark-661|...
   ```
   Get it from [Convex Dashboard](https://dashboard.convex.dev) → your deployment → Settings → Deployment key.
4. Run Convex dev (optional, for backend changes): `npx convex dev`
5. Run app: `npm run dev`

## Coolify / production build

- **Build env:** In Coolify → your application → **Build** / **Environment**, set:
  - `VITE_CONVEX_URL` = `https://kindhearted-lark-661.convex.cloud`  
  (optional; the app default is already this URL.)
- **Deploying Convex functions:** If you want Coolify (or CI) to run `npx convex deploy` before building the frontend, add to Build env:
  - `CONVEX_DEPLOY_KEY` = your deployment key (e.g. `dev:kindhearted-lark-661|eyJ...`).  
  Keep this secret; use Coolify’s secret/env UI, not the repo.

The frontend only needs `VITE_CONVEX_URL` at **build time**. The deployment key is only for the Convex CLI when running `npx convex dev` or `npx convex deploy`.
