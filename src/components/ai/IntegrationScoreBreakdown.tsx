import React from 'react';
import { motion } from 'framer-motion';
import { Plug, Globe, Cpu, Bot, Users, Info } from 'lucide-react';

interface IntegrationDimension {
  name: string;
  score: number;
  description: string;
  icon: React.ReactNode;
}

interface IntegrationScoreBreakdownProps {
  /** Overall integration score out of 100 */
  score?: number;
  className?: string;
}

const IntegrationScoreBreakdown: React.FC<IntegrationScoreBreakdownProps> = ({
  score = 0,
  className = '',
}) => {
  const pct = Math.max(0, Math.min(100, score));

  const dimensions: IntegrationDimension[] = [
    {
      name: 'API & Documentation',
      score: Math.round(pct * 0.3),
      description: 'Quality of public APIs and developer documentation',
      icon: <Plug className="w-5 h-5" />,
    },
    {
      name: 'Cross-Platform',
      score: Math.round(pct * 0.25),
      description: 'Availability across web, desktop, and mobile platforms',
      icon: <Globe className="w-5 h-5" />,
    },
    {
      name: 'Ecosystems',
      score: Math.round(pct * 0.2),
      description: 'Native support for smart home and productivity ecosystems',
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      name: 'Automation Platforms',
      score: Math.round(pct * 0.15),
      description: 'Zapier / Make / n8n compatibility and webhook support',
      icon: <Bot className="w-5 h-5" />,
    },
    {
      name: 'Developer Community',
      score: Math.round(pct * 0.1),
      description: 'Community SDKs, plugins, and third-party integrations',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const scoreColor =
    pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600';
  const barColor =
    pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className={`rounded-xl border bg-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Plug className="w-5 h-5 text-primary" />
          Integration Score
        </h3>
        <span className={`text-2xl font-bold ${scoreColor}`}>{pct}/100</span>
      </div>

      <div className="mb-5 h-2.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>

      <ul className="space-y-3">
        {dimensions.map((d) => (
          <li key={d.name} className="group">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <span className="text-primary">{d.icon}</span>
                {d.name}
              </span>
              <span className="tabular-nums text-muted-foreground">{d.score}</span>
            </div>
            <p className="mt-0.5 pl-7 text-xs text-muted-foreground">{d.description}</p>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        TheSynLab rates integration depth from API quality, native connector counts,
        ecosystem coverage, and automation-platform compatibility.
      </p>
    </div>
  );
};

export default IntegrationScoreBreakdown;