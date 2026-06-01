import { Link } from "react-router-dom";
import { MetaTags } from "@/components/seo/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GLOSSARY_TERMS = [
  { term: "Matter Protocol", slug: "matter-protocol-2026-everything-you-need-to-know", desc: "The new smart home standard for interoperability between devices from different manufacturers." },
  { term: "Thread", slug: "thread-protocol-2026-complete-guide", desc: "A low-power mesh networking protocol designed for IoT devices." },
  { term: "Trust Score", slug: "what-is-trust-score", desc: "TheSynLab's proprietary scoring system that rates products on trust, privacy, and value." },
  { term: "Zigbee", slug: "zigbee-vs-z-wave-2026-which-is-better", desc: "A wireless protocol for low-power, low-data-rate IoT devices." },
  { term: "Z-Wave", slug: "zigbee-vs-z-wave-2026-which-is-better", desc: "A wireless communication protocol for home automation." },
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Tech Glossary: Smart Home, IoT & SaaS Terms Explained | TheSynLab"
        description="Your glossary of smart home, IoT, and SaaS terminology. Clear explanations of Matter, Thread, Zigbee, Z-Wave, Trust Scores, and more tech terms."
        canonical="/glossary"
      />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Tech Glossary</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Clear explanations of smart home, IoT, and SaaS terminology — no jargon, no marketing.
        </p>
        <div className="space-y-4">
          {GLOSSARY_TERMS.map(({ term, slug, desc }) => (
            <Link key={slug} to={`/blog/${slug}`} className="block p-5 bg-card border rounded-xl hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-1">{term}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
