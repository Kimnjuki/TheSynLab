import { createRequire } from "module";
import { pathToFileURL } from "url";
import { register } from "node:module";
// use dynamic import via tsx already - just parse files with regex for speed
import fs from "fs";

const tools = [...fs.readFileSync("src/data/saasTools.ts","utf8").matchAll(/slug:\s*"([^"]+)"/g)].map(m=>m[1]);
const toolSet = new Set(tools);
// expanded uses slug:
const expanded = [...fs.readFileSync("src/data/expandedProductsStatic.ts","utf8").matchAll(/slug:\s*"([^"]+)"/g)].map(m=>m[1]);
const staticCore = [...fs.readFileSync("src/data/staticProductData.ts","utf8").matchAll(/productSlug:\s*"([^"]+)"/g)].map(m=>m[1]);
const products = new Set([...expanded, ...staticCore]);
const overlaps = [...toolSet].filter(s => products.has(s)).sort();
console.log(overlaps.join("\n"));
console.log("COUNT", overlaps.length);
console.log("tools", toolSet.size, "products", products.size);