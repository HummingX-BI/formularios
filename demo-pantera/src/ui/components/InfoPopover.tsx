import type React from 'react';
import { cn } from './utils';

export interface InfoPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function InfoPopover({
  className,
  children,
  ...props
}: InfoPopoverProps): React.JSX.Element {
  return (
    <div className={cn('infopopover-base', className)} {...props}>
      {children || 'InfoPopover'}
    </div>
  );
}
