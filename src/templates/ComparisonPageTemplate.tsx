import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check,
  X,
  Star,
  Shield,
  Zap,
  DollarSign,
  Users,
  Clock,
  Award,
  ChevronRight
} from "lucide-react";
import TrustScoreBreakdown from "@/components/ai/TrustScoreBreakdown";
import IntegrationScoreBreakdown from "@/components/ai/IntegrationScoreBreakdown";

interface ComparisonPageTemplateProps {
  toolA: {
    name: string;
    slug: string;
    logoUrl?: string;
    overallScore: number;
    trustScore: number;
    integrationScore: number;
    tagline: string;
    startingPrice: string;
  };
  toolB: {
    name: string;
    slug: string;
    logoUrl?: string;
    overallScore: number;
    trustScore: number;
    integrationScore: number;
    tagline: string;
    startingPrice: string;
  };
  featureComparison: {
    category: string;
    features: {
      name: string;
      toolA: boolean | string;
      toolB: boolean | string;
      notes?: string;
    }[];
  }[];
  verdict: {
    toolAWinner: string[];
    toolBWinner: string[];
    recommendation: string;
    chooseToolAIf: string[];
    chooseToolBIf: string[];
  };
  lastUpdated: string;
}

const ComparisonPageTemplate: React.FC<ComparisonPageTemplateProps> = ({ toolA, toolB, featureComparison, verdict, lastUpdated }) => {
  const currentYear = new Date().getFullYear();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${toolA.name} vs ${toolB.name}: Full Comparison ${currentYear}`,
    "description": `Complete side-by-side comparison of ${toolA.name} vs ${toolB.name}. Features, pricing, trust scores, and integration capabilities compared.`,
    "author": { "@type": "Organization", "name": "TheSynLab" },
    "publisher": { "@type": "Organization", "name": "TheSynLab", "url": "https://thesynlab.com" },
    "dateModified": lastUpdated,
    "about": [
      { "@type": "SoftwareApplication", "name": toolA.name, "url": `https://thesynlab.com/tool/${toolA.slug}` },
      { "@type": "SoftwareApplication", "name": toolB.name, "url": `https://thesynlab.com/tool/${toolB.slug}` },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{toolA.name} vs {toolB.name}: Full Comparison {currentYear} | TheSynLab</title>
        <meta name="description" content={`Complete side-by-side comparison of ${toolA.name} vs ${toolB.name}. Features, pricing, trust scores, and integration capabilities compared.`} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">{toolA.name} vs {toolB.name}</h1>
          <p className="text-xl text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
            Comprehensive side-by-side comparison including Trust & Integration scores, features, pricing, and real-world performance.
          </p>

          {/* Above-the-fold Decision */}
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-primary/10 mb-12">
            <h3 className="text-xl font-semibold mb-4 text-center">Quick Verdict</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <Badge className="mb-2">{verdict.toolAWinner.length} categories</Badge>
                <p className="font-semibold">{toolA.name} wins</p>
                <ul className="mt-2 text-sm text-left space-y-1">
                  {verdict.toolAWinner.map((item, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <Badge className="mb-2">{verdict.toolBWinner.length} categories</Badge>
                <p className="font-semibold">{toolB.name} wins</p>
                <ul className="mt-2 text-sm text-left space-y-1">
                  {verdict.toolBWinner.map((item, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                <p className="font-semibold">Recommendation</p>
                <p className="text-sm mt-2">{verdict.recommendation}</p>
              </div>
            </div>
          </Card>

          {/* Tool Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Tool A */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {toolA.logoUrl && (
                  <img src={toolA.logoUrl} alt={toolA.name} className="w-16 h-16 rounded-xl shadow-lg" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{toolA.name}</h2>
                  <p className="text-muted-foreground">{toolA.tagline}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Overall Score</span>
                  <span className="font-bold text-lg">{toolA.overallScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Trust Score</span>
                  <span className="font-semibold">{toolA.trustScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Integration Score</span>
                  <span className="font-semibold">{toolA.integrationScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Starting Price</span>
                  <span className="font-semibold">{toolA.startingPrice}</span>
                </div>
              </div>

              <TrustScoreBreakdown score={toolA.trustScore} />
              <Button className="w-full mt-4 gap-2">
                Full {toolA.name} Review <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>

            {/* Tool B */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {toolB.logoUrl && (
                  <img src={toolB.logoUrl} alt={toolB.name} className="w-16 h-16 rounded-xl shadow-lg" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{toolB.name}</h2>
                  <p className="text-muted-foreground">{toolB.tagline}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Overall Score</span>
                  <span className="font-bold text-lg">{toolB.overallScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Trust Score</span>
                  <span className="font-semibold">{toolB.trustScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Integration Score</span>
                  <span className="font-semibold">{toolB.integrationScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Starting Price</span>
                  <span className="font-semibold">{toolB.startingPrice}</span>
                </div>
              </div>

              <IntegrationScoreBreakdown score={toolB.integrationScore} />
              <Button className="w-full mt-4 gap-2">
                Full {toolB.name} Review <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
          
          {featureComparison.map((category, cIdx) => (
            <Card key={cIdx} className="mb-6 overflow-hidden">
              <h3 className="px-6 py-4 bg-muted/50 font-semibold text-lg border-b">{category.category}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium w-1/3">Feature</th>
                      <th className="px-6 py-3 text-center font-medium w-1/4">{toolA.name}</th>
                      <th className="px-6 py-3 text-center font-medium w-1/4">{toolB.name}</th>
                      <th className="px-6 py-3 text-left font-medium w-1/4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.features.map((feature, fIdx) => (
                      <tr key={fIdx} className="border-t hover:bg-muted/20">
                        <td className="px-6 py-3 font-medium">{feature.name}</td>
                        <td className="px-6 py-3 text-center">
                          {typeof feature.toolA === 'boolean' ? (
                            feature.toolA ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                          ) : (
                            feature.toolA
                          )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {typeof feature.toolB === 'boolean' ? (
                            feature.toolB ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                          ) : (
                            feature.toolB
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-muted-foreground">{feature.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </section>

        {/* Decision Summary */}
        <section className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Final Recommendation</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Choose {toolA.name} if</Badge>
                </h3>
                <ul className="space-y-2">
                  {verdict.chooseToolAIf.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Choose {toolB.name} if</Badge>
                </h3>
                <ul className="space-y-2">
                  {verdict.chooseToolBIf.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
};

export default ComparisonPageTemplate;