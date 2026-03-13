import { useState } from "react";
import { Search, HelpCircle, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "Platform",
    questions: [
      {
        id: "platform-1",
        question: "What is the Trust Score and how is it calculated?",
        answer: "The Trust Score (0-10) measures a product's privacy practices, security standards, terms transparency, ethical AI usage, and third-party audits. Each component is weighted based on importance, with data privacy carrying the highest weight at 3 points.",
      },
      {
        id: "platform-2",
        question: "How does the Integration Score work?",
        answer: "The Integration Score (0-10) evaluates how well a product connects with other tools and ecosystems. It considers API documentation quality, cross-platform support, smart home ecosystem compatibility, automation platform integration, and developer community strength.",
      },
      {
        id: "platform-3",
        question: "Are the reviews sponsored or influenced by vendors?",
        answer: "No. Our reviews are completely independent. While we may earn affiliate commissions, this never influences our scoring or recommendations. All sponsored content is clearly disclosed, and our methodology is transparent and public.",
      },
    ],
  },
  {
    category: "Tools",
    questions: [
      {
        id: "tools-1",
        question: "How does the Budget Calculator work?",
        answer: "Set your total budget, select product categories, and prioritize your needs. Our algorithm recommends the best products within your budget while maximizing Trust and Integration scores. You can save configurations and export shopping lists.",
      },
      {
        id: "tools-2",
        question: "Can I compare multiple products side by side?",
        answer: "Yes! Our Comparison Tool lets you compare up to 4 products simultaneously. View detailed breakdowns of scores, features, pricing, and compatibility. You can even share comparison links with colleagues.",
      },
    ],
  },
  {
    category: "Membership",
    questions: [
      {
        id: "membership-1",
        question: "What's included in the Integration Pro membership?",
        answer: "Integration Pro ($15/month or $149/year) includes: 2-week early access to content, monthly group consultations, private Discord community, exclusive tutorials, negotiated discount codes, ad-free experience, and downloadable templates.",
      },
      {
        id: "membership-2",
        question: "Is there a free trial available?",
        answer: "Yes! All paid plans come with a 7-day free trial. You can cancel anytime during the trial period without being charged.",
      },
    ],
  },
  {
    category: "Community",
    questions: [
      {
        id: "community-1",
        question: "Can I submit my own setup for the community gallery?",
        answer: "Absolutely! Submit your workspace or smart home setup with photos and equipment list. Featured setups can win monthly gift cards, and verified setups receive special badges.",
      },
      {
        id: "community-2",
        question: "How do I earn from contributing integration guides?",
        answer: "Write technical integration guides that get approved by our editorial team. You'll earn 50% of affiliate revenue generated from your content for 90 days, with a $25 minimum payout.",
      },
    ],
  },
];

const FAQAccordion = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaq = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-accent/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our platform and methodology
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg rounded-xl border-2 focus:border-primary"
          />
        </div>

        {/* FAQ Accordion */}
        {filteredFaq.length > 0 ? (
          <div className="space-y-6">
            {filteredFaq.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category.category}
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                        {highlightText(item.question)}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                        {highlightText(item.answer)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl">
            <HelpCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No matching questions found. Try a different search term.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-muted/30 rounded-2xl border border-border/50">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Our team is here to help.
          </p>
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
