import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight,
  Star,
  Check,
  X,
  DollarSign,
  Shield,
  Zap
} from "lucide-react";

interface ToolAlternativesTemplateProps {
  primaryTool: {
    name: string;
    slug: string;
    logoUrl?: string;
    overallScore: number;
  };
  alternatives: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    overallScore: number;
    trustScore: number;
    integrationScore: number;
    price: string;
    bestFor: string;
    keyDifferences: string[];
    summary: string;
  }[];
  category: string;
  useCase: string;
}

const AlternativesPageTemplate: React.FC<ToolAlternativesTemplateProps> = ({ primaryTool, alternatives, category, useCase }) => {
  const currentYear = new Date().getFullYear();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Best ${primaryTool.name} Alternatives for ${useCase} in ${currentYear}`,
    "description": `Curated list of the best ${primaryTool.name} alternatives. Compare features, pricing, and trust scores to find the right tool for ${useCase}.`,
    "mainEntity": alternatives.map(alt => ({
      "@type": "SoftwareApplication",
      "name": alt.name,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": alt.overallScore,
        "bestRating": 100
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Best {primaryTool.name} Alternatives for {useCase} in {currentYear} | TheSynLab</title>
        <meta name="description" content={`Curated list of the best {primaryTool.name} alternatives. Compare features, pricing, and trust scores to find the right tool for {useCase}.`} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Best {primaryTool.name} Alternatives for {useCase} in {currentYear}</h1>
          <p className="text-xl text-muted-foreground mb-8">
            We've analyzed and ranked the top alternatives to {primaryTool.name} based on Trust & Integration scores, pricing, and real user feedback.
          </p>

          {/* Comparison Table */}
          <Card className="overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Tool</th>
                    <th className="px-6 py-4 text-left font-medium">Overall Score</th>
                    <th className="px-6 py-4 text-left font-medium">Best For</th>
                    <th className="px-6 py-4 text-left font-medium">Pricing</th>
                    <th className="px-6 py-4 text-left font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {alternatives.map((alt, i) => (
                    <tr key={alt.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {alt.logoUrl && (
                            <img src={alt.logoUrl} alt={alt.name} className="w-10 h-10 rounded-lg" />
                          )}
                          <span className="font-medium">{alt.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{alt.overallScore}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{alt.bestFor}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span>{alt.price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="ghost" className="gap-1">
                          View Review <ChevronRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Detailed Alternatives */}
          <div className="space-y-8">
            {alternatives.map((alt, i) => (
              <Card key={alt.id} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    {alt.logoUrl && (
                      <img src={alt.logoUrl} alt={alt.name} className="w-14 h-14 rounded-xl shadow-md" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{i + 1}. {alt.name}</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">Overall: {alt.overallScore}/100</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Trust: {alt.trustScore}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Integration: {alt.integrationScore}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" className="gap-1">
                      Full Review <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{alt.summary}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Differences</h4>
                    <ul className="space-y-1">
                      {alt.keyDifferences.map((diff, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Pricing</h4>
                    <p className="text-lg font-semibold">{alt.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Decision Summary */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 mt-12">
            <h3 className="text-xl font-semibold mb-4">Who should stay with {primaryTool.name}?</h3>
            <p className="text-muted-foreground mb-4">
              {primaryTool.name} is still the best choice if you:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Already have an existing workflow built around {primaryTool.name}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Need specific integrations that only {primaryTool.name} offers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Have team training invested in {primaryTool.name}</span>
              </li>
            </ul>
          </Card>
        </section>
      </div>
    </>
  );
};

export default AlternativesPageTemplate;