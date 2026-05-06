# Render Optimization for GEO (Generative Engine Optimization)

## The Problem
The audit showed 2265% rendering — meaning the page content changes significantly after initial load. LLMs (ChatGPT, Gemini, Perplexity) that crawl the site may miss important content because they often read the initial HTML only.

## Root Causes
1. Pure client-side rendering (Vite SPA) — all content injected via JavaScript
2. Heavy lazy-loading of components
3. Dynamic content from Convex/Supabase API calls

## Solutions (in order of effort)

### Quick Fix (1 day)
- Add `<meta name="description">` with full site summary
- Ensure all critical headings are in initial HTML (add static fallbacks)
- Add `llms.txt` already exists — keep it updated

### Medium Fix (1 week)
- Use Vite's build-time prerendering: `vite-plugin-ssr` or `vite-plugin-prerender`
- This generates static HTML for key pages during build
- Hydrates to SPA after load — best of both worlds

### Full Fix (2-4 weeks)
- Migrate to Astro (recommended) or Next.js
- Astro: great for content sites, ships zero JS by default
- Each page gets fully rendered HTML first, enhances with React islands
- SEO + LLM readability instantly optimal

## Recommended Approach
Start with Vite prerendering (medium fix). It requires minimal code changes and solves 80% of the issue. Migrate to Astro only if prerendering isn't enough.

```bash
npm install vite-plugin-ssr
# Then follow: https://vite-plugin-ssr.com/
```
