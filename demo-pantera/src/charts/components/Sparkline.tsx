import React from 'react';
import { conceptColors } from '../../ui/conceptColors';

export interface SparklineProps {
  data: number[];
  concept?: keyof typeof conceptColors;
  width?: number;
  height?: number;
  highlightLast?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  concept = 'prospectos',
  width = 120,
  height = 40,
  highlightLast = true,
}) => {
  if (!data || data.length === 0) return <svg width={width} height={height} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 4;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * usableWidth;
    const y = padding + usableHeight - ((val - min) / range) * usableHeight;
    return `${x},${y}`;
  });

  const pathStr = `M ${points.join(' L ')}`;
  const areaStr = `${pathStr} L ${width - padding},${height} L ${padding},${height} Z`;

  const color = conceptColors[concept] as string;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${concept}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaStr} fill={`url(#grad-${concept})`} stroke="none" />
      <path
        d={pathStr}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {highlightLast && data.length > 0 && (
        <circle
          cx={padding + usableWidth}
          cy={padding + usableHeight - ((data[data.length - 1]! - min) / range) * usableHeight}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
};
