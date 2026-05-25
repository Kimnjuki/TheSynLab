import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Shield, Scale, PenLine, RefreshCw, FileSearch, Heart, Award, Eye } from "lucide-react";

const EditorialPolicy = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Editorial Policy | TheSynLab",
    description: "TheSynLab's editorial standards, review methodology, fact-checking process, and correction policy.",
  };

  const sections = [
    {
      icon: BookOpen,
      title: "Our Editorial Standards",
      content: `TheSynLab is committed to producing independent, data-driven, and accurate technology reviews. Our editorial team operates with full autonomy — no advertiser, partner, or affiliate relationship influences our ratings, rankings, or editorial content.

Every review and article is produced following these core principles:

• Independence: No external party has editorial oversight or approval rights over our content.
• Accuracy: All claims are verified through hands-on testing, vendor documentation, and independent research.
• Transparency: We clearly distinguish between editorial content, sponsored content, and affiliate recommendations.
• Fairness: Products are evaluated against objective criteria disclosed in each review.`
    },
    {
      icon: Scale,
      title: "Review Methodology",
      content: `Each product review on TheSynLab follows a standardized methodology:

1. Research Phase: Our analysts research product specifications, market positioning, and competitor alternatives.
2. Hands-On Testing: Products are tested in real-world or lab environments for a minimum of 40 hours.
3. Data Collection: We collect 25+ data points covering performance, privacy, security, ease of use, and value.
4. Scoring: Our proprietary Trust Score and Integration Score are calculated using transparent, published formulas.
5. Peer Review: Every score and review is reviewed by at least two team members before publication.
6. Publication: Reviews include full methodology disclosure and are date-stamped with the testing period.

We source products through standard retail channels. When vendors provide review units, this is disclosed in the review. Vendors cannot influence scoring.`
    },
    {
      icon: FileSearch,
      title: "Fact-Checking Process",
      content: `All content published on TheSynLab undergoes a multi-stage fact-checking process:

• Pre-Publication: Claims about product features, specifications, and pricing are verified against vendor documentation and independent sources.
• Technical Accuracy: Technical claims are reviewed by domain specialists (e.g., security claims reviewed by our security researcher).
• Statistical Claims: Performance metrics, benchmark results, and test data are verified through our internal testing logs.
• Post-Publication: Readers can submit corrections via our contact form. All correction requests are investigated within 5 business days.`
    },
    {
      icon: RefreshCw,
      title: "Correction Policy",
      content: `TheSynLab is committed to correcting errors promptly and transparently.

Correction Types:
• Minor Errors (typos, formatting): Corrected immediately without notation.
• Substantive Errors (factual inaccuracies, scoring errors): Corrected with a correction notice at the top of the page noting the date and nature of the correction.
• Major Errors (incorrect recommendations, data breaches of our scoring system): Corrected with a detailed explanation and full review reassessment if warranted.

To report an error, email corrections@thesynlab.com or use our contact form. We aim to respond to all correction reports within 48 hours.`
    },
    {
      icon: Heart,
      title: "Editorial Independence & Conflicts of Interest",
      content: `TheSynLab maintains strict separation between editorial and commercial operations.

• Editorial staff do not report to the commercial team.
• No advertiser, sponsor, or affiliate partner can influence editorial content, product rankings, or Trust Scores.
• Staff members must disclose any personal or financial relationships with companies they review.
• We do not accept payment for positive coverage or placement in our rankings.
• Sponsored content is clearly labeled as such and does not affect our independent editorial content.

If you believe any content violates these standards, please report it to ethics@thesynlab.com.`
    },
    {
      icon: Award,
      title: "Trust Score Integrity",
      content: `The TheSynLab Trust Score is our proprietary rating system designed to help readers make informed decisions.

Score Integrity Guarantees:
• All scoring factors are publicly documented.
• Scores are calculated programmatically using fixed formulas — no manual score adjustments are permitted.
• Vendors cannot request score changes or pay for score improvements.
• Scores are reviewed quarterly and updated when significant changes occur in product features, pricing, or security posture.
• Historical scores are preserved with date stamps — readers can see how a product's score has changed over time.

The Trust Score evaluates: Data Privacy Practices (3pts), Encryption Standards (2pts), Terms Transparency (2pts), Ethical AI Transparency (2pts), and Third-Party Audits (1pt).`
    },
    {
      icon: Eye,
      title: "Affiliate & Revenue Disclosure",
      content: `TheSynLab participates in affiliate marketing programs, including the Amazon Services LLC Associates Program and other partner networks. When you click on an affiliate link and make a purchase, we may earn a small commission at no additional cost to you.

Our affiliate relationships are transparently disclosed:
• Product pages include a clear affiliate disclosure notice.
• Affiliate links are marked with a visual indicator where practical.
• Affiliate commissions never influence our scores, rankings, or editorial decisions.
• If a product is acquired through an affiliate relationship, it undergoes the same testing and scoring process as any other product.

For full details, see our Affiliate Disclosure page.`
    },
    {
      icon: Shield,
      title: "Content Sourcing & AI Policy",
      content: `TheSynLab content is created by human experts with relevant domain experience. We disclose the following:

• All articles are written or reviewed by named authors with published biographies.
• We do not publish AI-generated content without human editorial review and fact-checking.
• If AI tools are used in the research or drafting process, this is disclosed in the article.
• Our editorial team retains full creative control and accountability for all published content.

Images and graphics used in reviews are either original, licensed, or used with permission. All sources are credited where applicable.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MetaTags
        title="Editorial Policy | TheSynLab — Our Standards & Methodology"
        description="TheSynLab's editorial standards, review methodology, fact-checking process, correction policy, and commitment to editorial independence."
        canonical="/editorial"
      />
      <JsonLd schema={pageSchema} />
      
      <main className="container py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <PenLine className="h-4 w-4" />
            <span className="text-sm font-medium">Our Standards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Editorial Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How we maintain editorial independence, ensure accuracy, and build trust through transparent methodology.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: May 25, 2026
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            This Editorial Policy is effective as of May 25, 2026 and applies to all content published on TheSynLab™. Questions about this policy can be directed to ethics@thesynlab.com.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditorialPolicy;
