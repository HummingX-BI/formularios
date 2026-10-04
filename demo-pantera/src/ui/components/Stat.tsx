import type React from 'react';
import { cn } from './utils';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function Stat({ className, children, ...props }: StatProps): React.JSX.Element {
  return (
    <div className={cn('stat-base', className)} {...props}>
      {children || 'Stat'}
    </div>
  );
}
