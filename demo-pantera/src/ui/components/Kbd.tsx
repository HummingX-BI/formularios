import type React from 'react';
import { cn } from './utils';

export interface KbdProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function Kbd({ className, children, ...props }: KbdProps): React.JSX.Element {
  return (
    <div className={cn('kbd-base', className)} {...props}>
      {children || 'Kbd'}
    </div>
  );
}
