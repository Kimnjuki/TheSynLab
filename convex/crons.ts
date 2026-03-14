/**
 * Competitive Blueprint cron jobs.
 * refreshAllMlPredictions weekly, refreshAffiliatePrices every 6h.
 * processTranslationQueue requires an action – using refreshAffiliatePrices
 * as placeholder for hourly; add translateReview action when ready.
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.weekly(
  "refreshAllMlPredictions",
  { dayOfWeek: 0, hourUTC: 2, minuteUTC: 0 },
  internal.cronHandlers.refreshAllMlPredictions
);

crons.interval(
  "refreshAffiliatePrices",
  { hours: 6 },
  internal.cronHandlers.refreshAffiliatePrices
);

crons.hourly(
  "processTranslationQueue",
  { minuteUTC: 30 },
  internal.cronHandlers.processTranslationQueue
);

export default crons;
