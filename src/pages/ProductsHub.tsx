import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/convex/useProducts";

export default function ProductsHub() {
  const { products, isLoading } = useProducts({ status: "active" });

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Products Hub"
        description="Browse TheSynLab product profiles with Trust and Integration benchmarks."
        canonical="https://www.thesynlab.com/products"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Products Hub</h1>
            <p className="text-muted-foreground">Open any product to view the new decision-engine PDP.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/tools/compare">Open Compare Engine</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(products ?? []).slice(0, 18).map((p: any) => (
            <Link key={p._id} to={`/products/${p.productSlug}`} aria-label={`Open ${p.productName}`}>
              <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-4 space-y-2">
                  {p.featuredImageUrl ? (
                    <img src={p.featuredImageUrl} alt={p.productName} className="h-28 w-full rounded-md object-cover" />
                  ) : (
                    <div className="h-28 w-full rounded-md bg-muted" />
                  )}
                  <p className="font-semibold line-clamp-1">{p.productName}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description || "No summary yet."}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {!isLoading && (!products || products.length === 0) && (
            <Card><CardContent className="p-4">No products found.</CardContent></Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
