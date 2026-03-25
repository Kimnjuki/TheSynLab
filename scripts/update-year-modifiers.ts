import "dotenv/config";
import { ConvexHttpClient } from "convex/browser";

async function main() {
  const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Missing CONVEX_URL or VITE_CONVEX_URL env var.");
  }

  const fromYear = process.env.FROM_YEAR ?? "2025";
  const toYear = process.env.TO_YEAR ?? "2026";
  const minViews = Number(process.env.MIN_VIEWS ?? "1000");

  const client = new ConvexHttpClient(convexUrl);

  const result = await client.mutation("posts:bulkUpdateYearModifiers" as any, {
    fromYear,
    toYear,
    minViews,
    postType: "guide",
  });

  // Best-effort: if you want to also touch livingGuides, pass postIds from a query in a follow-up.
  console.log("Bulk year update complete:", result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

