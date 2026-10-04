import type React from 'react';
import { cn } from './utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function EmptyState({ className, children, ...props }: EmptyStateProps): React.JSX.Element {
  return (
    <div className={cn('emptystate-base', className)} {...props}>
      {children || 'EmptyState'}
    </div>
  );
}
