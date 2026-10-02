import type React from 'react';
import { cn } from './utils';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Modal({ className, children, ...props }: ModalProps): React.JSX.Element {
  return (
    <div className={cn('modal-base', className)} {...props}>
      {children || 'Modal'}
    </div>
  );
}
