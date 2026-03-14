/**
 * FEAT-004: Hub landing page – SEO list of products in a hub.
 * Route: /hub/:slug (e.g. /hub/ai_workflow, /hub/intelligent_home, /hub/hybrid_office)
 */

import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { useProducts } from "@/hooks/convex/useProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScoreBadge from "@/components/ScoreBadge";
import { ExternalLink } from "lucide-react";

const HUB_LABELS: Record<string, string> = {
  ai_workflow: "AI & Workflow",
  intelligent_home: "Intelligent Home",
  hybrid_office: "Hybrid Office",
};

export default function Hub() {
  const { slug } = useParams<{ slug: string }>();
  const hubSlug = slug ?? "";
  const { products, isLoading } = useProducts({
    hub: hubSlug,
    status: "active",
  });

  const title = HUB_LABELS[hubSlug] ?? hubSlug.replace(/_/g, " ");
  const description = `Compare and discover the best products in ${title}. Trust scores, integration scores, and expert reviews.`;
  const canonical = `/hub/${hubSlug}`;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Hubs", url: "/" },
    { name: title, url: canonical },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title={`${title} – Product Reviews & Scores`}
        description={description}
        canonical={canonical}
      />
      <JsonLd
        type="BreadcrumbList"
        breadcrumbs={breadcrumbs}
      />
      <JsonLd
        type="WebPage"
        custom={{
          name: `${title} | TheSynLab`,
          description,
          url: `https://www.thesynlab.com${canonical}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products?.length ?? 0,
            itemListElement: (products ?? []).slice(0, 10).map((p: any, i: number) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.productName,
              url: `https://www.thesynlab.com/products/${p.productSlug}`,
            })),
          },
        }}
      />
      <Header />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : !products?.length ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No products in this hub yet.</p>
            <Button asChild variant="outline">
              <Link to="/tools/compare">Browse all products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(products as any[]).map((p) => (
              <Card key={p._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/products/${p.productSlug}`}>
                  <div className="aspect-video bg-muted">
                    {p.featuredImageUrl ? (
                      <img src={p.featuredImageUrl} alt={p.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{p.category ?? p.productType}</Badge>
                  </div>
                  <h2 className="font-semibold text-lg">
                    <Link to={`/products/${p.productSlug}`} className="hover:underline">
                      {p.productName}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.nova_trust_scores?.[0] && (
                      <ScoreBadge score={p.nova_trust_scores[0].total_score} label="Trust" type="trust" />
                    )}
                    {p.nova_integration_scores?.[0] && (
                      <ScoreBadge score={p.nova_integration_scores[0].total_score} label="Integration" type="integration" />
                    )}
                  </div>
                  <Button asChild size="sm" className="w-full">
                    <Link to={`/products/${p.productSlug}`}>
                      View review <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
