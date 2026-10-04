import type React from 'react';
import { cn } from './utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function SectionHeader({
  className,
  children,
  ...props
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div className={cn('sectionheader-base', className)} {...props}>
      {children || 'SectionHeader'}
    </div>
  );
}
