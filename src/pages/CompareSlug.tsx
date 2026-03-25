import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompareSlug() {
  const { slug } = useParams<{ slug: string }>();
  const data = useQuery(api.comparisons.getComparisonArticle, {
    slug: slug ?? "",
  });

  if (data === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <h1 className="text-2xl font-bold mb-2">Comparison Not Found</h1>
          <Link to="/tools/compare" className="text-primary hover:underline">
            Browse comparison tool
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${data?.productA?.productName ?? "Product A"} vs ${data?.productB?.productName ?? "Product B"} | TheSynLab`}
        metaDescription={data?.metaDescription ?? "Detailed comparison with choose-A vs choose-B guidance."}
        canonicalUrl={`/compare/${slug ?? ""}`}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">
          {data?.productA?.productName} vs {data?.productB?.productName}
        </h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose A If...</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data?.chooseAIf}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Choose B If...</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data?.chooseBIf}</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
