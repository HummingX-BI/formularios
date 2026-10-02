import type React from 'react';
import { cn } from './utils';

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Drawer({ className, children, ...props }: DrawerProps): React.JSX.Element {
  return (
    <div className={cn('drawer-base', className)} {...props}>
      {children || 'Drawer'}
    </div>
  );
}
