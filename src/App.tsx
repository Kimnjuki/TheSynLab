import { useEffect, Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";
import { HelmetProvider } from "react-helmet-async";
import { ConvexClientProvider } from "./integrations/convex/ConvexClientProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import CookieBanner from "./components/CookieBanner";
import AnalyticsScripts from "./components/AnalyticsScripts";
import { FacebookPixel } from "./components/FacebookPixel";
import { AdSlotProvider } from "./components/ads/AdSlotProvider";
import { AdsterraScript } from "./components/ads/AdsterraScript";
import { ComparisonBarProvider } from "./contexts/ComparisonBarContext";
import { ComparisonBar } from "./components/ComparisonBar";

// PERF-3.1 (mobile CWV): route-level code splitting. Previously ALL ~70 pages were
// statically imported into one ~2.8 MB JS bundle executed before ANY page could
// render — the main cause of poor mobile LCP/TBT and the depressed mobile search
// share. Homepage (Index) + NotFound stay eager (first-paint critical / cheap);
// every other route is a per-route chunk loaded on demand. The JSX route table is
// untouched because each lazy constant keeps its original name.
const Compare = lazyWithRetry(() => import("./pages/Compare"));
const CommunitySetups = lazyWithRetry(() => import("./pages/CommunitySetups"));
const BudgetCalculator = lazyWithRetry(() => import("./pages/BudgetCalculator"));
const CompatibilityChecker = lazyWithRetry(() => import("./pages/CompatibilityChecker"));
const ProductDetailPage = lazyWithRetry(() => import("./pages/products/ProductDetailPage"));
const ProductsHub = lazyWithRetry(() => import("./pages/ProductsHub"));
const ProductsWatchlist = lazyWithRetry(() => import("./pages/ProductsWatchlist"));
const Auth = lazyWithRetry(() => import("./pages/Auth"));
const Profile = lazyWithRetry(() => import("./pages/Profile"));
const Settings = lazyWithRetry(() => import("./pages/Settings"));
const Admin = lazyWithRetry(() => import("./pages/Admin"));
const AdminProductForm = lazyWithRetry(() => import("./pages/AdminProductForm"));
const Automations = lazyWithRetry(() => import("./pages/Automations"));
const Tasks = lazyWithRetry(() => import("./pages/Tasks"));
const AIWorkflowHub = lazyWithRetry(() => import("./pages/AIWorkflowHub"));
const IntelligentHomeHub = lazyWithRetry(() => import("./pages/IntelligentHomeHub"));
const HybridOfficeHub = lazyWithRetry(() => import("./pages/HybridOfficeHub"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazyWithRetry(() => import("./pages/TermsOfService"));
const About = lazyWithRetry(() => import("./pages/About"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const EditorialPolicy = lazyWithRetry(() => import("./pages/EditorialPolicy"));
const AffiliateDisclosure = lazyWithRetry(() => import("./pages/AffiliateDisclosure"));
const HowWeMakeMoney = lazyWithRetry(() => import("./pages/HowWeMakeMoney"));
const VendorProgram = lazyWithRetry(() => import("./pages/VendorProgram"));
const Blog = lazyWithRetry(() => import("./pages/Blog"));
const BlogArticle = lazyWithRetry(() => import("./pages/BlogArticle"));
const ScoringHub = lazyWithRetry(() => import("./pages/ScoringHub"));
const MethodologyPage = lazyWithRetry(() => import("./pages/MethodologyPage"));
const AdCompliance = lazyWithRetry(() => import("./pages/AdCompliance"));
const Forum = lazyWithRetry(() => import("./pages/Forum"));
const ForumCategory = lazyWithRetry(() => import("./pages/ForumCategory"));
const ForumThread = lazyWithRetry(() => import("./pages/ForumThread"));
const ForumNewThread = lazyWithRetry(() => import("./pages/ForumNewThread"));
const Hub = lazyWithRetry(() => import("./pages/Hub"));
const CommunityLeaderboard = lazyWithRetry(() => import("./pages/CommunityLeaderboard"));
const StackBuilder = lazyWithRetry(() => import("./pages/StackBuilder"));
const StackArchitect = lazyWithRetry(() => import("./pages/StackArchitect"));
const Search = lazyWithRetry(() => import("./pages/Search"));
const TrustScoreIndex = lazyWithRetry(() => import("./pages/TrustScoreIndex"));
const IntegrationScoreIndex = lazyWithRetry(() => import("./pages/IntegrationScoreIndex"));
const ToolsHub = lazyWithRetry(() => import("./pages/ToolsHub"));
const RoiCalculatorTool = lazyWithRetry(() => import("./pages/RoiCalculatorTool"));
const CompareSlug = lazyWithRetry(() => import("./pages/CompareSlug"));
const HubPost = lazyWithRetry(() => import("./pages/HubPost"));
const PillarGuide = lazyWithRetry(() => import("./pages/PillarGuide"));
const BestForEcosystem = lazyWithRetry(() => import("./pages/BestForEcosystem"));
const IntegrationRecipe = lazyWithRetry(() => import("./pages/IntegrationRecipe"));
const HubBuilderPage = lazyWithRetry(() => import("./pages/HubBuilderPage"));
const CompatibilityLeaderboardPage = lazyWithRetry(() => import("./pages/CompatibilityLeaderboardPage"));
const AIProductFinder = lazyWithRetry(() => import("./pages/AIProductFinder"));
const AdminContentQuality = lazyWithRetry(() => import("./pages/AdminContentQuality"));
const AdminModeration = lazyWithRetry(() => import("./pages/AdminModeration"));
const AdminSeoOpportunities = lazyWithRetry(() => import("./pages/AdminSeoOpportunities"));
const AIToolsHub = lazyWithRetry(() => import("./pages/saas/AIToolsHub"));
const AIToolsCategoryPage = lazyWithRetry(() => import("./pages/saas/AIToolsCategoryPage"));
const SaasToolReviewPage = lazyWithRetry(() => import("./pages/saas/SaasToolReviewPage"));
const ToolAlternativesPage = lazyWithRetry(() => import("./pages/saas/ToolAlternativesPage"));
const BestToolsRoundup = lazyWithRetry(() => import("./pages/saas/BestToolsRoundup"));
const HubsIndex = lazyWithRetry(() => import("./pages/HubsIndex"));
const DecisionStudio = lazyWithRetry(() => import("./pages/DecisionStudio"));
const WorkflowsIndex = lazyWithRetry(() => import("./pages/WorkflowsIndex"));
const StackQuiz = lazyWithRetry(() => import("./pages/tools/StackQuiz"));
const TcoCalculator = lazyWithRetry(() => import("./pages/tools/TcoCalculator"));
const VendorRiskChecker = lazyWithRetry(() => import("./pages/tools/VendorRiskChecker"));
const WorkflowBlueprint = lazyWithRetry(() => import("./pages/tools/WorkflowBlueprint"));
const TrustIndexLeaderboard = lazyWithRetry(() => import("./pages/TrustIndex"));
const MyStackDashboard = lazyWithRetry(() => import("./pages/MyStack"));
const WidgetGallery = lazyWithRetry(() => import("./pages/WidgetGallery"));
const ToolEmbedPage = lazyWithRetry(() => import("./pages/widgets/ToolEmbedPage"));
const StateOfSaaSTrust2026 = lazyWithRetry(() => import("./pages/report/StateOfSaaSTrust2026"));
const AlternativesIndex = lazyWithRetry(() => import("./pages/AlternativesIndex"));
const ProductCategoryPage = lazyWithRetry(() => import("./pages/ProductCategoryPage"));
const CategoryPage = lazyWithRetry(() => import("./pages/CategoryPage"));
const GuidesPage = lazyWithRetry(() => import("./pages/GuidesPage"));
const AdminGrowthDashboard = lazyWithRetry(() => import("./pages/AdminGrowthDashboard"));
const GlossaryPage = lazyWithRetry(() => import("./pages/GlossaryPage"));
import Index from "./pages/Index"; // PERF-3.1: homepage stays in the initial bundle for LCP
import NotFound from "./pages/NotFound"; // cheap; must render instantly on unknown URLs


const queryClient = new QueryClient();

/** Tracks page views on every route change for GA4. */
function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
}

/** PERF-3.1: minimal suspense fallback for lazy route chunks. */
function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <ConvexClientProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <RouteTracker />
                <ComparisonBarProvider>
                <AdSlotProvider>
                <AdsterraScript />
                <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {/* Core */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/products/new" element={<AdminProductForm />} />
                  <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
                  <Route path="/admin/content-quality" element={<AdminContentQuality />} />
                  <Route path="/admin/moderation" element={<AdminModeration />} />
                  <Route path="/admin/seo-opportunities" element={<AdminSeoOpportunities />} />
                  <Route path="/admin/growth" element={<AdminGrowthDashboard />} />

                  {/* Tools */}
                  <Route path="/tools" element={<ToolsHub />} />
                  <Route path="/tools/budget-calculator" element={<BudgetCalculator />} />
                  <Route path="/tools/compatibility" element={<CompatibilityChecker />} />
                  <Route path="/tools/compatibility-checker" element={<CompatibilityChecker />} />
                  <Route path="/tools/hub-builder" element={<HubBuilderPage />} />
                  <Route path="/tools/compatibility-leaderboard" element={<CompatibilityLeaderboardPage />} />
                  <Route path="/tools/find" element={<AIProductFinder />} />
                  <Route path="/tools/roi-calculator" element={<RoiCalculatorTool />} />
                  <Route path="/tools/automations" element={<Automations />} />
                  <Route path="/tasks" element={<Tasks />} />

                  {/* Compare — canonical root-level route; /tools/compare kept for embed CSP */}
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/tools/compare" element={<Compare />} />
                  <Route path="/compare/:slug" element={<CompareSlug />} />

                  {/* Products — /products renders ProductsHub (not DigitalProducts) */}
                  <Route path="/products" element={<ProductsHub />} />
                  <Route path="/products/watchlist" element={<ProductsWatchlist />} />
                  <Route path="/products/category/:category" element={<ProductCategoryPage />} />
                  <Route path="/products/:slug" element={<ProductDetailPage />} />

                  {/* Content Hubs */}
                  <Route path="/hub/:slug" element={<Hub />} />
                  <Route path="/hubs" element={<HubsIndex />} />
                  <Route path="/hubs/:hubSlug/:postSlug" element={<HubPost />} />
                  <Route path="/hubs/:slug/pillar" element={<PillarGuide />} />
                  <Route path="/hub/ai-workflow" element={<AIWorkflowHub />} />
                  <Route path="/hub/intelligent-home" element={<IntelligentHomeHub />} />
                  <Route path="/hub/hybrid-office" element={<HybridOfficeHub />} />
                  <Route path="/hub/ai-tools" element={<AIToolsHub />} />
                  <Route path="/hub/ai-tools/:category" element={<AIToolsCategoryPage />} />

                  {/* SaaS Tool Reviews */}
                  <Route path="/tool/:slug" element={<SaasToolReviewPage />} />
                  <Route path="/tool/:slug/alternatives" element={<ToolAlternativesPage />} />
                  <Route path="/best/:useCase" element={<BestToolsRoundup />} />
                  <Route path="/best/for-:ecosystem" element={<BestForEcosystem />} />

                  {/* Forum */}
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/forum/category/:slug" element={<ForumCategory />} />
                  <Route path="/forum/thread/:slug" element={<ForumThread />} />
                  <Route path="/forum/new" element={<ForumNewThread />} />

                  {/* Community */}
                  <Route path="/community/setups" element={<CommunitySetups />} />
                  <Route path="/community/leaderboard" element={<CommunityLeaderboard />} />

                  {/* Blog */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />

                  {/* Legal & Company Pages */}
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/disclosure" element={<AffiliateDisclosure />} />
                  <Route path="/editorial" element={<EditorialPolicy />} />
                  <Route path="/how-we-make-money" element={<HowWeMakeMoney />} />
                  <Route path="/vendor-program" element={<VendorProgram />} />
                  <Route path="/guides" element={<GuidesPage />} />
                  <Route path="/glossary" element={<GlossaryPage />} />
                  <Route path="/scoring-hub" element={<ScoringHub />} />
<Route path="/methodology" element={<MethodologyPage />} />
                  <Route path="/ad-compliance" element={<AdCompliance />} />

                  {/* Canonical root-level routes (v2.0) — old /tools/* versions 301-redirected by nginx */}
                  <Route path="/ai/stack-architect" element={<StackArchitect />} />
                  <Route path="/stack-builder" element={<StackBuilder />} />
                  <Route path="/tco-calculator" element={<TcoCalculator />} />
                  <Route path="/vendor-risk-checker" element={<VendorRiskChecker />} />
                  <Route path="/workflow-blueprint" element={<WorkflowBlueprint />} />
                  <Route path="/stack-quiz" element={<StackQuiz />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/scores/trust-score-index" element={<TrustScoreIndex />} />
                  <Route path="/scores/integration-score-index" element={<IntegrationScoreIndex />} />
                  <Route path="/decision-studio" element={<DecisionStudio />} />
                  <Route path="/workflows" element={<WorkflowsIndex />} />
                  <Route path="/alternatives" element={<AlternativesIndex />} />
                  <Route path="/trust-index" element={<TrustIndexLeaderboard />} />
                  <Route path="/my-stack" element={<MyStackDashboard />} />
                  <Route path="/widgets" element={<WidgetGallery />} />
                  <Route path="/widget/tool/:slug" element={<ToolEmbedPage />} />
                  <Route path="/report/state-of-saas-trust-2026" element={<StateOfSaaSTrust2026 />} />
                  <Route path="/recipes/:slug" element={<IntegrationRecipe />} />

                   {/* Categories */}
                   <Route path="/category/:slug" element={<CategoryPage />} />

                   {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                   <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
                <AnalyticsScripts />
                <FacebookPixel />
                <CookieBanner />
                <ComparisonBar />
                </AdSlotProvider>
                </ComparisonBarProvider>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ConvexClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
