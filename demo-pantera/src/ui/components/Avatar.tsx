import type React from 'react';
import { cn } from './utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Avatar({ className, children, ...props }: AvatarProps): React.JSX.Element {
  return (
    <div className={cn('avatar-base', className)} {...props}>
      {children || 'Avatar'}
    </div>
  );
}
