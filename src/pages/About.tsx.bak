import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Lightbulb, Heart, Shield, CheckCircle, Star, FlaskConical, TrendingUp, BookOpen, ArrowRight } from "lucide-react";

const About = () => {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About TheSynLab",
    description: "Next-gen tech reviews with unique Trust & Integration Scores. Expert analysis of productivity tools, smart home devices, and office hardware.",
  };

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & Editor-in-Chief",
      bio: "10+ years in tech journalism. Former editor at TechReview Pro.",
      expertise: ["AI Tools", "Productivity", "Smart Home"],
    },
    {
      name: "Sarah Mitchell",
      role: "Head of Testing",
      bio: "Hardware engineer turned tech reviewer with hands-on testing experience.",
      expertise: ["Hardware", "Integration Testing", "Security"],
    },
    {
      name: "Marcus Rodriguez",
      role: "Senior AI Analyst",
      bio: "PhD in Machine Learning. Specializes in AI workflow optimization.",
      expertise: ["AI/ML", "Automation", "Data Analysis"],
    },
    {
      name: "Emily Watson",
      role: "Smart Home Specialist",
      bio: "Former product manager at leading IoT companies. Real-world smart home expertise.",
      expertise: ["IoT", "Smart Home", "Home Automation"],
    },
    {
      name: "James Park",
      role: "Productivity Tools Analyst",
      bio: "Startup veteran who tested 200+ SaaS tools in production environments.",
      expertise: ["SaaS", "Project Management", "No-Code"],
    },
    {
      name: "Lisa Nakamura",
      role: "Security & Privacy Researcher",
      bio: "Cybersecurity professional with CISSP certification. Audits our security assessments.",
      expertise: ["Security", "Privacy", "Compliance"],
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Editorial Independence",
      description: "Our scores and recommendations are determined by lab testing alone. No commercial relationship influences our reviews."
    },
    {
      icon: FlaskConical,
      title: "Lab-Tested",
      description: "Every product in our catalog undergoes hands-on testing by domain experts. We measure what matters to real users."
    },
    {
      icon: TrendingUp,
      title: "Transparent Scoring",
      description: "Our Trust & Integration Scores are built from 50+ data points, each documented and auditable. See exactly how we score."
    },
    {
      icon: BookOpen,
      title: "Continuous Updates",
      description: "Products are re-tested quarterly. Scores update as features, pricing, and security postures change."
    },
  ];

  return (
    <div className="min-h-screen">
      <MetaTags
        title="About TheSynLab — Next-Gen Tech Reviews with Trust Scores"
        description="Meet the team behind TheSynLab. Expert tech reviews with transparent scoring, lab-tested products, and editorial independence."
        canonical="/about"
      />
      <JsonLd schema={pageSchema} />
      <Header />

      <main>
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container py-20 text-center">
            <Badge variant="secondary" className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Trust in every score.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              TheSynLab helps you build a trusted tech stack. Our lab-tested reviews and proprietary scoring system give you the data you need to make confident decisions.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                Most tech reviews tell you whether something is "good" or "bad." We tell you <em>why</em>, with data. Our mission is to replace promotional, surface-level reviews with transparent, lab-tested analysis that helps you build a stack you can trust.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <Card key={v.title} className="text-center">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-base mt-2">{v.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How We Test */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold mb-4">How We Test</h2>
              <p className="text-muted-foreground">Every product in our catalog goes through a standardized testing protocol before receiving a score.</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                { step: "1", title: "Product Selection", desc: "We prioritize products with significant market share, high search interest, or unique capabilities. Every product is independently sourced — never from PR samples that come with strings attached." },
                { step: "2", title: "Hands-On Testing", desc: "Each product is used in production-like environments for a minimum of 40 hours. We test setup, daily use, integration, reliability, and support quality." },
                { step: "3", title: "Score Calculation", desc: "Our Trust Score evaluates 25+ factors across privacy, security, transparency, and vendor track record. The Integration Score measures API quality, ecosystem compatibility, and automation capabilities." },
                { step: "4", title: "Peer Review & Publishing", desc: "Scores are reviewed by at least two team members. We publish the full methodology alongside each review so you can verify our conclusions." },
                { step: "5", title: "Continuous Updates", desc: "Products are re-tested quarterly or when major updates ship. Scores are date-stamped — you'll always know how current our assessment is." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/scoring-hub">View Full Scoring Methodology <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Editorial Independence */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Editorial Independence</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>We do not accept payment in exchange for positive coverage. Our affiliate relationships are clearly disclosed on every product page and never influence our scores or rankings.</p>
                    <p>If you see sponsored content, it will be clearly labeled as such. Sponsors cannot influence our editorial verdicts, Trust Scores, Integration Scores, or product rankings.</p>
                    <p>If you believe any content has been influenced by a commercial relationship, <Link to="/contact" className="underline">please report it</Link>.</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="outline" asChild><Link to="/how-we-make-money">How We Make Money →</Link></Button>
                    <Button variant="outline" asChild><Link to="/disclosure">Disclosure Policy →</Link></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-10">Meet the Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {teamMembers.map((member) => (
                <Card key={member.name}>
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-base mt-2">{member.name}</CardTitle>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((e) => (
                        <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fellows & Contact */}
        <section className="py-16">
          <div className="container max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Interested in joining TheSynLab?</h2>
            <p className="text-muted-foreground mb-8">
              We're building a Fellows program for domain experts to contribute reviews and earn through our community platform. 
              <Link to="/contact" className="underline ml-1">Get in touch</Link> if you'd like to know more.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild><Link to="/contact">Contact Us</Link></Button>
              <Button variant="outline" asChild><Link to="/scoring-hub">Scoring Methodology</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
