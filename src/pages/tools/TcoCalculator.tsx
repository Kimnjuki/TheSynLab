import { useState, useCallback, useMemo } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MetaTags } from "@/components/seo/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  DollarSign,
  Users,
  Calendar,
  Download,
  BarChart3,
  TrendingDown,
  Info,
  Search,
  Plus,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface ProductOption {
  _id: Id<"novaProducts">;
  productName: string;
  hub: string;
  productSlug: string;
}

const TcoCalculator = () => {
  const [sessionId] = useState(() => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
  const [selectedProductIds, setSelectedProductIds] = useState<Id<"novaProducts">[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [seatCount, setSeatCount] = useState(10);
  const [contractYears, setContractYears] = useState(1);
  const [includeHidden, setIncludeHidden] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];
  const calculateTcoAction = useAction(api.tco.calculateTco);
  const saveCalc = useMutation(api.tco.saveTcoCalculation);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return allProducts
      .filter(
        (p: any) =>
          p.productName.toLowerCase().includes(q) &&
          !selectedProductIds.includes(p._id)
      )
      .slice(0, 8);
  }, [searchQuery, allProducts, selectedProductIds]);

  const selectedProducts = useMemo(
    () => allProducts.filter((p: any) => selectedProductIds.includes(p._id)),
    [allProducts, selectedProductIds]
  );

  const addProduct = useCallback((product: ProductOption) => {
    if (selectedProductIds.length < 3) {
      setSelectedProductIds((prev) => [...prev, product._id]);
    }
    setSearchQuery("");
  }, [selectedProductIds.length]);

  const removeProduct = useCallback((id: Id<"novaProducts">) => {
    setSelectedProductIds((prev) => prev.filter((pid) => pid !== id));
    setResults(null);
  }, []);

  const handleCalculate = useCallback(async () => {
    if (selectedProductIds.length === 0) {
      toast.error("Select at least one product");
      return;
    }

    setLoading(true);
    try {
      const result = await calculateTcoAction({
        productIds: selectedProductIds,
        seatCount,
        contractLengthYears: contractYears,
        includeHiddenCosts: includeHidden,
        sessionId,
      });
      setResults(result);
      toast.success("TCO calculated!");
    } catch (err) {
      console.error("TCO error:", err);
      toast.error("Calculation failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedProductIds, seatCount, contractYears, includeHidden, sessionId, calculateTcoAction]);

  const formatCost = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  // ---- Render ----
  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="SaaS TCO Calculator — True 3-Year Cost of Any Tool — TheSynLab"
        description="Calculate the real 1, 2, and 3-year total cost of ownership for any SaaS tool — including hidden costs, onboarding, and add-ons. Compare up to 3 tools side-by-side."
        canonical="/tco-calculator"
      />

      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2">
            <Calculator className="mr-1 h-3.5 w-3.5" />
            TCO Calculator
          </Badge>
          <h1 className="text-3xl font-bold">3-Year SaaS Total Cost of Ownership</h1>
          <p className="mt-2 text-muted-foreground">
            Compare up to 3 tools side-by-side — including hidden costs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Input panel */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Tools</CardTitle>
                <CardDescription>Search and add up to 3 products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Product search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  {searchQuery && filteredProducts.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                      {(filteredProducts as ProductOption[]).map((p) => (
                        <button
                          key={p._id}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                          onClick={() => addProduct(p)}
                        >
                          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                          {p.productName}
                          <Badge variant="outline" className="ml-auto text-[10px]">
                            {p.hub}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected products */}
                {selectedProducts.length > 0 ? (
                  <div className="space-y-2">
                    {(selectedProducts as ProductOption[]).map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center justify-between rounded-md border px-3 py-2"
                      >
                        <span className="text-sm font-medium">{p.productName}</span>
                        <button
                          onClick={() => removeProduct(p._id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">No tools added yet</p>
                )}

                {/* Sliders */}
                <div className="space-y-4 pt-2">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Seat Count: <strong>{seatCount}</strong>
                    </Label>
                    <Slider
                      value={[seatCount]}
                      onValueChange={([v]) => setSeatCount(v)}
                      min={1}
                      max={500}
                      step={1}
                      className="mt-2"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>1</span>
                      <span>500</span>
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Contract Length: <strong>{contractYears}yr</strong>
                    </Label>
                    <Slider
                      value={[contractYears]}
                      onValueChange={([v]) => setContractYears(v)}
                      min={1}
                      max={3}
                      step={1}
                      className="mt-2"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>1yr</span>
                      <span>3yr</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Include hidden costs
                    </Label>
                    <Switch checked={includeHidden} onCheckedChange={setIncludeHidden} />
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCalculate}
                  disabled={selectedProductIds.length === 0 || loading}
                >
                  {loading ? (
                    "Calculating..."
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Calculate TCO
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2">
            {results ? (
              <div className="space-y-6">
                {/* Cost comparison cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {(results.results || []).map((r: any) => (
                    <Card key={r.productId}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {allProducts.find((p: any) => p._id === r.productId)?.productName || "Product"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year 1</span>
                            <span className="font-semibold">{formatCost(r.year1Cost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year 2</span>
                            <span className="font-semibold">{formatCost(r.year2Cost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year 3</span>
                            <span className="font-semibold">{formatCost(r.year3Cost)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between text-base">
                              <span className="font-bold">3-Year Total</span>
                              <span className="font-bold text-primary">{formatCost(r.totalTco)}</span>
                            </div>
                          </div>
                          {r.hiddenCostBreakdown && (
                            <p className="mt-2 text-[11px] text-muted-foreground">
                              Includes hidden costs (onboarding, training, integration)
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Alternatives */}
                {results.alternatives && results.alternatives.length > 0 && (
                  <Card className="border-amber-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingDown className="h-5 w-5 text-amber-500" />
                        Lower-Cost Alternatives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(results.alternatives || []).map((alt: any, i: number) => (
                          <li key={i} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              {alt.productName || `Alternative ${i + 1}`}
                            </span>
                            <Badge variant="outline">
                              {alt.totalTco ? formatCost(alt.totalTco) : "Est. lower"}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Download CTA */}
                <div className="text-center">
                  <Button variant="outline" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download TCO Report (PDF)
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Calculator className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Results Yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add tools and click Calculate TCO to see the breakdown
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TcoCalculator;
