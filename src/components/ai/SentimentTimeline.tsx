import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SentimentDataPoint {
  date: string;
  avgScore: number;
  count: number;
}

interface SentimentTimelineProps {
  data: SentimentDataPoint[];
  days?: number;
  className?: string;
}

const SentimentTimeline: React.FC<SentimentTimelineProps> = ({
  data,
  days = 90,
  className = '',
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return '#22C88A';
    if (score >= 0.4) return '#F5A623';
    return '#F74F4F';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      const count = payload[0].payload.count;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm text-gray-400">{formatDate(label)}</p>
          <p className="text-lg font-semibold text-white">
            Score: {(score * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500">{count} reviews</p>
        </div>
      );
    }
    return null;
  };

  const trend = data.length >= 2 
    ? data[data.length - 1].avgScore - data[0].avgScore 
    : 0;

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Sentiment Trend</h3>
          <p className="text-sm text-gray-500">Last {days} days</p>
        </div>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend > 0 ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            <span className="text-sm font-semibold">{(Math.abs(trend) * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 1]}
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0.7} stroke="#22C88A" strokeDasharray="5 5" />
            <ReferenceLine y={0.4} stroke="#F5A623" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="avgScore"
              stroke={data.length > 0 ? getScoreColor(data[data.length - 1].avgScore) : '#4F8EF7'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#4F8EF7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Good (>70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Fair (40-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Poor (<40%)</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentTimeline;