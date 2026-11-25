import fs from "fs";
import { createRequire } from "module";
// Load overrides without TS transpile: duplicate parse via dynamic import after building trivial map
const overrideSrc = fs.readFileSync("src/data/seoMetaOverrides.ts", "utf8");
const blogBlock = overrideSrc.match(/export const BLOG_META_OVERRIDES[\s\S]*?^};/m)?.[0];
if (!blogBlock) throw new Error("no blog overrides");
const entries = [...blogBlock.matchAll(/"([^"]+)":\s*\{[\s\S]*?title:\s*"([^"]*)"[\s\S]*?description:\s*\n?\s*"([^"]*)"/g)];
let src = fs.readFileSync("src/data/blogArticles.ts", "utf8");
let n = 0;
for (const m of entries) {
  const slug = m[1];
  const title = m[2];
  const description = m[3].replace(/\\n/g, " ");
  const slugMarker = `slug: "${slug}"`;
  const idx = src.indexOf(slugMarker);
  if (idx < 0) {
    console.log("missing", slug);
    continue;
  }
  const windowEnd = Math.min(src.length, idx + 1500);
  let chunk = src.slice(idx, windowEnd);
  const before = chunk;
  chunk = chunk.replace(/seoTitle:\s*"[^"]*"/, `seoTitle: ${JSON.stringify(title)}`);
  chunk = chunk.replace(/metaDescription:\s*"[^"]*"/, `metaDescription: ${JSON.stringify(description)}`);
  if (chunk !== before) {
    src = src.slice(0, idx) + chunk + src.slice(windowEnd);
    n++;
    console.log("updated", slug);
  } else console.log("no fields", slug);
}
fs.writeFileSync("src/data/blogArticles.ts", src);
console.log("done", n);