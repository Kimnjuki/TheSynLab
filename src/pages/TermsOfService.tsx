import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Scale, AlertTriangle, Users, Shield, Ban, RefreshCw, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  const lastUpdated = "January 12, 2026";
  
  const sections = [
    {
      icon: Scale,
      title: "1. Acceptance of Terms",
      content: `By accessing or using Project Nova ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.

These Terms apply to all visitors, users, and others who access or use the Service. By using the Service, you represent that you are at least 18 years of age, or if you are under 18, that you have obtained parental or guardian consent.

We reserve the right to update these Terms at any time. We will notify users of material changes via email or prominent notice on our website. Your continued use of the Service after changes constitutes acceptance of the updated Terms.`
    },
    {
      icon: Users,
      title: "2. User Accounts & Responsibilities",
      content: `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized access
• Ensuring your use complies with applicable laws

You agree not to:
• Share your account credentials with others
• Create multiple accounts for deceptive purposes
• Impersonate others or misrepresent your identity
• Use the Service for any illegal or unauthorized purpose`
    },
    {
      icon: FileText,
      title: "3. Content & Intellectual Property",
      content: `Our Service contains content owned or licensed by Project Nova ("Our Content"), including but not limited to reviews, scores, methodologies, graphics, and software. Our Content is protected by copyright, trademark, and other intellectual property laws.

User-Generated Content:
When you submit reviews, comments, or other content ("User Content"), you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content in connection with the Service.

You retain ownership of your User Content and represent that:
• You own or have the right to submit the content
• Your content does not infringe on third-party rights
• Your content is accurate and not misleading
• Your content does not contain harmful or illegal material`
    },
    {
      icon: Shield,
      title: "4. Reviews & Scores Disclaimer",
      content: `Our Trust Scores, Integration Scores, and product reviews are based on our proprietary methodology and represent our editorial opinions. While we strive for accuracy:

• Scores are subjective assessments based on our testing
• Product features and performance may vary
• Prices and availability are subject to change
• We cannot guarantee products will meet your specific needs

We encourage you to conduct your own research before making purchasing decisions. Our reviews should be one of many factors you consider.

AI-Assisted Content Disclosure:
Some content on our site may be created with AI assistance. All AI-generated content is reviewed and edited by our human editorial team to ensure accuracy and add original insights.`
    },
    {
      icon: AlertTriangle,
      title: "5. Limitation of Liability",
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.

Project Nova shall not be liable for:
• Any indirect, incidental, special, or consequential damages
• Loss of profits, data, or business opportunities
• Any damages arising from your use of the Service
• Actions taken based on our reviews or recommendations
• Third-party products or services reviewed on our site

Our total liability shall not exceed the amount you paid us, if any, in the past twelve months.`
    },
    {
      icon: Ban,
      title: "6. Prohibited Activities",
      content: `You agree not to engage in any of the following:

• Attempting to interfere with or disrupt the Service
• Using automated systems (bots, scrapers) without permission
• Circumventing security features or access restrictions
• Transmitting malware, viruses, or harmful code
• Harvesting user data without consent
• Spamming, phishing, or fraudulent activities
• Posting false, misleading, or defamatory content
• Violating intellectual property rights
• Engaging in any activity that violates applicable law

Violation of these prohibitions may result in immediate termination of your account and potential legal action.`
    },
    {
      icon: RefreshCw,
      title: "7. Termination",
      content: `We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including:

• Breach of these Terms
• Fraudulent or illegal activity
• Behavior harmful to other users
• Extended period of inactivity
• At our sole discretion for any reason

Upon termination:
• Your right to use the Service ceases immediately
• We may delete your account and User Content
• Provisions that should survive termination will remain in effect

You may terminate your account at any time by contacting us or using the account deletion feature in your settings.`
    },
    {
      icon: Mail,
      title: "8. Contact & Dispute Resolution",
      content: `For questions about these Terms or the Service, contact us:

Email: legal@projectnova.com
Address: Project Nova, Legal Department

Dispute Resolution:
Any disputes arising from these Terms or your use of the Service will be resolved through:

1. Informal Negotiation: Contact us first to attempt resolution
2. Mediation: If negotiation fails, we agree to attempt mediation
3. Arbitration: Binding arbitration as a last resort

Governing Law:
These Terms shall be governed by the laws of the jurisdiction in which Project Nova operates, without regard to conflict of law provisions.

Severability:
If any provision of these Terms is found unenforceable, the remaining provisions will continue in effect.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using Project Nova. By using our service, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Quick Summary Card */}
        <Card className="mb-12 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Key Points Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-4 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You must be 18+ or have parental consent to use our service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You retain ownership of content you submit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Our reviews are opinions based on our testing methodology</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>We may use AI to assist content creation (human-reviewed)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Prohibited activities may result in account termination</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Disputes will be resolved through negotiation first</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {section.title}
                  </CardTitle>
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

        {/* Footer Note */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            By continuing to use Project Nova, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
