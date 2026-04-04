import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FitScoreProps {
  score: number;
  label?: string;
  showSubscores?: boolean;
  subscores?: {
    uxFit: number;
    privacyFit: number;
    integrationFit: number;
    teamSizeFit: number;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FitScoreWidget: React.FC<FitScoreProps> = ({
  score,
  label = 'Fit Score',
  showSubscores = false,
  subscores,
  size = 'md',
  className = '',
}) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-emerald-500';
    if (value >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getSubscoreColor = (value: number) => {
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const sizeClasses = {
    sm: { circle: 'w-16 h-16', text: 'text-lg', subscore: 'h-1' },
    md: { circle: 'w-24 h-24', text: 'text-2xl', subscore: 'h-2' },
    lg: { circle: 'w-32 h-32', text: 'text-3xl', subscore: 'h-3' },
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative">
        <svg
          className={`${sizeClasses[size].circle} transform -rotate-90`}
          viewBox="0 0 100 100"
        >
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <motion.circle
            className={getScoreColor(score)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${sizeClasses[size].text} font-bold text-white`}>
            {score}
          </span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>

      {label && <span className="text-sm text-gray-400">{label}</span>}

      {showSubscores && subscores && (
        <div className="w-full space-y-2">
          <SubscoreBar
            label="UX Fit"
            value={subscores.uxFit}
            color={getSubscoreColor(subscores.uxFit)}
            size={sizeClasses[size].subscore}
          />
          <SubscoreBar
            label="Privacy Fit"
            value={subscores.privacyFit}
            color={getSubscoreColor(subscores.privacyFit)}
            size={sizeClasses[size].subscore}
          />
          <SubscoreBar
            label="Integration Fit"
            value={subscores.integrationFit}
            color={getSubscoreColor(subscores.integrationFit)}
            size={sizeClasses[size].subscore}
          />
          <SubscoreBar
            label="Team Size Fit"
            value={subscores.teamSizeFit}
            color={getSubscoreColor(subscores.teamSizeFit)}
            size={sizeClasses[size].subscore}
          />
        </div>
      )}
    </div>
  );
};

interface SubscoreBarProps {
  label: string;
  value: number;
  color: string;
  size: string;
}

const SubscoreBar: React.FC<SubscoreBarProps> = ({ label, value, color, size }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-400 w-24">{label}</span>
    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`${color} ${size} rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-xs text-gray-400 w-8 text-right">{value}%</span>
  </div>
);

export default FitScoreWidget;