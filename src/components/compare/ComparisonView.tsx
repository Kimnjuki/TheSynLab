import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScoreBadge from "@/components/ScoreBadge";
import { IntegrationSimulator } from "@/components/scoring/IntegrationSimulator";
import type { Id } from "../../../convex/_generated/dataModel";
import { X, Share2, Download, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ComparisonViewProps {
  products: any[];
  onRemove: (idOrSlug: string) => void;
}

export function ComparisonView({ products, onRemove }: ComparisonViewProps) {
  const [showCharts, setShowCharts] = useState(false);

  const handleShare = async () => {
    const ids = products.map((p: any) => p.productSlug ?? p.product_slug ?? (p.id ?? p._id)?.toString()).filter(Boolean);
    const shareUrl = `${window.location.origin}/tools/compare?products=${ids.join(",")}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Comparison link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleExportPDF = () => {
    // Basic implementation - triggers print dialog which can save as PDF
    window.print();
    toast.info("Use your browser's print dialog to save as PDF");
  };

  // Prepare data for charts
  const trustScoreData = products.map((p: any) => ({
    product: (p.productName ?? p.product_name ?? "").substring(0, 15),
    'Data Privacy': p.nova_trust_scores?.[0]?.data_privacy_practices || 0,
    'Encryption': p.nova_trust_scores?.[0]?.encryption_standards || 0,
    'Terms': p.nova_trust_scores?.[0]?.terms_transparency || 0,
    'Ethical AI': p.nova_trust_scores?.[0]?.ethical_ai_transparency || 0,
    'Audits': p.nova_trust_scores?.[0]?.third_party_audits || 0,
  }));

  const integrationScoreData = products.map((p: any) => ({
    product: (p.productName ?? p.product_name ?? "").substring(0, 15),
    'API Docs': p.nova_integration_scores?.[0]?.api_documentation || 0,
    'Cross-Platform': p.nova_integration_scores?.[0]?.cross_platform || 0,
    'Smart Home': p.nova_integration_scores?.[0]?.smart_home_ecosystems || 0,
    'Automation': p.nova_integration_scores?.[0]?.automation_platforms || 0,
    'Community': p.nova_integration_scores?.[0]?.developer_community || 0,
  }));

  const overallScoresData = products.map((p: any) => ({
    name: (p.productName ?? p.product_name ?? "").substring(0, 15),
    Trust: p.nova_trust_scores?.[0]?.total_score || 0,
    Integration: p.nova_integration_scores?.[0]?.total_score || 0,
  }));

  return (
    <section className="bg-muted/50 border-y">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Comparing {products.length} Products</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCharts(!showCharts)}>
              {showCharts ? 'Hide' : 'Show'} Charts
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-2 font-medium">Attribute</th>
                {products.map((product: any) => (
                  <th key={product.id ?? product._id} className="py-4 px-4 min-w-[200px]">
                    <Card className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm line-clamp-2">{product.productName ?? product.product_name}</h3>
                          <p className="text-xs text-muted-foreground">{product.manufacturer}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemove((product.id ?? product._id)?.toString() ?? product.productSlug ?? "")}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {product.featured_image_url && (
                        <img 
                          src={product.featured_image_url} 
                          alt={product.product_name}
                          className="w-full h-24 object-cover rounded"
                        />
                      )}
                    </Card>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr className="border-b">
                <td className="py-4 px-2 font-medium">Price</td>
                {products.map((product) => (
                  <td key={product.id ?? product._id} className="py-4 px-4 text-center">
                    <span className="text-lg font-bold text-primary">
                      ${product.price || "N/A"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Trust Score */}
              <tr className="border-b">
                <td className="py-4 px-2 font-medium">Trust Score</td>
                {products.map((product) => (
                  <td key={product.id ?? product._id} className="py-4 px-4">
                    <div className="flex justify-center">
                      <ScoreBadge 
                        score={product.nova_trust_scores?.[0]?.total_score || 0} 
                        label="Trust" 
                        type="trust" 
                        className="p-2" 
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Integration Score */}
              <tr className="border-b">
                <td className="py-4 px-2 font-medium">Integration Score</td>
                {products.map((product) => (
                  <td key={product.id ?? product._id} className="py-4 px-4">
                    <div className="flex justify-center">
                      <ScoreBadge 
                        score={product.nova_integration_scores?.[0]?.total_score || 0} 
                        label="Integration" 
                        type="integration" 
                        className="p-2" 
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr className="border-b">
                <td className="py-4 px-2 font-medium">Category</td>
                {products.map((product) => (
                  <td key={product.id ?? product._id} className="py-4 px-4 text-center text-sm">
                    {product.category || "N/A"}
                  </td>
                ))}
              </tr>

              {/* Hub */}
              <tr className="border-b">
                <td className="py-4 px-2 font-medium">Hub</td>
                {products.map((product) => (
                  <td key={product.id ?? product._id} className="py-4 px-4 text-center text-sm capitalize">
                    {product.hub?.replace('_', ' ') || "N/A"}
                  </td>
                ))}
              </tr>

              {/* Manufacturer */}
              <tr className="border-b">
                <td className="py-4 px-2 font-medium">Manufacturer</td>
                {products.map((product) => (
                  <td key={product.id ?? product._id} className="py-4 px-4 text-center text-sm">
                    {product.manufacturer || "N/A"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {products.length === 2 && products[0]._id && products[1]._id && (
          <div className="mt-6">
            <IntegrationSimulator
              productAId={products[0]._id as Id<"novaProducts">}
              productBId={products[1]._id as Id<"novaProducts">}
              productAName={products[0].productName ?? products[0].product_name}
              productBName={products[1].productName ?? products[1].product_name}
            />
          </div>
        )}

        {/* Visual Charts Section */}
        {showCharts && (
          <div className="mt-8 space-y-8">
            <h3 className="text-xl font-semibold">Visual Comparison</h3>
            
            {/* Overall Scores Bar Chart */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Overall Scores</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overallScoresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Trust" fill="hsl(var(--primary))" />
                  <Bar dataKey="Integration" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Trust Score Components */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Trust Score Breakdown</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {trustScoreData.map((data, idx) => (
                  <div key={idx}>
                    <h5 className="text-sm font-medium mb-2 text-center">{products[idx].product_name}</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={[
                        { subject: 'Data Privacy', value: data['Data Privacy'], fullMark: 3 },
                        { subject: 'Encryption', value: data['Encryption'], fullMark: 2 },
                        { subject: 'Terms', value: data['Terms'], fullMark: 2 },
                        { subject: 'Ethical AI', value: data['Ethical AI'], fullMark: 2 },
                        { subject: 'Audits', value: data['Audits'], fullMark: 1 },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 3]} />
                        <Radar name={products[idx].product_name} dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </Card>

            {/* Integration Score Components */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Integration Score Breakdown</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {integrationScoreData.map((data, idx) => (
                  <div key={idx}>
                    <h5 className="text-sm font-medium mb-2 text-center">{products[idx].product_name}</h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={[
                        { subject: 'API Docs', value: data['API Docs'], fullMark: 3 },
                        { subject: 'Cross-Platform', value: data['Cross-Platform'], fullMark: 3 },
                        { subject: 'Smart Home', value: data['Smart Home'], fullMark: 2 },
                        { subject: 'Automation', value: data['Automation'], fullMark: 1 },
                        { subject: 'Community', value: data['Community'], fullMark: 1 },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 3]} />
                        <Radar name={products[idx].product_name} dataKey="value" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
