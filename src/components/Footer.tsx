import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail, Twitter, Youtube, Github, Linkedin, ArrowUp,
  Shield, Lock, CheckCircle, Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const footerLinks = {
  hubs: [
    { name: "AI Workflow Hub", href: "/hubs/ai-workflow" },
    { name: "Intelligent Home Hub", href: "/hubs/intelligent-home" },
    { name: "Hybrid Office Hub", href: "/hubs/hybrid-office" },
  ],
  tools: [
    { name: "Comparison Engine", href: "/tools/compare" },
    { name: "Compatibility Checker", href: "/tools/compatibility" },
    { name: "Budget Calculator", href: "/tools/budget-calculator" },
    { name: "Community Forum", href: "/forum" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community/setups" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Affiliate Disclosure", href: "/disclosure" },
    { name: "Ad Compliance", href: "/ad-compliance" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/thesynlab", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@thesynlab", label: "YouTube" },
  { icon: Github, href: "https://github.com/thesynlab", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/thesynlab", label: "LinkedIn" },
];

const trustBadges = [
  { icon: Shield, label: "SOC 2" },
  { icon: Lock, label: "GDPR" },
  { icon: CheckCircle, label: "SSL" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setEmail("");
    toast({ title: "Subscribed!", description: "You've been added to our newsletter." });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="border-b">
        <div className="container py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-2">Stay in the Loop</h3>
              <p className="text-muted-foreground max-w-md">
                Get weekly reviews, exclusive deals, and workflow tips delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/25 transition-shadow" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TheSynLab
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Next-gen tech reviews with unique Trust & Integration Scores. Make confident decisions for your workflow.
            </p>
            <div className="flex items-center gap-2 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="h-10 w-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center hover:-translate-y-1"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground"
                  >
                    <Icon className="h-3 w-3" />
                    {badge.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Hubs</h3>
            <ul className="space-y-3">
              {footerLinks.hubs.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Tools</h3>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} TheSynLab. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground max-w-lg text-center md:text-right">
              We may earn a commission when you buy through links on our site.
              Our recommendations are independent and based on thorough testing.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default Footer;
