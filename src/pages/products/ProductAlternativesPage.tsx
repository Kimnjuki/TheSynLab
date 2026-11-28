import { Link, Navigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { STATIC_PRODUCTS } from "@/data/staticProductData";
import { saasTools } from "@/data/saasTools";
import { prefersToolCanonical } from "@/data/catalogCanonical";

function altHref(slug: string) {
  return STATIC_PRODUCTS.some((p) => p.productSlug === slug)
    ? `/products/${slug}`
    : `/tool/${slug}`;
}

function altName(slug: string) {
  return (
    STATIC_PRODUCTS.find((p) => p.productSlug === slug)?.productName ??
    saasTools.find((t) => t.slug === slug)?.name ??
    slug
  );
}

export default function ProductAlternativesPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const product = STATIC_PRODUCTS.find((p) => p.productSlug === slug);
  const year = new Date().getFullYear();

  // Dual-catalog: prefer /tool/:slug/alternatives when that review is canonical.
  if (slug && prefersToolCanonical(slug)) {
    return <Navigate to={"/tool/" + slug + "/alternatives"} replace />;
  }

  if (!product || product.alternativeSlugs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <MetaTags
          title="Alternatives Not Found | TheSynLab"
          description="This alternatives page does not exist."
          canonical=""
          noindex
        />
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <h1 className="text-2xl font-bold mb-4">Alternatives Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">
            뿯↽ Browse products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const alts = product.alternativeSlugs;
  const title = `Top ${alts.length} ${product.productName} Alternatives ${year} — Ranked by Trust Score`;
  const description = `Compare Trust Scores, Integration Scores, and TCO for the best ${product.productName} alternatives. Updated ${year}.`;
  const canonical = `https://thesynlab.com/products/${product.productSlug}/alternatives`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Thin product-catalog alts: noindex; /tool/:slug/alternatives stays indexable. */}
      <MetaTags title={title} description={description} canonical={canonical} noindex />
      <JsonLd
        type="ItemList"
        custom={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: title,
          numberOfItems: alts.length,
          itemListElement: alts.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: altName(s),
            url: `https://thesynlab.com${altHref(s)}`,
          })),
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/">TheSynLab</Link> › <Link to="/products">Products</Link> ›{" "}
          <Link to={`/products/${product.productSlug}`}>{product.productName}</Link> ›
          Alternatives
        </nav>
        <h1 className="text-3xl font-bold mb-4">
          Best {product.productName} Alternatives ({year})
        </h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Compare Trust Scores, Integration Scores, and TCO for top alternatives to{" "}
          {product.productName}. Every option below uses the same lab methodology as our
          full review.
        </p>

        <h2 className="text-xl font-semibold mb-3">
          Why look for a {product.productName} alternative?
        </h2>
        <p className="leading-relaxed mb-6">
          {product.productName} scores {product.trustScore}/10 on Trust and{" "}
          {product.integrationScore}/10 on Integration at roughly ${product.estimatedTco}
          /yr per seat. Teams typically switch for pricing at scale, deeper stack fit, or
          stronger privacy guarantees.
        </p>

        {product.pros.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-3">
              What {product.productName} still does well
            </h2>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              {product.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}

        {product.cons.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-3">Where it falls short</h2>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              {product.cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </>
        )}

        <h2 className="text-xl font-semibold mb-4">The alternatives, ranked</h2>
        <ol className="space-y-4 mb-8">
          {alts.map((s, i) => {
            const alt = STATIC_PRODUCTS.find((p) => p.productSlug === s);
            const tool = saasTools.find((t) => t.slug === s);
            const blurb =
              alt?.description ?? tool?.shortDescription ?? "See full review for scoring details.";
            return (
              <li key={s} className="border-b pb-4">
                <p className="font-semibold">
                  {i + 1}. <Link to={altHref(s)} className="text-primary hover:underline">{altName(s)}</Link>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {alt
                    ? `Trust ${alt.trustScore}/10 뿯½ Integration ${alt.integrationScore}/10 뿯½ $${alt.estimatedTco}/yr 뿯½ `
                    : ""}
                  {blurb}
                </p>
              </li>
            );
          })}
        </ol>

        <p>
          <Link to="/compare" className="text-primary hover:underline">
            Use the comparison tool 뿯↽
          </Link>{" "}
          or read the{" "}
          <Link to={`/products/${product.productSlug}`} className="text-primary hover:underline">
            full {product.productName} review
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}
