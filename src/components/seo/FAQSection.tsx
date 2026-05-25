import { JsonLd } from "@/components/seo/JsonLd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FaqItem {
  question: string;
  answer: string;
}

export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
}: {
  faqs: FaqItem[];
  title?: string;
  keyword?: string;
  hubSlug?: string;
  expertName?: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-4">
      <JsonLd
        type="FAQPage"
        faq={faqs}
      />
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="space-y-1">
              <div className="font-medium">{faq.question}</div>
              <div className="text-sm text-muted-foreground">{faq.answer}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
