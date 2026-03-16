/**
 * S9: Review translation – FREE: MyMemory API (no key). PAID: Claude when ANTHROPIC_API_KEY set.
 */

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

const DEFAULT_LOCALES = ["fr", "de", "es", "pt"];
const MYMEMORY_MAX_CHARS = 450;

async function translateWithMyMemory(
  text: string,
  targetLocale: string,
  email?: string
): Promise<string> {
  const chunk = text.slice(0, MYMEMORY_MAX_CHARS);
  const langpair = `en|${targetLocale === "zh" ? "zh-CN" : targetLocale}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${langpair}${email ? `&de=${encodeURIComponent(email)}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) return text;
  const data = (await res.json()) as { responseData?: { translatedText?: string } };
  return data.responseData?.translatedText ?? text;
}

export const translateReviewToLocales = action({
  args: {
    reviewId: v.id("productReviews"),
    targetLocales: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const review = await ctx.runQuery(api.reviews.get, { id: args.reviewId });
    if (!review) return { created: [], error: "Review not found" };

    const locales = args.targetLocales ?? DEFAULT_LOCALES;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const myMemoryEmail = process.env.MYMEMORY_EMAIL;
    const created: string[] = [];

    for (const locale of locales) {
      let translatedTitle: string;
      let translatedContent: string;
      let translatedPros: string[] | undefined;
      let translatedCons: string[] | undefined;
      let model: string;

      if (anthropicKey) {
        try {
          const prompt = `Translate to ${locale}. Return JSON: {"translatedTitle":"...","translatedContent":"...","translatedPros":["..."],"translatedCons":["..."]}\nTitle: ${review.reviewTitle}\nContent: ${review.reviewContent}\nPros: ${JSON.stringify(review.pros ?? [])}\nCons: ${JSON.stringify(review.cons ?? [])}`;
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": anthropicKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1024,
              messages: [{ role: "user", content: prompt }],
            }),
          });
          if (!res.ok) throw new Error(`Claude ${res.status}`);
          const data = (await res.json()) as { content?: { type: string; text?: string }[] };
          const text = data.content?.find((c) => c.type === "text")?.text?.trim() ?? "{}";
          const json = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim()) as Record<string, unknown>;
          translatedTitle = (json.translatedTitle as string) ?? review.reviewTitle;
          translatedContent = (json.translatedContent as string) ?? review.reviewContent;
          translatedPros = json.translatedPros as string[] | undefined;
          translatedCons = json.translatedCons as string[] | undefined;
          model = "claude-sonnet-4-20250514";
        } catch (e) {
          console.error(`Claude translate ${locale}:`, e);
          continue;
        }
      } else {
        try {
          translatedTitle = await translateWithMyMemory(review.reviewTitle, locale, myMemoryEmail);
          translatedContent = await translateWithMyMemory(review.reviewContent, locale, myMemoryEmail);
          translatedPros = review.pros
            ? await Promise.all(
                review.pros.map((p) => translateWithMyMemory(p, locale, myMemoryEmail))
              )
            : undefined;
          translatedCons = review.cons
            ? await Promise.all(
                review.cons.map((c) => translateWithMyMemory(c, locale, myMemoryEmail))
              )
            : undefined;
          model = "mymemory-free";
        } catch {
          translatedTitle = review.reviewTitle;
          translatedContent = review.reviewContent;
          translatedPros = review.pros;
          translatedCons = review.cons;
          model = "fallback-no-translation";
        }
      }

      await ctx.runMutation(api.reviewTranslations.create, {
        reviewId: args.reviewId,
        locale,
        translatedTitle,
        translatedContent,
        translatedPros,
        translatedCons,
        translationModel: model,
      });
      created.push(locale);
    }

    return { created };
  },
});
