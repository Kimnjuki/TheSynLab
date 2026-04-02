export type HubProduct = {
  _id: string;
  productName: string;
  productSlug: string;
  verdictSummary?: string;
  featuredImageUrl?: string;
  category?: string;
  followCount?: number;
};

export type DecisionCardData = {
  topPros: string[];
  topWatchOuts: string[];
  bestForTags: string[];
  keyIntegrations: string[];
  selfHostOption: boolean;
  soc2Ready: boolean;
  gdprReady: boolean;
  lockInRisk: "low" | "medium" | "high" | string;
  exportQuality: "excellent" | "good" | "limited" | string;
  dataResidency: "us-only" | "eu-friendly" | "global" | string;
  pricingComplexity: string;
  typicalCostTier: string;
  workflowTemplateCount: number;
  communityStackCount: number;
};

export type TrendingProduct = {
  product: HubProduct;
  trustScore?: number | null;
  trendingRank: number;
  trustScoreDelta: number;
  velocityScore: number;
};

export type BuyerJourneyPath = {
  _id: string;
  pathSlug: string;
  pathTitle: string;
  pathDescription: string;
  pathType: string;
  targetSegment: string;
  productSequence: string[];
  stepDescriptions: any[];
};
