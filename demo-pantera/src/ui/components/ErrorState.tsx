import type React from 'react';
import { cn } from './utils';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function ErrorState({ className, children, ...props }: ErrorStateProps): React.JSX.Element {
  return (
    <div className={cn('errorstate-base', className)} {...props}>
      {children || 'ErrorState'}
    </div>
  );
}
