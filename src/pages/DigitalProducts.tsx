import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import DigitalProductsPanel from "@/components/digital/DigitalProductsPanel";

const DigitalProducts = () => {
  return (
    <div className="min-h-screen">
      <MetaTags
        title="Reports & Templates — TheSynLab"
        description="In-depth tech stack audit reports, vendor due diligence checklists, and Notion templates from the TheSynLab research team."
        canonical="/products"
      />
      <JsonLd schema={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "TheSynLab Reports & Templates" }} />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">Reports & Templates</h1>
          <p className="text-muted-foreground mt-2">In-depth analysis, checklists, and tools for smarter tech stack decisions</p>
        </div>
        <div className="max-w-5xl mx-auto">
          <DigitalProductsPanel />
        </div>
        <section className="mt-16 border-t pt-10 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-sm text-muted-foreground">
            We're building interactive workbooks, paid micro-courses on vendor evaluation, and a premium research tier. 
            <a href="mailto:hello@thesynlab.com" className="underline ml-1">Get notified</a> when new products launch.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DigitalProducts;
