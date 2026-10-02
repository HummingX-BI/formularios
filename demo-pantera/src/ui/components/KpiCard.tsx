import type React from 'react';
import { cn } from './utils';
import { Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export interface KpiCardProps {
  title: string;
  value: number;
  unit?: string;
  variation?: number; // e.g. 5.2 for +5.2%, -2.1 for -2.1%
  variationIsPositiveGood?: boolean;
  infoText?: string;
  className?: string;
}

export function KpiCard({ title, value, unit = '', variation, variationIsPositiveGood = true, infoText, className }: KpiCardProps): React.JSX.Element {
  const isPositive = variation !== undefined && variation > 0;
  const isNeutral = variation === 0;
  
  let variationColor = 'text-text-tenue';
  if (!isNeutral && variation !== undefined) {
    if (isPositive) variationColor = variationIsPositiveGood ? 'text-state-verde-agua' : 'text-state-coral';
    else variationColor = variationIsPositiveGood ? 'text-state-coral' : 'text-state-verde-agua';
  }

  return (
    <div className={cn("rounded-xl bg-white p-5 shadow-soft-blue border border-ice-100", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        {infoText && <span title={infoText}><Info className="h-4 w-4 text-text-tenue cursor-help" /></span>}
      </div>
      <div className="flex items-baseline gap-1">
        <AnimatedCounter value={value} className="text-3xl font-display font-bold text-text-primary tabular-nums" />
        <span className="text-lg font-medium text-text-tenue">{unit}</span>
      </div>
      {variation !== undefined && (
        <div className={cn("mt-2 flex items-center text-sm font-medium", variationColor)}>
          {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : !isNeutral ? <ArrowDownRight className="mr-1 h-4 w-4" /> : null}
          <span>{Math.abs(variation)}% vs ant.</span>
        </div>
      )}
    </div>
  );
}