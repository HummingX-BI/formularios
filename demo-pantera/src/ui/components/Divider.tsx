import type React from 'react';
import { cn } from './utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Divider({ className, children, ...props }: DividerProps): React.JSX.Element {
  return (
    <div className={cn('divider-base', className)} {...props}>
      {children || 'Divider'}
    </div>
  );
}
