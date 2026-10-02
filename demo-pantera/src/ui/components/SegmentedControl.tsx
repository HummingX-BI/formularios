import type React from 'react';
import { cn } from './utils';

export interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function SegmentedControl({ className, children, ...props }: SegmentedControlProps): React.JSX.Element {
  return (
    <div className={cn('segmentedcontrol-base', className)} {...props}>
      {children || 'SegmentedControl'}
    </div>
  );
}
