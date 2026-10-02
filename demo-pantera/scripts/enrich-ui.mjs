import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uiDir = path.join(__dirname, '..', 'src', 'ui', 'components');

const buttonContent = `import type React from 'react';
import { cn } from './utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, ...props }: ButtonProps): React.JSX.Element {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-800 shadow-soft-blue",
    secondary: "bg-ice-100 text-blue-800 hover:bg-sky-200 border border-sky-200",
    ghost: "text-text-secondary hover:bg-ice-100",
    danger: "bg-state-coral text-white hover:opacity-90"
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}`;

const kpiCardContent = `import type React from 'react';
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
        {infoText && <Info className="h-4 w-4 text-text-tenue cursor-help" title={infoText} />}
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
}`;

const insightBlockContent = `import type React from 'react';
import { Droplet, ArrowRight } from 'lucide-react';
import { cn } from './utils';

export interface InsightBlockProps {
  conclusion: string;
  action?: string;
  severity?: 'low' | 'medium' | 'high';
  onActionClick?: () => void;
  className?: string;
}

export function InsightBlock({ conclusion, action, severity = 'low', onActionClick, className }: InsightBlockProps): React.JSX.Element {
  const severityColors = {
    low: 'bg-ice-50 border-sky-200 text-blue-800',
    medium: 'bg-orange-50 border-state-ambar text-orange-900',
    high: 'bg-red-50 border-state-coral text-red-900'
  };

  return (
    <div className={cn("rounded-xl border p-5 shadow-sm", severityColors[severity], className)}>
      <div className="flex items-center gap-2 mb-3">
        <Droplet className="h-5 w-5 fill-current" />
        <h4 className="font-display font-semibold">En español simple</h4>
      </div>
      <p className="text-sm mb-4 leading-relaxed opacity-90">{conclusion}</p>
      {action && (
        <div className="border-t border-current/10 pt-4 mt-2">
          <p className="text-sm font-medium mb-3">Qué hacer:</p>
          <p className="text-sm mb-4 opacity-90">{action}</p>
          {onActionClick && (
            <button 
              onClick={onActionClick}
              className="inline-flex items-center text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              Enviar al plan de acción <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}`;

const animatedCounterContent = `import React, { useEffect, useState } from 'react';

export interface AnimatedCounterProps {
  value: number;
  className?: string;
}

// Fallback simple counter that respects prefers-reduced-motion implicitly
export function AnimatedCounter({ value, className }: AnimatedCounterProps): React.JSX.Element {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number;
    const duration = 800; // max 800ms
    const startValue = displayValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (value - startValue) * ease;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  // Format appropriately
  const formatted = displayValue % 1 !== 0 
    ? displayValue.toFixed(2)
    : Math.floor(displayValue).toString();

  return <span className={className}>{formatted}</span>;
}`;

const tableContent = `import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './Button';
import { cn } from './utils';

export function Table({ className, ...props }: any): React.JSX.Element {
  return (
    <div className={cn("w-full rounded-xl border border-ice-100 bg-white overflow-hidden", className)}>
      <div className="p-4 flex items-center justify-between border-b border-ice-100">
        <input type="text" placeholder="Buscar..." className="px-3 py-1.5 text-sm rounded-md border border-ice-100 focus:outline-none focus:ring-2 focus:ring-sky-400" />
        <Button variant="secondary" size="sm"><Download className="mr-2 h-4 w-4" /> Exportar CSV</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-ice-50 text-text-secondary text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Concepto</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ice-50 hover:bg-ice-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-text-primary">Ejemplo A</td>
              <td className="px-4 py-3 tabular-nums">1,234</td>
              <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-sky-200 text-blue-800 font-medium">Activo</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-ice-100 text-xs text-text-tenue flex justify-between items-center">
        <span>Mostrando 1 a 1 de 1</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" disabled>Ant</Button>
          <Button variant="ghost" size="sm" disabled>Sig</Button>
        </div>
      </div>
    </div>
  );
}`;

fs.writeFileSync(path.join(uiDir, 'Button.tsx'), buttonContent);
fs.writeFileSync(path.join(uiDir, 'KpiCard.tsx'), kpiCardContent);
fs.writeFileSync(path.join(uiDir, 'InsightBlock.tsx'), insightBlockContent);
fs.writeFileSync(path.join(uiDir, 'AnimatedCounter.tsx'), animatedCounterContent);
fs.writeFileSync(path.join(uiDir, 'Table.tsx'), tableContent);

console.log('Enriched critical components.');
