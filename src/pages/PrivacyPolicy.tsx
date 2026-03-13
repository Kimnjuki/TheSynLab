import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Cookie, Database, Eye, Lock, Mail, Globe, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const lastUpdated = "January 12, 2026";
  
  const sections = [
    {
      icon: Database,
      title: "1. Information Collection",
      content: `We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, submit a review, or contact us. This may include:
      
• Name and email address
• Profile information (bio, location, website)
• Reviews, comments, and community contributions
• Usage data and preferences

We also automatically collect certain information when you visit our site, including your IP address, browser type, device information, and pages visited.`
    },
    {
      icon: Cookie,
      title: "2. Google AdSense & Cookies",
      content: `We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet.

You may opt out of personalized advertising by visiting Google Ads Settings at https://www.google.com/settings/ads.

Third-party vendors and ad networks may also serve ads on our site. These companies may use cookies, web beacons, and similar technologies to collect information about your visits to this and other websites.

We use the following types of cookies:
• Essential Cookies: Required for site functionality
• Analytics Cookies: Help us understand how visitors use our site
• Advertising Cookies: Used to deliver relevant advertisements
• Preference Cookies: Remember your settings and preferences`
    },
    {
      icon: Eye,
      title: "3. How We Use Your Information",
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Send you technical notices and support messages
• Respond to your comments, questions, and requests
• Send newsletters and marketing communications (with your consent)
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions
• Personalize and improve your experience
• Generate aggregate analytics and insights

We do not sell your personal data to third parties.`
    },
    {
      icon: Lock,
      title: "4. Data Protection & Security",
      content: `We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:

• SSL/TLS encryption for data in transit
• Encrypted storage for sensitive information
• Regular security audits and penetration testing
• Access controls and authentication measures
• Employee training on data protection

While we strive to protect your information, no method of transmission over the Internet is 100% secure.`
    },
    {
      icon: Globe,
      title: "5. CCPA/GDPR Compliance (2026 Update)",
      content: `If you are a resident of the European Economic Area (EEA), United Kingdom, or California, you have specific rights regarding your personal data:

Rights under GDPR (EEA/UK residents):
• Right to access your personal data
• Right to rectification of inaccurate data
• Right to erasure ("right to be forgotten")
• Right to restrict processing
• Right to data portability
• Right to object to processing
• Rights related to automated decision-making

Rights under CCPA (California residents):
• Right to know what personal information is collected
• Right to know if personal information is sold or disclosed
• Right to say no to the sale of personal information
• Right to access your personal information
• Right to equal service and price

To exercise these rights, please contact us at privacy@projectnova.com or use the "Cookie Settings" button at the bottom of our site.`
    },
    {
      icon: Settings,
      title: "6. Consent Management",
      content: `In accordance with 2026 regulations, we use a Consent Management Platform (CMP) that allows you to:

• View which cookies are being used
• Accept or decline non-essential cookies
• Modify your consent preferences at any time
• Withdraw consent previously given

You can access your cookie preferences at any time by clicking the "Cookie Settings" link in our footer or the cookie icon in the bottom-left corner of your screen.

We only use analytics and advertising cookies after obtaining your explicit consent.`
    },
    {
      icon: Mail,
      title: "7. Contact Us",
      content: `If you have any questions about this Privacy Policy, your personal data, or wish to exercise your rights, please contact us:

Email: privacy@projectnova.com
Address: Project Nova, Data Protection Team

For complaints regarding data processing, you may also contact your local data protection authority.

We will respond to your request within 30 days as required by applicable law.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Your Privacy Matters</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are committed to protecting your privacy and being transparent about how we collect, use, and share your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Quick Summary Card */}
        <Card className="mb-12 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Quick Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-4 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>We never sell your personal data to third parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>You can opt out of personalized ads at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>GDPR & CCPA compliant with full data rights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Cookie consent required before non-essential tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>SSL encryption protects all data in transit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Request data deletion or export anytime</span>
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
            This Privacy Policy is effective as of {lastUpdated} and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
