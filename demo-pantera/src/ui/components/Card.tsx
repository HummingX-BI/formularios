import type React from 'react';
import { cn } from './utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function Card({ className, children, ...props }: CardProps): React.JSX.Element {
  return (
    <div className={cn('card-base', className)} {...props}>
      {children || 'Card'}
    </div>
  );
}
