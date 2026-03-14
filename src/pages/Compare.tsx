import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { ComparisonFilters } from "@/components/compare/ComparisonFilters";
import { ProductCard } from "@/components/compare/ProductCard";
import { ComparisonView } from "@/components/compare/ComparisonView";
import { useProducts } from "@/hooks/convex/useProducts";

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    trustScore: [0, 10],
    integrationScore: [0, 10],
    ecosystems: [] as string[],
    categories: [] as string[],
  });
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { products, isLoading } = useProducts(filters);

  // Load selected products from URL on mount
  useEffect(() => {
    const productsParam = searchParams.get('products');
    if (productsParam) {
      const productIds = productsParam.split(',').filter(Boolean);
      setSelectedProducts(productIds);
    }
  }, [searchParams]);

  const handleProductSelect = (product: any) => {
    const slug = product.productSlug ?? (product.id ?? product._id)?.toString();
    if (!slug) return;
    let newSelectedProducts: string[];

    if (selectedProducts.includes(slug)) {
      newSelectedProducts = selectedProducts.filter((s) => s !== slug);
    } else if (selectedProducts.length < 4) {
      newSelectedProducts = [...selectedProducts, slug];
    } else {
      return; // Max 4 products
    }

    setSelectedProducts(newSelectedProducts);
    if (newSelectedProducts.length > 0) {
      setSearchParams({ products: newSelectedProducts.join(",") });
    } else {
      setSearchParams({});
    }
  };

  const selectedProductsData = products?.filter((p: any) =>
    selectedProducts.includes(p.productSlug ?? "") || selectedProducts.includes((p.id ?? p._id)?.toString() ?? "")
  );

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Tools", url: "/" },
    { name: "Product Comparison", url: "/tools/compare" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Product Comparison"
        description="Compare products side-by-side: trust score, integration score, price, and ecosystem compatibility."
        canonical="/tools/compare"
      />
      <JsonLd type="BreadcrumbList" breadcrumbs={breadcrumbs} />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Product Comparison Engine
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Compare products side-by-side with our interactive tool. Filter by price, 
              trust score, integration capabilities, and ecosystem compatibility.
            </p>
          </div>
        </section>

        {/* Comparison View - Shows when products are selected */}
        {selectedProducts.length > 0 && selectedProductsData && (
          <ComparisonView
            products={selectedProductsData}
            onRemove={(idOrSlug) => {
              const next = selectedProducts.filter((s) => s !== idOrSlug);
              setSelectedProducts(next);
              setSearchParams(next.length ? { products: next.join(",") } : {});
            }}
          />
        )}

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <ComparisonFilters 
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : `${products?.length || 0} products found`}
                  {selectedProducts.length > 0 && (
                    <span className="ml-2 text-primary font-medium">
                      • {selectedProducts.length} selected (max 4)
                    </span>
                  )}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                  ))
                ) : products?.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No products match your filters</p>
                  </div>
                ) : (
                  products?.map((product: any) => (
                    <ProductCard
                      key={product.id ?? product._id}
                      product={product}
                      isSelected={selectedProducts.includes(product.productSlug ?? (product.id ?? product._id)?.toString())}
                      onSelect={() => handleProductSelect(product)}
                      disabled={selectedProducts.length >= 4 && !selectedProducts.includes(product.productSlug ?? (product.id ?? product._id)?.toString())}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
