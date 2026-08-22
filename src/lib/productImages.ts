/**
 * Free product imagery (Unsplash — free to use under the Unsplash License).
 *
 * Every product shown across the site (products hub, search, watchlist,
 * comparisons, hubs, finders AND the product detail page) gets relevant
 * imagery even when the Convex record has no `featuredImageUrl`.
 *
 * Resolution order (hero):
 *   1. Exact product-slug match (curated, product-specific photo)
 *   2. Subcategory keyword match
 *   3. Category keyword match
 *   4. Functionality keyword match (product name / tags)
 *   5. Generic default
 *
 * Galleries (`getProductGalleryImages`) always return 4–6 related free
 * images so the PDP visual-story gallery never renders an empty state.
 */

const U = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

/** Curated per-product images keyed by product slug. */
export const PRODUCT_IMAGES: Record<string, string> = {
  // ---- Core SaaS (production seed) ----
  clickup: U("photo-1611224923853-80b023f02d71"), // task board
  todoist: U("photo-1484480974693-6ca0a78fb36b"), // checklist
  asana: U("photo-1507925921958-8a62f3d1a50d"), // sticky-note board
  notion: U("photo-1531403009284-440f080d1e12"), // workspace notes
  slack: U("photo-1611606063065-ee7946f0787a"), // messaging app
  canva: U("photo-1626785774573-4b799315345d"), // graphic design
  hubspot: U("photo-1563986768609-322da13575f3"), // CRM pipeline
  github: U("photo-1618401471353-b98afee0b2eb"), // code hosting
  zapier: U("photo-1558494949-ef010cbdcc31"), // connected workflows
  grammarly: U("photo-1455390582262-044cdead277a"), // writing
  teams: U("photo-1522071820081-009f0129c71c"), // team collaboration
  discord: U("photo-1542751371-adc38448a05e"), // gaming community
  make: U("photo-1551288049-bebda4e38f71"), // scenario builder
  confluence: U("photo-1517694712202-14dd9538aa97"), // docs on laptop
  prowritingaid: U("photo-1468779036391-52341f60b55d"), // long-form writing
  "monday-com": U("photo-1542744173-8e7e53415bb0"), // work OS board
  linear: U("photo-1461749280684-dccba630e2f6"), // code on screen

  // ---- AI meeting notes (Granola / Otter / Fireflies) ----
  granola: U("photo-1552664730-d307ca884978"), // meeting around table
  "otter-ai": U("photo-1478737270239-2f02b77fc618"), // live transcription mic
  "fireflies-ai": U("photo-1522071820081-009f0129c71c"), // recorded team meeting

  // ---- Competitive software set ----
  "focusflow-pro": U("photo-1506784983877-45594efa4cbe"), // calendar / time blocking
  "google-workspace-business-starter": U("photo-1499951360447-b19be8fe80f5"), // cloud office desk
  "notion-team-plan": U("photo-1531403009284-440f080d1e12"),
  "github-enterprise": U("photo-1618401471353-b98afee0b2eb"),
  "hubspot-crm": U("photo-1563986768609-322da13575f3"),
  "miro-business": U("photo-1553877522-43269d4ea984"), // online whiteboard
  "zapier-professional": U("photo-1558494949-ef010cbdcc31"),
  "zendesk-suite": U("photo-1553775282-20af80779df7"), // helpdesk support
  "todoist-business": U("photo-1484480974693-6ca0a78fb36b"),
  "grammarly-business": U("photo-1455390582262-044cdead277a"),
  "microsoft-365-business-standard": U("photo-1497215728101-856f4ea42174"), // modern office
  "make-core": U("photo-1551288049-bebda4e38f71"),
  "clickup-business": U("photo-1611224923853-80b023f02d71"),
  "n8n-community-edition": U("photo-1558494949-ef010cbdcc31"),
  "atlassian-confluence-cloud": U("photo-1517694712202-14dd9538aa97"),
  "asana-business": U("photo-1507925921958-8a62f3d1a50d"),
  "pipedrive-crm": U("photo-1563986768609-322da13575f3"),

  // ---- Smart home hardware ----
  "amazon-echo-hub": U("photo-1608043152269-423dbba4e7e1"), // smart speaker
  "schlage-encode-plus": U("photo-1558618666-fcd25c85cd64"), // smart lock
  "arlo-pro-5s": U("photo-1557597774-9d273605dfa9"), // security camera
  "eero-max-7": U("photo-1606904825846-647eb07f5be2"), // mesh router
  "ecobee-smart-thermostat-premium": U("photo-1585771724684-38269d6639fd"), // thermostat
  "philips-hue-starter-kit": U("photo-1473341304170-971dccb5ac1e"), // smart lighting
  "kasa-smart-plug-ep25": U("photo-1558346547-4439467bd1d5"), // smart plug
  "roborock-s8-pro-ultra": U("photo-1558618666-fcd25c85cd64"), // robot vacuum
  "google-nest-doorbell-wired": U("photo-1555963966-b7ae5404b6e8"), // video doorbell
  "aqara-multi-sensor-kit": U("photo-1518770660439-4636190af475"), // sensor electronics
  "google-nest-thermostat": U("photo-1585771724684-38269d6639fd"),
  "ring-video-doorbell-pro-2": U("photo-1555963966-b7ae5404b6e8"),
  "ring-video-doorbell": U("photo-1555963966-b7ae5404b6e8"),
  "tp-link-tapo-l930": U("photo-1473341304170-971dccb5ac1e"), // LED strip
  "lutron-caseta-smart-switch": U("photo-1558346547-4439467bd1d5"),
  "philips-hue": U("photo-1473341304170-971dccb5ac1e"),
  "ecobee-smart-thermostat": U("photo-1585771724684-38269d6639fd"),

  // ---- Office hardware ----
  "dell-ultrasharp-u3223qe": U("photo-1527443224154-c4a3942d3acf"), // monitor
  "keychron-q1-pro": U("photo-1587829741301-dc798b83add3"), // mechanical keyboard
  "brother-mfc-l3760cdw": U("photo-1612198273627-e6e6d3d7f5e0"), // printer
  "logitech-brio-4k": U("photo-1626285861696-9f0bf5a49c6d"), // webcam
  "jabra-evolve2-85": U("photo-1505740420928-5e560c06d30e"), // headset
  "anker-778-thunderbolt-dock": U("photo-1593642702821-c8da6771f0c6"), // dock / desk setup
  "herman-miller-aeron": U("photo-1580480055273-228ff5388ef8"), // ergonomic chair
  "synology-ds923-plus": U("photo-1544197150-b99a580bb7a8"), // NAS storage
  "neat-bar-pro": U("photo-1611532736597-de2d4265fba3"), // conference room
  "dymo-labelwriter-550": U("photo-1586953208448-b95a79798f07"), // label printer
  "logitech-mx-master-3s": U("photo-1527864550417-7fd91fc51a46"), // mouse
  "standdesk-pro-electric": U("photo-1593642632559-0c6d3fc62b89"), // standing desk
  "caldigit-ts4": U("photo-1593642702821-c8da6771f0c6"),

  // ---- E-commerce & finance (2026 expansion) ----
  shopify: U("photo-1441986300917-64674bd600d8"), // retail storefront
  stripe: U("photo-1556740738-b6a63e27c4df"), // card payment terminal
  square: U("photo-1556742049-0cfed4f6a45d"), // point of sale
  quickbooks: U("photo-1554224155-6726b3ff858f"), // accounting calculator
  klaviyo: U("photo-1563986768494-4dee2763ff3f"), // email marketing
  mailchimp: U("photo-1563986768494-4dee2763ff3f"), // email marketing

  // ---- Design & creative (2026 expansion) ----
  figma: U("photo-1581291518857-4e27b48ff24e"), // UI design on screen
  "adobe-express": U("photo-1626785774573-4b799315345d"),

  // ---- Developer tools (2026 expansion) ----
  jira: U("photo-1531403009284-440f080d1e12"), // agile boards
  gitlab: U("photo-1587620962725-abab7fe55159"), // code editor
  bitbucket: U("photo-1587620962725-abab7fe55159"),
  "vs-code": U("photo-1587620962725-abab7fe55159"),

  // ---- Communication & meetings (2026 expansion) ----
  zoom: U("photo-1587825140708-dfaf72ae4b04"), // video call laptop
  loom: U("photo-1573164713988-8665fc963095"), // recording at desk
  calendly: U("photo-1506784983877-45594efa4cbe"), // scheduling calendar
  "google-meet": U("photo-1587825140708-dfaf72ae4b04"),

  // ---- AI assistants (2026 expansion) ----
  "chatgpt-plus": U("photo-1620712943543-bcc4688e7485"), // AI concept
  "claude-pro": U("photo-1620712943543-bcc4688e7485"),
  "perplexity-pro": U("photo-1551288049-bebda4e38f71"), // research dashboard
  "notion-ai": U("photo-1531403009284-440f080d1e12"),

  // ---- Security (2026 expansion) ----
  "1password": U("photo-1563013544-824ae1b704d3"), // security lock
  bitwarden: U("photo-1563013544-824ae1b704d3"),

  // ---- Knowledge, data & storage (2026 expansion) ----
  airtable: U("photo-1551288049-bebda4e38f71"), // database grid
  obsidian: U("photo-1517842645767-c639042777db"), // notebook knowledge
  dropbox: U("photo-1597423244286-40db30950ff1"), // cloud storage devices
  "google-drive": U("photo-1597423244286-40db30950ff1"),
  trello: U("photo-1531403009284-440f080d1e12"), // kanban boards

  // ---- CRM & support (2026 expansion) ----
  salesforce: U("photo-1563986768609-322da13575f3"),
  "zoho-crm": U("photo-1563986768609-322da13575f3"),
  freshsales: U("photo-1563986768609-322da13575f3"),
  intercom: U("photo-1553775282-20af80779df7"), // customer support chat
  freshdesk: U("photo-1553775282-20af80779df7"),
};

