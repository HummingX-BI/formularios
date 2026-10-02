import type React from 'react';
import { cn } from './utils';

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Select({ className, children, ...props }: SelectProps): React.JSX.Element {
  return (
    <div className={cn('select-base', className)} {...props}>
      {children || 'Select'}
    </div>
  );
}
