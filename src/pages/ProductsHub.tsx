import { Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { api } from "@/../convex/_generated/api";
import { HubHeroBanner } from "@/components/products-hub/HubHeroBanner";
import { BuyerJourneyShortcuts } from "@/components/products-hub/BuyerJourneyShortcuts";
import { TrendingStrip } from "@/components/products-hub/TrendingStrip";
import { FilterBar } from "@/components/products-hub/FilterBar";
import { ProductHubSectionGroup } from "@/components/products-hub/ProductHubSectionGroup";
import { ActivitySidebar } from "@/components/products-hub/ActivitySidebar";
import { EmailCaptureContextual } from "@/components/products-hub/EmailCaptureContextual";

function HubSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ProductsHub() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") as
    | "trustScore"
    | "integrationDepth"
    | "lockInRisk"
    | "trending"
    | "newest"
    | null) ?? "trustScore";
  const lockInRisk = searchParams.get("lockInRisk") ?? undefined;
  const teamSizeFit = searchParams.get("teamSize") ?? undefined;

  const productsData = useQuery(api.productsHub.getProductsHubData, {
    category,
    sortBy: sort,
    lockInRisk,
    teamSizeFit,
    page: 0,
    limit: 24,
  });

  const paths = useQuery(api.productsHub.getBuyerJourneyPaths, {});
  const trending = useQuery(api.productsHub.getTrendingProducts, {
    periodYear: 2026,
    periodMonth: 4,
    limit: 6,
  });
  const filterOptions = useQuery(api.productsHub.getHubFilterOptions, {});

  const mappedItems = useMemo(
    () =>
      (productsData?.products ?? []).map((item: any) => ({
        product: {
          ...item.product,
          followCount: item.followCount,
        },
        decision: item.decisionCard ?? {
          topPros: [],
          topWatchOuts: [],
          bestForTags: [],
          keyIntegrations: [],
          selfHostOption: false,
          soc2Ready: false,
          gdprReady: false,
          lockInRisk: "medium",
          exportQuality: "good",
          dataResidency: "global",
          pricingComplexity: "tiered",
          typicalCostTier: "$$",
          workflowTemplateCount: 0,
          communityStackCount: 0,
        },
        trustScore: item.trustScore?.totalScore ?? 0,
        integrationScore: item.integrationScore?.totalScore ?? 0,
      })),
    [productsData]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Products Hub"
        description="Every product scored on trust, integration depth, and lock-in risk."
        canonical="https://www.thesynlab.com/products"
      />
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <Suspense fallback={<HubSkeleton />}>
          <div className="space-y-6">
            <HubHeroBanner toolCount={productsData?.totalCount ?? 0} reviewCount={1234} stackCount={987} />

            {paths ? <BuyerJourneyShortcuts paths={paths as any} /> : <Skeleton className="h-14 w-full" />}

            {trending ? (
              <TrendingStrip
                bestOfMonth={trending.bestOfMonth as any}
                fastestRising={trending.fastestRising as any}
                allTimeLeaders={trending.allTimeLeaders as any}
              />
            ) : (
              <Skeleton className="h-40 w-full" />
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
              <div className="hidden xl:block">
                <FilterBar
                  categories={filterOptions?.categories ?? []}
                  useCases={filterOptions?.useCaseTags ?? []}
                  technicalTraits={filterOptions?.technicalTraits ?? []}
                  lockInRisks={filterOptions?.lockInRisks ?? []}
                  activeFilters={Array.from(searchParams.entries()).map(([k, v]) => `${k}:${v}`)}
                  resultCount={productsData?.totalCount ?? 0}
                />
              </div>

              <div className="space-y-4">
                <div className="sticky top-16 z-10 flex items-center justify-between rounded-lg border bg-background/95 p-2 backdrop-blur xl:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Filters</Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh]">
                      <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                      <FilterBar
                        mobile
                        categories={filterOptions?.categories ?? []}
                        useCases={filterOptions?.useCaseTags ?? []}
                        technicalTraits={filterOptions?.technicalTraits ?? []}
                        lockInRisks={filterOptions?.lockInRisks ?? []}
                        activeFilters={Array.from(searchParams.entries()).map(([k, v]) => `${k}:${v}`)}
                        resultCount={productsData?.totalCount ?? 0}
                      />
                    </SheetContent>
                  </Sheet>
                  <div className="text-sm text-muted-foreground">{productsData?.totalCount ?? 0} results</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(Array.from(searchParams.entries()) ?? []).map(([k, v]) => (
                    <Button
                      key={`${k}-${v}`}
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const next = new URLSearchParams(searchParams);
                        next.delete(k);
                        setSearchParams(next, { replace: true });
                      }}
                    >
                      {k}:{v}
                    </Button>
                  ))}
                </div>

                <ProductHubSectionGroup label="All Products" items={mappedItems as any} />
                {mappedItems.length > 12 ? <EmailCaptureContextual /> : null}
              </div>

              <div className="hidden xl:block">
                <ActivitySidebar />
              </div>
            </div>
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
