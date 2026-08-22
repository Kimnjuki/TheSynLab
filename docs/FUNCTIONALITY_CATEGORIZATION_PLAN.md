# Functionality Categorization Plan — Convex Schema (2026)

## Goal

Categorize every product by **what it does** (functionality), not just by which
content hub or marketing category it sits in. This enables:

- Functionality-based browsing/filtering on the Products Hub
- Better AI Product Finder and Stack Architect recommendations
- Consistent free imagery per functional role (hero + gallery)
- LLM-friendly structured data for AI citation pickup

## Schema Changes (`novaProducts`)

Two new optional fields were added to the `novaProducts` table:

| Field | Type | Purpose |
|---|---|---|
| `primaryFunctionality` | `string` (optional) | The single functional role the product plays in a stack. Indexed via `by_functionality`. |
| `functionalityTags` | `string[]` (optional) | Supporting functional tags for multi-dimensional filtering and recommendations. |

New index: `by_functionality` on `["primaryFunctionality"]`.

Both fields are optional, so **no data migration is required** — existing
records simply lack the fields until backfilled.

## Functionality Taxonomy (canonical values for `primaryFunctionality`)

| Functionality | Example products |
|---|---|
| `task-management` | Todoist, Trello |
| `project-management` | ClickUp, Asana, Jira, Monday.com |
| `knowledge-management` | Notion, Confluence, Obsidian, Notion AI |
| `team-communication` | Slack, Teams, Discord, Loom |
| `video-conferencing` | Zoom, Google Meet |
| `workflow-automation` | Zapier, Make, n8n |
| `ai-assistant` | ChatGPT Plus, Claude Pro, Perplexity Pro |
| `meeting-notes` | Granola, Otter.ai, Fireflies.ai |
| `crm-sales` | HubSpot, Salesforce, Zoho CRM, Freshsales, Pipedrive |
| `email-marketing` | Mailchimp, Klaviyo |
| `customer-support` | Zendesk, Intercom, Freshdesk |
| `design-creative` | Canva, Figma, Adobe Express |
| `developer-tools` | GitHub, GitLab, Bitbucket, VS Code |
| `writing-assistant` | Grammarly, ProWritingAid |
| `ecommerce-platform` | Shopify |
| `payments-finance` | Stripe, Square, QuickBooks |
| `scheduling` | Calendly |
| `async-video` | Loom |
| `security-passwords` | 1Password, Bitwarden |
| `database-spreadsheet` | Airtable |
| `file-storage` | Dropbox, Google Drive |
| `smart-home` | Philips Hue, Ecobee, Ring, Nest, Aqara, … |
| `office-hardware` | Dell UltraSharp, Keychron, Herman Miller, … |

## Seeding & Backfill

1. **New products** — `convex/seedNewProducts2026.ts` inserts 28 new products
   (Shopify, Stripe, Figma, Zoom, Jira, GitLab, ChatGPT Plus, Claude Pro,
   1Password, Airtable, Obsidian, Salesforce, Intercom, …) each with
   `primaryFunctionality`, `functionalityTags`, `featuredImageUrl`, and a
   4–6 image `galleryImages` array. Idempotent:
   ```
   npx convex run seedNewProducts2026:seedNewProducts
   ```
2. **Existing products** — `products:backfillProductImages` now also fills
   `galleryImages` (when fewer than 4 images) and derives imagery from
   functionality/category keywords. Idempotent:
   ```
   npx convex run products:backfillProductImages
   ```

## Image Resolution Pipeline

Frontend (`src/lib/productImages.ts`) and backend (`convex/productImageMap.ts`)
share the same resolution order:

1. Stored `featuredImageUrl` / `galleryImages` (editorial)
2. Exact product-slug curated map
3. Functionality-tag pool match (gallery) / subcategory regex (hero)
4. Category regex fallback
5. Product-name keyword fallback
6. Generic default

The PDP (`ProductDetailPage`) synthesizes default visual-story slides via
`buildDefaultGallerySlides()` when no editorial `productGallerySlides` exist,
so **every product detail page always renders a full image gallery**.

## Future Work

- Add a `/products/functionality/:tag` route backed by the `by_functionality` index
- Surface `functionalityTags` as faceted filters in `productHubFilters`
- Backfill `primaryFunctionality` for the original production seed products