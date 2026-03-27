import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScoreBadge from "@/components/ScoreBadge";
import { Search } from "lucide-react";

export default function AIProductFinder() {
  const [q, setQ] = useState("Matter smart lock under $200");
  const [active, setActive] = useState("");

  const results = useQuery(
    api.productFinder.searchProducts,
    active.length > 1 ? { q: active, limit: 16 } : "skip"
  );

  const runSearch = () => {
    setActive(q.trim());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="AI product finder"
        description="Natural language product discovery — NEW-001 MVP with Convex search over catalog + scores."
        canonical="/tools/find"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
        <Link to="/tools" className="text-sm text-primary hover:underline mb-6 inline-block">
          ← Tools hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">AI product finder</h1>
        <p className="text-muted-foreground mb-6">
          Describe what you need. We match keywords against product names, categories, and descriptions, then show trust and integration scores. Plug in Claude with tools for full conversational ranking (see roadmap).
        </p>

        <div className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="e.g. HomeKit security camera with local processing"
            />
          </div>
          <Button onClick={runSearch}>Find</Button>
        </div>

        {!active && (
          <p className="text-sm text-muted-foreground">Enter a query and press Find.</p>
        )}

        {active && results === undefined && (
          <p className="text-muted-foreground">Searching…</p>
        )}

        {active && results && results.length === 0 && (
          <p className="text-muted-foreground">No matches — try broader terms.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {results?.map((p) => (
            <Card key={p._id}>
              <CardContent className="p-4 space-y-3">
                {p.featuredImageUrl && (
                  <img
                    src={p.featuredImageUrl}
                    alt=""
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <div>
                  <Link
                    to={`/products/${p.productSlug}`}
                    className="font-semibold hover:text-primary line-clamp-2"
                  >
                    {p.productName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{p.manufacturer}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="secondary">{p.category}</Badge>
                  {p.trustScore != null && (
                    <ScoreBadge score={p.trustScore} label="Trust" type="trust" />
                  )}
                  {p.integrationScore != null && (
                    <ScoreBadge
                      score={p.integrationScore}
                      label="Integration"
                      type="integration"
                    />
                  )}
                  {p.price != null && (
                    <span className="text-sm font-medium">${p.price}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
