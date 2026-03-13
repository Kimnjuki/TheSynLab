import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdSubmissionForm } from "@/components/ad-compliance/AdSubmissionForm";
import { PolicyRulesViewer } from "@/components/ad-compliance/PolicyRulesViewer";
import { ComplianceDashboard } from "@/components/ad-compliance/ComplianceDashboard";
import { 
  Shield, 
  FileText, 
  BookOpen, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Lock
} from "lucide-react";

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "AI-Powered Validation",
    description: "Advanced AI analyzes your ad content against platform policies from Google, Meta, TikTok, and LinkedIn.",
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Instant Compliance Scoring",
    description: "Get a 0-100 compliance score with detailed breakdown of any policy violations.",
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "Multi-Level Severity",
    description: "Violations are categorized by severity: Critical, High, Medium, and Low for prioritized action.",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Landing Page Checks",
    description: "Automatic validation of destination URLs for functionality, privacy policies, and user experience.",
  },
];

export default function AdCompliance() {
  const [activeTab, setActiveTab] = useState("submit");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Ad Compliance System
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Validate Your Ads Before Publishing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            AI-powered compliance validation engine that checks your ad content against 
            policies from major platforms including Google, Meta, TikTok, and LinkedIn.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="submit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Submit Ad</span>
              <span className="sm:hidden">Submit</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Policy Rules</span>
              <span className="sm:hidden">Policies</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AdSubmissionForm />
              </div>
              <div className="space-y-6">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 font-semibold">How It Works</h3>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
                      <span>Enter your ad title, description, and content</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
                      <span>Optionally add your landing page URL for validation</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
                      <span>Our AI analyzes content against platform policies</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">4</span>
                      <span>Review compliance score and any violations</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">5</span>
                      <span>Fix issues and resubmit for approval</span>
                    </li>
                  </ol>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 font-semibold">Compliance Levels</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="font-medium">Level 1:</span>
                      <span className="text-muted-foreground">Prohibited Content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />
                      <span className="font-medium">Level 2:</span>
                      <span className="text-muted-foreground">Restricted Content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <span className="font-medium">Level 3:</span>
                      <span className="text-muted-foreground">Editorial Standards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="font-medium">Level 4:</span>
                      <span className="text-muted-foreground">Landing Page</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies">
            <PolicyRulesViewer />
          </TabsContent>

          <TabsContent value="dashboard">
            <ComplianceDashboard />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
