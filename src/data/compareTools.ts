export interface CompareTool {
  id: number;
  label: string;
  category: string;
  icon: string;
  source: string;
  format:
    | "number_out_of_10"
    | "number_out_of_3"
    | "number_out_of_2"
    | "number_out_of_1"
    | "currency"
    | "text"
    | "stars_out_of_5"
    | "count"
    | "percent"
    | "number_kwh"
    | "number_kg"
    | "number_months"
    | "date";
  winner: "highest" | "lowest" | "most_recent" | null;
  description: string;
}

export const COMPARE_TOOLS: CompareTool[] = [
  { id: 1, label: "Overall Score", category: "Scores", icon: "Star", source: "novaProducts.overallScore", format: "number_out_of_10", winner: "highest", description: "Composite score combining Trust, Integration, and performance metrics." },
  { id: 2, label: "Trust Score", category: "Scores", icon: "Shield", source: "novaTrustScores.totalScore", format: "number_out_of_10", winner: "highest", description: "Privacy, encryption, transparency, and ethical AI rating." },
  { id: 3, label: "Integration Score", category: "Scores", icon: "Zap", source: "novaIntegrationScores.totalScore", format: "number_out_of_10", winner: "highest", description: "How well the product integrates with other tools and ecosystems." },
  { id: 4, label: "Data Privacy Practices", category: "Trust Breakdown", icon: "Lock", source: "novaTrustScores.dataPrivacyPractices", format: "number_out_of_3", winner: "highest", description: "Data collection, retention, and sharing transparency." },
  { id: 5, label: "Encryption Standards", category: "Trust Breakdown", icon: "KeyRound", source: "novaTrustScores.encryptionStandards", format: "number_out_of_2", winner: "highest", description: "AES-256, TLS 1.3, end-to-end encryption rating." },
  { id: 6, label: "Ethical AI Transparency", category: "Trust Breakdown", icon: "Brain", source: "novaTrustScores.ethicalAiTransparency", format: "number_out_of_2", winner: "highest", description: "AI decision explainability and bias disclosures." },
  { id: 7, label: "Terms Transparency", category: "Trust Breakdown", icon: "FileText", source: "novaTrustScores.termsTransparency", format: "number_out_of_1", winner: "highest", description: "Clarity and fairness of terms of service." },
  { id: 8, label: "Third-Party Audits", category: "Trust Breakdown", icon: "ClipboardCheck", source: "novaTrustScores.thirdPartyAudits", format: "number_out_of_2", winner: "highest", description: "Independent security and privacy audit certifications." },
  { id: 9, label: "API Documentation Quality", category: "Integration Breakdown", icon: "Code2", source: "novaIntegrationScores.apiDocumentation", format: "number_out_of_2", winner: "highest", description: "Completeness and developer-friendliness of API docs." },
  { id: 10, label: "Smart Home Ecosystems", category: "Integration Breakdown", icon: "Home", source: "novaIntegrationScores.smartHomeEcosystems", format: "number_out_of_3", winner: "highest", description: "Apple HomeKit, Google Home, Alexa, Matter, Thread support." },
  { id: 11, label: "Automation Platforms", category: "Integration Breakdown", icon: "Workflow", source: "novaIntegrationScores.automationPlatforms", format: "number_out_of_2", winner: "highest", description: "Zapier, Make, n8n, IFTTT, Home Assistant integration." },
  { id: 12, label: "Cross-Platform Support", category: "Integration Breakdown", icon: "Monitor", source: "novaIntegrationScores.crossPlatform", format: "number_out_of_2", winner: "highest", description: "iOS, Android, Windows, macOS, Linux, Web app availability." },
  { id: 13, label: "Developer Community", category: "Integration Breakdown", icon: "Users", source: "novaIntegrationScores.developerCommunity", format: "number_out_of_1", winner: "highest", description: "GitHub activity, SDKs, third-party plugins." },
  { id: 14, label: "Price", category: "Pricing & Value", icon: "DollarSign", source: "novaProducts.price", format: "currency", winner: "lowest", description: "Current retail price in USD." },
  { id: 15, label: "Price Model", category: "Pricing & Value", icon: "CreditCard", source: "novaProducts.priceModel", format: "text", winner: null, description: "One-time, subscription, freemium, or open-source." },
  { id: 16, label: "3-Year Total Cost of Ownership", category: "Pricing & Value", icon: "TrendingUp", source: "productTcoScores.totalTco", format: "currency", winner: "lowest", description: "All-in cost over 3 years including licensing, support, and training." },
  { id: 17, label: "Year 1 Cost", category: "Pricing & Value", icon: "Calendar", source: "productTcoScores.year1Cost", format: "currency", winner: "lowest", description: "First-year total cost including setup." },
  { id: 18, label: "Eco Score", category: "Sustainability", icon: "Leaf", source: "productTcoScores.ecoScore", format: "number_out_of_10", winner: "highest", description: "Environmental impact rating based on energy, carbon, and recyclability." },
  { id: 19, label: "Energy Consumption (kWh/yr)", category: "Sustainability", icon: "Bolt", source: "productTcoScores.energyConsumptionKwh", format: "number_kwh", winner: "lowest", description: "Annual energy usage in kilowatt-hours." },
  { id: 20, label: "Carbon Footprint (kg CO₂)", category: "Sustainability", icon: "Cloud", source: "productTcoScores.carbonFootprintKg", format: "number_kg", winner: "lowest", description: "Annual carbon footprint in kilograms of CO₂ equivalent." },
  { id: 21, label: "Recyclability Score", category: "Sustainability", icon: "Recycle", source: "productTcoScores.recyclabilityScore", format: "number_out_of_10", winner: "highest", description: "End-of-life recyclability and repairability rating." },
  { id: 22, label: "User Rating", category: "Community", icon: "Star", source: "productReviews.rating (avg)", format: "stars_out_of_5", winner: "highest", description: "Aggregated verified user rating." },
  { id: 23, label: "Review Count", category: "Community", icon: "MessageSquare", source: "productReviews count", format: "count", winner: "highest", description: "Total number of approved user reviews." },
  { id: 24, label: "Verified Purchase Reviews", category: "Community", icon: "BadgeCheck", source: "productReviews.verifiedPurchase count", format: "count", winner: "highest", description: "Reviews confirmed as verified purchases." },
  { id: 25, label: "ML Predicted Score", category: "AI Insights", icon: "Bot", source: "novaIntegrationScores.mlPredictedScore", format: "number_out_of_10", winner: "highest", description: "Machine learning model's predicted future integration quality." },
  { id: 26, label: "ML Confidence", category: "AI Insights", icon: "BarChart3", source: "novaIntegrationScores.mlConfidence", format: "percent", winner: "highest", description: "Confidence level of the ML prediction model." },
  { id: 27, label: "ROI Score", category: "Business Value", icon: "TrendingUp", source: "roiCalculations.calculatedRoi", format: "percent", winner: "highest", description: "Estimated return on investment based on time savings and cost." },
  { id: 28, label: "Payback Period (months)", category: "Business Value", icon: "Clock", source: "roiCalculations.paybackPeriodMonths", format: "number_months", winner: "lowest", description: "How many months until investment pays back in productivity gains." },
  { id: 29, label: "Lab Test Date", category: "Review Quality", icon: "FlaskConical", source: "novaProducts.labTestedAt", format: "date", winner: "most_recent", description: "Date the product was last tested in TheSynLab's lab environment." },
  { id: 30, label: "Release Date", category: "Review Quality", icon: "CalendarDays", source: "novaProducts.releaseDate", format: "date", winner: null, description: "Product release date — helps identify newer vs legacy products." },
];

export const COMPARE_CATEGORIES = [...new Set(COMPARE_TOOLS.map((t) => t.category))];
