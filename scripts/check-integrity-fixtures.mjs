import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function assertClose(actual, expected, id) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > 1e-9) {
    throw new Error(id + ": expected " + expected + ", got " + actual);
  }
}

function calculateTco36(inputs) {
  const horizonMonths = inputs.horizonMonths ?? 36;
  if (!Number.isFinite(inputs.seats) || inputs.seats < 0) return { rejectedReason: "seats", tco36: NaN };
  if (!Number.isFinite(inputs.pricePerSeatPerPeriod) || inputs.pricePerSeatPerPeriod < 0) {
    return { rejectedReason: "price", tco36: NaN };
  }
  const periodCount = inputs.billingCadence === "monthly" ? horizonMonths : horizonMonths / 12;
  const subscriptionTotal = inputs.seats * inputs.pricePerSeatPerPeriod * periodCount;
  const laborTotal =
    ((inputs.implementationHours ?? 0) + (inputs.migrationHours ?? 0) + (inputs.trainingHours ?? 0)) *
    (inputs.loadedHourlyRate ?? 0);
  const otherFeesTotal =
    (inputs.exitCost ?? 0) +
    (inputs.supportFeesTotal ?? 0) +
    (inputs.maintenanceTotal ?? 0) +
    (inputs.mandatoryAddonsTotal ?? 0) +
    (inputs.usageOverageTotal ?? 0);
  const tco36 = subscriptionTotal + laborTotal + otherFeesTotal;
  return {
    tco36,
    roi: tco36 === 0 ? "undefined_zero_denominator" : null,
  };
}

function convertScore(value, from, to) {
  const to100 = from === "0-5" ? value * 20 : from === "0-10" ? value * 10 : value;
  let next = to === "0-100" ? to100 : to === "0-10" ? to100 / 10 : to100 / 20;
  if (to !== "0-100") next = Math.round(next * 10) / 10;
  else next = Math.round(next);
  return next;
}

const tcoCases = [
  {
    id: "10_seats_10_usd_mo",
    inputs: { currency: "USD", seats: 10, pricePerSeatPerPeriod: 10, billingCadence: "monthly" },
    expected: 3600,
  },
  {
    id: "same_plus_impl_and_exit",
    inputs: {
      currency: "USD",
      seats: 10,
      pricePerSeatPerPeriod: 10,
      billingCadence: "monthly",
      implementationHours: 20,
      loadedHourlyRate: 50,
      exitCost: 500,
    },
    expected: 5100,
  },
  {
    id: "free_plan_zero",
    inputs: { currency: "USD", seats: 10, pricePerSeatPerPeriod: 0, billingCadence: "monthly" },
    expected: 0,
    expectRoiUndefined: true,
  },
];

const scaleCases = [
  { from: "0-10", to: "0-100", input: 6.8, expected: 68 },
  { from: "0-5", to: "0-10", input: 3.4, expected: 6.8 },
  { from: "0-100", to: "0-10", input: 68, expected: 6.8 },
];

let failed = 0;
for (const c of tcoCases) {
  try {
    const out = calculateTco36(c.inputs);
    assertClose(out.tco36, c.expected, c.id);
    if (c.expectRoiUndefined && out.roi !== "undefined_zero_denominator") {
      throw new Error(c.id + ": ROI should be undefined_zero_denominator");
    }
    console.log("PASS tco " + c.id);
  } catch (e) {
    failed++;
    console.error("FAIL tco " + e.message);
  }
}

for (const c of scaleCases) {
  try {
    const got = convertScore(c.input, c.from, c.to);
    assertClose(got, c.expected, c.from + "->" + c.to + ":" + c.input);
    console.log("PASS scale " + c.from + "->" + c.to + " " + c.input);
  } catch (e) {
    failed++;
    console.error("FAIL scale " + e.message);
  }
}

const staticSrc = fs.readFileSync(path.join(root, "src/data/staticProductData.ts"), "utf8");
const heroSrc = fs.readFileSync(path.join(root, "src/components/home/Hero.tsx"), "utf8");
const notionMatch = staticSrc.match(/productName:\s*"Notion"[\s\S]*?trustScore:\s*([0-9.]+)/);
const notionTrust = notionMatch ? Number(notionMatch[1]) : null;
if (notionTrust == null) {
  failed++;
  console.error("FAIL catalog: Notion trustScore not found");
} else if (/score:\s*9\.2/.test(heroSrc)) {
  failed++;
  console.error("FAIL hero still hard-codes 9.2 sample score");
} else if (!heroSrc.includes("STATIC_PRODUCTS") || !heroSrc.includes("notion")) {
  failed++;
  console.error("FAIL hero does not source Notion from STATIC_PRODUCTS");
} else {
  console.log("PASS hero uses catalog; Notion trustScore=" + notionTrust);
}

const sandboxSrc = fs.readFileSync(path.join(root, "src/components/home/ComparisonSandbox.tsx"), "utf8");
if (/Math\.random\(\)/.test(sandboxSrc)) {
  failed++;
  console.error("FAIL sandbox still uses Math.random for TCO");
} else {
  console.log("PASS sandbox has no Math.random TCO");
}

console.log(failed === 0 ? "\nAll integrity fixtures passed." : "\n" + failed + " fixture(s) failed.");
process.exit(failed === 0 ? 0 : 1);