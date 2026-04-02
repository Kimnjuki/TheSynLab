export type PDPSlide = {
  _id: string;
  imageUrl: string;
  annotatedImageUrl?: string;
  caption: string;
  slideType: string;
  scenarioTags?: string[];
};

export type PDPUseCase = {
  title: string;
  description: string;
  audienceTag?: string;
  icon?: string;
};

export type PDPRecipe = {
  _id: string;
  recipeTitle: string;
  summary?: string;
  estimatedMinutes?: number;
  toolStack?: string[];
  audienceTag?: string;
  difficulty?: string;
  steps?: Array<{ order?: number; action?: string; tool?: string }>;
};

export type PDPAlternative = {
  _id: string;
  productSlug: string;
  productName: string;
  featuredImageUrl?: string;
  verdictSummary?: string;
  priceModel?: string;
  overallScore?: number;
  trustScore?: number | null;
  integrationScore?: number | null;
};