/** Fallback images matched against subcategory text (lowercase contains). */
const SUBCATEGORY_IMAGES: [RegExp, string][] = [
  [/focus|pomodoro|time.?block/i, U("photo-1506784983877-45594efa4cbe")],
  [/task|todo|checklist/i, U("photo-1484480974693-6ca0a78fb36b")],
  [/project|work.?management|agile/i, U("photo-1611224923853-80b023f02d71")],
  [/wiki|knowledge|document/i, U("photo-1517694712202-14dd9538aa97")],
  [/writing|grammar|editor/i, U("photo-1455390582262-044cdead277a")],
  [/design|graphic|ui|ux/i, U("photo-1626785774573-4b799315345d")],
  [/messaging|chat|voice/i, U("photo-1522071820081-009f0129c71c")],
  [/automation|workflow|integration/i, U("photo-1558494949-ef010cbdcc31")],
  [/crm|sales|marketing/i, U("photo-1563986768609-322da13575f3")],
  [/version control|developer|code/i, U("photo-1461749280684-dccba630e2f6")],
  [/cloud office|office suite/i, U("photo-1499951360447-b19be8fe80f5")],
  [/helpdesk|support/i, U("photo-1553775282-20af80779df7")],
  [/whiteboard/i, U("photo-1553877522-43269d4ea984")],
  [/ecommerce|e-commerce|store|shop|retail/i, U("photo-1441986300917-64674bd600d8")],
  [/payment|billing|invoice|accounting|finance/i, U("photo-1556740738-b6a63e27c4df")],
  [/email|newsletter/i, U("photo-1563986768494-4dee2763ff3f")],
  [/video|meeting|conference call/i, U("photo-1587825140708-dfaf72ae4b04")],
  [/scheduling|calendar|appointment/i, U("photo-1506784983877-45594efa4cbe")],
  [/password|security|vault|auth/i, U("photo-1563013544-824ae1b704d3")],
  [/database|spreadsheet|airtable/i, U("photo-1551288049-bebda4e38f71")],
  [/note|second brain|obsidian/i, U("photo-1517842645767-c639042777db")],
  [/storage|file|drive|backup/i, U("photo-1597423244286-40db30950ff1")],
  [/kanban|board/i, U("photo-1531403009284-440f080d1e12")],
  [/ai assistant|chatbot|llm|gpt/i, U("photo-1620712943543-bcc4688e7485")],
  [/speaker|voice assistant/i, U("photo-1608043152269-423dbba4e7e1")],
  [/lock/i, U("photo-1558618666-fcd25c85cd64")],
  [/camera|video doorbell|doorbell/i, U("photo-1557597774-9d273605dfa9")],
  [/router|mesh|network/i, U("photo-1606904825846-647eb07f5be2")],
  [/thermostat/i, U("photo-1585771724684-38269d6639fd")],
  [/light|bulb|led/i, U("photo-1473341304170-971dccb5ac1e")],
  [/plug|switch|outlet/i, U("photo-1558346547-4439467bd1d5")],
  [/vacuum/i, U("photo-1558618666-fcd25c85cd64")],
  [/sensor/i, U("photo-1518770660439-4636190af475")],
  [/monitor|display/i, U("photo-1527443224154-c4a3942d3acf")],
  [/keyboard/i, U("photo-1587829741301-dc798b83add3")],
  [/printer|label/i, U("photo-1612198273627-e6e6d3d7f5e0")],
  [/webcam|camera bar/i, U("photo-1626285861696-9f0bf5a49c6d")],
  [/headset|headphone|audio/i, U("photo-1505740420928-5e560c06d30e")],
  [/dock|hub usb|thunderbolt/i, U("photo-1593642702821-c8da6771f0c6")],
  [/chair|seating/i, U("photo-1580480055273-228ff5388ef8")],
  [/desk/i, U("photo-1593642632559-0c6d3fc62b89")],
  [/nas|storage|server/i, U("photo-1544197150-b99a580bb7a8")],
  [/conference|meeting room/i, U("photo-1611532736597-de2d4265fba3")],
  [/mouse|pointer/i, U("photo-1527864550417-7fd91fc51a46")],
];

