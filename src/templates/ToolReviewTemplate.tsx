import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  CheckCircle,
  XCircle,
  Star,
  Award,
  DollarSign,
  ShieldCheck,
  Link2,
  ChevronRight
} from "lucide-react";
import TrustScoreBreakdown from "@/components/ai/TrustScoreBreakdown";
import IntegrationScoreBreakdown from "@/components/ai/IntegrationScoreBreakdown";

interface ToolReviewTemplateProps {
  tool: {
    name: string;
    slug: string;
    logoUrl?: string;
    tagline?: string;
    overallScore: number;
    trustScore: number;
    integrationScore: number;
    bestFor: string[];
    pros: string[];
    cons: string[];
    description: string;
    features: {
      category: string;
      items: { name: string; description: string; isPremium: boolean; }[];
    }[];
    pricing: {
      tier: string;
      price: number;
      currency: string;
      billingCycle: string;
      features: string[];
    }[];
    integrations: string[];
    alternatives: {
      name: string;
      slug: string;
      score: number;
      type: string;
    }[];
    faq: {
      question: string;
      answer: string;
    }[];
    officialUrl: string;
    lastUpdated: string;
  };
  relatedComparisons: {
    name: string;
    slug: string;
    vsTool: string;
    vsSlug: string;
  }[];
}

const ToolReviewTemplate: React.FC<ToolReviewTemplateProps> = ({ tool, relatedComparisons }) => {
  const currentYear = new Date().getFullYear();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    "name": `${tool.name} Review: Is It Worth Using in ${currentYear}?`,
    "reviewBody": tool.description,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": tool.overallScore,
      "bestRating": 100,
      "worstRating": 0
    },
    "author": {
      "@type": "Organization",
      "name": "TheSynLab"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TheSynLab",
      "url": "https://thesynlab.com"
    },
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": tool.name,
      "applicationCategory": "SaaS Application"
    },
    "datePublished": tool.lastUpdated,
    "dateModified": tool.lastUpdated
  };

  return (
    <>
      <Helmet>
        <title>{tool.name} Review: Is It Worth Using in {currentYear}? | TheSynLab</title>
        <meta name="description" content={`Comprehensive review of ${tool.name}. Trust score: ${tool.overallScore}/100. Full features, pricing, integrations, and honest alternatives.`} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                {tool.logoUrl && (
                  <img src={tool.logoUrl} alt={tool.name} className="w-16 h-16 rounded-xl shadow-lg" />
                )}
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">{tool.name} Review</h1>
                  <p className="text-muted-foreground text-lg">{tool.tagline}</p>
                </div>
              </div>

              {/* Verdict Box */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-primary/10 mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Quick Verdict</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-sm">
                        <Award className="w-4 h-4 mr-1" />
                        Overall Score: {tool.overallScore}/100
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-2">
                      Visit Official Website
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-2">Best For</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.bestFor.map((item, i) => (
                        <Badge key={i} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Pros
                    </h4>
                    <ul className="space-y-1">
                      {tool.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Cons
                    </h4>
                    <ul className="space-y-1">
                      {tool.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <TrustScoreBreakdown score={tool.trustScore} />
              <IntegrationScoreBreakdown score={tool.integrationScore} />
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">What is {tool.name}?</h2>
              <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
            </Card>

            {tool.faq.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible>
                  {tool.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            {tool.features.map((group, gi) => (
              <Card key={gi} className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  {group.category}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {group.items.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          {feature.name}
                          {feature.isPremium && (
                            <Badge variant="secondary" className="ml-2 text-[10px]">Premium</Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Integrations
              </h3>
              <div className="flex flex-wrap gap-2">
                {tool.integrations.map((integration, i) => (
                  <Badge key={i} variant="outline">{integration}</Badge>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {tool.pricing.map((tier, i) => (
                <Card key={i} className="p-6 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">{tier.tier}</h3>
                  <p className="text-3xl font-bold mb-1">
                    {tier.currency}{tier.price}
                    <span className="text-sm font-normal text-muted-foreground">/{tier.billingCycle}</span>
                  </p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {tier.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full gap-2">
                    <DollarSign className="w-4 h-4" />
                    Choose {tier.tier}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alternatives" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top {tool.name} Alternatives</h3>
              <div className="space-y-3">
                {tool.alternatives.map((alt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-medium">{alt.name}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{alt.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{alt.score}/100</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {relatedComparisons.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Related Comparisons
                </h3>
                <div className="space-y-2">
                  {relatedComparisons.map((cmp, i) => (
                    <a
                      key={i}
                      href={`/compare/${cmp.slug}-vs-${cmp.vsSlug}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-sm font-medium">{cmp.name} vs {cmp.vsTool}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ToolReviewTemplate;