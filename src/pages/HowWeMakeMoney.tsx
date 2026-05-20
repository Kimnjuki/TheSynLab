import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, DollarSign, Users, Scale, FileText, HeartHandshake, Search } from "lucide-react";

const HowWeMakeMoney = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "How We Make Money — TheSynLab",
    description: "Transparent breakdown of how TheSynLab generates revenue while maintaining editorial independence and unbiased reviews.",
  };

  return (
    <div className="min-h-screen">
      <MetaTags
        title="How We Make Money — TheSynLab"
        description="Transparent breakdown of how TheSynLab generates revenue while maintaining editorial independence and unbiased reviews."
        canonical="/how-we-make-money"
      />
      <JsonLd schema={pageSchema} />

      <div className="container py-16">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How We Make Money</h1>
          <p className="text-xl text-muted-foreground">
            TheSynLab is reader-supported. We're transparent about every revenue stream so you can trust our reviews.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Affiliate Revenue */}
          <section className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Affiliate Commissions</h2>
                <p className="text-sm text-muted-foreground">Primary revenue stream</p>
              </div>
            </div>
            <div className="space-y-3">
              <p>When you click a product link on TheSynLab and make a purchase, we may earn a commission — at <strong>no extra cost to you</strong>.</p>
              <p className="text-sm text-muted-foreground">Key principles:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>No influence on scores:</strong> Affiliate relationships never affect our Trust or Integration scores. If we wouldn't recommend a product without a commission, we won't recommend it with one.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Multiple partners:</strong> We work with dozens of affiliate networks and direct programs. No single vendor can buy influence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Disclosed on every page:</strong> Every review and product page includes our affiliate disclosure banner.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Sponsored Content Policy */}
          <section className="grid md:grid-cols-[1fr_2fr] gap-8 items-start border-t pt-12">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <HeartHandshake className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Sponsorships</h2>
                <p className="text-sm text-muted-foreground">Limited, clearly labeled</p>
              </div>
            </div>
            <div className="space-y-3">
              <p>We occasionally accept sponsorships for specific content. Every sponsored piece is:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Scale className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <span><strong>Cleary labeled</strong> — "Sponsored" badge in the header</span>
                </li>
                <li className="flex items-start gap-2">
                  <Scale className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <span><strong>Always factual</strong> — sponsors cannot influence scores, rankings, or editorial verdicts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Scale className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <span><strong>Never a review</strong> — sponsored content is clearly informational or "sponsored by" content, separate from our review system</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Digital Products */}
          <section className="grid md:grid-cols-[1fr_2fr] gap-8 items-start border-t pt-12">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Digital Products</h2>
                <p className="text-sm text-muted-foreground">Growing revenue stream</p>
              </div>
            </div>
            <div className="space-y-3">
              <p>We sell premium research reports, templates, and B2B services. Examples include:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>Vendor Risk Assessment reports ($499+)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>Workflow template packs ($19-$29)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>Industry benchmark reports</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">Our lab testing and editorial content remain free. Digital products fund deeper research that benefits our entire community.</p>
            </div>
          </section>

          {/* Vendor Services */}
          <section className="grid md:grid-cols-[1fr_2fr] gap-8 items-start border-t pt-12">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Vendor Certification</h2>
                <p className="text-sm text-muted-foreground">Optional badge program</p>
              </div>
            </div>
            <div className="space-y-3">
              <p>Vendors can earn a "Certified by TheSynLab" badge through a paid testing and verification process. Key safeguards:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Search className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <span><strong>Certification ≠ positive score</strong> — a certified product can still receive a low Trust or Integration score. Badge only indicates we completed a thorough audit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Search className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <span><strong>Free tier available</strong> — every product in our catalog gets a baseline score free of charge.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Search className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <span><strong>No editorial influence</strong> — payment does not affect ranking, placement, or review content.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Independence Guarantee */}
          <section className="border-t pt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Editorial Independence Guarantee</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              <p>No amount of money can buy a positive review, a higher score, or a better ranking on TheSynLab. Our editorial team operates independently from any commercial relationships.</p>
              <p className="text-muted-foreground text-sm">If you believe any content has been influenced by a commercial relationship, please <Link to="/contact" className="underline">contact us immediately</Link>.</p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <Button variant="outline" asChild>
                  <Link to="/scoring-hub">View Scoring Methodology →</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/disclosure">Full Disclosure Policy →</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HowWeMakeMoney;
