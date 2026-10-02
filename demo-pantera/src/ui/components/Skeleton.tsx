import type React from 'react';
import { cn } from './utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Skeleton({ className, children, ...props }: SkeletonProps): React.JSX.Element {
  return (
    <div className={cn('skeleton-base', className)} {...props}>
      {children || 'Skeleton'}
    </div>
  );
}
