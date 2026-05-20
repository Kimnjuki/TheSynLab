import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Shield,
  BarChart3,
  Megaphone,
  FileText,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  FlaskConical,
} from "lucide-react";

const VendorProgram = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vendor Program — TheSynLab",
    description: "List your product in the TheSynLab catalog. Get lab-tested, reviewed by our expert team, and listed in our trusted product database.",
  };

  const benefits = [
    {
      icon: FlaskConical,
      title: "Lab-Tested Review",
      description: "Your product gets a full hands-on review by our domain experts. Trust Score and Integration Score calculated using our transparent methodology."
    },
    {
      icon: Star,
      title: "Catalog Listing",
      description: "Listed in our searchable product catalog alongside competitor comparisons."
    },
    {
      icon: TrendingUp,
      title: "Stack Quiz Integration",
      description: "Your product appears in relevant Stack Quiz recommendations when it fits user needs."
    },
    {
      icon: FileText,
      title: "Buying Guides & Roundups",
      description: "Featured in \"Best Of\" roundups, buying guides, and comparison articles within your category."
    },
    {
      icon: BarChart3,
      title: "Vendor Dashboard",
      description: "See how users discover and interact with your product listing. Track impression and click metrics."
    },
    {
      icon: Users,
      title: "Community Visibility",
      description: "Your product listed in Trust Index leaderboards, Stack Templates, and community discussions."
    },
  ];

  const tiers = [
    {
      name: "Listing",
      price: "Free",
      features: [
        "Basic product listing",
        "Public Trust Score from existing data",
        "User reviews enabled",
        "Standard catalog placement",
      ],
      cta: "Join for Free",
      highlighted: false,
    },
    {
      name: "Verified",
      price: "Contact us",
      features: [
        "Full lab-tested review",
        "Trust & Integration Scores",
        "Stack Quiz integration",
        "Vendor dashboard access",
        "Quarterly re-testing",
      ],
      cta: "Get Verified",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Verified",
        "Priority re-testing",
        "Bulk product listing",
        "Dedicated account manager",
        "Custom category creation",
        "Analytics & insights reports",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <MetaTags
        title="Vendor Program — List Your Product on TheSynLab"
        description="Get your product lab-tested and listed in the TheSynLab catalog. Reach informed buyers with transparent Trust Scores and Integration Scores."
        canonical="/vendor-program"
      />
      <JsonLd schema={schema} />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-4">For Vendors</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Listed. Get Tested. Get Trusted.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              List your product in our lab-tested catalog and reach informed buyers who value transparency.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild><a href="#tiers">Join the Program</a></Button>
              <Button size="lg" variant="outline" asChild><Link to="/contact">Contact Us</Link></Button>
            </div>
          </div>
        </section>

        {/* Why Join */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-10">Why List with TheSynLab?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <Card key={b.title}>
                    <CardHeader>
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base mt-3">{b.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{b.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Submit", desc: "Fill out our vendor submission form with product details." },
                { step: "2", title: "Review", desc: "We source the product and begin our hands-on testing protocol." },
                { step: "3", title: "Score", desc: "Trust & Integration Scores calculated using our 50+ data point methodology." },
                { step: "4", title: "List", desc: "Product goes live in our catalog with full scoring and comparisons." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">{s.step}</div>
                  <h3 className="font-semibold mt-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section id="tiers" className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-4">Program Tiers</h2>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">Choose the tier that fits your product and goals.</p>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <Card key={tier.name} className={tier.highlighted ? "border-primary shadow-lg relative" : ""}>
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <p className="text-3xl font-bold mt-2">{tier.price}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={tier.highlighted ? "default" : "outline"} asChild>
                      <a href="mailto:partners@thesynlab.com">{tier.cta}</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can we purchase a positive review?", a: "No. Scores are determined exclusively by our lab testing protocol. Vendors cannot influence their Trust Score or Integration Score through payment." },
                { q: "How long does testing take?", a: "Our standard testing protocol takes 2-4 weeks, including setup, daily-use testing, and integration assessment." },
                { q: "Do we need to provide free samples?", a: "Yes. We test products independently, so we need access to the product. Returnable review units are preferred." },
                { q: "Can we update our product listing?", a: "Yes. Verified and Enterprise tier vendors can update descriptions, pricing, and feature lists through their dashboard." },
                { q: "What happens if our Trust Score is low?", a: "We provide detailed score breakdowns so you know exactly what to improve. Re-testing is available quarterly." },
              ].map((faq) => (
                <details key={faq.q} className="group border rounded-lg p-4 [&[open]]:border-primary/30">
                  <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-muted-foreground group-open:hidden">+</span>
                    <span className="text-muted-foreground hidden group-open:inline">−</span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">Email us at partners@thesynlab.com and we'll get back to you within 2 business days.</p>
            <Button size="lg" asChild><a href="mailto:partners@thesynlab.com">Apply Now</a></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VendorProgram;
