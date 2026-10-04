import type React from 'react';
import { cn } from './utils';

export interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function Switch({ className, children, ...props }: SwitchProps): React.JSX.Element {
  return (
    <div className={cn('switch-base', className)} {...props}>
      {children || 'Switch'}
    </div>
  );
}
