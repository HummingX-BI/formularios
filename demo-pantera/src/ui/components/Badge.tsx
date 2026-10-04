import type React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function Badge({ className, children, ...props }: BadgeProps): React.JSX.Element {
  return (
    <div className={cn('badge-base', className)} {...props}>
      {children || 'Badge'}
    </div>
  );
}
