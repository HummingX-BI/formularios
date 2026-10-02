import type React from 'react';
import { cn } from './utils';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Toast({ className, children, ...props }: ToastProps): React.JSX.Element {
  return (
    <div className={cn('toast-base', className)} {...props}>
      {children || 'Toast'}
    </div>
  );
}
