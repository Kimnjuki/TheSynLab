import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompareSlug() {
  const { slug } = useParams<{ slug: string }>();
  const data = useQuery(api.comparisons.getComparisonArticle, {
    slug: slug ?? "",
  });

  // Loading — do not emit a thin "Product A vs Product B" shell (soft 404).
  if (data === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <MetaTags
          title="Loading comparison… | TheSynLab"
          description="Loading comparison article."
          canonical=""
          noindex
        />
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <p className="text-muted-foreground">Loading comparison…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <MetaTags
          title="Comparison Not Found | TheSynLab"
          description="This comparison does not exist."
          canonical=""
          noindex
        />
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <h1 className="text-2xl font-bold mb-2">Comparison Not Found</h1>
          <Link to="/compare" className="text-primary hover:underline">
            Browse comparison tool
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const title = `${data.productA?.productName ?? "Product A"} vs ${data.productB?.productName ?? "Product B"} | TheSynLab`;
  const description =
    data.metaDescription ??
    "Detailed comparison with choose-A vs choose-B guidance.";

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title={title}
        description={description}
        canonical={`https://thesynlab.com/compare/${slug ?? ""}`}
        ogType="article"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">
          {data.productA?.productName} vs {data.productB?.productName}
        </h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose A If...</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data.chooseAIf}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Choose B If...</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data.chooseBIf}</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
