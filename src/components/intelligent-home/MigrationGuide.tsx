import { useState } from "react";
import { 
  ArrowRight, Check, AlertTriangle, Clock, DollarSign, 
  ChevronDown, ChevronUp, Lightbulb, Wrench, FileText, ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MigrationStep {
  title: string;
  description: string;
  duration: string;
  tips: string[];
  warnings?: string[];
}

interface MigrationPath {
  from: string;
  fromLogo: string;
  to: string;
  toLogo: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  estimatedCost: string;
  compatibleDevices: number;
  incompatibleDevices: string[];
  steps: MigrationStep[];
  automationNotes: string;
  benefits: string[];
  tradeoffs: string[];
}

const migrationPaths: MigrationPath[] = [
  {
    from: 'Amazon Alexa',
    fromLogo: '🔷',
    to: 'Apple HomeKit',
    toLogo: '🍎',
    difficulty: 'medium',
    estimatedTime: '2-4 hours',
    estimatedCost: '$100-300',
    compatibleDevices: 65,
    incompatibleDevices: ['Ring Doorbell (limited)', 'Echo Devices', 'Amazon Smart Plugs', 'Blink Cameras'],
    steps: [
      {
        title: 'Inventory your current devices',
        description: 'List all devices connected to Alexa and check HomeKit compatibility',
        duration: '15 min',
        tips: ['Use the Home app to scan for compatible devices', 'Check manufacturer websites for HomeKit support'],
        warnings: ['Ring devices will have limited functionality']
      },
      {
        title: 'Set up a Home Hub',
        description: 'You need an Apple TV, HomePod, or iPad as a home hub',
        duration: '10 min',
        tips: ['Apple TV 4K is recommended for best performance', 'HomePod Mini is the most affordable option'],
      },
      {
        title: 'Add compatible devices to HomeKit',
        description: 'Scan HomeKit codes or use manufacturer apps to add devices',
        duration: '30-60 min',
        tips: ['Some devices require a factory reset before adding', 'Add devices one at a time for best results'],
        warnings: ['WiFi devices may need to be on 2.4GHz network']
      },
      {
        title: 'Recreate automations',
        description: 'Rebuild your Alexa Routines as HomeKit automations',
        duration: '30-60 min',
        tips: ['HomeKit automations can be triggered by location, time, or sensor', 'Use Shortcuts app for complex automations'],
      },
      {
        title: 'Test and troubleshoot',
        description: 'Verify all devices work correctly and automations trigger properly',
        duration: '30 min',
        tips: ['Test each device individually', 'Check automations at different times'],
      }
    ],
    automationNotes: 'HomeKit automations are more limited than Alexa Routines but more reliable. For complex automations, use the Shortcuts app or consider Home Assistant as an intermediary.',
    benefits: ['End-to-end encryption', 'Local processing', 'Better privacy', 'Seamless Apple device integration'],
    tradeoffs: ['Fewer compatible devices', 'Higher hardware costs', 'Less voice assistant flexibility']
  },
  {
    from: 'Google Home',
    fromLogo: '🔵',
    to: 'Home Assistant',
    toLogo: '🏠',
    difficulty: 'hard',
    estimatedTime: '4-8 hours',
    estimatedCost: '$100-150',
    compatibleDevices: 95,
    incompatibleDevices: ['Nest Cameras (cloud features only)', 'Some Nest thermostats (older models)'],
    steps: [
      {
        title: 'Set up Home Assistant hardware',
        description: 'Install Home Assistant on a Raspberry Pi, NUC, or purchase Home Assistant Green',
        duration: '30-60 min',
        tips: ['Home Assistant Green is the easiest option', 'NUC provides best performance'],
        warnings: ['SD cards can fail - use SSD if using Raspberry Pi']
      },
      {
        title: 'Configure networking',
        description: 'Set a static IP and configure port forwarding if needed',
        duration: '15-30 min',
        tips: ['Consider Nabu Casa for easy remote access', 'Static IP prevents connection issues'],
      },
      {
        title: 'Add integrations',
        description: 'Add Google Home, Nest, and other device integrations',
        duration: '30-60 min',
        tips: ['Most integrations are automatic', 'Check the Home Assistant community for device-specific guides'],
        warnings: ['Google/Nest integration requires developer console setup']
      },
      {
        title: 'Migrate automations',
        description: 'Recreate Google Home routines in Home Assistant',
        duration: '1-2 hours',
        tips: ['Home Assistant automations are more powerful', 'Use the automation editor or write YAML'],
      },
      {
        title: 'Add local voice control (optional)',
        description: 'Set up local voice processing with Whisper and Piper',
        duration: '30-60 min',
        tips: ['Requires decent hardware', 'Start with cloud TTS then migrate'],
      },
      {
        title: 'Test and optimize',
        description: 'Test all devices and optimize response times',
        duration: '1-2 hours',
        tips: ['Use the developer tools to test entities', 'Check the logs for errors'],
      }
    ],
    automationNotes: 'Home Assistant automations are extremely powerful but have a learning curve. You can trigger on almost any condition and perform complex logic. The Node-RED add-on provides a visual programming option.',
    benefits: ['100% local control', 'Maximum privacy', 'Most integrations available', 'Highly customizable'],
    tradeoffs: ['Steep learning curve', 'Requires maintenance', 'Self-hosted responsibility']
  },
  {
    from: 'SmartThings',
    fromLogo: '⚡',
    to: 'Home Assistant',
    toLogo: '🏠',
    difficulty: 'medium',
    estimatedTime: '3-5 hours',
    estimatedCost: '$100-150',
    compatibleDevices: 98,
    incompatibleDevices: ['SmartThings-only devices (rare)'],
    steps: [
      {
        title: 'Set up Home Assistant',
        description: 'Install Home Assistant on your preferred hardware',
        duration: '30-60 min',
        tips: ['Home Assistant Green is recommended', 'Consider a Zigbee/Z-Wave coordinator'],
      },
      {
        title: 'Add SmartThings integration',
        description: 'Connect your SmartThings hub to Home Assistant',
        duration: '15 min',
        tips: ['This allows gradual migration', 'Devices will appear in both systems'],
      },
      {
        title: 'Add Zigbee/Z-Wave coordinator',
        description: 'If migrating fully, add a coordinator like Sonoff Zigbee 3.0 or Zooz Z-Wave',
        duration: '30 min',
        tips: ['ZHA or Zigbee2MQTT for Zigbee', 'Z-Wave JS for Z-Wave'],
        warnings: ['You may need to re-pair devices']
      },
      {
        title: 'Migrate devices to local coordinator',
        description: 'Move Zigbee and Z-Wave devices from SmartThings to local control',
        duration: '1-2 hours',
        tips: ['Reset devices before re-pairing', 'Do this room by room'],
      },
      {
        title: 'Recreate automations',
        description: 'Rebuild SmartThings automations in Home Assistant',
        duration: '1-2 hours',
        tips: ['SmartThings automations translate well to HA', 'Use automation blueprints for common patterns'],
      }
    ],
    automationNotes: 'SmartThings automations can be directly translated to Home Assistant. The webCoRE add-on provides similar rule-engine capabilities if needed.',
    benefits: ['Local control', 'No cloud dependency', 'More integrations', 'Better performance'],
    tradeoffs: ['Initial setup complexity', 'Self-hosted', 'Learning curve']
  },
  {
    from: 'Amazon Alexa',
    fromLogo: '🔷',
    to: 'Home Assistant',
    toLogo: '🏠',
    difficulty: 'medium',
    estimatedTime: '3-6 hours',
    estimatedCost: '$100-200',
    compatibleDevices: 90,
    incompatibleDevices: ['Echo Devices (as hubs)', 'Ring (full features)', 'Amazon Smart Plugs'],
    steps: [
      {
        title: 'Set up Home Assistant',
        description: 'Install on dedicated hardware with Zigbee/Z-Wave support',
        duration: '30-60 min',
        tips: ['Home Assistant Yellow includes Zigbee', 'USB coordinators work with any setup'],
      },
      {
        title: 'Add device integrations',
        description: 'Connect WiFi devices and prepare for Zigbee migration',
        duration: '30-60 min',
        tips: ['Many Alexa-compatible devices work with HA', 'Check integration list first'],
      },
      {
        title: 'Migrate Zigbee devices',
        description: 'If you have Zigbee devices on Echo with hub, move them to HA',
        duration: '1-2 hours',
        tips: ['Factory reset each device', 'Pair close to coordinator then move'],
        warnings: ['Echo-only devices cannot be migrated']
      },
      {
        title: 'Set up voice control',
        description: 'Configure Alexa integration or local voice with Wyoming',
        duration: '30-60 min',
        tips: ['You can keep Alexa for voice and use HA for automation', 'Local voice is more private but needs setup'],
      },
      {
        title: 'Recreate routines as automations',
        description: 'Rebuild Alexa Routines in Home Assistant',
        duration: '1-2 hours',
        tips: ['HA automations are more powerful', 'Use blueprints for common patterns'],
      }
    ],
    automationNotes: 'You can run Alexa alongside Home Assistant - use Alexa for voice and HA for automations. The Alexa Media Player integration enables this hybrid approach.',
    benefits: ['Local automation control', 'Privacy for automations', 'More device options', 'No subscription fees'],
    tradeoffs: ['Learning curve', 'Some Amazon devices incompatible', 'Hybrid setup complexity']
  },
];

const MigrationGuide = () => {
  const [fromPlatform, setFromPlatform] = useState<string>('');
  const [toPlatform, setToPlatform] = useState<string>('');
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const platforms = [
    { id: 'alexa', name: 'Amazon Alexa', logo: '🔷' },
    { id: 'google', name: 'Google Home', logo: '🔵' },
    { id: 'homekit', name: 'Apple HomeKit', logo: '🍎' },
    { id: 'smartthings', name: 'SmartThings', logo: '⚡' },
    { id: 'homeassistant', name: 'Home Assistant', logo: '🏠' },
  ];

  const selectedPath = migrationPaths.find(
    p => p.from.toLowerCase().includes(fromPlatform.toLowerCase()) && 
         p.to.toLowerCase().includes(toPlatform.toLowerCase())
  );

  const toggleStep = (index: number) => {
    setExpandedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleComplete = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted';
    }
  };

  const progress = selectedPath 
    ? (completedSteps.length / selectedPath.steps.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <ArrowRight className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Ecosystem Migration Guides</h2>
          <p className="text-muted-foreground">Step-by-step guides for switching smart home platforms</p>
        </div>
      </div>

      {/* Platform Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-2 block">From</label>
              <Select value={fromPlatform} onValueChange={setFromPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="flex items-center gap-2">
                        <span>{p.logo}</span>
                        {p.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />
            
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-2 block">To</label>
              <Select value={toPlatform} onValueChange={setToPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="flex items-center gap-2">
                        <span>{p.logo}</span>
                        {p.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration Path Content */}
      {selectedPath ? (
        <div className="space-y-6">
          {/* Overview */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedPath.fromLogo}</span>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <span className="text-5xl">{selectedPath.toLogo}</span>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">{selectedPath.from} → {selectedPath.to}</h3>
                    <Badge className={getDifficultyColor(selectedPath.difficulty)}>
                      {selectedPath.difficulty.charAt(0).toUpperCase() + selectedPath.difficulty.slice(1)} Migration
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-6 text-center">
                  <div>
                    <div className="flex items-center gap-1 text-lg font-bold">
                      <Clock className="h-4 w-4" />
                      {selectedPath.estimatedTime}
                    </div>
                    <p className="text-xs text-muted-foreground">Estimated Time</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-lg font-bold">
                      <DollarSign className="h-4 w-4" />
                      {selectedPath.estimatedCost}
                    </div>
                    <p className="text-xs text-muted-foreground">Estimated Cost</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-success">{selectedPath.compatibleDevices}%</p>
                    <p className="text-xs text-muted-foreground">Compatible</p>
                  </div>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="font-medium">{completedSteps.length} / {selectedPath.steps.length} steps</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Incompatible Devices Warning */}
          {selectedPath.incompatibleDevices.length > 0 && (
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Devices that won't migrate</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPath.incompatibleDevices.join(', ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Migration Steps</h3>
            {selectedPath.steps.map((step, index) => (
              <Collapsible
                key={index}
                open={expandedSteps.includes(index)}
                onOpenChange={() => toggleStep(index)}
              >
                <Card className={completedSteps.includes(index) ? 'border-success/50 bg-success/5' : ''}>
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          completedSteps.includes(index) 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {completedSteps.includes(index) ? <Check className="h-4 w-4" /> : index + 1}
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{step.title}</p>
                          <p className="text-sm text-muted-foreground">~{step.duration}</p>
                        </div>
                      </div>
                      {expandedSteps.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-0 border-t border-border ml-12">
                      <p className="text-muted-foreground mt-4 mb-4">{step.description}</p>
                      
                      {step.tips.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium flex items-center gap-1 mb-2">
                            <Lightbulb className="h-4 w-4 text-accent" />
                            Tips
                          </p>
                          <ul className="space-y-1">
                            {step.tips.map((tip, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {step.warnings && step.warnings.length > 0 && (
                        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          {step.warnings.map((warning, i) => (
                            <p key={i} className="text-sm text-destructive flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                              {warning}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      <Button
                        variant={completedSteps.includes(index) ? "outline" : "default"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplete(index);
                        }}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        {completedSteps.includes(index) ? 'Mark Incomplete' : 'Mark Complete'}
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {/* Benefits & Tradeoffs */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-success flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPath.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-accent flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Trade-offs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPath.tradeoffs.map((tradeoff, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Automation Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Automation Migration Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{selectedPath.automationNotes}</p>
            </CardContent>
          </Card>
        </div>
      ) : fromPlatform && toPlatform ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Migration guide not available yet</h3>
            <p className="text-muted-foreground mb-4">
              We're working on adding more migration paths. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ArrowRight className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Select platforms to see migration guide</h3>
            <p className="text-muted-foreground">
              Choose your current platform and desired platform above
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MigrationGuide;
