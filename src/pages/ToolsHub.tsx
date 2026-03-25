import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const tools = [
  { title: "Compare Engine", href: "/tools/compare", description: "Compare products side by side." },
  { title: "Compatibility Checker", href: "/tools/compatibility-checker", description: "Check ecosystem support." },
  { title: "Budget Calculator", href: "/tools/budget-calculator", description: "Estimate spend and trade-offs." },
  { title: "ROI Calculator", href: "/tools/roi-calculator", description: "Project ROI and payback period." },
];

export default function ToolsHub() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Smart Home & AI Tools Hub | TheSynLab" metaDescription="Interactive tools for comparison, compatibility, budget, and ROI." canonicalUrl="/tools" />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">Tools Hub</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Card key={tool.href}>
              <CardHeader>
                <CardTitle>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                <Link to={tool.href} className="text-primary hover:underline">
                  Open tool
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
