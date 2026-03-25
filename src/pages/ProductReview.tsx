import { useParams, Link } from "react-router-dom";
import { useProductBySlug } from "@/hooks/convex/useProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ScoreBadge from "@/components/ScoreBadge";
import { PredictiveScoreBadge } from "@/components/scoring/PredictiveScoreBadge";
import { ArProductPreview } from "@/components/products/ArProductPreview";
import { TcoCalculator } from "@/components/scoring/TcoCalculator";
import { RoiCalculator } from "@/components/scoring/RoiCalculator";
import { ExternalLink, Heart, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewsList from "@/components/reviews/ReviewsList";
import { ScoreTrendChart } from "@/components/compare/ScoreTrendChart";
import { LocaleScoreBadge } from "@/components/scores/LocaleScoreBadge";
import { CompetitorBenchmark } from "@/components/products/CompetitorBenchmark";
import { LabBenchmarkResults } from "@/components/products/LabBenchmarkResults";
import { ScoreRichSnippet } from "@/components/scores/ScoreRichSnippet";
import { ScoreBreakdownCard } from "@/components/scores/ScoreBreakdownCard";
import { CommunityScoreWidget } from "@/components/community/CommunityScoreWidget";

export default function ProductReview() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { product, isLoading } = useProductBySlug(slug || "");
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    // Toggle favorite - would need to implement in Convex
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <Link to="/tools/compare" className="text-primary hover:underline">
              Browse all products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const trustScore = product.trustScore;
  const integrationScore = product.integrationScore;
  const ecosystems = product.compatibility || [];

  const productUrl = `/products/${product.productSlug}`;
  const desc =
    (product as { metaDescription?: string }).metaDescription ||
    product.description ||
    `${product.productName} – Trust & Integration scores, specs, and review.`;

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title={product.productName}
        description={desc}
        canonical={productUrl}
        ogImage={product.featuredImageUrl}
        ogType="product"
      />
      <JsonLd
        type="Product"
        product={{
          name: product.productName,
          description: desc,
          image: product.featuredImageUrl,
          url: productUrl,
          rating: (product as { avgRating?: number }).avgRating,
          reviewCount: (product as { reviewCount?: number }).reviewCount,
        }}
      />
      <ScoreRichSnippet
        name={product.productName}
        description={desc}
        url={productUrl}
        image={product.featuredImageUrl}
        trustScore={trustScore?.totalScore}
        integrationScore={integrationScore?.totalScore}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Product Image */}
              <div className="space-y-4">
                {(product as { modelUrl3D?: string; arEnabled?: boolean }).arEnabled && (
                  <ArProductPreview
                    productName={product.productName}
                    modelUrl={(product as { modelUrl3D?: string }).modelUrl3D}
                    imageUrl={product.featuredImageUrl}
                  />
                )}
                {!((product as { arEnabled?: boolean }).arEnabled) && product.featuredImageUrl && (
                  <img
                    src={product.featuredImageUrl}
                    alt={product.productName}
                    className="w-full rounded-lg shadow-lg"
                  />
                )}
                {product.galleryImages && Array.isArray(product.galleryImages) && (
                  <div className="grid grid-cols-4 gap-2">
                    {(product.galleryImages as string[]).slice(0, 4).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${product.productName} ${i + 1}`}
                        className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.productType}</Badge>
                  </div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {product.productName}
                  </h1>
                  <p className="text-lg text-muted-foreground">{product.manufacturer}</p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {trustScore && (
                    <ScoreBadge score={trustScore.totalScore} label="Trust Score" type="trust" />
                  )}
                  {integrationScore && (
                    <ScoreBadge score={integrationScore.totalScore} label="Integration" type="integration" />
                  )}
                  {integrationScore?.mlPredictedScore != null && (
                    <PredictiveScoreBadge
                      score={integrationScore.mlPredictedScore}
                      confidence={integrationScore.mlConfidence}
                      model={integrationScore.predictionModel}
                    />
                  )}
                  <LocaleScoreBadge
                    productId={product._id}
                    baseTrustScore={trustScore?.totalScore}
                    baseIntegrationScore={integrationScore?.totalScore}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price?.toLocaleString()}
                  </span>
                  {product.priceModel && (
                    <Badge variant="outline">{product.priceModel}</Badge>
                  )}
                </div>

                <p className="text-foreground">{product.description}</p>

                <div className="flex gap-3">
                  {product.officialWebsite && (
                    <Button size="lg" className="gap-2" asChild>
                      <a href={product.officialWebsite} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Official Website
                      </a>
                    </Button>
                  )}
                  <Button size="lg" variant="outline" onClick={handleFavorite} className="gap-2">
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-primary' : ''}`} />
                    {isFavorited ? 'Saved' : 'Save'}
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleShare} className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground border-t pt-4">
                  ℹ️ We may earn a commission when you buy through our links. 
                  Our recommendations are independent and based on thorough testing.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Content */}
        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="overview">Overview & Reviews</TabsTrigger>
              <TabsTrigger value="trust">Trust Score</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="tco-roi">TCO & ROI</TabsTrigger>
              <TabsTrigger value="specs">Specs & Ecosystem</TabsTrigger>
              <TabsTrigger value="benchmarks">Lab Benchmarks</TabsTrigger>
              <TabsTrigger value="score-trends">Score History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Verdict</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>

              {product.features && typeof product.features === 'object' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Object.entries(product.features as Record<string, any>).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-2">
                          <span className="text-primary">✓</span>
                          <span className="text-foreground">
                            <strong>{key}:</strong> {String(value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>User Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewsList productId={product._id} />
                </CardContent>
              </Card>

              <ReviewForm productId={product._id} onSuccess={() => {}} />
            </TabsContent>

            <TabsContent value="trust" className="space-y-6">
              {trustScore && (
                <ScoreBreakdownCard
                  title="Trust Score Breakdown"
                  dimensions={[
                    { label: "Data Privacy Practices", value: trustScore.dataPrivacyPractices, max: 3 },
                    { label: "Encryption Standards", value: trustScore.encryptionStandards, max: 2 },
                    { label: "Terms Transparency", value: trustScore.termsTransparency, max: 2 },
                    { label: "Ethical AI Transparency", value: trustScore.ethicalAiTransparency, max: 2 },
                    { label: "Third-Party Audits", value: trustScore.thirdPartyAudits, max: 1 },
                  ]}
                />
              )}
            </TabsContent>

            <TabsContent value="tco-roi" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <TcoCalculator
                  productId={product._id}
                  productName={product.productName}
                  basePrice={product.price ?? 0}
                />
                <RoiCalculator
                  productId={product._id}
                  productName={product.productName}
                  currentToolCost={product.price ?? 0}
                  userId={user?.id}
                  className="h-fit"
                />
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-6">
              {integrationScore && (
                <ScoreBreakdownCard
                  title="Integration Score Breakdown"
                  dimensions={[
                    { label: "API & Documentation", value: integrationScore.apiDocumentation, max: 3 },
                    { label: "Cross-Platform Support", value: integrationScore.crossPlatform, max: 3 },
                    { label: "Smart Home Ecosystems", value: integrationScore.smartHomeEcosystems, max: 2 },
                    { label: "Automation Platforms", value: integrationScore.automationPlatforms, max: 1 },
                    { label: "Developer Community", value: integrationScore.developerCommunity, max: 1 },
                  ]}
                />
              )}
              <CommunityScoreWidget productId={product._id} />
            </TabsContent>

            <TabsContent value="specs" className="space-y-6">
              {product.specifications && typeof product.specifications === 'object' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="border-b pb-2">
                          <dt className="font-semibold text-foreground">{key}</dt>
                          <dd className="text-muted-foreground">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Ecosystem Compatibility</CardTitle>
                </CardHeader>
                <CardContent>
                  {ecosystems.length === 0 ? (
                    <p className="text-muted-foreground">No ecosystem compatibility data available</p>
                  ) : (
                    <div className="grid gap-4">
                      {ecosystems.map((eco: any) => (
                        <div key={eco._id || eco.ecosystem} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-lg">{eco.ecosystem}</h4>
                            <Badge
                              variant={
                                eco.compatibilityLevel === 'full'
                                  ? 'default'
                                  : eco.compatibilityLevel === 'partial'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {eco.compatibilityLevel}
                            </Badge>
                          </div>
                          {eco.integrationMethod && (
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Integration:</strong> {eco.integrationMethod}
                            </p>
                          )}
                          {eco.notes && (
                            <p className="text-sm text-muted-foreground">{eco.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benchmarks" className="space-y-6">
              <LabBenchmarkResults
                benchmarkData={(product as any).benchmarkData}
                benchmarkVersion={(product as any).benchmarkVersion}
                labTestedAt={(product as any).labTestedAt}
                labTestedBy={(product as any).labTestedBy}
                category={product.category}
              />
              <CompetitorBenchmark
                productId={product._id}
                productSlug={product.productSlug}
              />
            </TabsContent>

            <TabsContent value="score-trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trust Score History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreTrendChart productId={product._id} type="trust" height={220} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Integration Score History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreTrendChart productId={product._id} type="integration" height={220} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}
