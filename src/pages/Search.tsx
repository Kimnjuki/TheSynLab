import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon, SlidersHorizontal, Star, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "trust_desc", label: "Trust Score (High–Low)" },
  { value: "integration_desc", label: "Integration Score (High–Low)" },
  { value: "price_asc", label: "Price (Low–High)" },
  { value: "newest", label: "Newest" },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState("relevance");
  const [trustRange, setTrustRange] = useState([0, 10]);
  const [integRange, setIntegRange] = useState([0, 10]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [onlyLabTested, setOnlyLabTested] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const logSearch = useMutation(api.search.log);

  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];

  const results = useMemo(() => {
    if (!query && !onlyLabTested) return allProducts;
    const q = query.toLowerCase();
    let filtered = allProducts.filter((p: any) => {
      if (
        q &&
        !p.productName?.toLowerCase().includes(q) &&
        !p.description?.toLowerCase().includes(q) &&
        !p.category?.toLowerCase().includes(q)
      )
        return false;
      const trust = p.nova_trust_scores?.[0]?.total_score ?? 0;
      const integ = p.nova_integration_scores?.[0]?.total_score ?? 0;
      if (trust < trustRange[0] || trust > trustRange[1]) return false;
      if (integ < integRange[0] || integ > integRange[1]) return false;
      if ((p.price ?? 0) < priceRange[0] || (p.price ?? 0) > priceRange[1]) return false;
      if (onlyLabTested && !p.labTestedAt) return false;
      return true;
    });

    if (sort === "trust_desc") {
      filtered = [...filtered].sort((a: any, b: any) =>
        (b.nova_trust_scores?.[0]?.total_score ?? 0) -
        (a.nova_trust_scores?.[0]?.total_score ?? 0)
      );
    } else if (sort === "integration_desc") {
      filtered = [...filtered].sort((a: any, b: any) =>
        (b.nova_integration_scores?.[0]?.total_score ?? 0) -
        (a.nova_integration_scores?.[0]?.total_score ?? 0)
      );
    } else if (sort === "price_asc") {
      filtered = [...filtered].sort((a: any, b: any) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "newest") {
      filtered = [...filtered].sort(
        (a: any, b: any) => (b.releaseDate ?? 0) - (a.releaseDate ?? 0)
      );
    }

    return filtered;
  }, [allProducts, query, sort, trustRange, integRange, priceRange, onlyLabTested]);

  const handleSearch = () => {
    if (query.trim()) {
      setSearchParams({ q: query });
      logSearch({ query, resultsCount: results.length }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title={`Search: ${query || "All Products"}`}
        description="Search TheSynLab's product database with advanced filters."
        canonical="/search"
      />
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Product Search</h1>
            <div className="flex gap-2 max-w-2xl">
              <Input
                placeholder="Search products, categories, features…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="text-base"
              />
              <Button onClick={handleSearch} className="gap-2 px-6">
                <SearchIcon className="h-4 w-4" />
                Search
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters */}
            <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="space-y-6 sticky top-24">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Sort By</Label>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Trust Score: {trustRange[0]}–{trustRange[1]}
                  </Label>
                  <Slider
                    value={trustRange}
                    onValueChange={setTrustRange}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Integration Score: {integRange[0]}–{integRange[1]}
                  </Label>
                  <Slider
                    value={integRange}
                    onValueChange={setIntegRange}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Price: ${priceRange[0]}–${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={5000}
                    step={50}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyLabTested}
                      onChange={(e) => setOnlyLabTested(e.target.checked)}
                      className="rounded"
                    />
                    <FlaskConical className="h-3 w-3" />
                    Lab Tested Only
                  </label>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTrustRange([0, 10]);
                    setIntegRange([0, 10]);
                    setPriceRange([0, 5000]);
                    setOnlyLabTested(false);
                    setSort("relevance");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground text-sm">
                  {results.length} product{results.length !== 1 ? "s" : ""} found
                  {query && ` for "${query}"`}
                </p>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-16">
                  <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No products match your criteria.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(results as any[]).map((p) => {
                    const trust = p.nova_trust_scores?.[0]?.total_score;
                    const integ = p.nova_integration_scores?.[0]?.total_score;
                    return (
                      <Card key={p._id}>
                        <CardContent className="pt-4 flex gap-4 items-start">
                          {p.featuredImageUrl && (
                            <img
                              src={p.featuredImageUrl}
                              alt={p.productName}
                              className="w-16 h-16 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                to={`/products/${p.productSlug}`}
                                className="font-semibold hover:text-primary transition-colors line-clamp-1"
                              >
                                {p.productName}
                              </Link>
                              {p.price != null && (
                                <span className="text-primary font-bold flex-shrink-0">
                                  ${p.price}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {p.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {p.category}
                                </Badge>
                              )}
                              {trust != null && (
                                <Badge
                                  variant="outline"
                                  className="text-xs gap-1"
                                >
                                  <Star className="h-3 w-3" />
                                  Trust {trust}/10
                                </Badge>
                              )}
                              {integ != null && (
                                <Badge variant="outline" className="text-xs">
                                  Int. {integ}/10
                                </Badge>
                              )}
                              {p.labTestedAt && (
                                <Badge variant="outline" className="text-xs text-purple-600">
                                  <FlaskConical className="h-3 w-3 mr-1" />
                                  Lab Tested
                                </Badge>
                              )}
                            </div>
                            {p.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {p.description}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
