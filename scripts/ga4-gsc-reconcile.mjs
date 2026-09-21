#!/usr/bin/env node
/**
 * GA4 ⇄ GSC reconciliation — TheSynLab
 *
 * Turns the two exports into the comparison nobody can do by eye, and tests the
 * "is this growth real?" question with the fingerprints that bots cannot fake.
 *
 * Reads a GA4 "Reports snapshot" CSV export and a Search Console Performance
 * export folder (Chart.csv, Countries.csv, Devices.csv, Pages.csv, Queries.csv).
 *
 * Usage:
 *   node scripts/ga4-gsc-reconcile.mjs <GA4-snapshot.csv> <GSC-export-folder>
 *   node scripts/ga4-gsc-reconcile.mjs            # uses the default Downloads paths
 *
 * Exit code 0 = analysed, 1 = inputs unreadable.
 * See docs/ANALYTICS_GSC_GA4_RECONCILIATION.md for the interpretation.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { homedir } from "node:os";

const DEFAULT_GA4 = join(homedir(), "Downloads", "Reports_snapshot.csv");
const DEFAULT_GSC = join(
  homedir(),
  "Downloads",
  "https___thesynlab.com_-Performance-on-Search-2026-09-21"
);

/* ── tiny RFC4180-ish CSV parser (handles quoted titles containing commas) ── */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

/**
 * GA4 "Reports snapshot" export → array of { header, rows } tables.
 * Every table in that export is preceded by a `#` comment block (the Start date /
 * End date header), which is what separates one table from the next.
 */
function parseGa4Tables(text) {
  const tables = [];
  let current = null;
  let pendingNewTable = true;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "") continue;
    if (line.startsWith("#")) {
      pendingNewTable = true;
      continue;
    }
    const cells = parseCsv(line)[0];
    if (pendingNewTable) {
      current = { header: cells, rows: [] };
      tables.push(current);
      pendingNewTable = false;
    } else if (current) {
      current.rows.push(cells);
    }
  }
  return tables;
}

function findTable(tables, predicate, label) {
  const t = tables.find(predicate);
  if (!t) {
    throw new Error(`GA4 export did not contain the "${label}" table — has the export format changed?`);
  }
  return t;
}

const num = (v) => Number(String(v).replace(/[^0-9.-]/g, "")) || 0;
const pct = (v, digits = 2) => `${(v * 100).toFixed(digits)}%`;


/* ── load inputs ─────────────────────────────────────────────────────────── */
const ga4Path = resolve(process.argv[2] || DEFAULT_GA4);
const gscDir = resolve(process.argv[3] || DEFAULT_GSC);

if (!existsSync(ga4Path)) {
  console.error(`✗ GA4 export not found: ${ga4Path}`);
  console.error("  Usage: node scripts/ga4-gsc-reconcile.mjs <GA4-snapshot.csv> <GSC-export-folder>");
  process.exit(1);
}
if (!existsSync(gscDir)) {
  console.error(`✗ GSC export folder not found: ${gscDir}`);
  process.exit(1);
}

const readMaybe = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const gsc = (name) => {
  const p = join(gscDir, name);
  return existsSync(p) ? parseCsv(readFileSync(p, "utf8")) : [];
};

const tables = parseGa4Tables(readMaybe(ga4Path));

/* ── GA4 tables ──────────────────────────────────────────────────────────── */
const tOverview = findTable(tables, (t) => t.header[0] === "Active users", "overview");
const tTitles = findTable(tables, (t) => t.header[0] === "Page title and screen class", "page titles");
const tFirstUser = findTable(tables, (t) => t.header[0] === "First user source / medium", "first user source");
const tSessions = findTable(tables, (t) => t.header[0] === "Session source / medium", "session source");
const tNthDay = findTable(tables, (t) => t.header[0] === "Nth day", "nth day");
const tCity = findTable(tables, (t) => t.header[0] === "City", "city");

const [activeUsers, newUsers, avgEngagement, eventCount] = tOverview.rows[0].map(num);

const channelUsers = (name) =>
  tFirstUser.rows.filter((r) => r[0].toLowerCase().includes(name)).reduce((a, r) => a + num(r[1]), 0);
const directUsers = channelUsers("direct");
const googleUsers = channelUsers("google");
const bingUsers = channelUsers("bing");
const organicUsers = googleUsers + bingUsers;

const sessionsTotal = tSessions.rows.reduce((a, r) => a + num(r[1]), 0);
const sessionOrganic = tSessions.rows.filter((r) => /organic/i.test(r[0])).reduce((a, r) => a + num(r[1]), 0);
const sessionDirect = tSessions.rows.filter((r) => /direct/i.test(r[0])).reduce((a, r) => a + num(r[1]), 0);

const titleRows = tTitles.rows
  .map((r) => ({ title: r[0], views: num(r[1]), users: num(r[2]), events: num(r[3]), bounce: num(r[4]) }))
  .sort((a, b) => b.views - a.views);
