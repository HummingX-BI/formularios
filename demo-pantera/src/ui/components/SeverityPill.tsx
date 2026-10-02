import type React from 'react';
import { cn } from './utils';

export interface SeverityPillProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function SeverityPill({ className, children, ...props }: SeverityPillProps): React.JSX.Element {
  return (
    <div className={cn('severitypill-base', className)} {...props}>
      {children || 'SeverityPill'}
    </div>
  );
}
