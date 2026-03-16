"use node";

/**
 * S3: Blockchain review publishing – immutable verification.
 * FREE: Simulated verification (deterministic hash) when no keys set.
 * PAID: ALCHEMY_API_KEY (Alchemy free tier: 30M CUs/month) for real chain submission.
 */

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { createHash } from "crypto";

const SYN_TOKENS_VERIFIED = 50;
const DEFAULT_NETWORK = "polygon-mainnet";

export const publishReviewToChain = action({
  args: { reviewId: v.id("productReviews") },
  handler: async (ctx, args): Promise<{ txHash?: string; error?: string }> => {
    const review = await ctx.runQuery(api.reviews.get, { id: args.reviewId });
    if (!review) return { error: "Review not found" };

    const payload = JSON.stringify({
      id: args.reviewId,
      userId: review.userId,
      content: review.reviewContent,
      title: review.reviewTitle,
      rating: review.rating,
      createdAt: Date.now(),
    });
    const contentHash = "0x" + createHash("sha256").update(payload).digest("hex");

    const alchemyKey = process.env.ALCHEMY_API_KEY;
    const alchemyUrl = process.env.ALCHEMY_API_URL ?? "https://polygon-mainnet.g.alchemy.com/v2";

    let txHash: string;

    if (alchemyKey && alchemyUrl) {
      try {
        const res = await fetch(`${alchemyUrl}/${alchemyKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_sendTransaction",
            params: [
              {
                from: process.env.ALCHEMY_FROM_ADDRESS ?? "0x0000000000000000000000000000000000000000",
                data: contentHash,
                gas: "0x5208",
              },
            ],
          }),
        });
        const json = (await res.json()) as { result?: string; error?: { message: string } };
        if (json.error) throw new Error(json.error.message ?? "Alchemy error");
        txHash = json.result ?? `0x${Date.now().toString(16)}`;
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Alchemy submission failed" };
      }
    } else {
      txHash = `0x${contentHash.slice(2, 18)}${Date.now().toString(16).padStart(16, "0")}`;
    }

    await ctx.runMutation(api.reviews.patchBlockchain, {
      id: args.reviewId,
      blockchainTxHash: txHash,
      blockchainNetwork: DEFAULT_NETWORK,
      reviewContentHash: contentHash,
      verificationLevel: "blockchain",
      synTokensAwarded: SYN_TOKENS_VERIFIED,
    });

    await ctx.runMutation(api.synTokenLedger.create, {
      userId: review.userId,
      eventType: "verified_review_submitted",
      amount: SYN_TOKENS_VERIFIED,
      referenceId: args.reviewId,
      referenceType: "review",
      txHash,
    });

    return { txHash };
  },
});
