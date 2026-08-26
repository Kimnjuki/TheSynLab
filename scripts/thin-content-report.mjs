#!/usr/bin/env node
/** Thin-content report: ranks indexable prerendered pages by static body size. */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const NO = new Set([
  "/forum", "/community/setups", "/community/leaderboard", "/products/watchlist",
  "/search", "/tasks", "/tools/find", "/tools/hub-builder",
  "/tools/compatibility-leaderboard", "/tools/automations",
  "/admin", "/profile", "/settings", "/auth",
]);

function walk(d, a = []) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, a);
    else if (e.endsWith(".html")) a.push(p);
  }
  return a;
}

const rows = walk("dist")
  .map((f) => {
    const raw = readFileSync(f, "utf8");
    let r = f.replace(/^dist/, "").replace(/\\/g, "/");
    r = r === "/index.html" ? "/" : r.replace(/\/index\.html$/, "");
    if (NO.has(r) || r.endsWith("404.html") || /^\/google/.test(r)) return null;
    const b = raw.slice(raw.indexOf('<div id="root">'), raw.lastIndexOf("</body>"));
    const t = b
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return [t.length, r];
  })
  .filter(Boolean)
  .sort((a, b) => a[0] - b[0]);

console.log("THINNEST 35 INDEXABLE PAGES (static body chars):");
rows.slice(0, 35).forEach(([n, r]) => console.log(String(n).padStart(6), r));
console.log("\nDistribution:", {
  "<400 chars": rows.filter(([n]) => n < 400).length,
  "400-1000": rows.filter(([n]) => n >= 400 && n < 1000).length,
  "1k-4k": rows.filter(([n]) => n >= 1000 && n < 4000).length,
  ">4k": rows.filter(([n]) => n >= 4000).length,
});
console.log("Total pages:", rows.length);
