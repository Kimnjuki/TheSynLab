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
  { match: /smart home|intelligent home/i, url: U("photo-1558002038-1055907df827") },
  { match: /hybrid office|office hardware/i, url: U("photo-1497215728101-856f4ea42174") },
];

/** Generic default (clean laptop workspace). */
export const DEFAULT_PRODUCT_IMAGE = U("photo-1517694712202-14dd9538aa97");

/** Resolve an image URL for a product record. */
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