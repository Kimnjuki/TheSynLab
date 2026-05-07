import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { MetaTags } from "@/components/seo/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  Plus,
  Trash2,
  Search,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  ArrowUp,
  RefreshCw,
  BarChart3,
  X,
  ExternalLink,
} from "lucide-react";
import type { Id } from "@/../convex/_generated/dataModel";

interface ProductOption {
  _id: Id<"novaProducts">;
  productName: string;
  productSlug: string;
  hub: string;
}

const MyStackDashboard = () => {
  const [sessionId] = useState(() => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const myStack = useQuery(api.myStack.getMyStack, {
    identifier: { type: "sessionId", value: sessionId },
  });
  const addToStack = useMutation(api.myStack.addToMyStack);
  const removeFromStack = useMutation(api.myStack.removeFromMyStack);
  const computeRiskWarnings = useAction(api.myStack.computeStackRiskWarnings);
  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];

  const stackData = myStack?.[0];
  const productIds = stackData?.productIds || [];
  const riskWarnings = stackData?.riskWarnings || [];
  const tcoEstimate = stackData?.tcoEstimate;
  const lastComputed = stackData?.lastComputedAt;

  const stackProducts = useMemo(() => {
    return (allProducts as ProductOption[]).filter((p) => productIds.includes(p._id));
  }, [allProducts, productIds]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return (allProducts as ProductOption[]).filter(
      (p) =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !productIds.includes(p._id)
    ).slice(0, 6);
  }, [searchQuery, allProducts, productIds]);

  const handleAddProduct = useCallback(async (productId: Id<"novaProducts">) => {
    try {
      await addToStack({ sessionId, productIds: [productId], action: "add" });
      setSearchQuery("");
      toast.success("Added to your stack");
    } catch (err) {
      toast.error("Failed to add");
    }
  }, [sessionId, addToStack]);

  const handleRemoveProduct = useCallback(async (productId: Id<"novaProducts">) => {
    try {
      await removeFromStack({ sessionId, productIds: [productId] });
      toast.success("Removed from your stack");
    } catch (err) {
      toast.error("Failed to remove");
    }
  }, [sessionId, removeFromStack]);

  const handleRunRiskCheck = useCallback(async () => {
    try {
      await computeRiskWarnings({ sessionId });
      toast.success("Risk analysis complete!");
    } catch (err) {
      toast.error("Risk analysis failed");
    }
  }, [sessionId, computeRiskWarnings]);

  const highSeverityWarnings = riskWarnings.filter((w: any) => w.severity === "high" || w.severity === "critical");

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="My Stack — TheSynLab Dashboard"
        description="Your saved tool stack with risk analysis, cost estimates, and vendor warnings."
        canonical="/my-stack"
        noindex={true}
      />
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2">
            <Layers className="mr-1 h-4 w-4" />
            My Stack
          </Badge>
          <h1 className="text-3xl font-bold">Your Tool Stack</h1>
          <p className="mt-2 text-muted-foreground">
            Saved tools, risk warnings, and total cost estimates
          </p>
        </div>

        {/* Add tool search */}
        <Card className="mx-auto mb-8 max-w-lg">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && filteredProducts.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                  {(filteredProducts as ProductOption[]).map((p) => (
                    <button
                      key={p._id}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                      onClick={() => handleAddProduct(p._id)}
                    >
                      <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex-1">
                        <span className="font-medium">{p.productName}</span>
                        <Badge variant="outline" className="ml-2 text-[10px]">{p.hub}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stack products */}
        {stackProducts.length === 0 && (
          <Card className="mx-auto max-w-lg py-12 text-center">
            <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Your stack is empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Search and add tools to get started
            </p>
          </Card>
        )}

        {stackProducts.length > 0 && (
          <>
            {/* Summary bar */}
            <Card className="mb-8">
              <CardContent className="flex flex-wrap items-center justify-center gap-6 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stackProducts.length}</p>
                  <p className="text-xs text-muted-foreground">Tools</p>
                </div>
                {tcoEstimate !== undefined && tcoEstimate !== null && (
                  <div className="text-center">
                    <p className="text-2xl font-bold">${Math.round(tcoEstimate)}</p>
                    <p className="text-xs text-muted-foreground">Est. Monthly Cost</p>
                  </div>
                )}
                {highSeverityWarnings.length > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">{highSeverityWarnings.length}</p>
                    <p className="text-xs text-muted-foreground">Risk Warnings</p>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={handleRunRiskCheck}>
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Run Risk Check
                </Button>
              </CardContent>
            </Card>

            {/* Product cards */}
            <h2 className="mb-4 text-xl font-semibold">Your Tools</h2>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              {stackProducts.map((p) => (
                <Card key={p._id} className="group relative">
                  <button
                    className="absolute right-2 top-2 z-10 rounded-full p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    onClick={() => handleRemoveProduct(p._id)}
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-medium">{p.productName}</h3>
                        <Badge variant="outline" className="text-[10px]">{p.hub}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/products/${p.productSlug}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Risk warnings for this product */}
                    {riskWarnings.filter((w: any) => w.productId === p._id).length > 0 && (
                      <div className="mt-3 space-y-1">
                        {riskWarnings.filter((w: any) => w.productId === p._id).map((w: any, i: number) => (
                          <div key={i} className="flex items-start gap-2 rounded-md bg-red-500/5 p-2 text-xs">
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
                            <span>{w.warningMessage}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Quick actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/vendor-risk-checker")}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            Vendor Risk Checker
          </Button>
          <Button variant="outline" onClick={() => navigate("/tco-calculator")}>
            <DollarSign className="mr-2 h-4 w-4" />
            TCO Calculator
          </Button>
          <Button variant="outline" onClick={() => navigate("/stack-quiz")}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Stack Quiz
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyStackDashboard;
