import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductHero } from "@/components/pdp/ProductHero";
import { QuickStatsBar } from "@/components/pdp/QuickStatsBar";
import { VisualStoryGallery } from "@/components/pdp/VisualStoryGallery";
import { BenchmarkDashboard } from "@/components/pdp/BenchmarkDashboard";
import { WorkflowRecipeCard } from "@/components/pdp/WorkflowRecipeCard";
import { AlternativesStrip } from "@/components/pdp/AlternativesStrip";
import { CoreMetaPanel } from "@/components/pdp/CoreMetaPanel";
import { RoiEstimatorCard } from "@/components/pdp/RoiEstimatorCard";
import { DecisionSummaryCard } from "@/components/pdp/DecisionSummaryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Layers, ExternalLink, DollarSign, Star, TrendingUp, Shield } from "lucide-react";
import { useViewTracking, trackConversion } from "@/hooks/useViewTracking";
import { getPurchaseUrl, buildAffiliateUrl } from "@/lib/affiliateLinks";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const { user } = useAuth();
  const details = useQuery(api.products.getProductDetailsBySlug, { slug });
  const addBookmark = useMutation(api.productBookmarks.insert);
  const addAlert = useMutation(api.productAlerts.insert);

  if (details === undefined) {
    return <div className="min-h-screen"><Header /><main className="container py-10">Loading...</main><Footer /></div>;
  }
  if (!details) {
    return <div className="min-h-screen"><Header /><main className="container py-10">Product not found.</main><Footer /></div>;
  }

  const onAddToStack = async () => {
    if (!user) return toast.error("Sign in to save to your stack");
    await addBookmark({ userId: user.id, productId: details._id, listName: "default" });
    toast.success("Added to My Stack");
  };

  const { totalViews } = useViewTracking('product', slug);

  const onSubscribe = async () => {
    if (!user) return toast.error("Sign in to subscribe");
    await addAlert({ userId: user.id, productId: details._id, alertType: "changelog" });
    toast.success("Subscribed to updates");
  };

  const canonical = `https://thesynlab.com/products/${details.productSlug}`;
  const seoTitle = `${details.productName} Review ${new Date().getFullYear()} — Trust Score, Integrations & Workflow Verdict | TheSynLab`;
  const seoDesc = `TheSynLab deep-dive on ${details.productName}: benchmarked trust score, integration depth, workflow recipes, and a clear verdict.`;

  const featureList: string[] = Array.isArray(details.features)
    ? details.features.map((f: any) => (typeof f === "string" ? f : f?.name ?? "")).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <MetaTags title={seoTitle} description={seoDesc} canonical={canonical} ogImage={details.featuredImageUrl} ogType="product" />
      <JsonLd
        type="SoftwareApplication"
        softwareApp={{
          name: details.productName,
          description: details.description || seoDesc,
          url: canonical,
          image: details.featuredImageUrl,
          applicationCategory: details.category ?? "SoftwareApplication",
          price: details.price,
          priceCurrency: details.priceCurrency,
          rating: details.trustScore?.totalScore,
          reviewCount: details.trustScore ? 1 : undefined,
          featureList,
          screenshots: details.galleryImages,
        }}
      />
      <JsonLd
        type="FAQPage"
        faq={[
          { question: `Is ${details.productName} worth it?`, answer: details.verdictSummary || "Depends on team needs and stack fit." },
          { question: `What is ${details.productName} best for?`, answer: details.meta?.whoShouldUse || "General productivity and workflow optimization." },
          ...(details.meta?.avoidIfTags?.length ? [{ question: `Who should avoid ${details.productName}?`, answer: details.meta.whoShouldAvoid || details.meta.avoidIfTags.join(", ") }] : []),
        ]}
      />
      <JsonLd type="BreadcrumbList" breadcrumbs={[{ name: "Home", url: "/" }, { name: "Products", url: "/tools/compare" }, { name: details.productName, url: `/products/${details.productSlug}` }]} />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">Home</Link> / <Link to="/tools/compare" className="hover:underline">Products</Link> / <span>{details.productName}</span>
        </div>

        <ProductHero
          product={details}
          bestForTags={details.meta?.bestForTags}
          trustScore={details.trustScore?.totalScore}
          integrationScore={details.integrationScore?.totalScore}
          tcoTier={details.tcoScore?.costTier}
          riskBadge={details.riskBadge}
          labCertified={details.labCertified}
          isVerified={details.trustScore?.isVerified}
          onAddToStack={onAddToStack}
          onSubscribe={onSubscribe}
        />

        {/* Affiliate / Price CTA Strip — drives income by linking to product site */}
        <div className="mt-6 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden md:flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {details.meta?.pricingNote || `Starting at ${details.price || details.tcoScore?.costTier || 'Varies'}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {details.meta?.affiliateNote || 'Check current pricing and availability'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                className="gap-2 flex-1 md:flex-initial"
                onClick={() => {
                  trackConversion('product', slug, 'affiliate_click');
                  const affUrl = getPurchaseUrl(details.affiliateUrl, details.officialWebsite, details.productName);
                  trackConversion('product', slug, 'affiliate_click');
                  window.open(affUrl, '_blank', 'noopener');
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Check Price
              </Button>
              <Button
                variant="outline"
                className="gap-2 flex-1 md:flex-initial"
                onClick={() => {
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(details.productName + ' reviews ' + new Date().getFullYear())}`, '_blank', 'noopener');
                }}
              >
                <Star className="w-4 h-4" />
                See Deals
              </Button>
            </div>
          </div>
          {/* Trust badge */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-success" /> Independent review</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-primary" /> Prices updated regularly</span>
            {details.meta?.affiliateDisclosure && (
              <span className="text-[10px] text-muted-foreground/60">{details.meta.affiliateDisclosure}</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <DecisionSummaryCard
            bestForTags={details.meta?.bestForTags}
            avoidIfTags={details.meta?.avoidIfTags}
            stackFitRole={details.meta?.stackFitRole}
            maturityLevel={details.meta?.maturityLevel}
            learningCurve={details.meta?.learningCurve}
            timeToFirstValueMinutes={details.meta?.timeToFirstValueMinutes}
            costTier={details.tcoScore?.costTier ?? details.meta?.costTier}
            lockInRisk={details.meta?.lockInRisk}
            whoShouldUse={details.meta?.whoShouldUse}
            whoShouldAvoid={details.meta?.whoShouldAvoid}
          />
        </div>

        <div className="mt-4"><QuickStatsBar
          timeToFirstValueMinutes={details.meta?.timeToFirstValueMinutes}
          setupDifficulty={details.meta?.setupDifficulty}
          learningCurve={details.meta?.learningCurve}
          benchmarkedWorkflowCount={details.meta?.benchmarkedWorkflowCount}
          lastReviewedAt={details.trustScore?.testedDate}
          releaseCadence={details.meta?.releaseCadence}
        /></div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr),320px]">
          <div className="space-y-8">
            <VisualStoryGallery slides={(details.gallerySlides ?? []) as any} />

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Narrative description & use cases</h2>
              <Card>
                <CardHeader><CardTitle className="text-base">What it does</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{details.description || "No description yet."}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">TheSynLab verdict</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>{details.verdictSummary || "Editorial verdict pending."}</p>
                  {details.meta?.replacesTools?.length ? <p><strong>Replaces:</strong> {details.meta.replacesTools.join(", ")}</p> : null}
                  <p><strong>Who should use:</strong> {details.meta?.whoShouldUse || "General users evaluating workflow fit."}</p>
                  <p><strong>Who should avoid:</strong> {details.meta?.whoShouldAvoid || "Teams requiring unsupported integrations."}</p>
                </CardContent>
              </Card>
              {!!details.meta?.useCases?.length && (
                <div className="grid gap-3 md:grid-cols-2">
                  {details.meta.useCases.slice(0, 5).map((uc: any, idx: number) => (
                    <Card key={`${uc.title}-${idx}`} className="border-primary/20">
                      <CardContent className="p-4">
                        <p className="font-semibold">{uc.title}</p>
                        <p className="text-sm text-muted-foreground">{uc.description}</p>
                        {uc.audienceTag && <Badge variant="outline" className="mt-2">{uc.audienceTag}</Badge>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Workflow recipes</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {(details.recipes ?? []).slice(0, 4).map((r: any) => (
                  <WorkflowRecipeCard key={r._id} recipe={r} />
                ))}
              </div>
            </section>

            <BenchmarkDashboard trustScore={details.trustScore} integrationScore={details.integrationScore} benchmarkData={details.benchmarkData} />
            <RoiEstimatorCard productId={details._id as any} userId={user?.id} />
            <AlternativesStrip alternatives={(details.alternatives ?? []) as any} />
          </div>

          <div>
            <CoreMetaPanel product={details} meta={details.meta} />
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="container mx-auto flex gap-2">
          <Button className="flex-1" onClick={onAddToStack} aria-label="Add this product to my stack">
            <Layers className="h-4 w-4" /> Add to stack
          </Button>
          <Button className="flex-1" variant="outline" onClick={onSubscribe} aria-label="Subscribe to product updates">
            <Bell className="h-4 w-4" /> Subscribe
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
