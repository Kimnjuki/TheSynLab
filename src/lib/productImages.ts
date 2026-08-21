/**
 * Free product imagery (Unsplash — free to use under the Unsplash License).
 *
 * Every product shown across the site (products hub, search, watchlist,
 * comparisons, hubs, finders) gets a relevant image even when the Convex
 * record has no `featuredImageUrl`.
 *
 * Resolution order:
 *   1. Exact product-slug match (curated, product-specific photo)
 *   2. Subcategory keyword match
 *   3. Category keyword match
 *   4. Generic default
 */

const U = (id: string) => `https://images.unsplash.com/${id}?w=800&h=600&fit=crop&auto=format`;

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
};

/** Fallback images matched against subcategory text (lowercase contains). */
const SUBCATEGORY_IMAGES: [RegExp, string][] = [
  [/focus|pomodoro|time.?block/i, U("photo-1506784983877-45594efa4cbe")],
  [/task|todo|checklist/i, U("photo-1484480974693-6ca0a78fb36b")],
  [/project|work.?management|agile/i, U("photo-1611224923853-80b023f02d71")],
  [/wiki|knowledge|document/i, U("photo-1517694712202-14dd9538aa97")],
  [/writing|grammar|editor/i, U("photo-1455390582262-044cdead277a")],
  [/design|graphic/i, U("photo-1626785774573-4b799315345d")],
  [/messaging|chat|voice/i, U("photo-1522071820081-009f0129c71c")],
  [/automation|workflow|integration/i, U("photo-1558494949-ef010cbdcc31")],
  [/crm|sales|marketing/i, U("photo-1563986768609-322da13575f3")],
  [/version control|developer|code/i, U("photo-1461749280684-dccba630e2f6")],
  [/cloud office|office suite/i, U("photo-1499951360447-b19be8fe80f5")],
  [/helpdesk|support/i, U("photo-1553775282-20af80779df7")],
  [/whiteboard/i, U("photo-1553877522-43269d4ea984")],
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
 * Resolve the best available image for a product.
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

  return DEFAULT_PRODUCT_IMAGE;
}