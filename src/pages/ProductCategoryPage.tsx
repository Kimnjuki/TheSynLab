import { useParams, Link } from "react-router-dom";
import { MetaTags } from "@/components/seo/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PRODUCT_CATEGORIES: Record<string, { label: string; description: string; icon: string }> = {
  "air-purifiers": {
    label: "Air Purifiers",
    description: "Compare the best air purifiers for 2026. HEPA filters, smart features, room coverage, and Trust Scores for top brands including Dyson, Coway, Blueair, Levoit, and Winix.",
    icon: "🌬️",
  },
  "docking-stations": {
    label: "Docking Stations",
    description: "Find the best laptop docking stations for 2026. Thunderbolt 4, USB-C hubs, dual monitor support, power delivery, and Trust Scores for CalDigit, Anker, Dell, and Kensington.",
    icon: "🔌",
  },
  "ergonomic-chairs": {
    label: "Ergonomic Chairs",
    description: "Compare the best ergonomic office chairs for 2026. Adjustable lumbar support, breathable mesh, headrests, and Trust Scores for Herman Miller, Steelcase, Haworth, and Branch.",
    icon: "🪑",
  },
  "mechanical-keyboards": {
    label: "Mechanical Keyboards",
    description: "Best mechanical keyboards for productivity and gaming in 2026. Switch types (Cherry MX, Gateron, Topre), hot-swappable PCBs, wireless options, and Trust Scores.",
    icon: "⌨️",
  },
  "monitor-arms": {
    label: "Monitor Arms",
    description: "Compare monitor arms and standing desk mounts for 2026. Gas spring vs mechanical, VESA compatibility, cable management, and Trust Scores for Ergotron, Humanscale, and AmazonBasics.",
    icon: "🖥️",
  },
  "monitors": {
    label: "Monitors",
    description: "Best monitors for work, productivity, and gaming in 2026. 4K, ultrawide, high refresh rate, USB-C connectivity, and Trust Scores for Dell, LG, Samsung, and Apple Studio Display.",
    icon: "🖥️",
  },
  "robot-vacuums": {
    label: "Robot Vacuums",
    description: "Compare the best robot vacuum cleaners for 2026. Lidar vs camera navigation, self-emptying, mop functions, pet hair performance, and Trust Scores for Roomba, Roborock, Dreame, and Ecovacs.",
    icon: "🤖",
  },
  "security-cameras": {
    label: "Security Cameras",
    description: "Best home security cameras for 2026. Indoor, outdoor, doorbell cameras, AI detection, privacy features, cloud vs local storage, and Trust Scores for Ring, Arlo, Eufy, and Nest.",
    icon: "📹",
  },
  "smart-doorbells": {
    label: "Smart Doorbells",
    description: "Compare smart video doorbells for 2026. 2K vs 4K resolution, package detection, battery vs wired, and Trust Scores for Ring, Nest, Eufy, Arlo, and Aqara.",
    icon: "🔔",
  },
  "smart-home-hubs": {
    label: "Smart Home Hubs",
    description: "Best smart home hubs for 2026. Matter-compatible, Thread border routers, Zigbee support, voice assistant integration, and Trust Scores for Home Assistant, Hubitat, SmartThings, and Amazon.",
    icon: "🏠",
  },
  "smart-lights": {
    label: "Smart Lights",
    description: "Compare smart light bulbs and lighting systems for 2026. RGB vs tunable white, Hue vs Nanoleaf vs Govee, HomeKit compatibility, energy efficiency, and Trust Scores.",
    icon: "💡",
  },
  "smart-locks": {
    label: "Smart Locks",
    description: "Best smart locks for home security in 2026. Keyless entry, fingerprint readers, Apple Home Key, Wi-Fi vs Thread, and Trust Scores for August, Yale, Schlage, Level, and Aqara.",
    icon: "🔒",
  },
  "smart-thermostats": {
    label: "Smart Thermostats",
    description: "Compare smart thermostats for energy savings in 2026. AI learning, geofencing, HVAC compatibility, rebate programs, and Trust Scores for Nest, ecobee, Honeywell, and Mysa.",
    icon: "🌡️",
  },
  "standing-desks": {
    label: "Standing Desks",
    description: "Best standing desks and height-adjustable desks for 2026. Dual vs single motor, desktop size options, stability at max height, and Trust Scores for Uplift, Jarvis, ApexDesk, and Vari.",
    icon: "📐",
  },
  "webcams": {
    label: "Webcams",
    description: "Compare the best webcams for video conferencing and streaming in 2026. 4K vs 1080p, autofocus, low-light performance, microphone quality, and Trust Scores for Logitech, Razer, Elgato, and Insta360.",
    icon: "🎥",
  },
  "wireless-headphones": {
    label: "Wireless Headphones",
    description: "Best wireless headphones for work and focus in 2026. Active noise cancellation, battery life, microphone quality for calls, and Trust Scores for Sony, Bose, Apple AirPods Max, and Sennheiser.",
    icon: "🎧",
  },
};

export default function ProductCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const cat = category ? PRODUCT_CATEGORIES[category] : null;

  if (!cat) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find that product category.</p>
          <Link to="/products" className="text-primary hover:underline">Browse all products →</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title={`Best ${cat.label} 2026: Reviews, Trust Scores & Buying Guide | TheSynLab`}
        description={cat.description}
        canonical={`/products/category/${category}`}
      />
      <Header />
      <main className="max-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <span className="text-5xl mb-4 block">{cat.icon}</span>
          <h1 className="text-4xl font-bold mb-3">Best {cat.label} 2026</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{cat.description}</p>
        </div>

        <div className="bg-muted/30 rounded-xl p-8 border">
          <h2 className="text-xl font-semibold mb-4">🔍 How We Test & Score {cat.label}</h2>
          <p className="text-muted-foreground mb-4">
            Every product in this category is scored using TheSynLab Trust Score methodology — 
            evaluating real-world performance, privacy & security, integration quality, 
            value for money, and customer support responsiveness. 
            Scores are updated quarterly based on independent testing.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            ← Back to all product categories
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">📊 Trust Score Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Performance (40%)", desc: `Real-world testing of ${cat.label.toLowerCase()} across key metrics — speed, reliability, build quality, and feature completeness.` },
              { title: "Privacy & Security (25%)", desc: "Data collection practices, encryption standards, cloud vs local processing, and third-party data sharing policies." },
              { title: "Value & Support (35%)", desc: "Price vs performance ratio, warranty terms, customer support responsiveness, and long-term reliability data." },
            ].map((item) => (
              <div key={item.title} className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
