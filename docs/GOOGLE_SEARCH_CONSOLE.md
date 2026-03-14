# Google Search Console setup

## Verification

- **Method:** HTML tag (meta)
- **Content:** `SNhz-KkeLZzVcCXi5CcIlZwHZ5DPTb3n_A3xR7b_Bco`
- **Where:** In `index.html` as `<meta name="google-site-verification" content="..." />`

After deploy, in [Search Console](https://search.google.com/search-console) add the property (e.g. `https://www.thesynlab.com` or `https://thesynlab.com`), choose “HTML tag” and use the same content; verification should succeed.

## Sitemap

- **URL:** `https://www.thesynlab.com/sitemap.xml`
- In Search Console: **Sitemaps** → add `sitemap.xml` (or full URL) → Submit.

Static sitemap is in `public/sitemap.xml`. A dynamic sitemap is also available via Convex at your deployment’s `.convex.site` if you proxy it.

## robots.txt

- **URL:** `https://www.thesynlab.com/robots.txt`
- Allows all user-agents and points to the sitemap. No need to change anything in Search Console for this.

## RSS (optional)

- Feed: Convex HTTP at `https://kindhearted-lark-661.convex.site/feed.xml` (or proxy `/feed.xml` on your domain). Not submitted in Search Console; used for discovery only.

## Coverage and indexing

- Use **URL Inspection** for important URLs to request indexing.
- Use **Pages** / **Indexed** and **Coverage** to monitor errors.
- This is an SPA: ensure important content and canonicals are in the initial HTML or injected early so Google can see them.
