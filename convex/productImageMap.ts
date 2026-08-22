/**
 * Curated free product imagery (Unsplash — free under the Unsplash License).
 * Shared by the backfill mutation so every product in the database gets a
 * relevant image even when it was created without a `featuredImageUrl`.
 *
 * Mirrors src/lib/productImages.ts (frontend fallback map).
 */

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=600&fit=crop&auto=format`;

export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // ---- Core SaaS ----
  clickup: U("photo-1611224923853-80b023f02d71"),
  todoist: U("photo-1484480974693-6ca0a78fb36b"),
  asana: U("photo-1507925921958-8a62f3d1a50d"),
  notion: U("photo-1531403009284-440f080d1e12"),
  slack: U("photo-1611606063065-ee7946f0787a"),
  canva: U("photo-1626785774573-4b799315345d"),
  hubspot: U("photo-1563986768609-322da13575f3"),
  github: U("photo-1618401471353-b98afee0b2eb"),
  zapier: U("photo-1558494949-ef010cbdcc31"),
  grammarly: U("photo-1455390582262-044cdead277a"),
  teams: U("photo-1522071820081-009f0129c71c"),
  discord: U("photo-1542751371-adc38448a05e"),
  make: U("photo-1551288049-bebda4e38f71"),
  confluence: U("photo-1517694712202-14dd9538aa97"),
  prowritingaid: U("photo-1468779036391-52341f60b55d"),
  "monday-com": U("photo-1542744173-8e7e53415bb0"),
  linear: U("photo-1461749280684-dccba630e2f6"),

  // ---- AI meeting notes ----
  granola: U("photo-1552664730-d307ca884978"),
  "otter-ai": U("photo-1478737270239-2f02b77fc618"),
  "fireflies-ai": U("photo-1522071820081-009f0129c71c"),

  // ---- Competitive software set ----
  "focusflow-pro": U("photo-1506784983877-45594efa4cbe"),
  "google-workspace-business-starter": U("photo-1499951360447-b19be8fe80f5"),
  "notion-team-plan": U("photo-1531403009284-440f080d1e12"),
  "github-enterprise": U("photo-1618401471353-b98afee0b2eb"),
  "hubspot-crm": U("photo-1563986768609-322da13575f3"),
  "miro-business": U("photo-1553877522-43269d4ea984"),
  "zapier-professional": U("photo-1558494949-ef010cbdcc31"),
  "zendesk-suite": U("photo-1553775282-20af80779df7"),
  "todoist-business": U("photo-1484480974693-6ca0a78fb36b"),
  "grammarly-business": U("photo-1455390582262-044cdead277a"),
  "microsoft-365-business-standard": U("photo-1497215728101-856f4ea42174"),
  "make-core": U("photo-1551288049-bebda4e38f71"),
  "clickup-business": U("photo-1611224923853-80b023f02d71"),
  "n8n-community-edition": U("photo-1558494949-ef010cbdcc31"),
  "atlassian-confluence-cloud": U("photo-1517694712202-14dd9538aa97"),
  "asana-business": U("photo-1507925921958-8a62f3d1a50d"),
  "pipedrive-crm": U("photo-1563986768609-322da13575f3"),

  // ---- Smart home hardware ----
  "amazon-echo-hub": U("photo-1608043152269-423dbba4e7e1"),
  "schlage-encode-plus": U("photo-1558618666-fcd25c85cd64"),
  "arlo-pro-5s": U("photo-1557597774-9d273605dfa9"),
  "eero-max-7": U("photo-1606904825846-647eb07f5be2"),
  "ecobee-smart-thermostat-premium": U("photo-1585771724684-38269d6639fd"),
  "philips-hue-starter-kit": U("photo-1473341304170-971dccb5ac1e"),
  "kasa-smart-plug-ep25": U("photo-1558346547-4439467bd1d5"),
  "roborock-s8-pro-ultra": U("photo-1558618666-fcd25c85cd64"),
  "google-nest-doorbell-wired": U("photo-1555963966-b7ae5404b6e8"),
  "aqara-multi-sensor-kit": U("photo-1518770660439-4636190af475"),
  "google-nest-thermostat": U("photo-1585771724684-38269d6639fd"),
  "ring-video-doorbell-pro-2": U("photo-1555963966-b7ae5404b6e8"),
  "ring-video-doorbell": U("photo-1555963966-b7ae5404b6e8"),
  "tp-link-tapo-l930": U("photo-1473341304170-971dccb5ac1e"),
  "lutron-caseta-smart-switch": U("photo-1558346547-4439467bd1d5"),
  "philips-hue": U("photo-1473341304170-971dccb5ac1e"),
  "ecobee-smart-thermostat": U("photo-1585771724684-38269d6639fd"),

  // ---- Office hardware ----
  "dell-ultrasharp-u3223qe": U("photo-1527443224154-c4a3942d3acf"),
  "keychron-q1-pro": U("photo-1587829741301-dc798b83add3"),
  "brother-mfc-l3760cdw": U("photo-1612198273627-e6e6d3d7f5e0"),
  "logitech-brio-4k": U("photo-1626285861696-9f0bf5a49c6d"),
  "jabra-evolve2-85": U("photo-1505740420928-5e560c06d30e"),
  "anker-778-thunderbolt-dock": U("photo-1593642702821-c8da6771f0c6"),
  "herman-miller-aeron": U("photo-1580480055273-228ff5388ef8"),
  "synology-ds923-plus": U("photo-1544197150-b99a580bb7a8"),
  "neat-bar-pro": U("photo-1611532736597-de2d4265fba3"),
  "dymo-labelwriter-550": U("photo-1586953208448-b95a79798f07"),
  "logitech-mx-master-3s": U("photo-1527864550417-7fd91fc51a46"),
  "standdesk-pro-electric": U("photo-1593642632559-0c6d3fc62b89"),
  "caldigit-ts4": U("photo-1593642702821-c8da6771f0c6"),

  // ---- E-commerce & finance (2026 expansion) ----
  shopify: U("photo-1441986300917-64674bd600d8"),
  stripe: U("photo-1556740738-b6a63e27c4df"),
  square: U("photo-1556742049-0cfed4f6a45d"),
  quickbooks: U("photo-1554224155-6726b3ff858f"),
  klaviyo: U("photo-1563986768494-4dee2763ff3f"),
  mailchimp: U("photo-1563986768494-4dee2763ff3f"),

  // ---- Design & creative (2026 expansion) ----
  figma: U("photo-1581291518857-4e27b48ff24e"),
  "adobe-express": U("photo-1626785774573-4b799315345d"),

  // ---- Developer tools (2026 expansion) ----
  jira: U("photo-1531403009284-440f080d1e12"),
  gitlab: U("photo-1587620962725-abab7fe55159"),
  bitbucket: U("photo-1587620962725-abab7fe55159"),
  "vs-code": U("photo-1587620962725-abab7fe55159"),

  // ---- Communication & meetings (2026 expansion) ----
  zoom: U("photo-1587825140708-dfaf72ae4b04"),
  loom: U("photo-1573164713988-8665fc963095"),
  calendly: U("photo-1506784983877-45594efa4cbe"),
  "google-meet": U("photo-1587825140708-dfaf72ae4b04"),

  // ---- AI assistants (2026 expansion) ----
  "chatgpt-plus": U("photo-1620712943543-bcc4688e7485"),
  "claude-pro": U("photo-1620712943543-bcc4688e7485"),
  "perplexity-pro": U("photo-1551288049-bebda4e38f71"),
  "notion-ai": U("photo-1531403009284-440f080d1e12"),

  // ---- Security (2026 expansion) ----
  "1password": U("photo-1563013544-824ae1b704d3"),
  bitwarden: U("photo-1563013544-824ae1b704d3"),

  // ---- Knowledge, data & storage (2026 expansion) ----
  airtable: U("photo-1551288049-bebda4e38f71"),
  obsidian: U("photo-1517842645767-c639042777db"),
  dropbox: U("photo-1597423244286-40db30950ff1"),
  "google-drive": U("photo-1597423244286-40db30950ff1"),
  trello: U("photo-1531403009284-440f080d1e12"),

  // ---- CRM & support (2026 expansion) ----
  salesforce: U("photo-1563986768609-322da13575f3"),
  "zoho-crm": U("photo-1563986768609-322da13575f3"),
  freshsales: U("photo-1563986768609-322da13575f3"),
  intercom: U("photo-1553775282-20af80779df7"),
  freshdesk: U("photo-1553775282-20af80779df7"),

  // ---- Expanded 2026 catalog (convex/seedExpandedCatalog.ts) ----
  "n8n": U("photo-1558494949-ef010cbdcc31"),
  "ifttt": U("photo-1558494949-ef010cbdcc31"),
  "github-actions": U("photo-1461749280684-dccba630e2f6"),
  "power-automate": U("photo-1558494949-ef010cbdcc31"),
  "writesonic": U("photo-1455390582262-044cdead277a"),
  "blaze-ai": U("photo-1522071820081-009f0129c71c"),
  "syllaby": U("photo-1620712943543-bcc4688e7485"),
  "airops": U("photo-1620712943543-bcc4688e7485"),
  "play-ht": U("photo-1478737270239-2f02b77fc618"),
  "mubert": U("photo-1511379938547-c1f69419868d"),
  "lalal-ai": U("photo-1478737270239-2f02b77fc618"),
  "murf-ai": U("photo-1478737270239-2f02b77fc618"),
  "opus-clip": U("photo-1620712943543-bcc4688e7485"),
  "remnote": U("photo-1499951360447-b19be8fe80f5"),
  "taskade": U("photo-1499951360447-b19be8fe80f5"),
  "slite": U("photo-1499951360447-b19be8fe80f5"),
  "magical-ai": U("photo-1455390582262-044cdead277a"),
  "textexpander": U("photo-1455390582262-044cdead277a"),
  "wispr-flow": U("photo-1455390582262-044cdead277a"),
  "superwhisper": U("photo-1455390582262-044cdead277a"),
  "tactiq": U("photo-1587825140708-dfaf72ae4b04"),
  "milanote": U("photo-1626785774573-4b799315345d"),
  "craft": U("photo-1499951360447-b19be8fe80f5"),
  "workflowy": U("photo-1499951360447-b19be8fe80f5"),
  "coda": U("photo-1551288049-bebda4e38f71"),
  "forever-notes": U("photo-1499951360447-b19be8fe80f5"),
  "mattermost": U("photo-1522071820081-009f0129c71c"),
  "guilded": U("photo-1608043152269-423dbba4e7e1"),
  "rocketchat": U("photo-1522071820081-009f0129c71c"),
  "twist": U("photo-1522071820081-009f0129c71c"),
  "telegram": U("photo-1522071820081-009f0129c71c"),
  "signal": U("photo-1563013544-824ae1b704d3"),
  "viva-engage": U("photo-1522071820081-009f0129c71c"),
  "height": U("photo-1499951360447-b19be8fe80f5"),
  "fleep": U("photo-1522071820081-009f0129c71c"),
  "element": U("photo-1522071820081-009f0129c71c"),
  "zulip": U("photo-1522071820081-009f0129c71c"),
  "chanty": U("photo-1522071820081-009f0129c71c"),
  "brief": U("photo-1522071820081-009f0129c71c"),
  "activecampaign": U("photo-1563986768609-322da13575f3"),
  "getresponse": U("photo-1563986768609-322da13575f3"),
  "convertkit": U("photo-1563986768609-322da13575f3"),
  "semrush": U("photo-1563986768609-322da13575f3"),
  "ahrefs": U("photo-1563986768609-322da13575f3"),
  "moz": U("photo-1563986768609-322da13575f3"),
  "hotjar": U("photo-1563986768609-322da13575f3"),
  "mixpanel": U("photo-1551288049-bebda4e38f71"),
  "amplitude": U("photo-1551288049-bebda4e38f71"),
  "heap": U("photo-1551288049-bebda4e38f71"),
  "customerio": U("photo-1563986768609-322da13575f3"),
  "braze": U("photo-1563986768609-322da13575f3"),
  "wyze": U("photo-1557597774-9d273605dfa9"),
  "eufy-security": U("photo-1557597774-9d273605dfa9"),
  "simplisafe": U("photo-1557597774-9d273605dfa9"),
  "abode": U("photo-1558618666-fcd25c85cd64"),
  "vivint": U("photo-1557597774-9d273605dfa9"),
  "adt": U("photo-1557597774-9d273605dfa9"),
  "honeywell-home": U("photo-1585771724684-38269d6639fd"),
  "lg-thinq": U("photo-1558002038-1055907df827"),
  "myq": U("photo-1558346547-4439467bd1d5"),
  "level-lock": U("photo-1558618666-fcd25c85cd64"),
  "switchbot": U("photo-1558346547-4439467bd1d5"),
  "nanoleaf": U("photo-1473341304170-971dccb5ac1e"),
  "ledvance": U("photo-1473341304170-971dccb5ac1e"),
  "elgato-key-light": U("photo-1473341304170-971dccb5ac1e"),
  "blue-yeti": U("photo-1505740420928-5e560c06d30e"),
  "razer-blackwidow": U("photo-1587829741301-dc798b83add3"),
  "corsair-k70": U("photo-1587829741301-dc798b83add3"),
  "sony-wh-1000xm5": U("photo-1505740420928-5e560c06d30e"),
  "apple-airpods-max": U("photo-1505740420928-5e560c06d30e"),
};

/** Category keyword fallbacks (checked in order). */
export const CATEGORY_IMAGE_FALLBACKS: { match: RegExp; url: string }[] = [
  { match: /productivity/i, url: U("photo-1611224923853-80b023f02d71") },
  { match: /collaboration/i, url: U("photo-1522071820081-009f0129c71c") },
  { match: /automation/i, url: U("photo-1558494949-ef010cbdcc31") },
  { match: /marketing|crm/i, url: U("photo-1563986768609-322da13575f3") },
  { match: /design/i, url: U("photo-1626785774573-4b799315345d") },
  { match: /writing/i, url: U("photo-1455390582262-044cdead277a") },
  { match: /developer/i, url: U("photo-1461749280684-dccba630e2f6") },
  { match: /ecommerce|commerce/i, url: U("photo-1441986300917-64674bd600d8") },
  { match: /finance|payment|accounting/i, url: U("photo-1556740738-b6a63e27c4df") },
  { match: /security/i, url: U("photo-1563013544-824ae1b704d3") },
  { match: /smart home|intelligent home/i, url: U("photo-1558002038-1055907df827") },
  { match: /hybrid office|office hardware/i, url: U("photo-1497215728101-856f4ea42174") },
];

/** Generic default (clean laptop workspace). */
export const DEFAULT_PRODUCT_IMAGE = U("photo-1517694712202-14dd9538aa97");

/** Resolve a hero image URL for a product record. */
export function resolveProductImage(product: {
  productSlug?: string;
  productName?: string;
  category?: string;
  subcategory?: string;
}): string {
  const slug = product.productSlug ?? "";
  if (slug && PRODUCT_IMAGE_MAP[slug]) return PRODUCT_IMAGE_MAP[slug];

  const sub = product.subcategory ?? "";
  const cat = product.category ?? "";
  for (const { match, url } of CATEGORY_IMAGE_FALLBACKS) {
    if ((sub && match.test(sub)) || (cat && match.test(cat))) return url;
  }

  const name = (product.productName ?? "").toLowerCase();
  if (name.includes("otter")) return PRODUCT_IMAGE_MAP["otter-ai"];
  if (name.includes("fireflies")) return PRODUCT_IMAGE_MAP["fireflies-ai"];
  if (name.includes("granola")) return PRODUCT_IMAGE_MAP.granola;

  return DEFAULT_PRODUCT_IMAGE;
}

/* ------------------------------------------------------------------ */
/* Gallery resolution — used by the backfill mutation to give every    */
/* product a related set of free images for its detail-page gallery.   */
/* ------------------------------------------------------------------ */

/** Contextual shot pools keyed by functionality tag. */
const FUNCTIONALITY_GALLERY: Record<string, string[]> = {
  "task-management": [
    U("photo-1484480974693-6ca0a78fb36b"),
    U("photo-1506784983877-45594efa4cbe"),
    U("photo-1611224923853-80b023f02d71"),
    U("photo-1455390582262-044cdead277a"),
  ],
  "project-management": [
    U("photo-1611224923853-80b023f02d71"),
    U("photo-1542744173-8e7e53415bb0"),
    U("photo-1553877522-43269d4ea984"),
    U("photo-1522071820081-009f0129c71c"),
  ],
  "knowledge-management": [
    U("photo-1517694712202-14dd9538aa97"),
    U("photo-1517842645767-c639042777db"),
    U("photo-1531403009284-440f080d1e12"),
    U("photo-1455390582262-044cdead277a"),
  ],
  "team-communication": [
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1611606063065-ee7946f0787a"),
    U("photo-1552664730-d307ca884978"),
    U("photo-1542751371-adc38448a05e"),
  ],
  "video-conferencing": [
    U("photo-1587825140708-dfaf72ae4b04"),
    U("photo-1611532736597-de2d4265fba3"),
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1626285861696-9f0bf5a49c6d"),
  ],
  "workflow-automation": [
    U("photo-1558494949-ef010cbdcc31"),
    U("photo-1551288049-bebda4e38f71"),
    U("photo-1587620962725-abab7fe55159"),
    U("photo-1553877522-43269d4ea984"),
  ],
  "ai-assistant": [
    U("photo-1620712943543-bcc4688e7485"),
    U("photo-1551288049-bebda4e38f71"),
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1517694712202-14dd9538aa97"),
  ],
  "meeting-notes": [
    U("photo-1552664730-d307ca884978"),
    U("photo-1478737270239-2f02b77fc618"),
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1455390582262-044cdead277a"),
  ],
  "crm-sales": [
    U("photo-1563986768609-322da13575f3"),
    U("photo-1551288049-bebda4e38f71"),
    U("photo-1553775282-20af80779df7"),
    U("photo-1522071820081-009f0129c71c"),
  ],
  "email-marketing": [
    U("photo-1563986768494-4dee2763ff3f"),
    U("photo-1563986768609-322da13575f3"),
    U("photo-1551288049-bebda4e38f71"),
    U("photo-1455390582262-044cdead277a"),
  ],
  "customer-support": [
    U("photo-1553775282-20af80779df7"),
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1553877522-43269d4ea984"),
    U("photo-1551288049-bebda4e38f71"),
  ],
  "design-creative": [
    U("photo-1626785774573-4b799315345d"),
    U("photo-1581291518857-4e27b48ff24e"),
    U("photo-1553877522-43269d4ea984"),
    U("photo-1527443224154-c4a3942d3acf"),
  ],
  "developer-tools": [
    U("photo-1461749280684-dccba630e2f6"),
    U("photo-1587620962725-abab7fe55159"),
    U("photo-1618401471353-b98afee0b2eb"),
    U("photo-1551434678-e076c223a692"),
  ],
  "writing-assistant": [
    U("photo-1455390582262-044cdead277a"),
    U("photo-1468779036391-52341f60b55d"),
    U("photo-1517842645767-c639042777db"),
    U("photo-1517694712202-14dd9538aa97"),
  ],
  "ecommerce-platform": [
    U("photo-1441986300917-64674bd600d8"),
    U("photo-1556740738-b6a63e27c4df"),
    U("photo-1556742049-0cfed4f6a45d"),
    U("photo-1551288049-bebda4e38f71"),
  ],
  "payments-finance": [
    U("photo-1556740738-b6a63e27c4df"),
    U("photo-1554224155-6726b3ff858f"),
    U("photo-1556742049-0cfed4f6a45d"),
    U("photo-1551288049-bebda4e38f71"),
  ],
  scheduling: [
    U("photo-1506784983877-45594efa4cbe"),
    U("photo-1507925921958-8a62f3d1a50d"),
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1484480974693-6ca0a78fb36b"),
  ],
  "async-video": [
    U("photo-1573164713988-8665fc963095"),
    U("photo-1587825140708-dfaf72ae4b04"),
    U("photo-1626285861696-9f0bf5a49c6d"),
    U("photo-1522071820081-009f0129c71c"),
  ],
  "security-passwords": [
    U("photo-1563013544-824ae1b704d3"),
    U("photo-1518770660439-4636190af475"),
    U("photo-1558494949-ef010cbdcc31"),
    U("photo-1563986768609-322da13575f3"),
  ],
  "database-spreadsheet": [
    U("photo-1551288049-bebda4e38f71"),
    U("photo-1542744173-8e7e53415bb0"),
    U("photo-1553877522-43269d4ea984"),
    U("photo-1611224923853-80b023f02d71"),
  ],
  "file-storage": [
    U("photo-1597423244286-40db30950ff1"),
    U("photo-1544197150-b99a580bb7a8"),
    U("photo-1593642702821-c8da6771f0c6"),
    U("photo-1517694712202-14dd9538aa97"),
  ],
  "smart-home": [
    U("photo-1558002038-1055907df827"),
    U("photo-1608043152269-423dbba4e7e1"),
    U("photo-1473341304170-971dccb5ac1e"),
    U("photo-1558618666-fcd25c85cd64"),
  ],
  "office-hardware": [
    U("photo-1497215728101-856f4ea42174"),
    U("photo-1593642702821-c8da6771f0c6"),
    U("photo-1580480055273-228ff5388ef8"),
    U("photo-1527443224154-c4a3942d3acf"),
  ],
};

const GENERIC_GALLERY_SHOTS = [
  U("photo-1499951360447-b19be8fe80f5"),
  U("photo-1522202176988-66273c2fd55f"),
  U("photo-1497215728101-856f4ea42174"),
  U("photo-1517694712202-14dd9538aa97"),
];

/**
 * Resolve 4–6 related free images for a product's gallery.
 * Order: stored galleryImages → per-product map → functionality pool → pads.
 */
export function resolveProductGallery(product: {
  productSlug?: string;
  productName?: string;
  category?: string;
  subcategory?: string;
  functionalityTags?: string[];
  featuredImageUrl?: string;
  galleryImages?: string[];
}): string[] {
  const stored = (product.galleryImages ?? []).filter(Boolean);
  if (stored.length >= 4) return stored.slice(0, 6);

  const hero = product.featuredImageUrl || resolveProductImage(product);
  const pool: string[] = [];

  const keys = [
    ...(product.functionalityTags ?? []),
    product.subcategory ?? "",
    product.category ?? "",
    product.productName ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const pushPool = (imgs: string[]) => {
    for (const img of imgs) if (!pool.includes(img) && img !== hero) pool.push(img);
  };

  for (const [fnKey, imgs] of Object.entries(FUNCTIONALITY_GALLERY)) {
    if (keys.includes(fnKey.replace(/-/g, " ")) || keys.includes(fnKey)) {
      pushPool(imgs);
    }
  }

  if (/task|todo/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["task-management"]);
  if (/project|agile|sprint/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["project-management"]);
  if (/wiki|knowledge|note|doc/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["knowledge-management"]);
  if (/messaging|chat|communicat/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["team-communication"]);
  if (/video|meeting|call/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["video-conferencing"]);
  if (/automation|workflow|integration/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["workflow-automation"]);
  if (/crm|sales|pipeline/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["crm-sales"]);
  if (/email|newsletter/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["email-marketing"]);
  if (/support|helpdesk|ticket/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["customer-support"]);
  if (/design|graphic|ui|ux|creative/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["design-creative"]);
  if (/code|developer|git|version control/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["developer-tools"]);
  if (/writing|grammar/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["writing-assistant"]);
  if (/ecommerce|store|shop|retail|commerce/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["ecommerce-platform"]);
  if (/payment|finance|accounting|billing/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["payments-finance"]);
  if (/schedul|calendar|appointment/.test(keys)) pushPool(FUNCTIONALITY_GALLERY.scheduling);
  if (/password|security|vault/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["security-passwords"]);
  if (/database|spreadsheet|grid/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["database-spreadsheet"]);
  if (/storage|file|drive|backup/.test(keys)) pushPool(FUNCTIONALITY_GALLERY["file-storage"]);
  if (/smart home|speaker|thermostat|lighting|lock|camera|sensor|vacuum|doorbell|plug|router/.test(keys))
    pushPool(FUNCTIONALITY_GALLERY["smart-home"]);
  if (/monitor|keyboard|chair|desk|headset|webcam|printer|mouse|dock/.test(keys))
    pushPool(FUNCTIONALITY_GALLERY["office-hardware"]);

  const merged = [hero, ...pool];
  for (const pad of GENERIC_GALLERY_SHOTS) {
    if (merged.length >= 5) break;
    if (!merged.includes(pad)) merged.push(pad);
  }
  return merged.slice(0, 6);
}