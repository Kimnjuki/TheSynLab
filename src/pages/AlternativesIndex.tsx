import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, GitCompare } from "lucide-react";
import { saasTools, TOOL_CATEGORIES } from "@/data/saasTools";

const POPULAR_TOOLS = saasTools
  .filter((t) => t.alternativeSlugs.length > 0)
  .sort((a, b) => b.volume - a.volume)
  .slice(0, 60);

export default function AlternativesIndex() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredTools = POPULAR_TOOLS.filter((tool) => {
    const matchesSearch =
      search === "" ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "all" || tool.category === category;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...Object.entries(TOOL_CATEGORIES).map(([value, { name }]) => ({
      value,
      label: name,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Best Alternatives – Find Better Software Replacements | TheSynLab"
        description="Discover the best alternatives to popular SaaS tools. Every alternative scored for integration depth, TCO, vendor risk, and trust. Find your perfect stack match."
        canonical="/alternatives"
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 border-b">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">Alternatives Hub</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Better Alternatives
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every alternative scored for integration grade, 3-year TCO, vendor risk, and real user trust — not just star ratings.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-14 z-30 border-b bg-background/95 backdrop-blur py-3">
          <div className="container mx-auto px-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools…"
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant={category === opt.value ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCategory(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Tool Grid */}
        <section className="container mx-auto px-4 py-10">
          <p className="text-sm text-muted-foreground mb-6">
            {filteredTools.length} tools with scored alternatives
          </p>
          {filteredTools.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No tools match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => (
                <Card key={tool.slug} className="group hover:border-primary/40 hover:shadow-md transition-all">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {tool.alternativeSlugs.length} alts
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.tagline}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">Trust</span>
                        <span className={`font-semibold ${tool.trustScore >= 4.2 ? "text-green-600" : tool.trustScore >= 3.8 ? "text-amber-600" : "text-red-500"}`}>
                          {tool.trustScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">Int.</span>
                        <span className={`font-semibold ${tool.integrationScore >= 4.2 ? "text-green-600" : tool.integrationScore >= 3.8 ? "text-amber-600" : "text-red-500"}`}>
                          {tool.integrationScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <Link to={`/tool/${tool.slug}/alternatives`} className="mt-auto">
                      <Button variant="ghost" size="sm" className="w-full gap-1 h-8 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <GitCompare className="h-3 w-3" />
                        Best alternatives <ArrowRight className="h-3 w-3 ml-auto" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Browse by category */}
        <section className="border-t py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(TOOL_CATEGORIES).map(([slug, { name, description }]) => {
                const count = POPULAR_TOOLS.filter((t) => t.category === slug).length;
                return (
                  <Link key={slug} to={`/hub/ai-tools/${slug}`} className="group">
                    <Card className="hover:border-primary/30 hover:shadow-sm transition-all">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{count} tools with alternatives</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
