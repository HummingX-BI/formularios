import type React from 'react';
import { cn } from './utils';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function Tabs({ className, children, ...props }: TabsProps): React.JSX.Element {
  return (
    <div className={cn('tabs-base', className)} {...props}>
      {children || 'Tabs'}
    </div>
  );
}
