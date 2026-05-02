import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Star, Shield, Layers, HelpCircle, BarChart3, Brain, Clock, Target, Globe, Sparkles, Eye, DollarSign, History, ArrowRight } from "lucide-react";
import DeviceReviewsView, { DeviceReview } from "@/components/intelligent-home/DeviceReviewsView";
import SecurityGuidesView, { SecurityGuide } from "@/components/intelligent-home/SecurityGuidesView";
import EcosystemComparisonView, { Ecosystem } from "@/components/intelligent-home/EcosystemComparisonView";
import TroubleshootingView, { TroubleshootingIssue } from "@/components/intelligent-home/TroubleshootingView";
import AnalyticsDashboard from "@/components/intelligent-home/AnalyticsDashboard";
import SentimentAnalysis from "@/components/intelligent-home/SentimentAnalysis";
import LongTermTestingView from "@/components/intelligent-home/LongTermTestingView";
import MLMatchmaker from "@/components/intelligent-home/MLMatchmaker";
import CompetitiveIntelPanel from "@/components/intelligent-home/CompetitiveIntelPanel";
import EcosystemSelector from "@/components/intelligent-home/EcosystemSelector";
import PrivacyScorecard from "@/components/intelligent-home/PrivacyScorecard";
import CostCalculator from "@/components/intelligent-home/CostCalculator";
import LongevityTracker from "@/components/intelligent-home/LongevityTracker";
import MigrationGuide from "@/components/intelligent-home/MigrationGuide";

// Device Reviews Data
const deviceReviews: DeviceReview[] = [
  { id: 1, name: "Philips Hue Bridge v3", category: "Hub", image: "", rating: 4.5, reviewCount: 2847, trustScore: 8.8, integrationScore: 9.2, price: "$59.99", priceValue: 59.99, pros: ["Excellent ecosystem", "Matter support"], cons: ["Requires bridge"], protocols: ["Zigbee", "Matter", "Thread", "WiFi"], ecosystems: ["HomeKit", "Alexa", "Google"], featured: true, releaseDate: "2023-06-15", brand: "Philips" },
  { id: 2, name: "Ecobee Smart Thermostat Premium", category: "Climate", image: "", rating: 4.7, reviewCount: 1523, trustScore: 8.2, integrationScore: 8.5, price: "$249.99", priceValue: 249.99, pros: ["Built-in Alexa", "Room sensors"], cons: ["Pricey"], protocols: ["WiFi", "Matter"], ecosystems: ["HomeKit", "Alexa", "Google", "SmartThings"], featured: true, releaseDate: "2023-09-01", brand: "Ecobee" },
  { id: 3, name: "Yale Assure Lock 2", category: "Security", image: "", rating: 4.4, reviewCount: 892, trustScore: 9.1, integrationScore: 8.8, price: "$279.99", priceValue: 279.99, pros: ["Excellent security", "Multiple unlock methods"], cons: ["Battery dependent"], protocols: ["Matter", "Thread", "Z-Wave"], ecosystems: ["HomeKit", "Alexa", "Google"], releaseDate: "2023-04-20", brand: "Yale" },
  { id: 4, name: "Nanoleaf Shapes", category: "Lighting", image: "", rating: 4.3, reviewCount: 1205, trustScore: 7.5, integrationScore: 8.2, price: "$199.99", priceValue: 199.99, pros: ["Stunning visuals", "Thread border router"], cons: ["Expensive per panel"], protocols: ["Thread", "WiFi", "Matter"], ecosystems: ["HomeKit", "Alexa", "Google"], releaseDate: "2022-11-10", brand: "Nanoleaf" },
  { id: 5, name: "Eve Energy", category: "Plug", image: "", rating: 4.6, reviewCount: 654, trustScore: 9.5, integrationScore: 7.8, price: "$39.99", priceValue: 39.99, pros: ["No cloud required", "Privacy-focused"], cons: ["HomeKit first"], protocols: ["Thread", "Matter"], ecosystems: ["HomeKit", "Google", "Alexa"], featured: true, releaseDate: "2023-02-28", brand: "Eve" },
  { id: 6, name: "Arlo Pro 5S", category: "Camera", image: "", rating: 4.2, reviewCount: 1876, trustScore: 7.2, integrationScore: 7.5, price: "$249.99", priceValue: 249.99, pros: ["2K HDR", "Color night vision"], cons: ["Subscription needed"], protocols: ["WiFi"], ecosystems: ["HomeKit", "Alexa", "Google"], releaseDate: "2023-08-05", brand: "Arlo" },
  { id: 7, name: "Sonos Era 100", category: "Speaker", image: "", rating: 4.5, reviewCount: 2341, trustScore: 7.8, integrationScore: 8.0, price: "$249.00", priceValue: 249.00, pros: ["Excellent sound", "Voice assistants"], cons: ["Ecosystem lock-in"], protocols: ["WiFi", "Bluetooth"], ecosystems: ["Alexa", "Google", "Sonos"], releaseDate: "2023-03-28", brand: "Sonos" },
  { id: 8, name: "Aqara Hub M2", category: "Hub", image: "", rating: 4.4, reviewCount: 987, trustScore: 8.0, integrationScore: 8.5, price: "$49.99", priceValue: 49.99, pros: ["IR blaster included", "Affordable"], cons: ["Zigbee only"], protocols: ["Zigbee", "WiFi", "IR"], ecosystems: ["HomeKit", "Alexa", "Google"], releaseDate: "2022-07-15", brand: "Aqara" },
];

