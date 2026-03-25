import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScoreBadge from "@/components/ScoreBadge";

export default function PillarGuide() {
  const { slug } = useParams<{ slug: string }>();
  const hub = useQuery(api.hubs.getHubBySlug, { slug: slug ?? "" });
  const products = useQuery(api.pillarGuides.getTopProductsForHub, {
    hubSlug: slug ?? "",
    limit: 10,
  });

  const hubName = hub?.name ?? (slug ?? "").replace(/[-_]/g, " ");
  const title = `Best ${hubName} Tools 2026`;
  const description = `A pillar guide ranking the top ${hubName} products using live Trust + Integration scoring.`;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${title} | TheSynLab`}
        metaDescription={description}
        canonicalUrl={`/hubs/${slug ?? ""}/pillar`}
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: title,
          description,
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: hubName, href: `/hubs/${slug ?? ""}` },
            { label: "Pillar Guide" },
          ]}
        />

        <div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        <div className="grid gap-4">
          {(products ?? []).map((p: any, idx: number) => (
            <Card key={p._id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-3">
                  <span>
                    <span className="text-muted-foreground mr-2">#{idx + 1}</span>
                    <Link className="hover:underline" to={`/products/${p.productSlug}`}>
                      {p.productName}
                    </Link>
                  </span>
                  <Badge variant="secondary">{p.category ?? p.productType}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {p.nova_trust_scores?.[0] && (
                    <ScoreBadge score={p.nova_trust_scores[0].total_score} label="Trust" type="trust" />
                  )}
                  {p.nova_integration_scores?.[0] && (
                    <ScoreBadge score={p.nova_integration_scores[0].total_score} label="Integration" type="integration" />
                  )}
                  <Badge variant="outline">
                    Overall: {(p.computedOverallScore ?? 0).toFixed(2)}
                  </Badge>
                </div>
                {p.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

