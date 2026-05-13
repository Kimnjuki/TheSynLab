import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Copy, Check, ExternalLink, Code, Shield, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { STATIC_PRODUCTS } from "@/data/staticProductData";

const SITE_URL = "https://thesynlab.com";

export default function WidgetGallery() {
  const products = useMemo(() => STATIC_PRODUCTS.slice(0, 12), []);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyEmbed = (slug: string, idx: number) => {
    const code = `<iframe src="${SITE_URL}/widget/product/${slug}" width="360" height="220" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedIdx(idx);
      toast.success("Embed code copied!");
      setTimeout(() => setCopiedIdx(null), 2000);
    }).catch(() => toast.error("Could not copy. Try manually selecting the code."));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Embeddable Trust Score Scorecard Widgets | TheSynLab"
        description="Copy and paste Trust Score, Integration Score, and TCO widgets for any product. Embed independent ratings on your website."
        canonicalUrl="/widgets"
      />
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2">
            <Code className="mr-1 h-3.5 w-3.5" />
            Embed &amp; Share
          </Badge>
          <h1 className="text-3xl font-bold">Scorecard Widgets</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Embed TheSynLab's independent Trust Scores and Integration Scores on your own website. 
            Each widget includes a do-follow link back to the full product review.
          </p>
        </div>

        <Tabs defaultValue="scorecard" className="mb-10">
          <TabsList className="mx-auto flex w-fit">
            <TabsTrigger value="scorecard">
              <Shield className="mr-2 h-4 w-4" />
              Product Scorecards
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <BarChart3 className="mr-2 h-4 w-4" />
              Comparison Widget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scorecard" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, idx) => (
                <Card key={p.productSlug} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{p.productName}</CardTitle>
                    <CardDescription>
                      Trust Score: {p.trustScore}/10 — Integration: {p.integrationScore}/10
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between gap-3">
                    {/* Preview */}
                    <div className="rounded-lg border bg-card p-3 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trust Score</span>
                        <span className="font-bold">{p.trustScore}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Integration</span>
                        <span className="font-bold">{p.integrationScore}/10</span>
                      </div>
                      {p.estimatedTCO && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. TCO</span>
                          <span className="font-bold">{p.estimatedTCO}</span>
                        </div>
                      )}
                    </div>
                    {/* Embed code */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Embed code</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => copyEmbed(p.productSlug, idx)}
                        >
                          {copiedIdx === idx ? (
                            <><Check className="mr-1 h-3 w-3" /> Copied</>
                          ) : (
                            <><Copy className="mr-1 h-3 w-3" /> Copy</>
                          )}
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          readOnly
                          value={`<iframe src="${SITE_URL}/widget/product/${p.productSlug}" width="360" height="220" loading="lazy"></iframe>`}
                          className="font-mono text-[11px] h-auto py-1.5 pr-8"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <a href={`/products/${p.productSlug}`}>
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Full Review
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hub Comparison Widget</CardTitle>
                <CardDescription>
                  Embed a comparison widget showing the top 5 products from any category hub.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The comparison widget displays a ranked table of products from a hub (e.g., 
                  Productivity, AI Workflow, Intelligent Home) sorted by Trust Score, with 
                  Integration Score and TCO data.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Example: Productivity Hub Widget</label>
                  <Input
                    readOnly
                    value={`<iframe src="${SITE_URL}/widget/hub/productivity" width="480" height="360" loading="lazy"></iframe>`}
                    className="font-mono text-[11px] h-auto py-1.5"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const code = `<iframe src="${SITE_URL}/widget/hub/productivity" width="480" height="360" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
                      navigator.clipboard.writeText(code);
                      toast.success("Comparison widget embed code copied!");
                    }}
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copy Comparison Widget Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How to embed */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              How to Embed
            </CardTitle>
            <CardDescription>
              Adding a TheSynLab widget to your website takes 30 seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Choose a product widget from the gallery above</li>
              <li>Click <strong>Copy</strong> to copy the iframe embed code</li>
              <li>Paste the code into your website HTML where you want the scorecard to appear</li>
              <li>The widget will display live Trust Score, Integration Score, and TCO data</li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Partner program:</strong> Featured products can receive a branded badge. 
              <a href="/contact" className="ml-1 underline underline-offset-2">Contact us</a> for details.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