/** Fallback images matched against category text (lowercase contains). */
const CATEGORY_IMAGES: [RegExp, string][] = [
  [/productivity/i, U("photo-1611224923853-80b023f02d71")],
  [/collaboration/i, U("photo-1522071820081-009f0129c71c")],
  [/automation/i, U("photo-1558494949-ef010cbdcc31")],
  [/marketing|crm/i, U("photo-1563986768609-322da13575f3")],
  [/design/i, U("photo-1626785774573-4b799315345d")],
  [/writing/i, U("photo-1455390582262-044cdead277a")],
  [/developer/i, U("photo-1461749280684-dccba630e2f6")],
  [/ecommerce|commerce/i, U("photo-1441986300917-64674bd600d8")],
  [/finance|payment|accounting/i, U("photo-1556740738-b6a63e27c4df")],
  [/security/i, U("photo-1563013544-824ae1b704d3")],
  [/smart home|intelligent home/i, U("photo-1558002038-1055907df827")],
  [/hybrid office|office hardware/i, U("photo-1497215728101-856f4ea42174")],
];

/** Generic default (clean laptop workspace). */
export const DEFAULT_PRODUCT_IMAGE = U("photo-1517694712202-14dd9538aa97");

type ImageTarget = {
  productSlug?: string;
  productName?: string;
  category?: string;
  subcategory?: string;
};

