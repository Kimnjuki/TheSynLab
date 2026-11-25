/**
 * Pure 36-month TCO calculator (T08 foundation).
 * Deterministic, no I/O, no commercial ranking inputs.
 * Spec: thesynlab_research_and_cursor_plan.json → cost_model_specification
 */

export type BillingCadence = "monthly" | "annual";

export interface Tco36Inputs {
  currency: string;
  seats: number;
  /** Price per seat for one billing period in major currency units */
  pricePerSeatPerPeriod: number;
  billingCadence: BillingCadence;
  horizonMonths?: number;
  implementationHours?: number;
  migrationHours?: number;
  trainingHours?: number;
  loadedHourlyRate?: number;
  exitCost?: number;
  supportFeesTotal?: number;
  maintenanceTotal?: number;
  mandatoryAddonsTotal?: number;
  usageOverageTotal?: number;
  taxIncluded?: boolean;
}

export interface Tco36Outputs {
  currency: string;
  horizonMonths: number;
  subscriptionTotal: number;
  laborTotal: number;
  otherFeesTotal: number;
  tco36: number;
  effectiveMonthly: number;
  annualRecurringSubscriptionQuote: number;
  costPerSeatOverHorizon: number | null;
  roi: number | null | "undefined_zero_denominator";
  assumptions: string[];
  rejectedReason?: string;
}

const DEFAULT_HORIZON = 36;

function periodsInHorizon(cadence: BillingCadence, horizonMonths: number): number {
  return cadence === "monthly" ? horizonMonths : horizonMonths / 12;
}

export function calculateTco36(inputs: Tco36Inputs): Tco36Outputs {
  const horizonMonths = inputs.horizonMonths ?? DEFAULT_HORIZON;
  const assumptions: string[] = [
    `horizon_months=${horizonMonths}`,
    `billing_cadence=${inputs.billingCadence}`,
    `tax_included=${inputs.taxIncluded === true}`,
  ];

  if (!Number.isFinite(inputs.seats) || inputs.seats < 0) {
    return reject(inputs.currency, horizonMonths, "seats must be a non-negative number", assumptions);
  }
  if (!Number.isFinite(inputs.pricePerSeatPerPeriod) || inputs.pricePerSeatPerPeriod < 0) {
    return reject(inputs.currency, horizonMonths, "pricePerSeatPerPeriod must be a non-negative number", assumptions);
  }
  if (horizonMonths <= 0 || !Number.isFinite(horizonMonths)) {
    return reject(inputs.currency, horizonMonths, "horizonMonths must be positive", assumptions);
  }
  if (!inputs.currency || typeof inputs.currency !== "string") {
    return reject("UNKNOWN", horizonMonths, "currency is required", assumptions);
  }

  const periodCount = periodsInHorizon(inputs.billingCadence, horizonMonths);
  const subscriptionTotal = inputs.seats * inputs.pricePerSeatPerPeriod * periodCount;

  const laborHours =
    (inputs.implementationHours ?? 0) +
    (inputs.migrationHours ?? 0) +
    (inputs.trainingHours ?? 0);
  const rate = inputs.loadedHourlyRate ?? 0;
  if (laborHours < 0 || rate < 0) {
    return reject(inputs.currency, horizonMonths, "labor hours and rate must be non-negative", assumptions);
  }
  const laborTotal = laborHours * rate;

  const otherFeesTotal =
    (inputs.exitCost ?? 0) +
    (inputs.supportFeesTotal ?? 0) +
    (inputs.maintenanceTotal ?? 0) +
    (inputs.mandatoryAddonsTotal ?? 0) +
    (inputs.usageOverageTotal ?? 0);

  if (otherFeesTotal < 0) {
    return reject(inputs.currency, horizonMonths, "fee totals must be non-negative", assumptions);
  }

  const tco36 = subscriptionTotal + laborTotal + otherFeesTotal;
  const effectiveMonthly = tco36 / horizonMonths;
  const annualRecurringSubscriptionQuote =
    inputs.billingCadence === "monthly"
      ? inputs.seats * inputs.pricePerSeatPerPeriod * 12
      : inputs.seats * inputs.pricePerSeatPerPeriod;

  const costPerSeatOverHorizon = inputs.seats > 0 ? tco36 / inputs.seats : null;

  assumptions.push(
    `subscription_total=${subscriptionTotal}`,
    `labor_total=${laborTotal}`,
    `other_fees_total=${otherFeesTotal}`
  );

  return {
    currency: inputs.currency,
    horizonMonths,
    subscriptionTotal,
    laborTotal,
    otherFeesTotal,
    tco36,
    effectiveMonthly,
    annualRecurringSubscriptionQuote,
    costPerSeatOverHorizon,
    roi: tco36 === 0 ? "undefined_zero_denominator" : null,
    assumptions,
  };
}

function reject(
  currency: string,
  horizonMonths: number,
  reason: string,
  assumptions: string[]
): Tco36Outputs {
  return {
    currency,
    horizonMonths,
    subscriptionTotal: 0,
    laborTotal: 0,
    otherFeesTotal: 0,
    tco36: NaN,
    effectiveMonthly: NaN,
    annualRecurringSubscriptionQuote: 0,
    costPerSeatOverHorizon: null,
    roi: null,
    assumptions,
    rejectedReason: reason,
  };
}

/**
 * Golden fixtures from the research cost_model_specification scenarios.
 * Note: the research JSON listed expected_tco_36 10800 / 12300 for
 * "10 seats x $10/seat/month x 36", which is arithmetically 3600 / 5100.
 * This module follows the stated formula, not the incorrect totals.
 */
export const TCO36_GOLDEN_FIXTURES = [
  {
    id: "10_seats_10_usd_mo",
    inputs: {
      currency: "USD",
      seats: 10,
      pricePerSeatPerPeriod: 10,
      billingCadence: "monthly" as const,
    },
    expectedTco36: 3600,
  },
  {
    id: "same_plus_impl_and_exit",
    inputs: {
      currency: "USD",
      seats: 10,
      pricePerSeatPerPeriod: 10,
      billingCadence: "monthly" as const,
      implementationHours: 20,
      loadedHourlyRate: 50,
      exitCost: 500,
    },
    expectedTco36: 5100,
  },
  {
    id: "free_plan_zero",
    inputs: {
      currency: "USD",
      seats: 10,
      pricePerSeatPerPeriod: 0,
      billingCadence: "monthly" as const,
    },
    expectedTco36: 0,
    expectRoiUndefined: true,
  },
] as const;