import fs from "fs";

const overlap = new Set([
  "airops","blaze-ai","lalal-ai","magical-ai","mubert","murf-ai","opus-clip",
  "play-ht","remnote","slite","superwhisper","syllaby","tactiq","taskade",
  "textexpander","wispr-flow","writesonic",
]);
const banExact = new Set([
  "https://thesynlab.com/my-stack",
  "https://thesynlab.com/widgets",
  "https://thesynlab.com/search",
  "https://thesynlab.com/tools/compare",
  "https://thesynlab.com/tools/stack-builder",
  "https://thesynlab.com/tools/stack-quiz",
  "https://thesynlab.com/tools/tco-calculator",
  "https://thesynlab.com/tools/vendor-risk-checker",
  "https://thesynlab.com/tools/workflow-blueprint",
]);

function shouldDrop(loc) {
  if (banExact.has(loc)) return true;
  if (loc.includes("/widget/")) return true;
  const m = loc.match(/\/products\/([^/]+)(?:\/|$)/);
  if (m && overlap.has(m[1])) return true;
  if (loc.includes("www.thesynlab.com")) return true;
  return false;
}

const file = "public/sitemap.xml";
const xml = fs.readFileSync(file, "utf8");
const urls = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0]);
const kept = [];
let dropped = 0;
const droppedSamples = [];
for (const block of urls) {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc || shouldDrop(loc)) {
    dropped++;
    if (droppedSamples.length < 12) droppedSamples.push(loc);
    continue;
  }
  kept.push(block);
}
const out =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  kept.map((b) => `  ${b}`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(file, out);
console.log("kept", kept.length, "dropped", dropped);
console.log("samples", droppedSamples.join(" | "));