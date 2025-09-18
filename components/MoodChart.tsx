import React from 'react';
import type { MoodLog } from '../types';

interface MoodChartProps {
  data: MoodLog[];
}

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  if (data.length < 2) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-lg">
        <p className="text-slate-600">Log your mood for a few more days to see a trend chart here.</p>
      </div>
    );
  }

  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 20;

  const points = data.map((log, index) => {
    const x = (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - ((log.score - 1) / 9) * (chartHeight - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-[500px]">
        {/* Y-axis labels */}
        <text x="10" y={padding} dy="0.3em" textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">10</text>
        <text x="10" y={chartHeight - padding} dy="0.3em" textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">1</text>
        
        {/* Gradient for area fill */}
        <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
        </defs>

        {/* Area fill */}
        <polygon
          points={`${padding},${chartHeight-padding} ${points} ${chartWidth-padding},${chartHeight-padding}`}
          fill="url(#area-gradient)"
        />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {data.map((log, index) => {
            const x = (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
            const y = chartHeight - ((log.score - 1) / 9) * (chartHeight - padding * 2) - padding;
            return (
                <g key={log.id}>
                    <circle cx={x} cy={y} r="6" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2" />
                    <circle cx={x} cy={y} r="3" fill="var(--color-primary)" />
                </g>
            );
        })}
      </svg>
    </div>
  );
};

export default MoodChart;
