import Header from "@/components/Header";
import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import AnimatedStats from "@/components/landing/AnimatedStats";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const HomepageInsights = lazy(() =>
  import("@/components/landing/HomepageInsights").then((m) => ({
    default: m.HomepageInsights,
  }))
);
import FeaturedReviews from "@/components/landing/FeaturedReviews";
import TrendingTopics from "@/components/landing/TrendingTopics";
import Hubs from "@/components/Hubs";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import TestimonialsCarousel from "@/components/landing/TestimonialsCarousel";
import Methodology from "@/components/Methodology";
import FAQAccordion from "@/components/landing/FAQAccordion";
import CTABanner from "@/components/landing/CTABanner";
import Newsletter from "@/components/Newsletter";
import { AdSlot } from "@/components/ads/AdSlot";
import Footer from "@/components/Footer";
import { OnboardingTour, useOnboarding } from "@/components/dashboard/OnboardingTour";
import { StackArchitectChat } from "@/components/ai/StackArchitectChat";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";

const Index = () => {
  const { showTour, closeTour } = useOnboarding();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TheSynLab",
    url: "https://thesynlab.com",
    description: "Next-gen tech reviews with unique Trust & Integration Scores. Expert analysis of productivity tools, smart home devices, and office hardware.",
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
    description: "Next-gen tech review platform with Trust & Integration Scores for productivity tools, smart home, and office hardware.",
    sameAs: [
      "https://twitter.com/thesynlab",
      "https://www.linkedin.com/company/thesynlab",
      "https://www.producthunt.com/products/thesynlab",
    ],
  };

  return (
    <div className="min-h-screen">
      <MetaTags
        title="TheSynLab – Smart Home & Productivity Reviews with Trust Scores"
        description="Expert reviews of smart home devices, productivity tools, and workflow automation. Data-driven Trust Scores help you make confident tech decisions."
        canonical="https://thesynlab.com/"
        ogType="website"
      />
      <JsonLd type="WebPage" custom={websiteSchema} />
      <JsonLd type="Organization" custom={orgSchema} />

      <Header />
      <main>
        <Hero />
        <section className="container py-8">
          <StackArchitectChat />
        </section>
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <HomepageInsights />
          </Suspense>
        </ErrorBoundary>
        <div className="container px-4">
          <AdSlot
            slotName="home_leaderboard"
            pageTemplate="home_page"
            iabFormat="728x90"
            position="below_insights"
          />
        </div>
        <FeaturedReviews />
        <TrendingTopics />
        <Hubs />
        <WhyChooseUs />
        <TestimonialsCarousel />
        <Methodology />
        <CTABanner />
        <FAQAccordion />
        <Newsletter />
      </main>
      <Footer />
      
      <OnboardingTour
        isOpen={showTour}
        onClose={closeTour}
        onComplete={closeTour}
      />
    </div>
  );
};

export default Index;