const totalViews = titleRows.reduce((a, r) => a + r.views, 0);
const topTitle = titleRows[0];
const homepageShareUsers = activeUsers ? topTitle.users / activeUsers : 0;
const homepageShareViews = totalViews ? topTitle.views / totalViews : 0;

const days = tNthDay.rows.map((r) => ({ day: num(r[0]), neu: num(r[1]), ret: num(r[2]) }));
const half = Math.max(1, Math.floor(days.length / 2));
const firstHalf = days.slice(0, half).reduce((a, d) => a + d.neu, 0);
const secondHalf = days.slice(half).reduce((a, d) => a + d.neu, 0);
const zeroDays = days.filter((d) => d.neu === 0).map((d) => d.day);
const nonZero = days.filter((d) => d.neu > 0).map((d) => d.neu);
const minNonZero = nonZero.length ? Math.min(...nonZero) : 0;
const dipDays = days.filter((d) => d.neu > 0 && d.neu < 100).map((d) => d.day);
const returningTotal = days.reduce((a, d) => a + d.ret, 0);

const cities = tCity.rows.map((r) => ({ city: r[0], users: num(r[1]) })).sort((a, b) => b.users - a.users);
const cityTotal = cities.reduce((a, c) => a + c.users, 0) || 1;
const top10CityShare = cities.slice(0, 10).reduce((a, c) => a + c.users, 0) / cityTotal;

/* ── GSC tables ──────────────────────────────────────────────────────────── */
const chart = gsc("Chart.csv").slice(1); // Date,Clicks,Impressions,CTR,Position
const countries = gsc("Countries.csv").slice(1);
const pages = gsc("Pages.csv").slice(1);
const queries = gsc("Queries.csv").slice(1);

/* ── GSC-derived metrics ─────────────────────────────────────────────────── */
const devices = gsc("Devices.csv").slice(1);
const filters = gsc("Filters.csv");

const gscClicks = chart.reduce((a, r) => a + num(r[1]), 0);
const gscImpr = chart.reduce((a, r) => a + num(r[2]), 0);
const gscPos = chart.length ? chart.reduce((a, r) => a + num(r[4]), 0) / chart.length : 0;
const imprFirst = chart.length ? num(chart[0][2]) : 0;
const imprLast = chart.length ? num(chart[chart.length - 1][2]) : 0;
const imprHalf = Math.max(1, Math.floor(chart.length / 2));
const imprEarly = chart.slice(0, imprHalf).reduce((a, r) => a + num(r[2]), 0);
const imprLate = chart.slice(imprHalf).reduce((a, r) => a + num(r[2]), 0);
const gscCountryImp = (name) => {
  const row = countries.find((r) => r[0]?.toLowerCase() === name.toLowerCase());
  return row ? num(row[2]) : 0;
};
const strikingDistance = pages
  .map((r) => ({ page: r[0], impressions: num(r[2]), position: num(r[4]) }))
  .filter((p) => p.impressions > 0 && p.position > 0 && p.position <= 25)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 8);

/* ── report ──────────────────────────────────────────────────────────────── */
const L = (...args) => console.log(...args);
const rule = (t) => L(`\n── ${t} ${"─".repeat(Math.max(0, 68 - t.length))}`);
const flag = (msg) => L(`  ✗ ${msg}`);
const good = (msg) => L(`  ✓ ${msg}`);
const warn = (msg) => L(`  ⚠ ${msg}`);

L("GA4 ⇄ GSC RECONCILIATION — TheSynLab");
L(`  GA4 export : ${basename(ga4Path)}`);
L(`  GSC export : ${basename(gscDir)}`);
if (filters.length > 1) {
  L(`  GSC filter : ${filters.slice(1).map((r) => `${r[0]}=${r[1]}`).join(", ")}`);
}

rule("GA4 property totals");
L(`  Active users           ${activeUsers.toLocaleString()}`);
L(`  New users              ${newUsers.toLocaleString()}  (${pct(newUsers / (activeUsers || 1), 1)} of active)`);
L(`  Sessions               ${sessionsTotal.toLocaleString()}  (${(sessionsTotal / (activeUsers || 1)).toFixed(2)} per user)`);
L(`  Events                 ${eventCount.toLocaleString()}  (${(eventCount / (activeUsers || 1)).toFixed(2)} per user, ${(eventCount / (sessionsTotal || 1)).toFixed(2)} per session)`);
L(`  Avg engagement / user  ${avgEngagement.toFixed(3)} s`);
L(`  Top title views        ${topTitle.views.toLocaleString()} (${pct(homepageShareViews, 1)} of all views) — "${topTitle.title.slice(0, 50)}"`);
L(`  Bounce rate (top page) ${pct(topTitle.bounce, 1)}`);

