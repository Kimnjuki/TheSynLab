import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScoreBadge from "@/components/ScoreBadge";

export default function BestForEcosystem() {
  const { ecosystem } = useParams<{ ecosystem: string }>();
  const eco = (ecosystem ?? "").replace(/-/g, " ");
  const rows = useQuery(api.bestFor.listBestForEcosystem, {
    ecosystem: eco,
    limit: 20,
  });

  const title = `Best for ${eco} (Live Compatibility Rankings)`;
  const description = `Automatically ranked products for ${eco} based on ecosystem compatibility and overall score.`;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${title} | TheSynLab`}
        metaDescription={description}
        canonicalUrl={`/best/for-${ecosystem ?? ""}`}
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "RecommendationList",
          name: title,
          itemListElement: (rows ?? []).slice(0, 10).map((r: any, idx: number) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: r.product.productName,
            url: `https://www.thesynlab.com/products/${r.product.productSlug}`,
          })),
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        <div className="grid gap-4">
          {(rows ?? []).map((r: any, idx: number) => (
            <Card key={`${r.product._id}-${idx}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>
                    <span className="text-muted-foreground mr-2">#{idx + 1}</span>
                    <Link className="hover:underline" to={`/products/${r.product.productSlug}`}>
                      {r.product.productName}
                    </Link>
                  </span>
                  <Badge variant="secondary">{r.compatibility.compatibilityLevel}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {r.product.trustScore?.totalScore != null && (
                    <ScoreBadge score={r.product.trustScore.totalScore} label="Trust" type="trust" />
                  )}
                  {r.product.integrationScore?.totalScore != null && (
                    <ScoreBadge score={r.product.integrationScore.totalScore} label="Integration" type="integration" />
                  )}
                  {typeof r.product.overallScore === "number" && (
                    <Badge variant="outline">Overall: {r.product.overallScore.toFixed(2)}</Badge>
                  )}
                </div>
                {r.compatibility.integrationMethod && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Integration:</span> {r.compatibility.integrationMethod}
                  </p>
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

