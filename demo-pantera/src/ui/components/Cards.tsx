import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { InfoPopover } from './Feedback';
import { SeverityPill } from './DataDisplay';
import { Button } from './Buttons';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded-lg shadow-aquatic border border-ice-100 overflow-hidden ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
};

// Animated counter for KPIs
const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
}> = ({ value, prefix = '', suffix = '', isCurrency }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800; // ms
    const frames = 30;
    const stepTime = duration / frames;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / frames;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(value * easeOutQuart);

      if (currentFrame >= frames) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const formatted = isCurrency
    ? new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0,
      }).format(displayValue)
    : new Intl.NumberFormat('es-MX', {
        maximumFractionDigits: displayValue % 1 === 0 ? 0 : 1,
      }).format(displayValue);

  return (
    <span className="tabular-figures">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export interface KpiCardProps {
  title: string;
  value: number;
  unit?: string;
  isCurrency?: boolean;
  variation?: number;
  variationLabel?: string;
  semanticColor?: 'positive' | 'negative' | 'neutral';
  infoText?: string;
  infoFormula?: string;
  sparklineSlot?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  isCurrency,
  variation,
  variationLabel,
  semanticColor = 'neutral',
  infoText,
  infoFormula,
  sparklineSlot,
}) => {
  const colorMap = {
    positive: 'text-verde-agua',
    negative: 'text-coral',
    neutral: 'text-secundario',
  };

  return (
    <Card className="p-5 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-secundario font-jakarta uppercase tracking-wider">
          {title}
        </h3>
        {infoText && (
          <InfoPopover
            title={title}
            description={infoText}
            {...(infoFormula ? { formula: infoFormula } : {})}
          />
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-navy-900 font-jakarta flex items-baseline gap-1">
            <AnimatedCounter
              value={value}
              {...(isCurrency !== undefined ? { isCurrency } : {})}
              suffix={unit ? ` ${unit}` : ''}
            />
          </div>
          {variation !== undefined && (
            <div
              className={`text-sm font-medium mt-2 flex items-center gap-1 ${colorMap[semanticColor]}`}
            >
              {variation > 0 ? '↑' : variation < 0 ? '↓' : '−'}
              {Math.abs(variation)}%{' '}
              {variationLabel && <span className="text-tenue text-xs ml-1">{variationLabel}</span>}
            </div>
          )}
        </div>
        {sparklineSlot && <div className="w-24 h-12 ml-4 flex-shrink-0">{sparklineSlot}</div>}
      </div>
    </Card>
  );
};

export interface InsightBlockProps {
  title?: string;
  conclusion: string;
  whatToDo?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  onAction?: () => void;
  actionLabel?: string;
}

export const InsightBlock: React.FC<InsightBlockProps> = ({
  title = 'En español simple',
  conclusion,
  whatToDo,
  severity = 'low',
  onAction,
  actionLabel = 'Enviar al plan de acción',
}) => {
  const severityMap = {
    low: { bg: 'bg-ice-50', border: 'border-ice-100', icon: 'text-sky-400' },
    medium: { bg: 'bg-amber-50/50', border: 'border-amber-200', icon: 'text-ambar' },
    high: { bg: 'bg-red-50/50', border: 'border-red-200', icon: 'text-coral' },
    critical: { bg: 'bg-red-100', border: 'border-red-300', icon: 'text-red-700' },
  };
  const theme = severityMap[severity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg p-5 border shadow-sm ${theme.bg} ${theme.border}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 ${theme.icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h4 className="font-jakarta font-bold text-navy-900">{title}</h4>
        </div>
        <SeverityPill level={severity} />
      </div>
      <p className="text-secundario text-base leading-relaxed mb-4">{conclusion}</p>
      {whatToDo && (
        <div className="bg-white/60 p-4 rounded-base border border-white/40 mb-4">
          <h5 className="text-sm font-bold text-navy-900 mb-1">Qué hacer:</h5>
          <p className="text-secundario text-sm">{whatToDo}</p>
        </div>
      )}
      {onAction && (
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
};
