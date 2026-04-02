import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/../convex/_generated/api";

export default function ProductsWatchlist() {
  const { user, loading: authLoading } = useAuth();
  const rows = useQuery(
    api.productBookmarks.listDetailedByUser,
    user?.id ? { userId: user.id } : "skip"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="My Products Watchlist | TheSynLab"
        description="Track your saved products with trust and integration signals."
        canonical="https://www.thesynlab.com/products/watchlist"
      />
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Watchlist</h1>
            <p className="text-muted-foreground">Saved products and their latest benchmark signals.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/products">Back to Products Hub</Link>
          </Button>
        </div>

        {!user && !authLoading ? (
          <Card>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground">Sign in to view your watchlist.</p>
              <Button asChild><Link to="/auth">Sign In</Link></Button>
            </CardContent>
          </Card>
        ) : null}

        {authLoading || (user && rows === undefined) ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="p-4 space-y-3"><Skeleton className="h-28 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
            ))}
          </div>
        ) : null}

        {user && rows && rows.length === 0 ? (
          <Card>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground">You have no saved products yet.</p>
              <Button asChild><Link to="/products">Explore Products</Link></Button>
            </CardContent>
          </Card>
        ) : null}

        {user && rows && rows.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row: any) => (
              <Link key={row.bookmark._id} to={`/products/${row.product.productSlug}`} aria-label={`Open ${row.product.productName}`}>
                <Card className="h-full border-primary/20 transition-colors hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{row.product.productName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {row.product.featuredImageUrl ? (
                      <img src={row.product.featuredImageUrl} alt={row.product.productName} className="h-28 w-full rounded-md object-cover" />
                    ) : (
                      <div className="h-28 w-full rounded-md bg-muted" />
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">{row.product.verdictSummary || row.product.description || "No summary yet."}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">Trust: {row.trustScore ?? "N/A"}</Badge>
                      <Badge variant="outline">Integration: {row.integrationScore ?? "N/A"}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
