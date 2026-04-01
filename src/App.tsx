import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ConvexClientProvider } from "./integrations/convex/ConvexClientProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import CookieBanner from "./components/CookieBanner";
import AnalyticsScripts from "./components/AnalyticsScripts";
import { AdSlotProvider } from "./components/ads/AdSlotProvider";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import CommunitySetups from "./pages/CommunitySetups";
import BudgetCalculator from "./pages/BudgetCalculator";
import CompatibilityChecker from "./pages/CompatibilityChecker";
import ProductReview from "./pages/ProductReview";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import AdminProductForm from "./pages/AdminProductForm";
import Automations from "./pages/Automations";
import Tasks from "./pages/Tasks";
import AIWorkflowHub from "./pages/AIWorkflowHub";
import IntelligentHomeHub from "./pages/IntelligentHomeHub";
import HybridOfficeHub from "./pages/HybridOfficeHub";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AffiliateDisclosure from "./pages/AffiliateDisclosure";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import ScoringHub from "./pages/ScoringHub";
import AdCompliance from "./pages/AdCompliance";
import Forum from "./pages/Forum";
import ForumCategory from "./pages/ForumCategory";
import ForumThread from "./pages/ForumThread";
import ForumNewThread from "./pages/ForumNewThread";
import Hub from "./pages/Hub";
import CommunityLeaderboard from "./pages/CommunityLeaderboard";
import StackBuilder from "./pages/StackBuilder";
import Search from "./pages/Search";
import TrustScoreIndex from "./pages/TrustScoreIndex";
import IntegrationScoreIndex from "./pages/IntegrationScoreIndex";
import ToolsHub from "./pages/ToolsHub";
import RoiCalculatorTool from "./pages/RoiCalculatorTool";
import CompareSlug from "./pages/CompareSlug";
import HubPost from "./pages/HubPost";
import PillarGuide from "./pages/PillarGuide";
import BestForEcosystem from "./pages/BestForEcosystem";
import IntegrationRecipe from "./pages/IntegrationRecipe";
import HubBuilderPage from "./pages/HubBuilderPage";
import CompatibilityLeaderboardPage from "./pages/CompatibilityLeaderboardPage";
import AIProductFinder from "./pages/AIProductFinder";
import AdminContentQuality from "./pages/AdminContentQuality";
import AdminModeration from "./pages/AdminModeration";
import AdminSeoOpportunities from "./pages/AdminSeoOpportunities";

const queryClient = new QueryClient();

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
                <AdSlotProvider>
                <Routes>
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
                  <Route path="/tools/compare" element={<Compare />} />
                  <Route path="/compare/:slug" element={<CompareSlug />} />
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
                  <Route path="/products/:slug" element={<ProductReview />} />
                  <Route path="/hub/:slug" element={<Hub />} />
                  <Route path="/hubs/:hubSlug/:postSlug" element={<HubPost />} />
                  <Route path="/hubs/:slug/pillar" element={<PillarGuide />} />
                  <Route path="/best/for-:ecosystem" element={<BestForEcosystem />} />
                  <Route path="/recipes/:slug" element={<IntegrationRecipe />} />
                  <Route path="/community/setups" element={<CommunitySetups />} />
                  <Route path="/community/leaderboard" element={<CommunityLeaderboard />} />
                  <Route path="/hubs/ai-workflow" element={<AIWorkflowHub />} />
                  <Route path="/hubs/intelligent-home" element={<IntelligentHomeHub />} />
                  <Route path="/hubs/hybrid-office" element={<HybridOfficeHub />} />
                  {/* Forum */}
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/forum/category/:slug" element={<ForumCategory />} />
                  <Route path="/forum/thread/:slug" element={<ForumThread />} />
                  <Route path="/forum/new" element={<ForumNewThread />} />
                  {/* Legal & Company Pages */}
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/disclosure" element={<AffiliateDisclosure />} />
                  {/* Blog */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />
                  {/* Scoring Hub */}
                  <Route path="/scoring-hub" element={<ScoringHub />} />
                  {/* Ad Compliance */}
                  <Route path="/ad-compliance" element={<AdCompliance />} />
                  {/* New v2.0 routes */}
                  <Route path="/tools/stack-builder" element={<StackBuilder />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/scores/trust-score-index" element={<TrustScoreIndex />} />
                  <Route path="/scores/integration-score-index" element={<IntegrationScoreIndex />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <AnalyticsScripts />
                <CookieBanner />
                </AdSlotProvider>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ConvexClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
