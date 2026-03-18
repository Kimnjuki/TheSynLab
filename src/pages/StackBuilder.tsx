import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Layers,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Save,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface StackProduct {
  _id: Id<"novaProducts">;
  productName: string;
  category?: string;
  hub: string;
  price?: number;
  ecosystems?: string[];
}

function compatibilityScore(products: StackProduct[]): number {
  if (products.length < 2) return 100;
  let shared = 0;
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const ecosA = products[i].ecosystems ?? [];
      const ecosB = products[j].ecosystems ?? [];
      const union = new Set([...ecosA, ...ecosB]).size;
      const intersection = ecosA.filter((e) => ecosB.includes(e)).length;
      if (union > 0) {
        shared += intersection / union;
        total += 1;
      }
    }
  }
  return total > 0 ? Math.round((shared / total) * 100) : 50;
}

export default function StackBuilder() {
  const { user } = useAuth();
  const [canvas, setCanvas] = useState<StackProduct[]>([]);
  const [search, setSearch] = useState("");
  const [stackName, setStackName] = useState("My Stack");

  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];
  const saveConfig = useMutation(api.userWorkflowConfigs.save);

  const filtered = search.length >= 2
    ? allProducts
        .filter((p: any) =>
          p.productName?.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 8)
    : [];

  const addToCanvas = useCallback(
    async (product: any) => {
      if (canvas.some((p) => p._id === product._id)) {
        toast.info("Already in your stack");
        return;
      }
      setCanvas((prev) => [
        ...prev,
        {
          _id: product._id,
          productName: product.productName,
          category: product.category,
          hub: product.hub,
          price: product.price,
          ecosystems: [],
        },
      ]);
      setSearch("");
    },
    [canvas]
  );

  const removeFromCanvas = (id: Id<"novaProducts">) => {
    setCanvas((prev) => prev.filter((p) => p._id !== id));
  };

  const score = compatibilityScore(canvas);

  const handleSave = async () => {
    if (!user) {
      toast.error("Sign in to save your stack");
      return;
    }
    try {
      await saveConfig({
        userId: user.id,
        name: stackName,
        description: `Stack with ${canvas.length} products`,
        workflowNodes: canvas.map((p) => ({ id: p._id, type: "product", data: p })),
        workflowConnections: [],
      });
      toast.success("Stack saved!");
    } catch {
      toast.error("Failed to save stack");
    }
  };

  const handleShare = () => {
    const ids = canvas.map((p) => p.productName).join(",");
    const url = `${window.location.origin}/tools/stack-builder?stack=${encodeURIComponent(ids)}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Share link copied!"));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Stack Builder"
        description="Build and validate your product stack. Check real-time compatibility across your selected tools and smart devices."
        canonical="/tools/stack-builder"
      />
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-2">Build My Stack</h1>
            <p className="text-muted-foreground max-w-2xl">
              Drag products into your stack and instantly see compatibility across ecosystems.
              Save and share your configuration.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product Search */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Search className="h-4 w-4" />
                    Add Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Search products…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {filtered.map((p: any) => (
                    <button
                      key={p._id}
                      onClick={() => addToCanvas(p)}
                      className="w-full text-left p-2 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="text-sm font-medium">{p.productName}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.category} · {p.hub}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-2 space-y-4">
              {/* Stack health */}
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      <Input
                        value={stackName}
                        onChange={(e) => setStackName(e.target.value)}
                        className="font-semibold h-7 border-transparent hover:border-input px-1 w-40"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleShare} className="gap-1">
                        <Share2 className="h-3 w-3" />
                        Share
                      </Button>
                      <Button size="sm" onClick={handleSave} className="gap-1">
                        <Save className="h-3 w-3" />
                        Save
                      </Button>
                    </div>
                  </div>
                  {canvas.length >= 2 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Stack Health Score</span>
                        <span
                          className={`font-semibold ${
                            score >= 70
                              ? "text-green-600"
                              : score >= 40
                              ? "text-amber-600"
                              : "text-red-500"
                          }`}
                        >
                          {score}%
                        </span>
                      </div>
                      <Progress value={score} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Based on ecosystem overlap across {canvas.length} products
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {canvas.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Plus className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Search and add products to build your stack
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {canvas.map((product) => (
                    <Card key={product._id} className="relative">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {product.productName}
                            </p>
                            <div className="flex gap-1 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {product.category ?? product.hub}
                              </Badge>
                              {product.price != null && (
                                <Badge variant="outline" className="text-xs">
                                  ${product.price}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive flex-shrink-0"
                            onClick={() => removeFromCanvas(product._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
