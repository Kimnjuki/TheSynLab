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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Layers } from "lucide-react";
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

  const onSubscribe = async () => {
    if (!user) return toast.error("Sign in to subscribe");
    await addAlert({ userId: user.id, productId: details._id, alertType: "changelog" });
    toast.success("Subscribed to updates");
  };

  const canonical = `https://www.thesynlab.com/products/${details.productSlug}`;
  const seoTitle = `${details.productName} Review ${new Date().getFullYear()} — Trust Score, Integrations & Workflow Verdict | TheSynLab`;
  const seoDesc = `TheSynLab deep-dive on ${details.productName}: benchmarked trust score, integration depth, workflow recipes, and a clear verdict.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `Is ${details.productName} worth it?`, acceptedAnswer: { "@type": "Answer", text: details.verdictSummary || "Depends on team needs and stack fit." } },
      { "@type": "Question", name: `What is ${details.productName} best for?`, acceptedAnswer: { "@type": "Answer", text: details.meta?.whoShouldUse || "General productivity and workflow optimization." } },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags title={seoTitle} description={seoDesc} canonical={canonical} ogImage={details.featuredImageUrl} ogType="product" />
      <JsonLd
        type="Product"
        product={{
          name: details.productName,
          description: seoDesc,
          image: details.featuredImageUrl,
          url: canonical,
          rating: details.trustScore?.totalScore,
          reviewCount: 1,
        }}
      />
      <JsonLd type="Review" custom={{ reviewBody: details.verdictSummary, reviewRating: { "@type": "Rating", ratingValue: details.trustScore?.totalScore ?? 0 } }} />
      <JsonLd type="BreadcrumbList" breadcrumbs={[{ name: "Home", url: "/" }, { name: "Products", url: "/tools/compare" }, { name: details.productName, url: `/products/${details.productSlug}` }]} />
      <JsonLd type="WebPage" custom={faqSchema} />
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
          isVerified={details.trustScore?.isVerified}
          onAddToStack={onAddToStack}
          onSubscribe={onSubscribe}
        />

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
