import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Brain, Award, AlertTriangle, Info } from 'lucide-react';

interface TrustDimension {
  name: string;
  score: number;
  description: string;
  icon: React.ReactNode;
  findings?: string[];
}

interface TrustScoreBreakdownProps {
  dimensions: {
    dataPrivacyPractices?: number;
    encryptionStandards?: number;
    termsTransparency?: number;
    ethicalAiTransparency?: number;
    thirdPartyAudits?: number;
  };
  overallScore?: number;
  category?: string;
  className?: string;
}

const TrustScoreBreakdown: React.FC<TrustScoreBreakdownProps> = ({
  dimensions,
  overallScore,
  category,
  className = '',
}) => {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);

  const trustDimensions: TrustDimension[] = [
    {
      name: 'Data Privacy',
      score: dimensions.dataPrivacyPractices ?? 0,
      description: 'How the product handles, stores, and protects user data',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      name: 'Encryption',
      score: dimensions.encryptionStandards ?? 0,
      description: 'Security measures for data in transit and at rest',
      icon: <Lock className="w-5 h-5" />,
    },
    {
      name: 'ToS Transparency',
      score: dimensions.termsTransparency ?? 0,
      description: 'Clarity and fairness of terms of service',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: 'Ethical AI',
      score: dimensions.ethicalAiTransparency ?? 0,
      description: 'Transparency about AI usage and data training',
      icon: <Brain className="w-5 h-5" />,
    },
    {
      name: 'Third-Party Audits',
      score: dimensions.thirdPartyAudits ?? 0,
      description: 'Independent security and compliance verification',
      icon: <Award className="w-5 h-5" />,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Trust Score Breakdown</h3>
        {overallScore !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Overall</span>
            <span className={`text-lg font-bold ${getScoreColor(overallScore).replace('bg-', 'text-')}`}>
              {overallScore}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {trustDimensions.map((dimension, index) => (
          <div
            key={dimension.name}
            className="relative"
            onMouseEnter={() => setHoveredDimension(dimension.name)}
            onMouseLeave={() => setHoveredDimension(null)}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-gray-400">{dimension.icon}</span>
              <span className="text-sm text-gray-300 flex-1">{dimension.name}</span>
              <span className={`text-sm font-semibold ${getScoreColor(dimension.score).replace('bg-', 'text-')}`}>
                {dimension.score}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getScoreColor(dimension.score)} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${dimension.score}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{getScoreLabel(dimension.score)}</span>
              {hoveredDimension === dimension.name && (
                <span className="text-xs text-gray-400">{dimension.description}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {category && (
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Info className="w-4 h-4" />
            <span>Scores are adjusted for the {category} category</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustScoreBreakdown;