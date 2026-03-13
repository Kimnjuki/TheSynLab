import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Target, Award, Lightbulb, Heart, Shield, CheckCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
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
      bio: "Certified smart home integrator with 50+ home automation projects.",
      expertise: ["Home Automation", "IoT", "Matter/Thread"],
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Independence",
      description: "Our reviews are never influenced by advertisers. We purchase products ourselves whenever possible and maintain strict editorial independence.",
    },
    {
      icon: Target,
      title: "Transparency",
      description: "We clearly disclose affiliate relationships, sponsored content, and our testing methodology. No hidden agendas.",
    },
    {
      icon: Award,
      title: "Expertise",
      description: "Our team brings decades of combined experience in technology, testing, and real-world implementation.",
    },
    {
      icon: Heart,
      title: "User-First",
      description: "Every review and score is designed to help YOU make better decisions, not to drive clicks or sales.",
    },
  ];

  const stats = [
    { value: "500+", label: "Products Reviewed" },
    { value: "50K+", label: "Monthly Readers" },
    { value: "98%", label: "Accuracy Rate" },
    { value: "24hr", label: "Avg Response Time" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">About Project Nova</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Tech Reviews You Can{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Actually Trust
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We're a team of tech enthusiasts, engineers, and journalists on a mission to cut through the noise and deliver honest, in-depth reviews with our proprietary Trust & Integration Scores.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Project Nova was born out of frustration. As technology professionals, we were tired of reading product reviews that felt like thinly-veiled advertisements. We wanted data-driven insights, real-world testing, and honest assessments of how products actually integrate into modern workflows.
                </p>
                <p>
                  In 2024, we launched with a simple mission: create the review site we wished existed. One that treats readers as intelligent professionals who need practical information, not marketing fluff.
                </p>
                <p>
                  Our unique approach centers on two proprietary scoring systems:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Trust Score:</strong> Evaluates privacy practices, security standards, transparency, and ethical AI usage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span><strong>Integration Score:</strong> Measures API quality, ecosystem compatibility, automation support, and cross-platform capabilities</span>
                  </li>
                </ul>
                <p>
                  Today, we're proud to serve over 50,000 monthly readers who rely on our reviews to make informed technology decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide every review we write and every score we assign.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The experts behind Project Nova's reviews and methodology.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-foreground">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.expertise.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* E-E-A-T Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Our Expertise & Authority</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• 50+ combined years in technology and journalism</p>
                    <p>• Hands-on testing of every product we review</p>
                    <p>• Real-world implementation experience</p>
                    <p>• Continuous learning and certification</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Expertise</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Certified professionals in our coverage areas</p>
                    <p>• Regular training on emerging technologies</p>
                    <p>• Academic backgrounds in relevant fields</p>
                    <p>• Industry conference speakers and contributors</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Authoritativeness</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Cited by major technology publications</p>
                    <p>• Partnerships with industry organizations</p>
                    <p>• Guest appearances on tech podcasts</p>
                    <p>• Contributor to industry standards discussions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Trustworthiness</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Clear disclosure of affiliate relationships</p>
                    <p>• Transparent testing methodology</p>
                    <p>• Regular accuracy audits and corrections</p>
                    <p>• Independent editorial team</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
