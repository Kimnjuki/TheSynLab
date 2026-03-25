import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function parseRecipeSlug(slug: string) {
  const parts = slug.split("-and-");
  if (parts.length === 2) {
    return { a: parts[0].replace(/-/g, " "), b: parts[1].replace(/-/g, " ") };
  }
  const toParts = slug.split("-to-");
  if (toParts.length === 2) {
    return { a: toParts[0].replace(/-/g, " "), b: toParts[1].replace(/-/g, " ") };
  }
  return { a: slug.replace(/-/g, " "), b: "" };
}

export default function IntegrationRecipe() {
  const { slug } = useParams<{ slug: string }>();
  const parsed = useMemo(() => parseRecipeSlug(slug ?? ""), [slug]);
  const entry = useQuery(api.integrationRecipes.getMatrixEntry, {
    ecosystemA: parsed.a,
    ecosystemB: parsed.b,
  });

  const title = parsed.b ? `How to connect ${parsed.a} and ${parsed.b}` : `Integration recipe: ${parsed.a}`;
  const description =
    "Integration recipe powered by TheSynLab compatibility matrix (setup complexity, integration method, and notes).";

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${title} | TheSynLab`}
        metaDescription={description}
        canonicalUrl={`/recipes/${slug ?? ""}`}
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: title,
          description,
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 space-y-6">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>

        <Card>
          <CardHeader>
            <CardTitle>Compatibility Matrix Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!entry ? (
              <div className="text-muted-foreground">
                No matrix entry found yet for this pair. Add one to `apiCompatibilityMatrix` to publish this recipe.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Score: {entry.compatibilityScore}/10</Badge>
                  <Badge variant="outline">Complexity: {entry.setupComplexity}/5</Badge>
                </div>
                <div>
                  <div className="font-medium">Integration method</div>
                  <div className="text-muted-foreground">{entry.integrationMethod}</div>
                </div>
                {entry.notes && (
                  <div>
                    <div className="font-medium">Notes</div>
                    <div className="text-muted-foreground whitespace-pre-wrap">{entry.notes}</div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

