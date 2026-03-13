import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CompatibilityChecker() {
  const [productA, setProductA] = useState<any>(null);
  const [productB, setProductB] = useState<any>(null);
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  // Fetch all active products from Convex
  const allProducts = useQuery(api.products.list, { status: "active" }) || [];

  // Client-side search filtering
  const productsAFiltered = useMemo(() => {
    if (!searchA || searchA.length < 2) return [];
    return allProducts
      .filter((p: any) => p.productName?.toLowerCase().includes(searchA.toLowerCase()))
      .slice(0, 5);
  }, [allProducts, searchA]);

  const productsBFiltered = useMemo(() => {
    if (!searchB || searchB.length < 2) return [];
    return allProducts
      .filter((p: any) => p.productName?.toLowerCase().includes(searchB.toLowerCase()))
      .slice(0, 5);
  }, [allProducts, searchB]);

  // Fetch ecosystem compatibility for selected products
  const ecosystemsA = useQuery(
    api.products.getEcosystems,
    productA ? { productId: productA._id } : "skip"
  );
  const ecosystemsB = useQuery(
    api.products.getEcosystems,
    productB ? { productId: productB._id } : "skip"
  );

  const commonEcosystems = ecosystemsA && ecosystemsB
    ? ecosystemsA
        .filter((ecoA: any) =>
          ecosystemsB.some((ecoB: any) => ecoB.ecosystem === ecoA.ecosystem)
        )
        .map((ecoA: any) => {
          const ecoB = ecosystemsB.find((e: any) => e.ecosystem === ecoA.ecosystem);
          return {
            ecosystem: ecoA.ecosystem,
            productA_level: ecoA.compatibilityLevel,
            productB_level: ecoB?.compatibilityLevel,
            compatible:
              ecoA.compatibilityLevel === "full" && ecoB?.compatibilityLevel === "full",
            partial:
              (ecoA.compatibilityLevel === "full" && ecoB?.compatibilityLevel === "partial") ||
              (ecoA.compatibilityLevel === "partial" && ecoB?.compatibilityLevel === "full") ||
              (ecoA.compatibilityLevel === "partial" && ecoB?.compatibilityLevel === "partial"),
          };
        })
    : [];

  const compatibility = {
    fullyCompatible: commonEcosystems.filter((e: any) => e.compatible).length,
    partiallyCompatible: commonEcosystems.filter((e: any) => e.partial).length,
    totalEcosystems: commonEcosystems.length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Compatibility Checker
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Check if two products work together across different ecosystems. 
              Get detailed compatibility reports and integration guides.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Product A Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Product A</CardTitle>
                <CardDescription>Search and select the first product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!productA ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="search-a">Search Products</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search-a"
                          placeholder="Type to search..."
                          value={searchA}
                          onChange={(e) => setSearchA(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {productsAFiltered.length > 0 && (
                      <div className="space-y-2">
                        {productsAFiltered.map((product: any) => (
                          <button
                            key={product._id}
                            onClick={() => {
                              setProductA(product);
                              setSearchA("");
                            }}
                            className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">{product.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.manufacturer} • {product.category}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      {productA.featuredImageUrl && (
                        <img
                          src={productA.featuredImageUrl}
                          alt={productA.productName}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg">{productA.productName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {productA.manufacturer}
                      </p>
                      <Badge variant="secondary">{productA.category}</Badge>
                    </div>
                    <Button variant="outline" onClick={() => setProductA(null)} className="w-full">
                      Change Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product B Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Product B</CardTitle>
                <CardDescription>Search and select the second product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!productB ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="search-b">Search Products</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search-b"
                          placeholder="Type to search..."
                          value={searchB}
                          onChange={(e) => setSearchB(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {productsBFiltered.length > 0 && (
                      <div className="space-y-2">
                        {productsBFiltered.map((product: any) => (
                          <button
                            key={product._id}
                            onClick={() => {
                              setProductB(product);
                              setSearchB("");
                            }}
                            className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">{product.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.manufacturer} • {product.category}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      {productB.featuredImageUrl && (
                        <img
                          src={productB.featuredImageUrl}
                          alt={productB.productName}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg">{productB.productName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {productB.manufacturer}
                      </p>
                      <Badge variant="secondary">{productB.category}</Badge>
                    </div>
                    <Button variant="outline" onClick={() => setProductB(null)} className="w-full">
                      Change Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Compatibility Results */}
          {productA && productB && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Compatibility Summary</CardTitle>
                  <CardDescription>
                    {productA.productName} + {productB.productName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {compatibility.fullyCompatible}
                      </div>
                      <p className="text-sm text-muted-foreground">Fully Compatible Ecosystems</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600 mb-2">
                        {compatibility.partiallyCompatible}
                      </div>
                      <p className="text-sm text-muted-foreground">Partially Compatible</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {compatibility.totalEcosystems}
                      </div>
                      <p className="text-sm text-muted-foreground">Common Ecosystems</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ecosystem-by-Ecosystem Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {commonEcosystems.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No common ecosystems found. These products may not work together directly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {commonEcosystems.map((eco: any) => (
                        <div key={eco.ecosystem} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{eco.ecosystem}</h4>
                            {eco.compatible ? (
                              <Badge className="gap-1 bg-green-600">
                                <Check className="w-3 h-3" />
                                Compatible
                              </Badge>
                            ) : eco.partial ? (
                              <Badge variant="secondary" className="gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Partial
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <X className="w-3 h-3" />
                                Limited
                              </Badge>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">{productA.productName}</p>
                              <Badge variant="outline">{eco.productA_level} compatibility</Badge>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">{productB.productName}</p>
                              <Badge variant="outline">{eco.productB_level} compatibility</Badge>
                            </div>
                          </div>

                          {eco.compatible && (
                            <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded">
                              <p className="text-sm text-green-900 dark:text-green-100">
                                ✓ These products work seamlessly together in the {eco.ecosystem} ecosystem
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {compatibility.fullyCompatible > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Setup Guide</CardTitle>
                    <CardDescription>How to integrate these products together</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">1</div>
                        <div>
                          <h4 className="font-semibold mb-1">Connect to Common Ecosystem</h4>
                          <p className="text-sm text-muted-foreground">
                            Add both products to your {commonEcosystems[0]?.ecosystem} ecosystem using their respective apps
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">2</div>
                        <div>
                          <h4 className="font-semibold mb-1">Configure Integration</h4>
                          <p className="text-sm text-muted-foreground">
                            Enable permissions and configure automation rules between devices
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">3</div>
                        <div>
                          <h4 className="font-semibold mb-1">Test Connection</h4>
                          <p className="text-sm text-muted-foreground">
                            Verify both products communicate correctly and set up your first automation
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