/**
 * Resolve the best available hero image for a product.
 * Returns the stored `featuredImageUrl` when present, otherwise a curated
 * free image that relates to the product.
 */
export function getProductImage(
  product: ImageTarget & { featuredImageUrl?: string | null },
): string {
  if (product.featuredImageUrl) return product.featuredImageUrl;

  const slug = product.productSlug ?? "";
  if (slug && PRODUCT_IMAGES[slug]) return PRODUCT_IMAGES[slug];

  const sub = product.subcategory ?? "";
  for (const [re, img] of SUBCATEGORY_IMAGES) {
    if (sub && re.test(sub)) return img;
  }

  const cat = product.category ?? "";
  for (const [re, img] of CATEGORY_IMAGES) {
    if (cat && re.test(cat)) return img;
  }

  // Last resort: try to match on the product name itself (e.g. "Otter.ai")
  const name = (product.productName ?? "").toLowerCase();
  if (name.includes("otter")) return PRODUCT_IMAGES["otter-ai"];
  if (name.includes("fireflies")) return PRODUCT_IMAGES["fireflies-ai"];
  if (name.includes("granola")) return PRODUCT_IMAGES.granola;
  if (name.includes("zoom")) return PRODUCT_IMAGES.zoom;
  if (name.includes("figma")) return PRODUCT_IMAGES.figma;
  if (name.includes("shopify")) return PRODUCT_IMAGES.shopify;
  if (name.includes("stripe")) return PRODUCT_IMAGES.stripe;
  if (name.includes("jira")) return PRODUCT_IMAGES.jira;
  if (name.includes("gitlab")) return PRODUCT_IMAGES.gitlab;
  if (name.includes("salesforce")) return PRODUCT_IMAGES.salesforce;
  if (name.includes("mailchimp")) return PRODUCT_IMAGES.mailchimp;
  if (name.includes("klaviyo")) return PRODUCT_IMAGES.klaviyo;
  if (name.includes("calendly")) return PRODUCT_IMAGES.calendly;
  if (name.includes("loom")) return PRODUCT_IMAGES.loom;
  if (name.includes("airtable")) return PRODUCT_IMAGES.airtable;
  if (name.includes("obsidian")) return PRODUCT_IMAGES.obsidian;
  if (name.includes("dropbox")) return PRODUCT_IMAGES.dropbox;
  if (name.includes("trello")) return PRODUCT_IMAGES.trello;
  if (name.includes("intercom")) return PRODUCT_IMAGES.intercom;
  if (name.includes("freshdesk")) return PRODUCT_IMAGES.freshdesk;
  if (name.includes("bitwarden")) return PRODUCT_IMAGES.bitwarden;
  if (name.includes("1password")) return PRODUCT_IMAGES["1password"];
  if (name.includes("chatgpt")) return PRODUCT_IMAGES["chatgpt-plus"];
  if (name.includes("claude")) return PRODUCT_IMAGES["claude-pro"];
  if (name.includes("perplexity")) return PRODUCT_IMAGES["perplexity-pro"];

  return DEFAULT_PRODUCT_IMAGE;
}

