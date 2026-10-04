import type React from 'react';
import { Droplet, ArrowRight } from 'lucide-react';
import { cn } from './utils';

export interface InsightBlockProps {
  conclusion: string;
  action?: string;
  severity?: 'low' | 'medium' | 'high';
  onActionClick?: () => void;
  className?: string;
}

export function InsightBlock({
  conclusion,
  action,
  severity = 'low',
  onActionClick,
  className,
}: InsightBlockProps): React.JSX.Element {
  const severityColors = {
    low: 'bg-ice-50 border-sky-200 text-blue-800',
    medium: 'bg-orange-50 border-state-ambar text-orange-900',
    high: 'bg-red-50 border-state-coral text-red-900',
  };

  return (
    <div className={cn('rounded-xl border p-5 shadow-sm', severityColors[severity], className)}>
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
}
