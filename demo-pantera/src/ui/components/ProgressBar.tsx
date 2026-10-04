import type React from 'react';
import { cn } from './utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function ProgressBar({
  className,
  children,
  ...props
}: ProgressBarProps): React.JSX.Element {
  return (
    <div className={cn('progressbar-base', className)} {...props}>
      {children || 'ProgressBar'}
    </div>
  );
}
