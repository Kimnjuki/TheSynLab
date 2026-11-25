import fs from "fs";

const raw = fs.readFileSync(
  "C:/Users/Administrator/Downloads/https___thesynlab.com_-Performance-on-Search-2026-11-25/Queries.csv",
  "utf8"
);
const lines = raw.trim().split(/\r?\n/).slice(1);
const rows = [];
for (const l of lines) {
  const re = /^(.*),(\d+),(\d+),([0-9.]+)%,([0-9.]+)$/;
  const m = l.match(re);
  if (!m) continue;
  rows.push({
    q: m[1].replace(/^"|"$/g, ""),
    clicks: +m[2],
    imp: +m[3],
    ctr: m[4],
    pos: +m[5],
  });
}
rows.sort((a, b) => b.imp - a.imp);
console.log("TOP 50 BY IMPRESSIONS");
rows.slice(0, 50).forEach((r, i) =>
  console.log(
    `${i + 1}. [${r.imp} imp, pos ${r.pos}, ctr ${r.ctr}%, clicks ${r.clicks}] ${r.q}`
  )
);
console.log("\nOPPORTUNITY: pos<=12, imp>=30, clicks==0");
rows
  .filter((r) => r.pos <= 12 && r.imp >= 30 && r.clicks === 0)
  .slice(0, 50)
  .forEach((r, i) => console.log(`${i + 1}. [${r.imp} imp, pos ${r.pos}] ${r.q}`));
console.log(
  "\nTOTAL",
  rows.length,
  "imp",
  rows.reduce((s, r) => s + r.imp, 0),
  "clicks",
  rows.reduce((s, r) => s + r.clicks, 0)
);