import type React from 'react';
import { cn } from './utils';

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Tooltip({ className, children, ...props }: TooltipProps): React.JSX.Element {
  return (
    <div className={cn('tooltip-base', className)} {...props}>
      {children || 'Tooltip'}
    </div>
  );
}
