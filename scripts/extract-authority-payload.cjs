const fs = require("fs");
const path = require("path");

const transcriptPath =
  "C:/Users/Administrator/.cursor/projects/c-Users-Administrator-Downloads-TheSynLab/agent-transcripts/073e2650-9e8d-456b-acf2-4c1e508f19c0.txt";
const marker = "this is the correct content, ignore the previous one: {";

function extractLastJsonBlock(text, startMarker) {
  const idx = text.lastIndexOf(startMarker);
  if (idx === -1) {
    throw new Error("Marker not found in transcript.");
  }

  const start = text.indexOf("{", idx);
  if (start === -1) {
    throw new Error("Opening brace not found after marker.");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;

  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) {
    throw new Error("Failed to find matching closing brace.");
  }

  return text.slice(start, end + 1);
}

function toSeedArticle(post, hubFallback) {
  return {
    postTitle: post.postTitle,
    postSlug: post.postSlug,
    postType: post.postType ?? "segmented-list",
    postStatus: "published",
    hub: post.hub ?? hubFallback ?? "productivity",
    primaryKeyword: post.primaryKeyword ?? "",
    secondaryKeywords: post.secondaryKeywords ?? [],
    seoTitle: post.seoTitle ?? post.postTitle,
    metaDescription: post.metaDescription ?? "",
    readingTimeMinutes: post.readingTimeMinutes ?? 8,
    wordCount: post.wordCount ?? 900,
    tldrSummary: post.tldrSummary ?? "",
    postContent: post.postContent ?? "",
    verdictText: post.verdictText ?? "",
    isLivingGuide: Boolean(post.isLivingGuide),
    schemaMarkup: post.schemaMarkup ?? undefined,
    bestOfPageMapping: {
      title: post.bestOfPageMapping?.title ?? post.postTitle,
      category: post.bestOfPageMapping?.category ?? (post.hub ?? hubFallback ?? "productivity"),
      slug: post.bestOfPageMapping?.slug ?? post.postSlug,
      useCase: post.bestOfPageMapping?.useCase ?? "general",
      hubSlug: post.bestOfPageMapping?.hubSlug ?? (post.hub ?? hubFallback ?? "productivity"),
    },
  };
}

const raw = fs.readFileSync(transcriptPath, "utf8");
const jsonText = extractLastJsonBlock(raw, marker);
const payload = JSON.parse(jsonText);

const flattened = [];
for (const category of payload.articles ?? []) {
  for (const post of category.posts ?? []) {
    flattened.push(toSeedArticle(post, category.convexMapping?.hub));
  }
}

const output = `export type AuthorityArticleSeed = {
  postTitle: string;
  postSlug: string;
  postType: "pillar" | "segmented-list";
  postStatus: "published";
  hub: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  seoTitle: string;
  metaDescription: string;
  readingTimeMinutes: number;
  wordCount: number;
  tldrSummary: string;
  postContent: string;
  verdictText: string;
  isLivingGuide: boolean;
  schemaMarkup?: Record<string, unknown>;
  bestOfPageMapping: {
    title: string;
    category: string;
    slug: string;
    useCase: string;
    hubSlug: string;
  };
};

export const AUTHORITY_ARTICLES: AuthorityArticleSeed[] = ${JSON.stringify(flattened, null, 2)};
`;

const outPath = path.resolve(
  "C:/Users/Administrator/.cursor/worktrees/TheSynLab/ltb/convex/authorityArticlesPayload.ts",
);
fs.writeFileSync(outPath, output, "utf8");
console.log(`Wrote ${flattened.length} authority articles to ${outPath}`);