// Security Guides Data
const securityGuides: SecurityGuide[] = [
  { id: 1, title: "Securing Your Smart Home Network", description: "Essential steps to protect your IoT devices from hackers.", category: "network", difficulty: "beginner", readTime: 8, steps: 6, urgency: "high", updated: "2024-01-10" },
  { id: 2, title: "Privacy Settings for Smart Speakers", description: "Configure Alexa, Google Home, and HomePod to minimize data collection.", category: "privacy", difficulty: "beginner", readTime: 5, steps: 4, urgency: "medium", updated: "2024-01-08" },
  { id: 3, title: "Setting Up a VLAN for IoT Devices", description: "Isolate your smart home devices on a separate network.", category: "network", difficulty: "advanced", readTime: 15, steps: 10, urgency: "low", updated: "2024-01-05" },
  { id: 4, title: "Two-Factor Authentication for Smart Home Apps", description: "Enable 2FA across all your smart home platforms.", category: "device", difficulty: "beginner", readTime: 6, steps: 5, urgency: "high", updated: "2024-01-12" },
  { id: 5, title: "Data Backup for Home Automation", description: "Protect your automations with proper backup strategies.", category: "data", difficulty: "intermediate", readTime: 10, steps: 7, urgency: "medium", updated: "2024-01-03" },
  { id: 6, title: "Reviewing Device Permissions", description: "Audit what data your smart devices collect.", category: "privacy", difficulty: "intermediate", readTime: 12, steps: 8, urgency: "medium", updated: "2024-01-07" },
];

// Ecosystems Data
const ecosystemsData: Ecosystem[] = [
  { id: "homekit", name: "Apple HomeKit", logo: "🍎", rating: 4.5, deviceCount: 800, matterSupport: "full", threadSupport: "full", localControl: true, privacyScore: 9.5, priceRange: "$$$", pros: ["Best privacy", "Local control", "Secure enclave"], cons: ["Limited device support", "Expensive"], bestFor: "Privacy-conscious Apple users", setupDifficulty: "easy", voiceAssistants: ["Siri"] },
  { id: "google", name: "Google Home", logo: "🔵", rating: 4.2, deviceCount: 5000, matterSupport: "full", threadSupport: "full", localControl: false, privacyScore: 6.0, priceRange: "$$", pros: ["Huge ecosystem", "Great voice AI"], cons: ["Cloud dependent", "Privacy concerns"], bestFor: "Android users wanting wide compatibility", setupDifficulty: "easy", voiceAssistants: ["Google Assistant"] },
  { id: "alexa", name: "Amazon Alexa", logo: "🔷", rating: 4.3, deviceCount: 10000, matterSupport: "full", threadSupport: "partial", localControl: false, privacyScore: 5.5, priceRange: "$", pros: ["Largest ecosystem", "Best skills"], cons: ["Ad integration", "Privacy issues"], bestFor: "Budget-conscious users wanting max compatibility", setupDifficulty: "easy", voiceAssistants: ["Alexa"] },
  { id: "smartthings", name: "SmartThings", logo: "⚡", rating: 4.0, deviceCount: 3000, matterSupport: "full", threadSupport: "full", localControl: true, privacyScore: 7.5, priceRange: "$$", pros: ["Protocol agnostic", "Advanced automations"], cons: ["Learning curve"], bestFor: "Power users wanting flexibility", setupDifficulty: "medium", voiceAssistants: ["Alexa", "Google Assistant", "Bixby"] },
  { id: "homeassistant", name: "Home Assistant", logo: "🏠", rating: 4.8, deviceCount: 2500, matterSupport: "full", threadSupport: "full", localControl: true, privacyScore: 10.0, priceRange: "$", pros: ["Full local control", "Open source"], cons: ["Technical setup", "Self-managed"], bestFor: "Tech enthusiasts wanting full control", setupDifficulty: "hard", voiceAssistants: ["All"] },
];

