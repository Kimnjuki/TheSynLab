import Header from "@/components/Header";
import { lazy, Suspense } from "react";
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

const ComparisonSandbox = lazy(() =>
  import("@/components/home/ComparisonSandbox").then((m) => ({
    default: m.ComparisonSandbox,
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

  return (
    <div className="min-h-screen">
      <MetaTags
        title="Independent AI & SaaS Reviews You Can Actually Trust | TheSynLab"
        description="We test every tool for 14+ days and score it on Trust, Integration, and 3-Year TCO. Compare tools, build your stack, and choose faster with TheSynLab."
        canonical="https://thesynlab.com/"
        ogType="website"
      />
      <JsonLd type="WebSite" custom={websiteSchema} />
      <JsonLd type="Organization" custom={orgSchema} />

      <Header />
      <main>
        <Hero />
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