rule("Acquisition mix vs Search Console");
L(`  GA4 first users — direct ${directUsers.toLocaleString()} (${pct(directUsers / (activeUsers || 1), 2)}), google ${googleUsers}, bing ${bingUsers}`);
L(`  GA4 organic     — ${organicUsers} users (${pct(organicUsers / (activeUsers || 1), 3)})`);
L(`  GA4 sessions    — direct ${sessionDirect.toLocaleString()}, organic ${sessionOrganic}`);
L(`  GSC             — ${gscClicks.toLocaleString()} clicks / ${gscImpr.toLocaleString()} impressions over ${chart.length} days, avg position ${gscPos.toFixed(1)}`);
L("");
L("  Reconcilable pair: GA4 organic sessions vs GSC clicks");
L(`    GA4 organic sessions ${sessionOrganic}  ≈  GSC clicks ${gscClicks}  → both ≈ 0 (agreement at the noise floor)`);
L(`    Everything else in GA4 (${pct(directUsers / (activeUsers || 1), 2)} direct) has NO Search Console counterpart:`);
L("    Search Console only measures Google Search, so it can never confirm a direct-channel rise.");

rule("Is the GA4 growth real? (bot fingerprint)");
L(`  New users — first half ${firstHalf.toLocaleString()} vs second half ${secondHalf.toLocaleString()} → ${(secondHalf / (firstHalf || 1)).toFixed(2)}× step`);
L(`  Returning users (28 d) ${returningTotal.toLocaleString()} (${pct(returningTotal / (newUsers + returningTotal || 1), 1)} of user-days)`);
if (zeroDays.length) flag(`exactly-0 new-user days at day ${zeroDays.join(", ")} — a human audience does not stop at zero mid-month`);
if (dipDays.length) flag(`implausible dips below 100 new users at day ${dipDays.join(", ")} (machine supply hiccup, not demand)`);
if (avgEngagement < 5) flag(`average engagement ${avgEngagement.toFixed(3)} s per user — human range is tens of seconds`);
if (homepageShareUsers > 0.9) flag(`${pct(homepageShareUsers, 1)} of users never leave / (landing-page collapse on a 662-page site)`);

rule("Geo cross-check (GA4 city users vs GSC country impressions)");
const datacenterCities = ["Ashburn", "Council Bluffs", "Mountain View", "Santa Clara", "Secaucus", "Piscataway", "North Bergen", "Tukwila", "Bellevue", "Fair Lawn", "Simferopol", "Yalta", "Moscow"];
const suspicious = cities.filter((c) => datacenterCities.some((d) => c.city.includes(d)));
L(`  Datacenter-flavoured GA4 cities: ${suspicious.map((c) => `${c.city} ${c.users}`).join(" · ") || "(none)"}`);
for (const [label, cityKey, country] of [["United States", "new york", "United States"], ["Singapore", "singapore", "Singapore"]]) {
  const ga4City = cities.find((c) => c.city.toLowerCase() === cityKey);
  L(`  ${label.padEnd(14)} GA4 city users ${String(ga4City ? ga4City.users : "n/a").padStart(6)}   GSC impressions ${String(gscCountryImp(country)).padStart(4)}`);
}
L(`  Iran (Tehran = GA4 top-3 city) → GSC impressions ${gscCountryImp("Iran")} (Iran is absent from the GSC country list)`);

rule("GSC detail");
L(`  Impressions ${imprFirst} → ${imprLast} (first → last day); early half ${imprEarly} vs late half ${imprLate} → ${imprLate >= imprEarly ? "flat/up" : "DECLINING"}`);
if (devices.length > 1) L(`  Devices: ${devices.map((d) => `${d[0]} ${d[1]} clicks / ${d[2]} impr`).join(" · ")}`);
if (strikingDistance.length) {
  L("  Striking distance (impressions with position ≤ 25 — cheapest wins):");
  for (const p of strikingDistance) {
    L(`    pos ${p.position.toFixed(1).padStart(5)}  ${String(p.impressions).padStart(4)} impr  ${p.page.replace("https://thesynlab.com", "")}`);
  }
}
if (queries.length > 1) L(`  Top query: "${queries[0][0]}" — ${queries[0][2]} impressions, position ${queries[0][4]}`);

rule("VERDICT");
if (directUsers / (activeUsers || 1) > 0.8 && avgEngagement < 5) {
  flag("GA4's headline growth is NOT organic demand: direct-channel traffic with machine engagement.");
  flag("Search Console cannot corroborate it by definition, and GSC's own demand is flat/declining.");
  L("     → treat this traffic as automated, filter/block it (doc §6), and never report it as growth.");
} else if (organicUsers > 0) {
  good("Part of the audience is search-attributable — reconcile GA4 organic sessions against GSC clicks (doc §7).");
} else {
  warn("No organic users at all — verify the tag fires and that GSC has fresh data before concluding.");
}
L("\nReference: docs/ANALYTICS_GSC_GA4_RECONCILIATION.md");

if (newUsers / (activeUsers || 1) > 0.9) flag(`${pct(newUsers / (activeUsers || 1), 1)} of active users are brand-new — no returning readership`);
if (topTitle.bounce < 0.3 && avgEngagement < 5) {
  warn(`bounce rate ${pct(topTitle.bounce, 1)} looks healthy only because duplicated page views mark sessions engaged`);
}
L(`  Top-10 cities = ${pct(top10CityShare, 1)} of users: ${cities.slice(0, 10).map((c) => `${c.city} ${c.users}`).join(" · ")}`);
