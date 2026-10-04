import type React from 'react';
import { cn } from './utils';

export interface MultiSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function MultiSelect({
  className,
  children,
  ...props
}: MultiSelectProps): React.JSX.Element {
  return (
    <div className={cn('multiselect-base', className)} {...props}>
      {children || 'MultiSelect'}
    </div>
  );
}
