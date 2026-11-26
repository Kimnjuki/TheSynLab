import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { STATIC_PRODUCTS } from "@/data/staticProductData";

function findProduct(slug: string) {
  return STATIC_PRODUCTS.find((p) => p.productSlug === slug);
}

export default function VsComparisonPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const parts = slug.split("-vs-");
  const aSlug = parts[0] ?? "";
  const bSlug = parts.slice(1).join("-vs-");
  const prodA = findProduct(aSlug);
  const prodB = findProduct(bSlug);
  const year = new Date().getFullYear();

  if (!prodA || !prodB) {
    return (
      <div className="min-h-screen flex flex-col">
        <MetaTags
          title="Comparison Not Found | TheSynLab"
          description="This product comparison does not exist."
          canonical=""
          noindex
        />
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <h1 className="text-2xl font-bold mb-4">Comparison Not Found</h1>
          <p className="text-muted-foreground mb-4">
            We do not have a static comparison for <code>{slug}</code>.
          </p>
          <Link to="/compare" className="text-primary hover:underline">
            뿯↽ Open the comparison tool
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const aName = prodA.productName;
  const bName = prodB.productName;
  const trustWinner = prodA.trustScore >= prodB.trustScore ? prodA : prodB;
  const intWinner =
    prodA.integrationScore >= prodB.integrationScore ? prodA : prodB;
  const tcoWinner =
    prodA.estimatedTco <= prodB.estimatedTco ? prodA : prodB;
  const trustDiff = Math.abs(prodA.trustScore - prodB.trustScore).toFixed(1);
  const intDiff = Math.abs(
    prodA.integrationScore - prodB.integrationScore
  ).toFixed(1);

  const title = `${aName} vs ${bName} (${year}): Trust Score, TCO & Integration Depth Compared`;
  const description = `${aName} vs ${bName} compared on Trust Score (${prodA.trustScore} vs ${prodB.trustScore}), Integration Score, and estimated TCO. Updated ${year}.`;
  const canonical = `https://thesynlab.com/vs/${aSlug}-vs-${bSlug}`;

  const narrative = `${aName} and ${bName} serve overlapping but distinct needs in ${prodA.category}. ${aName} scores ${prodA.trustScore}/10 on Trust while ${bName} scores ${prodB.trustScore}/10 (difference: ${trustDiff}). On integration depth, ${intWinner.productName} leads (difference: ${intDiff}). For budget, ${tcoWinner.productName} is lower at $${Math.min(prodA.estimatedTco, prodB.estimatedTco)}/yr vs $${Math.max(prodA.estimatedTco, prodB.estimatedTco)}/yr per seat.`;

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags title={title} description={description} canonical={canonical} ogType="article" />
      <JsonLd
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            mainEntityOfPage: canonical,
            author: { "@type": "Organization", name: "TheSynLab" },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://thesynlab.com/" },
              { "@type": "ListItem", position: 2, name: "Comparisons", item: "https://thesynlab.com/compare" },
              { "@type": "ListItem", position: 3, name: `${aName} vs ${bName}` },
            ],
          },
        ]}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/">TheSynLab</Link> › <Link to="/compare">Comparisons</Link> ›{" "}
          {aName} vs {bName}
        </nav>
        <h1 className="text-3xl font-bold mb-6">
          {aName} vs {bName} ({year}): Trust Score, TCO & Integration Compared
        </h1>

        <section className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">Quick Verdict</h2>
          <p>
            <strong>{trustWinner.productName}</strong> is stronger on trust and
            vendor transparency ({trustWinner.trustScore}/10).{" "}
            <strong>{intWinner.productName}</strong> leads on integration depth (
            {intWinner.integrationScore}/10). Budget pick:{" "}
            <strong>{tcoWinner.productName}</strong> at ${tcoWinner.estimatedTco}
            /yr per seat.
          </p>
        </section>

        <section className="rounded-lg border p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">Comparison Overview</h2>
          <p className="leading-relaxed">{narrative}</p>
        </section>

        <h2 className="text-xl font-semibold mb-3">Side-by-Side Score Comparison</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border p-3 text-left">Metric</th>
                <th className="border p-3 text-center">{aName}</th>
                <th className="border p-3 text-center">{bName}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Trust Score</td>
                <td className="border p-3 text-center font-medium">{prodA.trustScore}/10</td>
                <td className="border p-3 text-center font-medium">{prodB.trustScore}/10</td>
              </tr>
              <tr>
                <td className="border p-3">Integration Score</td>
                <td className="border p-3 text-center font-medium">{prodA.integrationScore}/10</td>
                <td className="border p-3 text-center font-medium">{prodB.integrationScore}/10</td>
              </tr>
              <tr>
                <td className="border p-3">Est. TCO / yr</td>
                <td className="border p-3 text-center">${prodA.estimatedTco}</td>
                <td className="border p-3 text-center">${prodB.estimatedTco}</td>
              </tr>
              <tr>
                <td className="border p-3">Price</td>
                <td className="border p-3 text-center">${prodA.price}/{prodA.priceModel}</td>
                <td className="border p-3 text-center">${prodB.price}/{prodB.priceModel}</td>
              </tr>
              <tr>
                <td className="border p-3">Category</td>
                <td className="border p-3 text-center">{prodA.category}</td>
                <td className="border p-3 text-center">{prodB.category}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold mb-3">Feature Comparison</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold mb-2">{aName} Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {prodA.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{bName} Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {prodB.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3">Best For</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold mb-2">{aName}</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
              {prodA.bestFor.slice(0, 4).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mb-2">
              {(prodA.longDescription || prodA.description).slice(0, 220)}…
            </p>
            <Link to={`/products/${prodA.productSlug}`} className="text-primary text-sm hover:underline">
              Read full {aName} review 뿯↽
            </Link>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{bName}</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
              {prodB.bestFor.slice(0, 4).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mb-2">
              {(prodB.longDescription || prodB.description).slice(0, 220)}…
            </p>
            <Link to={`/products/${prodB.productSlug}`} className="text-primary text-sm hover:underline">
              Read full {bName} review 뿯↽
            </Link>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3">Verdict</h2>
        <p className="leading-relaxed mb-6">
          <strong>{trustWinner.productName}</strong> wins on trust and data practices.{" "}
          <strong>{intWinner.productName}</strong> wins on ecosystem connectivity.{" "}
          <strong>{tcoWinner.productName}</strong> is the lower-TCO option. Pick based on
          whether privacy, integrations, or cost dominate your decision.
        </p>

        <p>
          <Link to="/compare" className="text-primary hover:underline">
            Model this comparison in TheSynLab Decision Studio 뿯↽
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
