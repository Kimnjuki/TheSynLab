import { useState } from "react";
import { 
  Shield, Eye, Database, Lock, FileText, AlertTriangle, 
  Check, X, ChevronDown, ChevronUp, ExternalLink, Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PrivacyCategory {
  name: string;
  score: number;
  icon: React.ReactNode;
  items: { label: string; status: 'good' | 'warning' | 'bad'; detail: string }[];
}

interface PlatformPrivacy {
  id: string;
  name: string;
  logo: string;
  overallScore: number;
  tier: string;
  lastUpdated: string;
  categories: PrivacyCategory[];
  dataCollected: string[];
  dataNotCollected: string[];
  thirdPartySharing: { entity: string; purpose: string; optOut: boolean }[];
  retentionPolicy: string;
  encryptionType: string;
  breachHistory: { date: string; severity: string; affected: string }[];
}

const platforms: PlatformPrivacy[] = [
  {
    id: 'homeassistant',
    name: 'Home Assistant',
    logo: '🏠',
    overallScore: 10,
    tier: 'Tier 1 (Privacy Champion)',
    lastUpdated: '2026-01-15',
    categories: [
      {
        name: 'Data Collection',
        score: 10,
        icon: <Database className="h-4 w-4" />,
        items: [
          { label: 'No cloud data collection', status: 'good', detail: 'All data stays local on your hardware' },
          { label: 'No usage telemetry', status: 'good', detail: 'Opt-in analytics only' },
          { label: 'No voice recordings stored', status: 'good', detail: 'Local voice processing available' },
        ]
      },
      {
        name: 'Data Storage',
        score: 10,
        icon: <Lock className="h-4 w-4" />,
        items: [
          { label: '100% local storage', status: 'good', detail: 'Your server, your data' },
          { label: 'Encrypted backups', status: 'good', detail: 'AES-256 encryption supported' },
          { label: 'User-controlled retention', status: 'good', detail: 'Configure exactly how long data is kept' },
        ]
      },
      {
        name: 'Third-Party Access',
        score: 10,
        icon: <Eye className="h-4 w-4" />,
        items: [
          { label: 'No third-party data sharing', status: 'good', detail: 'Data never leaves your network' },
          { label: 'Open source auditable', status: 'good', detail: 'Anyone can verify the code' },
          { label: 'No advertising partnerships', status: 'good', detail: 'No ads, no ad tracking' },
        ]
      },
      {
        name: 'Transparency',
        score: 10,
        icon: <FileText className="h-4 w-4" />,
        items: [
          { label: 'Open source codebase', status: 'good', detail: 'Full visibility into what runs' },
          { label: 'Community governance', status: 'good', detail: 'Decisions made by the community' },
          { label: 'Clear documentation', status: 'good', detail: 'Every feature is documented' },
        ]
      },
    ],
    dataCollected: [],
    dataNotCollected: ['Voice recordings', 'Location data', 'Usage patterns', 'Device identifiers', 'Personal information'],
    thirdPartySharing: [],
    retentionPolicy: 'User configured - typically 1-90 days',
    encryptionType: 'AES-256 (user configured)',
    breachHistory: [],
  },
  {
    id: 'homekit',
    name: 'Apple HomeKit',
    logo: '🍎',
    overallScore: 9.2,
    tier: 'Tier 2 (Privacy Focused)',
    lastUpdated: '2026-01-14',
    categories: [
      {
        name: 'Data Collection',
        score: 9,
        icon: <Database className="h-4 w-4" />,
        items: [
          { label: 'Minimal data collection', status: 'good', detail: 'Only essential operational data' },
          { label: 'Local Siri processing', status: 'good', detail: 'Most voice commands processed on-device' },
          { label: 'Anonymous analytics', status: 'warning', detail: 'Opt-in diagnostic data shared' },
        ]
      },
      {
        name: 'Data Storage',
        score: 9.5,
        icon: <Lock className="h-4 w-4" />,
        items: [
          { label: 'End-to-end encryption', status: 'good', detail: 'iCloud Keychain encryption' },
          { label: 'Secure Enclave', status: 'good', detail: 'Hardware-level security' },
          { label: 'Private Cloud Compute', status: 'good', detail: 'Encrypted cloud processing (iOS 19+)' },
        ]
      },
      {
        name: 'Third-Party Access',
        score: 9,
        icon: <Eye className="h-4 w-4" />,
        items: [
          { label: 'No data selling', status: 'good', detail: 'Apple never sells user data' },
          { label: 'Limited app access', status: 'good', detail: 'Apps get minimal necessary data' },
          { label: 'HomeKit Secure Video', status: 'good', detail: 'Video analyzed locally, stored encrypted' },
        ]
      },
      {
        name: 'Transparency',
        score: 9,
        icon: <FileText className="h-4 w-4" />,
        items: [
          { label: 'Privacy labels', status: 'good', detail: 'Clear app privacy info' },
          { label: 'Transparency reports', status: 'good', detail: 'Regular government request disclosures' },
          { label: 'Closed source', status: 'warning', detail: 'Cannot independently verify code' },
        ]
      },
    ],
    dataCollected: ['Device identifiers (anonymized)', 'HomeKit sync data (encrypted)'],
    dataNotCollected: ['Voice recordings (processed locally)', 'Advertising profiles', 'Browsing history', 'Location history'],
    thirdPartySharing: [
      { entity: 'iCloud', purpose: 'Encrypted sync', optOut: false },
    ],
    retentionPolicy: '30 days for analytics, encrypted indefinitely for sync',
    encryptionType: 'AES-256 with end-to-end encryption',
    breachHistory: [],
  },
  {
    id: 'alexa',
    name: 'Amazon Alexa',
    logo: '🔶',
    overallScore: 4.5,
    tier: 'Tier 3 (Privacy Concerns)',
    lastUpdated: '2026-01-13',
    categories: [
      {
        name: 'Data Collection',
        score: 3,
        icon: <Database className="h-4 w-4" />,
        items: [
          { label: 'Voice recordings stored', status: 'bad', detail: 'Recordings kept and used for training' },
          { label: 'Extensive usage tracking', status: 'bad', detail: 'All interactions logged' },
          { label: 'Device fingerprinting', status: 'bad', detail: 'Detailed device and network data' },
        ]
      },
      {
        name: 'Data Storage',
        score: 5,
        icon: <Lock className="h-4 w-4" />,
        items: [
          { label: 'Cloud-only processing', status: 'bad', detail: 'All data sent to Amazon servers' },
          { label: 'Encrypted in transit', status: 'good', detail: 'TLS encryption for data transfer' },
          { label: 'Manual deletion required', status: 'warning', detail: 'Must actively delete history' },
        ]
      },
      {
        name: 'Third-Party Access',
        score: 4,
        icon: <Eye className="h-4 w-4" />,
        items: [
          { label: 'Data used for advertising', status: 'bad', detail: 'Informs Amazon ad targeting' },
          { label: 'Model training', status: 'bad', detail: 'Voice data used to improve Alexa' },
          { label: 'Skill data sharing', status: 'warning', detail: 'Third-party skills may access data' },
        ]
      },
      {
        name: 'Transparency',
        score: 6,
        icon: <FileText className="h-4 w-4" />,
        items: [
          { label: 'Privacy dashboard', status: 'good', detail: 'Can view and delete recordings' },
          { label: 'Opt-out options', status: 'warning', detail: 'Limited but available' },
          { label: 'Complex privacy policy', status: 'warning', detail: 'Difficult to understand fully' },
        ]
      },
    ],
    dataCollected: ['Voice recordings', 'Usage patterns', 'Device information', 'WiFi network data', 'Purchase history', 'Music preferences'],
    dataNotCollected: [],
    thirdPartySharing: [
      { entity: 'Amazon Ads', purpose: 'Advertising targeting', optOut: true },
      { entity: 'Alexa Skills', purpose: 'Skill functionality', optOut: true },
      { entity: 'Amazon ML', purpose: 'Model improvement', optOut: true },
    ],
    retentionPolicy: 'Indefinite unless manually deleted',
    encryptionType: 'TLS in transit, encrypted at rest',
    breachHistory: [
      { date: '2019-04', severity: 'Medium', affected: 'Voice recordings exposed to contractors' },
    ],
  },
  {
    id: 'google',
    name: 'Google Home',
    logo: '🔵',
    overallScore: 5.0,
    tier: 'Tier 3 (Privacy Concerns)',
    lastUpdated: '2026-01-12',
    categories: [
      {
        name: 'Data Collection',
        score: 4,
        icon: <Database className="h-4 w-4" />,
        items: [
          { label: 'Voice activity recorded', status: 'bad', detail: 'Audio stored in activity history' },
          { label: 'Home activity tracking', status: 'bad', detail: 'All home actions logged' },
          { label: 'Cross-service profiling', status: 'bad', detail: 'Combined with other Google data' },
        ]
      },
      {
        name: 'Data Storage',
        score: 6,
        icon: <Lock className="h-4 w-4" />,
        items: [
          { label: 'Cloud processing', status: 'bad', detail: 'All commands sent to Google' },
          { label: 'Strong encryption', status: 'good', detail: 'Enterprise-grade security' },
          { label: 'Auto-delete options', status: 'warning', detail: '3, 18, or 36 month auto-delete' },
        ]
      },
      {
        name: 'Third-Party Access',
        score: 4,
        icon: <Eye className="h-4 w-4" />,
        items: [
          { label: 'Advertising integration', status: 'bad', detail: 'Data informs ad personalization' },
          { label: 'Partner data sharing', status: 'warning', detail: 'Works actions may share data' },
          { label: 'Google services linking', status: 'warning', detail: 'Connected to full Google profile' },
        ]
      },
      {
        name: 'Transparency',
        score: 6,
        icon: <FileText className="h-4 w-4" />,
        items: [
          { label: 'Activity controls', status: 'good', detail: 'Granular privacy controls' },
          { label: 'Takeout export', status: 'good', detail: 'Can download all data' },
          { label: 'Privacy checkup', status: 'good', detail: 'Regular privacy review prompts' },
        ]
      },
    ],
    dataCollected: ['Voice recordings', 'Search queries', 'Location data', 'Device info', 'Usage patterns', 'Connected accounts'],
    dataNotCollected: [],
    thirdPartySharing: [
      { entity: 'Google Ads', purpose: 'Personalized advertising', optOut: true },
      { entity: 'Partner services', purpose: 'Integration features', optOut: true },
    ],
    retentionPolicy: 'Configurable: 3, 18, or 36 months',
    encryptionType: 'AES-256 with perfect forward secrecy',
    breachHistory: [
      { date: '2019-07', severity: 'Low', affected: 'Contractors reviewed voice recordings' },
    ],
  },
];

const PrivacyScorecard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(platforms[0].id);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Data Collection']);

  const platform = platforms.find(p => p.id === selectedPlatform) || platforms[0];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-accent';
    if (score >= 4) return 'text-orange-500';
    return 'text-destructive';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-success/10 border-success/30';
    if (score >= 6) return 'bg-accent/10 border-accent/30';
    if (score >= 4) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-destructive/10 border-destructive/30';
  };

  const getTierColor = (tier: string) => {
    if (tier.includes('1')) return 'bg-success text-success-foreground';
    if (tier.includes('2')) return 'bg-primary text-primary-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Platform Selector */}
        <div className="flex flex-wrap gap-3">
          {platforms.map((p) => (
            <Button
              key={p.id}
              variant={selectedPlatform === p.id ? "default" : "outline"}
              onClick={() => setSelectedPlatform(p.id)}
              className="gap-2"
            >
              <span className="text-lg">{p.logo}</span>
              {p.name}
            </Button>
          ))}
        </div>

        {/* Overall Score Card */}
        <Card className={`border-2 ${getScoreBg(platform.overallScore)}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{platform.logo}</div>
                <div>
                  <h2 className="text-2xl font-bold">{platform.name}</h2>
                  <Badge className={getTierColor(platform.tier)}>{platform.tier}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {platform.lastUpdated}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(platform.overallScore)}`}>
                  {platform.overallScore}/10
                </div>
                <p className="text-sm text-muted-foreground">Privacy Score</p>
                <div className="w-48 mt-2">
                  <Progress 
                    value={platform.overallScore * 10} 
                    className="h-3"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detailed Assessment</h3>
          {platform.categories.map((category) => (
            <Collapsible
              key={category.name}
              open={expandedCategories.includes(category.name)}
              onOpenChange={() => toggleCategory(category.name)}
            >
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getScoreBg(category.score)}`}>
                        {category.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.items.filter(i => i.status === 'good').length}/{category.items.length} criteria met
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}/10
                      </div>
                      {expandedCategories.includes(category.name) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t border-border pt-4 space-y-3">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {item.status === 'good' && <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />}
                          {item.status === 'warning' && <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />}
                          {item.status === 'bad' && <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* Data Collection Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              {platform.dataCollected.length === 0 ? (
                <p className="text-success flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  No data collected
                </p>
              ) : (
                <ul className="space-y-2">
                  {platform.dataCollected.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <X className="h-4 w-4 text-destructive shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Data NOT Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              {platform.dataNotCollected.length === 0 ? (
                <p className="text-muted-foreground text-sm">No explicit non-collection guarantees</p>
              ) : (
                <ul className="space-y-2">
                  {platform.dataNotCollected.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Third Party Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Third-Party Data Sharing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {platform.thirdPartySharing.length === 0 ? (
              <p className="text-success flex items-center gap-2">
                <Check className="h-4 w-4" />
                No third-party data sharing
              </p>
            ) : (
              <div className="space-y-3">
                {platform.thirdPartySharing.map((sharing, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{sharing.entity}</p>
                      <p className="text-sm text-muted-foreground">{sharing.purpose}</p>
                    </div>
                    <Badge variant={sharing.optOut ? "outline" : "secondary"}>
                      {sharing.optOut ? "Opt-out available" : "Required"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Data Retention</p>
              <p className="font-medium">{platform.retentionPolicy}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Encryption</p>
              <p className="font-medium">{platform.encryptionType}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Security Incidents</p>
              <p className={`font-medium ${platform.breachHistory.length === 0 ? 'text-success' : 'text-destructive'}`}>
                {platform.breachHistory.length === 0 ? 'None reported' : `${platform.breachHistory.length} incident(s)`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PrivacyScorecard;
