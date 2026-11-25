import Header from "@/components/Header";
import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import Hero from "@/components/home/Hero";
import DecisionToolsStrip from "@/components/home/DecisionToolsStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedComparisons from "@/components/home/FeaturedComparisons";
import MethodologySnapshot from "@/components/home/MethodologySnapshot";
import SocialProof from "@/components/home/SocialProof";
import TrustDisclosure from "@/components/home/TrustDisclosure";
import NewsletterCapture from "@/components/home/NewsletterCapture";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/layout/Footer";
import { AdSlot } from "@/components/ads/AdSlot";

const ComparisonSandbox = lazyWithRetry(() =>
  import("@/components/home/ComparisonSandbox").then((m) => ({
    default: m.default,
  }))
);

const Index = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TheSynLab",
    url: "https://thesynlab.com",
    description: "Independent AI & SaaS reviews with lab-tested Trust Scores, Integration Scores, and TCO analysis.",
    potentialAction: {
      "@type": "SearchAction",
      "target": "https://thesynlab.com/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TheSynLab",
    url: "https://thesynlab.com",
    logo: "https://thesynlab.com/logo.png",
    description: "Independent AI & SaaS review platform with lab-tested Trust Scores, Integration Scores, and TCO analysis.",
    sameAs: [
      "https://twitter.com/thesynlab",
      "https://www.linkedin.com/company/thesynlab",
      "https://www.producthunt.com/products/thesynlab",
    ],
  };

  // Intentionally no homepage score Table schema: hard-coded sample scores
  // previously disagreed with the product catalog (see docs/T01_T02_DISCOVERY_REPORT.md).

  return (
    <div className="min-h-screen">
      <MetaTags
        // SEO-1.4: keep byte-identical to HOME_TITLE in vite.config.ts and index.html
        title="TheSynLab – Independent Tech Reviews, Comparisons & Alternatives"
        description="Independent tech reviews with Trust Scores (0–10). Compare productivity tools, smart home devices, and SaaS — side-by-side scores, ownership cost, and real alternatives."
        canonical="https://thesynlab.com/"
        ogType="website"
      />
      <JsonLd type="WebSite" custom={websiteSchema} />
      <JsonLd type="Organization" custom={orgSchema} />

      <Header />
      <main>
        <Hero />
        <AdSlot
          slotName="home_leaderboard"
          pageTemplate="home_page"
          iabFormat="728x90"
          position="hero_below"
        />
        <DecisionToolsStrip />
        <CategoryGrid />
        <FeaturedComparisons />
        <MethodologySnapshot />
        <Suspense fallback={null}>
          <ComparisonSandbox />
        </Suspense>
        <SocialProof />
        <TrustDisclosure />
        <NewsletterCapture />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