// Troubleshooting Issues Data
const troubleshootingIssues: TroubleshootingIssue[] = [
  { id: 1, title: "Hue lights not responding after power outage", description: "Philips Hue bulbs show as unreachable after a power outage.", category: "Connectivity", device: "Philips Hue", ecosystem: "All", solution: ["Power cycle the Hue Bridge for 30 seconds", "Wait 2-3 minutes for full restart", "Toggle physical switch off/on", "Run 'Search for lights' in app", "Reset bulbs by toggling power 5 times rapidly"], tags: ["Philips Hue", "connectivity", "power outage"], votes: 847, views: 12503, resolved: 94, createdAt: "2024-01-10" },
  { id: 2, title: "Matter device pairing fails with timeout", description: "Pairing process times out before completion.", category: "Setup", device: "Matter Devices", ecosystem: "All", solution: ["Ensure phone is on 2.4GHz WiFi", "Move device closer to router", "Disable VPN", "Force close app and restart", "Factory reset device"], tags: ["Matter", "pairing", "timeout"], votes: 523, views: 8762, resolved: 87, createdAt: "2024-01-08" },
  { id: 3, title: "Thread border router not forming mesh", description: "Thread devices aren't connecting through mesh properly.", category: "Networking", device: "Thread Devices", ecosystem: "All", solution: ["Verify Thread border router exists", "Place router within 30 feet", "Update firmware", "Re-add Thread devices", "Wait 15 minutes for optimization"], tags: ["Thread", "mesh", "border router"], votes: 312, views: 5421, resolved: 82, createdAt: "2024-01-05" },
  { id: 4, title: "Smart lock responds slowly in HomeKit", description: "Lock takes 5-10 seconds to respond via HomeKit.", category: "Performance", device: "Smart Locks", ecosystem: "HomeKit", solution: ["Ensure good Bluetooth range to home hub", "Update lock firmware", "Remove and re-pair lock", "Restart Apple TV or HomePod", "Consider Thread-enabled lock"], tags: ["HomeKit", "smart lock", "latency"], votes: 445, views: 7234, resolved: 79, createdAt: "2024-01-03" },
  { id: 5, title: "Alexa routines not triggering at scheduled time", description: "Scheduled routines fail to run or run at wrong times.", category: "Automation", device: "Echo Devices", ecosystem: "Alexa", solution: ["Check device timezone", "Verify Echo is online", "Delete and recreate routine", "Check Do Not Disturb schedule", "Verify trigger conditions"], tags: ["Alexa", "routines", "scheduling"], votes: 289, views: 6543, resolved: 91, createdAt: "2024-01-01" },
];

import { MetaTags } from "@/components/seo/MetaTags";

const IntelligentHomeHub = () => {
  const avgTrustScore = deviceReviews.reduce((acc, d) => acc + d.trustScore, 0) / deviceReviews.length;
  const avgIntegrationScore = deviceReviews.reduce((acc, d) => acc + d.integrationScore, 0) / deviceReviews.length;
  const totalReviews = deviceReviews.reduce((acc, d) => acc + d.reviewCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Intelligent Home Hub 2026 | Smart Home Device Reviews & Trust Scores"
        description="Find the best smart home devices with expert reviews, Trust Scores, and ecosystem comparison. Compare Zigbee, Thread, Z-Wave devices and build your connected home."
        canonical="/hub/intelligent-home"
        ogType="website"
      />
      <Header />
      <main className="container py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg">
              <Home className="h-7 w-7 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Intelligent Home Hub</h1>
              <p className="text-muted-foreground">
                Enterprise-grade device analysis, ML matchmaking & competitive intelligence
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="selector" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 h-auto p-1">
            <TabsTrigger value="selector" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Selector</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="ecosystems" className="gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Ecosystems</span>
            </TabsTrigger>
            <TabsTrigger value="cost" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Cost</span>
            </TabsTrigger>
            <TabsTrigger value="longevity" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Longevity</span>
            </TabsTrigger>
            <TabsTrigger value="migration" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              <span className="hidden sm:inline">Migration</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="troubleshoot" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Troubleshoot</span>
            </TabsTrigger>
            <TabsTrigger value="intel" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Intel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selector">
            <EcosystemSelector />
          </TabsContent>

          <TabsContent value="reviews">
            <DeviceReviewsView devices={deviceReviews} onViewDetails={(d) => console.log(d)} />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacyScorecard />
          </TabsContent>

          <TabsContent value="ecosystems">
            <EcosystemComparisonView ecosystems={ecosystemsData} />
          </TabsContent>

          <TabsContent value="cost">
            <CostCalculator />
          </TabsContent>

          <TabsContent value="longevity">
            <LongevityTracker />
          </TabsContent>

          <TabsContent value="migration">
            <MigrationGuide />
          </TabsContent>

          <TabsContent value="security">
            <SecurityGuidesView guides={securityGuides} />
          </TabsContent>

          <TabsContent value="troubleshoot">
            <TroubleshootingView issues={troubleshootingIssues} />
          </TabsContent>

          <TabsContent value="intel">
            <CompetitiveIntelPanel />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default IntelligentHomeHub;
