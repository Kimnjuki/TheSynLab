import { Link } from "react-router-dom";
import { Twitter } from "lucide-react";

const linkGroups = [
  {
    title: "Hubs",
    links: [
      { name: "AI & Workflow Tools", href: "/hub/ai-tools" },
      { name: "SaaS & Developer Tools", href: "/hub/ai-tools" },
      { name: "Intelligent Home", href: "/hub/intelligent-home" },
      { name: "Hybrid Office", href: "/hub/hybrid-office" },
      { name: "All Products", href: "/products" },
    ],
  },
  {
    title: "Decision Tools",
    links: [
      { name: "Compare Tools", href: "/compare" },
      { name: "TCO Calculator", href: "/tco-calculator" },
      { name: "Vendor Risk Checker", href: "/vendor-risk-checker" },
      { name: "Stack Builder", href: "/stack-builder" },
      { name: "Decision Studio", href: "/decision-studio" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Buying Guides", href: "/guides" },
      { name: "Scoring Hub", href: "/scoring-hub" },
      { name: "Trust Index", href: "/trust-index" },
      { name: "About", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Affiliate Disclosure", href: "/disclosure" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-tsl-bg-primary border-t border-tsl-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block text-2xl font-bold text-tsl-text mb-4">
              TheSynLab
            </Link>
            <p className="text-sm text-tsl-text-secondary mb-6 max-w-xs">
              Independent AI &amp; SaaS reviews you can actually trust. Lab-tested scores, no vendor influence.
            </p>
            <a
              href="https://twitter.com/thesynlab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-tsl-border text-tsl-text-secondary hover:text-tsl-accent hover:border-tsl-accent/40 transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-tsl-text mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-tsl-text-secondary hover:text-tsl-text transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-tsl-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-tsl-text-secondary">
            &copy; {new Date().getFullYear()} TheSynLab. All rights reserved.
          </p>
          <p className="text-xs text-tsl-text-secondary max-w-lg text-center md:text-right">
            We may earn a commission when you buy through links on our site. Our scores are independent and based on 14+ days of hands-on testing.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
