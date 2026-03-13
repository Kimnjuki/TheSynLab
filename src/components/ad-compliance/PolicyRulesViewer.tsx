import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  AlertOctagon, 
  AlertTriangle, 
  FileText, 
  Link2,
  Lock,
  Users,
  Pill,
  DollarSign,
  Vote,
  Heart,
  Type,
  MousePointer,
  User,
  Globe,
  FileCheck,
  Eye
} from "lucide-react";

interface PolicyRule {
  level_id: number;
  level_name: string;
  severity: string;
  category: string;
  keywords: string[];
  instruction: string;
  requires_certification: boolean;
  age_restriction: number | null;
}

const policyRules: PolicyRule[] = [
  // Level 1: Prohibited Content
  {
    level_id: 1,
    level_name: "Prohibited Content",
    severity: "CRITICAL",
    category: "Illegal Products & Services",
    keywords: ["drugs", "weapons", "explosives", "fake documents", "malware", "hacking software", "tobacco", "vapes"],
    instruction: "Flag any promotion, sale, or facilitation of illegal goods, recreational drugs, drug paraphernalia, weapons, ammunition, or tobacco products.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 1,
    level_name: "Prohibited Content",
    severity: "CRITICAL",
    category: "Discriminatory Practices",
    keywords: ["race", "ethnicity", "religion", "sexual orientation", "housing discrimination", "employment discrimination"],
    instruction: "Flag content that discriminates against or incites hatred toward any group based on personal attributes.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 1,
    level_name: "Prohibited Content",
    severity: "CRITICAL",
    category: "Adult Content & Nudity",
    keywords: ["pornography", "sex toys", "escort services", "strip clubs", "genitalia"],
    instruction: "Reject content showing explicit nudity, sexual acts, or excessive skin.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 1,
    level_name: "Prohibited Content",
    severity: "CRITICAL",
    category: "Misinformation & Deception",
    keywords: ["fake news", "deepfake", "guaranteed cure", "get rich quick", "pyramid scheme", "conspiracy theory"],
    instruction: "Reject false claims, doctored media, unrealistic health/financial promises, and multilevel marketing schemes.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 1,
    level_name: "Prohibited Content",
    severity: "CRITICAL",
    category: "Counterfeit Goods",
    keywords: ["replica", "knockoff", "fake", "imitation"],
    instruction: "Reject ads selling counterfeit or unauthorized replica goods that infringe on trademarks.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 1,
    level_name: "Prohibited Content",
    severity: "CRITICAL",
    category: "Malicious Software",
    keywords: ["spyware", "virus", "unauthorized download", "automatic download"],
    instruction: "Reject any destination URL that hosts malware or initiates unauthorized downloads.",
    requires_certification: false,
    age_restriction: null,
  },
  // Level 2: Restricted Content
  {
    level_id: 2,
    level_name: "Restricted Content",
    severity: "HIGH",
    category: "Alcohol",
    keywords: ["beer", "wine", "spirits", "liquor", "cocktail"],
    instruction: "Ensure target audience is of legal drinking age (18+/21+) and complies with local laws.",
    requires_certification: false,
    age_restriction: 18,
  },
  {
    level_id: 2,
    level_name: "Restricted Content",
    severity: "HIGH",
    category: "Gambling & Gaming",
    keywords: ["casino", "betting", "sportsbook", "poker", "lottery", "social casino"],
    instruction: "Require proof of license/certification. Flag for age-gating (18+).",
    requires_certification: true,
    age_restriction: 18,
  },
  {
    level_id: 2,
    level_name: "Restricted Content",
    severity: "HIGH",
    category: "Healthcare & Medicine",
    keywords: ["prescription", "pharmacy", "weight loss", "clinical trial", "botox", "telehealth"],
    instruction: "Flag for review. Prescription drugs require certification (e.g., LegitScript).",
    requires_certification: true,
    age_restriction: null,
  },
  {
    level_id: 2,
    level_name: "Restricted Content",
    severity: "HIGH",
    category: "Financial Services",
    keywords: ["crypto", "loan", "credit card", "investment", "forex"],
    instruction: "Require disclosure of fees, interest rates, and physical address.",
    requires_certification: true,
    age_restriction: null,
  },
  {
    level_id: 2,
    level_name: "Restricted Content",
    severity: "HIGH",
    category: "Political & Social Issues",
    keywords: ["election", "vote", "candidate", "social issue", "legislation"],
    instruction: "Require 'Paid for by' disclaimer and identity verification.",
    requires_certification: true,
    age_restriction: null,
  },
  {
    level_id: 2,
    level_name: "Restricted Content",
    severity: "HIGH",
    category: "Dating Services",
    keywords: ["dating app", "singles", "meet people"],
    instruction: "Flag for Adult audience targeting only.",
    requires_certification: false,
    age_restriction: 18,
  },
  // Level 3: Editorial Standards
  {
    level_id: 3,
    level_name: "Editorial & Technical Standards",
    severity: "MEDIUM",
    category: "Grammar & Professionalism",
    keywords: ["gimmicky text", "all caps", "excessive symbols", "misspelling"],
    instruction: "Flag excessive capitalization, repeated punctuation, or substituting numbers for letters.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 3,
    level_name: "Editorial & Technical Standards",
    severity: "MEDIUM",
    category: "Clickbait & Sensationalism",
    keywords: ["you wont believe", "shocking", "one weird trick", "graphic violence"],
    instruction: "Flag sensationalist language or shocking imagery used to drive clicks.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 3,
    level_name: "Editorial & Technical Standards",
    severity: "MEDIUM",
    category: "Personal Attributes",
    keywords: ["are you", "do you suffer from", "meet other"],
    instruction: "Flag text that directly asserts or implies a user's personal attributes.",
    requires_certification: false,
    age_restriction: null,
  },
  // Level 4: Landing Page
  {
    level_id: 4,
    level_name: "Destination & Landing Page",
    severity: "MEDIUM",
    category: "Functional Destination",
    keywords: ["404 error", "broken link", "under construction"],
    instruction: "Reject if the landing page does not load or returns an error code.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 4,
    level_name: "Destination & Landing Page",
    severity: "MEDIUM",
    category: "Relevance & Consistency",
    keywords: ["bait and switch", "mismatch"],
    instruction: "Ensure the product/service in the ad matches the landing page content.",
    requires_certification: false,
    age_restriction: null,
  },
  {
    level_id: 4,
    level_name: "Destination & Landing Page",
    severity: "MEDIUM",
    category: "Transparency & Privacy",
    keywords: ["privacy policy", "terms of service", "cookie notice"],
    instruction: "Verify the landing page has a visible Privacy Policy link.",
    requires_certification: false,
    age_restriction: null,
  },
];

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    "Illegal Products & Services": <Lock className="h-4 w-4" />,
    "Discriminatory Practices": <Users className="h-4 w-4" />,
    "Adult Content & Nudity": <Eye className="h-4 w-4" />,
    "Misinformation & Deception": <AlertTriangle className="h-4 w-4" />,
    "Counterfeit Goods": <Shield className="h-4 w-4" />,
    "Malicious Software": <AlertOctagon className="h-4 w-4" />,
    "Alcohol": <Pill className="h-4 w-4" />,
    "Gambling & Gaming": <DollarSign className="h-4 w-4" />,
    "Healthcare & Medicine": <Pill className="h-4 w-4" />,
    "Financial Services": <DollarSign className="h-4 w-4" />,
    "Political & Social Issues": <Vote className="h-4 w-4" />,
    "Dating Services": <Heart className="h-4 w-4" />,
    "Grammar & Professionalism": <Type className="h-4 w-4" />,
    "Clickbait & Sensationalism": <MousePointer className="h-4 w-4" />,
    "Personal Attributes": <User className="h-4 w-4" />,
    "Functional Destination": <Globe className="h-4 w-4" />,
    "Relevance & Consistency": <Link2 className="h-4 w-4" />,
    "Transparency & Privacy": <FileCheck className="h-4 w-4" />,
  };
  return iconMap[category] || <FileText className="h-4 w-4" />;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "CRITICAL": return "bg-red-500";
    case "HIGH": return "bg-orange-500";
    case "MEDIUM": return "bg-yellow-500";
    case "LOW": return "bg-blue-500";
    default: return "bg-gray-500";
  }
};

