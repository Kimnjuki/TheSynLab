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
      "url": "https://www.thesynlab.com"
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
            <TabsTrigger value="