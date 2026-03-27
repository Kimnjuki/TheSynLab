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
import Footer from "@/components/Footer";
import { OnboardingTour, useOnboarding } from "@/components/dashboard/OnboardingTour";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { showTour, closeTour } = useOnboarding();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TheSynLab",
    "url": "https://www.thesynlab.com",
    "description": "Next-gen tech reviews with unique Trust & Integration Scores. Expert analysis of productivity tools, smart home devices, and office hardware.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.thesynlab.com/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>TheSynLab – Next-Gen Tech Reviews & Workflow Optimization</title>
        <meta name="description" content="In-depth tech reviews with unique Trust & Integration Scores. Expert analysis of productivity tools, smart home devices, and office hardware to build your perfect workflow ecosystem." />
        <link rel="canonical" href="https://www.thesynlab.com/" />
        <meta property="og:title" content="TheSynLab – Next-Gen Tech Reviews & Workflow Optimization" />
        <meta property="og:description" content="In-depth tech reviews with unique Trust & Integration Scores." />
        <meta property="og:url" content="https://www.thesynlab.com/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />
      <main>
        <Hero />
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <HomepageInsights />
          </Suspense>
        </ErrorBoundary>
        <AnimatedStats />
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