export function PolicyRulesViewer() {
  const [activeLevel, setActiveLevel] = useState("1");

  const levels = [
    { id: "1", name: "Prohibited", icon: <AlertOctagon className="h-4 w-4" />, color: "text-red-500" },
    { id: "2", name: "Restricted", icon: <AlertTriangle className="h-4 w-4" />, color: "text-orange-500" },
    { id: "3", name: "Editorial", icon: <FileText className="h-4 w-4" />, color: "text-yellow-500" },
    { id: "4", name: "Landing Page", icon: <Link2 className="h-4 w-4" />, color: "text-blue-500" },
  ];

  const filteredRules = policyRules.filter(rule => rule.level_id === parseInt(activeLevel));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Policy Guidelines
        </CardTitle>
        <CardDescription>
          Advertising compliance rules based on major platform standards (Google, Meta, TikTok, LinkedIn)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeLevel} onValueChange={setActiveLevel}>
          <TabsList className="grid w-full grid-cols-4">
            {levels.map((level) => (
              <TabsTrigger 
                key={level.id} 
                value={level.id}
                className="flex items-center gap-1 text-xs"
              >
                <span className={level.color}>{level.icon}</span>
                <span className="hidden sm:inline">{level.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {levels.map((level) => (
            <TabsContent key={level.id} value={level.id}>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {policyRules
                    .filter(rule => rule.level_id === parseInt(level.id))
                    .map((rule, index) => (
                      <div 
                        key={index}
                        className="rounded-lg border p-4 space-y-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(rule.category)}
                            <h4 className="font-medium">{rule.category}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getSeverityColor(rule.severity)}`} />
                            <span className="text-xs text-muted-foreground">{rule.severity}</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">{rule.instruction}</p>

                        <div className="flex flex-wrap gap-1">
                          {rule.keywords.slice(0, 6).map((keyword, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {rule.keywords.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{rule.keywords.length - 6} more
                            </Badge>
                          )}
                        </div>

                        {(rule.requires_certification || rule.age_restriction) && (
                          <div className="flex gap-2 pt-1">
                            {rule.requires_certification && (
                              <Badge variant="secondary" className="text-xs">
                                Certification Required
                              </Badge>
                            )}
                            {rule.age_restriction && (
                              <Badge variant="secondary" className="text-xs">
                                {rule.age_restriction}+ Only
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
