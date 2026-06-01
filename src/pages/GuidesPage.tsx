import { Link } from "react-router-dom";
import { MetaTags } from "@/components/seo/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Buying Guides 2026: Smart Home, SaaS & Productivity Tools | TheSynLab"
        description="TheSynLab buying guides help you choose the right smart home devices, SaaS tools, and productivity software. Compare features, Trust Scores, and find your perfect setup with confidence."
        canonical="/guides"
      />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Buying Guides</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Our curated guides help you navigate product categories, compare features, and make confident purchasing decisions.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/blog/smart-home-buying-guide-2026-first-time" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-shadow">
            <span className="text-3xl mb-2 block">🏠</span>
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Smart Home for Beginners</h2>
            <p className="text-sm text-muted-foreground mt-2">Your complete guide to building your first smart home in 2026</p>
          </Link>
          <Link to="/blog/monitor-buying-guide-productivity" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-shadow">
            <span className="text-3xl mb-2 block">🖥️</span>
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Monitor Buying Guide</h2>
            <p className="text-sm text-muted-foreground mt-2">Find the perfect monitor for work, productivity, and ergonomics</p>
          </Link>
          <Link to="/blog/best-project-management-software-2026" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-shadow">
            <span className="text-3xl mb-2 block">📋</span>
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Project Management Guide</h2>
            <p className="text-sm text-muted-foreground mt-2">Compare the best PM tools and find the right one for your team</p>
          </Link>
          <Link to="/blog/smart-home-security-best-practices-2026" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-shadow">
            <span className="text-3xl mb-2 block">🔒</span>
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Smart Home Security Guide</h2>
            <p className="text-sm text-muted-foreground mt-2">Protect your smart home from privacy risks and security threats</p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