/* ------------------------------------------------------------------ */
/* Gallery support — every product detail page gets a full visual      */
/* story even when no editorial slides have been published yet.        */
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
  "scheduling": [
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

/** Generic closing shots used to pad any gallery to a consistent length. */
const GENERIC_GALLERY_SHOTS = [
  U("photo-1499951360447-b19be8fe80f5"), // cloud office desk
  U("photo-1522202176988-66273c2fd55f"), // people collaborating on laptops
  U("photo-1497215728101-856f4ea42174"), // modern office
  U("photo-1517694712202-14dd9538aa97"), // clean laptop workspace
];

/** Per-product gallery overrides (hero first). */
const PRODUCT_GALLERY_OVERRIDES: Record<string, string[]> = {
  shopify: [
    U("photo-1441986300917-64674bd600d8"),
    U("photo-1556740738-b6a63e27c4df"),
    U("photo-1556742049-0cfed4f6a45d"),
    U("photo-1551288049-bebda4e38f71"),
    U("photo-1522202176988-66273c2fd55f"),
  ],
  zoom: [
    U("photo-1587825140708-dfaf72ae4b04"),
    U("photo-1611532736597-de2d4265fba3"),
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1626285861696-9f0bf5a49c6d"),
    U("photo-1497215728101-856f4ea42174"),
  ],
  figma: [
    U("photo-1581291518857-4e27b48ff24e"),
    U("photo-1626785774573-4b799315345d"),
    U("photo-1553877522-43269d4ea984"),
    U("photo-1527443224154-c4a3942d3acf"),
    U("photo-1522202176988-66273c2fd55f"),
  ],
  granola: [
    U("photo-1552664730-d307ca884978"),
    U("photo-1478737270239-2f02b77fc618"),
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1455390582262-044cdead277a"),
    U("photo-1499951360447-b19be8fe80f5"),
  ],
  "otter-ai": [
    U("photo-1478737270239-2f02b77fc618"),
    U("photo-1552664730-d307ca884978"),
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1455390582262-044cdead277a"),
    U("photo-1499951360447-b19be8fe80f5"),
  ],
  "fireflies-ai": [
    U("photo-1522071820081-009f0129c71c"),
    U("photo-1552664730-d307ca884978"),
    U("photo-1478737270239-2f02b77fc618"),
    U("photo-1455390582262-044cdead277a"),
    U("photo-1499951360447-b19be8fe80f5"),
  ],
};

/**
 * Resolve 4–6 related free images for a product's detail-page gallery.
 * Order: stored galleryImages → per-product override → functionality pool
 * (matched against functionalityTags/category/subcategory/name) → generic pads.
 */
export function getProductGalleryImages(
  product: ImageTarget & {
    featuredImageUrl?: string | null;
    galleryImages?: string[] | null;
    functionalityTags?: string[] | null;
  },
): string[] {
  const stored = (product.galleryImages ?? []).filter(Boolean);
  if (stored.length >= 4) return stored.slice(0, 6);

  const slug = product.productSlug ?? "";
  if (slug && PRODUCT_GALLERY_OVERRIDES[slug]) {
    return PRODUCT_GALLERY_OVERRIDES[slug];
  }

  const hero = getProductImage(product);
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

  // Keyword-based matching for pools when no exact functionality tag exists
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

export type DefaultGallerySlide = {
  _id: string;
  slideType: string;
  imageUrl: string;
  caption: string;
  annotatedImageUrl?: string;
  scenarioTags?: string[];
  isPublished: boolean;
};

/**
 * Build default visual-story slides for a product that has no editorial
 * gallery slides yet, so the PDP gallery never shows an empty state.
 */
export function buildDefaultGallerySlides(
  product: ImageTarget & {
    featuredImageUrl?: string | null;
    galleryImages?: string[] | null;
    functionalityTags?: string[] | null;
  },
): DefaultGallerySlide[] {
  const name = product.productName || "This product";
  const images = getProductGalleryImages(product);
  const captions = [
    `${name} at a glance — the workspace view`,
    `${name} in daily use across a team`,
    `How ${name} fits into your existing stack`,
    `Planning and reviewing work with ${name}`,
    `${name} alongside the rest of your toolkit`,
    `Getting set up with ${name}`,
  ];
  const types = ["overview", "feature", "integration", "results", "recipe", "overview"];
  return images.map((imageUrl, i) => ({
    _id: `default-${product.productSlug ?? "product"}-${i}`,
    slideType: types[i % types.length],
    imageUrl,
    caption: captions[i % captions.length],
    scenarioTags: i === 0 ? ["Overview"] : undefined,
    isPublished: true,
  }));
}