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

  const comparisonTableSchema = {
    "@context": "https://schema.org",
    "@type": "Table",
    name: "Sample Tool Trust Score Comparison",
    description: "Comparison of Trust Scores for sample tools reviewed by TheSynLab.",
    table: [
      {
        "@type": "TableRow",
        row: [
          { "@type": "TableCell", text: "Tool" },
          { "@type": "TableCell", text: "Trust Score (/10)" },
          { "@type": "TableCell", text: "Rating" },
        ],
      },
      {
        "@type": "TableRow",
        row: [
          { "@type": "TableCell", text: "Notion" },
          { "@type": "TableCell", text: "9.2/10" },
          { "@type": "TableCell", text: "A+ Highly Recommended" },
        ],
      },
      {
        "@type": "TableRow",
        row: [
          { "@type": "TableCell", text: "Airtable" },
          { "@type": "TableCell", text: "8.8/10" },
          { "@type": "TableCell", text: "A+ Highly Recommended" },
        ],
      },
      {
        "@type": "TableRow",
        row: [
          { "@type": "TableCell", text: "ClickUp" },
          { "@type": "TableCell", text: "8.5/10" },
          { "@type": "TableCell", text: "A+ Highly Recommended" },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <MetaTags
        // SEO-1.4: keep byte-identical to HOME_TITLE in vite.config.ts and index.html
        title="TheSynLab – Tech Reviews, Comparisons & Tool Alternatives"
        description="In-depth tech reviews with Trust Scores. Compare the best productivity tools, smart home devices, and SaaS solutions. Expert analysis and real alternatives."
        canonical="https://thesynlab.com/"
        ogType="website"
      />
      <JsonLd type="WebSite" custom={websiteSchema} />
      <JsonLd type="Organization" custom={orgSchema} />
      <JsonLd schema={[comparisonTableSchema]} />

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
