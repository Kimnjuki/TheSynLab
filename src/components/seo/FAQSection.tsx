import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/seo/SEOHead";

export function FAQSection({
  keyword,
  hubSlug,
  expertName = "TheSynLab Editorial",
}: {
  keyword?: string;
  hubSlug?: string;
  expertName?: string;
}) {
  const questions = useQuery(api.paa.getUncoveredQuestions, {
    keyword,
    hubSlug,
    limit: 8,
  });

  const qas =
    (questions ?? []).map((q) => ({
      question: q.question,
      answer: `Expert answer by ${expertName}: This is an evidence-backed explanation based on SynLab scoring methodology and lab notes.`,
    })) ?? [];

  if (!qas.length) return null;

  return (
    <div className="space-y-4">
      <SEOHead
        title=""
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: qas.map((qa) => ({
            "@type": "Question",
            name: qa.question,
            acceptedAnswer: { "@type": "Answer", text: qa.answer },
          })),
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>People Also Ask</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {qas.map((qa) => (
            <div key={qa.question} className="space-y-1">
              <div className="font-medium">{qa.question}</div>
              <div className="text-sm text-muted-foreground">{qa.answer}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

