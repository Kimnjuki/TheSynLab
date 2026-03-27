import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  X,
  AlertCircle,
  Search,
  Shield,
  Users,
  Lightbulb,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AICompatibilityAssistant } from "@/components/compatibility/AICompatibilityAssistant";
import { CompatibilitySimulationPanel } from "@/components/compatibility/CompatibilitySimulationPanel";
import { ApiCompatibilitySnippet } from "@/components/compatibility/ApiCompatibilitySnippet";

const ALL_ECOSYSTEMS = [
  "Apple HomeKit",
  "Google Home",
  "Amazon Alexa",
  "Matter",
  "Zigbee",
  "Z-Wave",
  "Thread",
  "Home Assistant",
  "SmartThings",
  "IFTTT",
  "Zapier",
  "Make",
  "n8n",
  "REST API",
  "Webhooks",
  "MQTT",
  "Bluetooth",
  "Wi-Fi 6",
];

const SETUP_TIME: Record<number, string> = {
  1: "~15 min",
  2: "~30 min",
  3: "~1 hour",
  4: "2+ hours",
};

function EcosystemCell({
  level,
  requiresHub,
  setupComplexity,
}: {
  level?: string;
  requiresHub?: boolean;
  setupComplexity?: number;
}) {
  if (!level || level === "unknown") {
    return (
      <span className="text-muted-foreground text-lg" title="Unknown">
        ?
      </span>
    );
  }
  const icon =
    level === "full" ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : level === "partial" ? (
      <AlertCircle className="h-4 w-4 text-amber-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    );
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help flex justify-center">{icon}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize font-medium">{level}</p>
          {requiresHub && <p className="text-xs">Requires hub</p>}
          {setupComplexity && (
            <p className="text-xs">Setup: {SETUP_TIME[setupComplexity] ?? "varies"}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ProductSlot({
  slot,
  label,
  product,
  search,
  setSearch,
  setProduct,
  filtered,
}: {
  slot: string;
  label: string;
  product: any;
  search: string;
  setSearch: (v: string) => void;
  setProduct: (p: any) => void;
  filtered: any[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>Search and select a product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!product ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Type to search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {filtered.map((p: any) => (
              <button
                key={p._id}
                onClick={() => {
                  setProduct(p);
                  setSearch("");
                }}
                className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm">{p.productName}</div>
                <div className="text-xs text-muted-foreground">
                  {p.manufacturer} · {p.category}
                </div>
              </button>
            ))}
          </>
        ) : (
          <div className="space-y-3">
            {product.featuredImageUrl && (
              <img
                src={product.featuredImageUrl}
                alt={product.productName}
                className="w-full h-28 object-cover rounded"
              />
            )}
            <h3 className="font-semibold">{product.productName}</h3>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.hub}</Badge>
            </div>
            <Button variant="outline" onClick={() => setProduct(null)} className="w-full">
              Change Product
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompatibilityChecker() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([null, null, null]);
  const [searches, setSearches] = useState(["", "", ""]);

  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];

  const filtered = searches.map((s) => {
    if (!s || s.length < 2) return [];
    return allProducts
      .filter((p: any) => p.productName?.toLowerCase().includes(s.toLowerCase()))
      .slice(0, 5);
  });

  const ecosystemsA = useQuery(
    api.products.getEcosystems,
    products[0] ? { productId: products[0]._id } : "skip"
  ) ?? [];
  const ecosystemsB = useQuery(
    api.products.getEcosystems,
    products[1] ? { productId: products[1]._id } : "skip"
  ) ?? [];
  const ecosystemsC = useQuery(
    api.products.getEcosystems,
    products[2] ? { productId: products[2]._id } : "skip"
  ) ?? [];

  const allEco = [ecosystemsA, ecosystemsB, ecosystemsC];
  const selectedProducts = products.filter(Boolean);

  const matrixData = useMemo(() => {
    return ALL_ECOSYSTEMS.map((eco) => ({
      ecosystem: eco,
      levels: products.map((_, i) => {
        const found = allEco[i]?.find((e: any) => e.ecosystem === eco);
        return found
          ? {
              level: found.compatibilityLevel,
              requiresHub: found.requiresHub,
              setupComplexity: found.setupComplexity,
              verifiedCount: found.verifiedCount,
            }
          : null;
      }),
    })).filter((row) => row.levels.some((l) => l !== null));
  }, [ecosystemsA, ecosystemsB, ecosystemsC, products]);

  const fullyCompatible = matrixData.filter((row) =>
    row.levels
      .filter((_, i) => products[i] !== null)
      .every((l) => l?.level === "full")
  ).length;

  const hubSuggestions = useQuery(
    api.products.getHubSuggestions,
    selectedProducts.length >= 2
      ? {
          ecosystems: [
            ...new Set(
              allEco
                .flat()
                .map((e: any) => e?.ecosystem)
                .filter(Boolean)
            ),
          ] as string[],
        }
      : "skip"
  ) ?? [];

  const compatPct =
    matrixData.length > 0
      ? Math.round((fullyCompatible / matrixData.length) * 100)
      : 0;

  const aiContext = useMemo(() => {
    const names = selectedProducts.map((p) => p.productName).join(", ");
    const ecoSummary = matrixData
      .slice(0, 12)
      .map((r) => `${r.ecosystem}: ${r.levels.map((l) => l?.level ?? "—").join("/")}`)
      .join("; ");
    return `Products: ${names}. Matrix sample: ${ecoSummary}. Compatibility index: ${compatPct}%.`;
  }, [selectedProducts, matrixData, compatPct]);

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Compatibility Checker"
        description="Check ecosystem compatibility across up to 3 products with a full matrix, setup wizard, and bridge suggestions."
        canonical="/tools/compatibility"
      />
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Compatibility Checker
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Check if up to 3 products work together across 18+ ecosystems. Full matrix,
              hub detection, and step-by-step setup wizard.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-10">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link to="/tools/hub-builder" className="text-primary hover:underline">
              Multi-device hub builder
            </Link>
            <Link to="/tools/compatibility-leaderboard" className="text-primary hover:underline">
              Compatibility leaderboard
            </Link>
            <Link to="/tools/find" className="text-primary hover:underline">
              AI product finder
            </Link>
          </div>

          {/* Product Selection */}
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <ProductSlot
                key={i}
                slot={`product-${i}`}
                label={`Product ${String.fromCharCode(65 + i)}`}
                product={products[i]}
                search={searches[i]}
                setSearch={(v) => setSearches((prev) => { const n = [...prev]; n[i] = v; return n; })}
                setProduct={(p) => setProducts((prev) => { const n = [...prev]; n[i] = p; return n; })}
                filtered={filtered[i]}
              />
            ))}
          </div>

          {selectedProducts.length >= 2 && (
            <>
              {/* Compatibility Score Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-4xl font-bold text-primary">{compatPct}%</div>
                      <p className="text-sm text-muted-foreground">Overall Compatibility</p>
                      <Progress value={compatPct} className="mt-2 h-2" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-green-600">{fullyCompatible}</div>
                      <p className="text-sm text-muted-foreground">Fully Compatible Ecosystems</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-amber-600">
                        {matrixData.filter((r) =>
                          r.levels.some((l) => l?.level === "partial")
                        ).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Partial Support</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-muted-foreground">
                        {matrixData.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Ecosystems Checked</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compatibility Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle>Compatibility Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium">Ecosystem</th>
                          {products.map(
                            (p, i) =>
                              p && (
                                <th key={i} className="text-center py-2 px-4 font-medium text-xs">
                                  {p.productName}
                                </th>
                              )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {matrixData.map((row) => (
                          <tr key={row.ecosystem} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="py-2 pr-4 font-medium text-xs">{row.ecosystem}</td>
                            {products.map(
                              (p, i) =>
                                p && (
                                  <td key={i} className="text-center py-2 px-4">
                                    <EcosystemCell
                                      level={row.levels[i]?.level}
                                      requiresHub={row.levels[i]?.requiresHub}
                                      setupComplexity={row.levels[i]?.setupComplexity}
                                    />
                                  </td>
                                )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-600" /> Full</span>
                    <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-amber-500" /> Partial</span>
                    <span className="flex items-center gap-1"><X className="h-3 w-3 text-red-500" /> None</span>
                    <span className="flex items-center gap-1">? Unknown</span>
                  </div>
                </CardContent>
              </Card>

              {/* Setup Wizard */}
              {fullyCompatible > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Step-by-Step Setup Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: "Download Required Apps",
                        desc: `Install the companion apps for ${selectedProducts.map((p) => p.productName).join(", ")}.`,
                      },
                      {
                        step: 2,
                        title: "Connect to Shared Ecosystem",
                        desc: `Add all devices to your ${
                          matrixData.find((r) =>
                            r.levels.filter((_, i) => products[i]).every((l) => l?.level === "full")
                          )?.ecosystem ?? "shared ecosystem"
                        }.`,
                      },
                      {
                        step: 3,
                        title: "Enable Permissions",
                        desc: "Grant required permissions for cross-device communication.",
                      },
                      {
                        step: 4,
                        title: "Create First Automation",
                        desc: "Set up your first routine linking the products together.",
                      },
                    ].map(({ step, title, desc }) => (
                      <div key={step} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          {step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{title}</h4>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Bridge Products */}
              {hubSuggestions.length > 0 && compatPct < 50 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Bridge Products
                    </CardTitle>
                    <CardDescription>
                      These hubs can connect your selected products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {hubSuggestions.map((hub: any) => (
                        <div key={hub._id} className="border rounded-lg p-3 space-y-2">
                          <p className="font-medium text-sm">{hub.productName}</p>
                          <div className="flex flex-wrap gap-1">
                            {(hub.supportedEcosystems as string[])
                              .slice(0, 3)
                              .map((e: string) => (
                                <Badge key={e} variant="secondary" className="text-xs">
                                  {e}
                                </Badge>
                              ))}
                          </div>
                          {hub.price && (
                            <p className="text-xs text-muted-foreground">${hub.price}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <AICompatibilityAssistant contextSummary={aiContext} />
            <CompatibilitySimulationPanel
              productA={products[0]}
              productB={products[1]}
              userId={user?.id}
            />
          </div>
          <ApiCompatibilitySnippet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
