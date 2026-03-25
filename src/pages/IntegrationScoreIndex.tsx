import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntegrationScoreIndex() {
  const data = useQuery(api.scoreIndexes.getProductsWithIntegrationScores, { page: 1, pageSize: 50 });

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Integration Score Index 2026 | TheSynLab"
        metaDescription="Live index of Integration Scores for smart home and AI tools."
        canonicalUrl="/scores/integration-score-index"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Integration Score Index</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.items ?? []).map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b pb-2">
                <span>{item.productName}</span>
                <span className="font-semibold">{item.integrationScore.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
