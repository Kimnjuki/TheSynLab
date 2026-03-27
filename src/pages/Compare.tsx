import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { ComparisonFilters } from "@/components/compare/ComparisonFilters";
import { ProductCard } from "@/components/compare/ProductCard";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { AICompareAssistant } from "@/components/compare/AICompareAssistant";
import { PriceHistoryChart } from "@/components/compare/PriceHistoryChart";
import { useCompareUrl } from "@/hooks/useCompareUrl";
import { useProducts } from "@/hooks/convex/useProducts";
import { WeightedScoreCustomizer } from "@/components/compare/WeightedScoreCustomizer";
import { EcosystemOverlapPanel } from "@/components/compare/EcosystemOverlapPanel";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bot, Share2, Twitter, Linkedin, Code2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function Compare() {
  const { slugs, setProducts, shareUrl, shareOnTwitter, shareOnLinkedIn, generateEmbedCode } =
    useCompareUrl();
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    trustScore: [0, 10],
    integrationScore: [0, 10],
    ecosystems: [] as string[],
    categories: [] as string[],
  });
  const [showAI, setShowAI] = useState(false);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { products, isLoading, error } = useProducts(filters);

  const handleProductSelect = (product: any) => {
    const slug = product.productSlug ?? (product.id ?? product._id)?.toString();
    if (!slug) return;
    if (slugs.includes(slug)) {
      setProducts(slugs.filter((s) => s !== slug));
    } else if (slugs.length < 4) {
      setProducts([...slugs, slug]);
    } else {
      toast.info("You can compare up to 4 products");
    }
  };

  const selectedProductsData = products?.filter((p: any) =>
    slugs.includes(p.productSlug ?? "") ||
    slugs.includes((p.id ?? p._id)?.toString() ?? "")
  );

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Tools", url: "/" },
    { name: "Product Comparison", url: "/tools/compare" },
  ];

  const embedCode = generateEmbedCode();

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Product Comparison Engine"
        description="Compare up to 4 products side-by-side: trust score, integration score, TCO, sustainability, and compatibility."
        canonical="/tools/compare"
      />
      <JsonLd type="BreadcrumbList" breadcrumbs={breadcrumbs} />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Product Comparison Engine
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Compare up to 4 products across 30 dimensions — Trust, Integration, TCO,
                  Sustainability, and more.
                </p>
              </div>

              {/* Share / AI buttons */}
              <div className="flex flex-wrap gap-2">
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Share Comparison</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-2">
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => { shareUrl(); setShareDialogOpen(false); }}
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => { shareOnTwitter(); setShareDialogOpen(false); }}
                      >
                        <Twitter className="h-4 w-4" />
                        Share on X (Twitter)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => { shareOnLinkedIn(); setShareDialogOpen(false); }}
                      >
                        <Linkedin className="h-4 w-4" />
                        Share on LinkedIn
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Code2 className="h-4 w-4" />
                      Embed
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Embed Comparison</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-2">
                      <textarea
                        readOnly
                        value={embedCode}
                        className="w-full text-xs font-mono border rounded p-2 h-24 resize-none"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(embedCode);
                          toast.success("Embed code copied!");
                        }}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {selectedProductsData && selectedProductsData.length > 0 && (
                  <Button
                    size="sm"
                    variant={showAI ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => setShowAI(!showAI)}
                  >
                    <Bot className="h-4 w-4" />
                    AI Assistant
                  </Button>
                )}
              </div>
            </div>

            {slugs.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {slugs.length} product{slugs.length > 1 ? "s" : ""} selected (max 4)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProducts([])}
                  className="text-xs text-destructive h-6"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Comparison View + AI Assistant */}
        {slugs.length > 0 && selectedProductsData && selectedProductsData.length > 0 && (
          <div className="container mx-auto px-4 py-6">
            <WeightedScoreCustomizer products={selectedProductsData} />
            <EcosystemOverlapPanel
              productIds={
                selectedProductsData
                  .map((p: { _id?: Id<"novaProducts"> }) => p._id)
                  .filter(Boolean) as Id<"novaProducts">[]
              }
            />
            <div className={`grid gap-6 ${showAI ? "lg:grid-cols-3" : "grid-cols-1"}`}>
              <div className={showAI ? "lg:col-span-2" : ""}>
                <Tabs defaultValue="overview">
                  <TabsList className="w-full flex flex-wrap h-auto gap-1 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="scores">Scores</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing & TCO</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <ComparisonView
                      products={selectedProductsData}
                      onRemove={(idOrSlug) =>
                        setProducts(slugs.filter((s) => s !== idOrSlug))
                      }
                    />
                  </TabsContent>

                  <TabsContent value="scores">
                    <ComparisonView
                      products={selectedProductsData}
                      onRemove={(idOrSlug) =>
                        setProducts(slugs.filter((s) => s !== idOrSlug))
                      }
                      defaultSection="scores"
                    />
                  </TabsContent>

                  <TabsContent value="specs">
                    <ComparisonView
                      products={selectedProductsData}
                      onRemove={(idOrSlug) =>
                        setProducts(slugs.filter((s) => s !== idOrSlug))
                      }
                      defaultSection="specs"
                    />
                  </TabsContent>

                  <TabsContent value="compatibility">
                    <ComparisonView
                      products={selectedProductsData}
                      onRemove={(idOrSlug) =>
                        setProducts(slugs.filter((s) => s !== idOrSlug))
                      }
                      defaultSection="compatibility"
                    />
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-6">
                    <ComparisonView
                      products={selectedProductsData}
                      onRemove={(idOrSlug) =>
                        setProducts(slugs.filter((s) => s !== idOrSlug))
                      }
                      defaultSection="pricing"
                    />
                    <PriceHistoryChart
                      products={selectedProductsData.map((p: any) => ({
                        _id: p._id,
                        productName: p.productName,
                      }))}
                    />
                  </TabsContent>

                  <TabsContent value="reviews">
                    <ComparisonView
                      products={selectedProductsData}
                      onRemove={(idOrSlug) =>
                        setProducts(slugs.filter((s) => s !== idOrSlug))
                      }
                      defaultSection="reviews"
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {showAI && (
                <div className="lg:col-span-1">
                  <div className="sticky top-24 h-[500px]">
                    <AICompareAssistant
                      products={selectedProductsData}
                      onClose={() => setShowAI(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <ComparisonFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {isLoading ? "Loading…" : `${products?.length || 0} products found`}
                </p>
                {error && <p className="text-sm text-amber-700">{error}</p>}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                    ))
                  : (products as any[])?.map((product) => (
                      <ProductCard
                        key={product.id ?? product._id}
                        product={product}
                        isSelected={slugs.includes(
                          product.productSlug ??
                            (product.id ?? product._id)?.toString()
                        )}
                        onSelect={() => handleProductSelect(product)}
                        disabled={
                          slugs.length >= 4 &&
                          !slugs.includes(
                            product.productSlug ??
                              (product.id ?? product._id)?.toString()
                          )
                        }
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
