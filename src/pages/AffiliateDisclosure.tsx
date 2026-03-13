import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DollarSign, Shield, CheckCircle, AlertCircle, HandHeart, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AffiliateDisclosure = () => {
  const lastUpdated = "January 12, 2026";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Full Transparency</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Affiliate Disclosure
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe in complete transparency about how we earn money and how it affects our recommendations.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Key Points Card */}
        <Card className="mb-12 max-w-4xl mx-auto border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Our Commitment to You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>We never let affiliate relationships influence our reviews or scores</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Products are reviewed on their merits, not commission rates</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>We clearly label affiliate links so you always know</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Using our links costs you nothing extra—same price as going directly</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                How We Make Money
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                Project Nova is a participant in various affiliate advertising programs designed to provide a means for sites to earn advertising fees by linking to products and services.
              </p>
              <p>
                When you click on certain links on our site and make a purchase, we may receive a small commission at no additional cost to you. These commissions help us:
              </p>
              <ul>
                <li>Purchase products for hands-on testing</li>
                <li>Pay our team of expert reviewers</li>
                <li>Maintain and improve our website</li>
                <li>Develop new tools and features</li>
                <li>Keep our content free for all readers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                Editorial Independence
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                <strong>Our reviews are never influenced by affiliate relationships.</strong> Here's how we maintain editorial independence:
              </p>
              <ul>
                <li>
                  <strong>Separate Teams:</strong> Our editorial team and business team operate independently. Reviewers don't know which products have affiliate programs.
                </li>
                <li>
                  <strong>Purchase Policy:</strong> We purchase most products ourselves to avoid any perception of bias from receiving free review units.
                </li>
                <li>
                  <strong>Negative Reviews:</strong> If a product doesn't meet our standards, we say so—regardless of commission potential.
                </li>
                <li>
                  <strong>Score Methodology:</strong> Our Trust and Integration Scores follow a documented methodology that doesn't factor in commercial relationships.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                How We Disclose Affiliate Links
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                We make it easy to identify affiliate links on our site:
              </p>
              <ul>
                <li>Affiliate links are marked with a small icon or "affiliate" label</li>
                <li>Each review page includes a disclosure statement</li>
                <li>Product cards may display "Commission earned" when applicable</li>
                <li>Our footer contains a general affiliate disclosure</li>
              </ul>
              <p>
                If you ever have questions about whether a link is an affiliate link, just ask us!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HandHeart className="h-5 w-5 text-primary" />
                </div>
                Supporting Our Work
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                If you find our reviews helpful and decide to purchase a product we recommend, using our affiliate links is the best way to support our work. It costs you nothing extra and helps us continue providing in-depth, unbiased reviews.
              </p>
              <p>
                However, we understand if you prefer not to use affiliate links. Our primary goal is to help you make informed decisions, whether or not you purchase through our links.
              </p>
              <p>
                Other ways to support us:
              </p>
              <ul>
                <li>Share our reviews on social media</li>
                <li>Subscribe to our newsletter</li>
                <li>Leave feedback to help us improve</li>
                <li>Tell friends and colleagues about Project Nova</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                Affiliate Programs We Participate In
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                We participate in affiliate programs with various companies, including but not limited to:
              </p>
              <ul>
                <li>Amazon Associates Program</li>
                <li>Direct partnerships with SaaS companies</li>
                <li>Hardware manufacturer affiliate programs</li>
                <li>Smart home product affiliate networks</li>
              </ul>
              <p>
                <strong>Amazon Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 pt-8 border-t border-border max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground">
            Thank you for supporting Project Nova. Your trust means everything to us, and we're committed to maintaining complete transparency in all our business relationships.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Questions? Contact us at{" "}
            <a href="mailto:disclosure@projectnova.com" className="text-primary hover:underline">
              disclosure@projectnova.com
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AffiliateDisclosure;
