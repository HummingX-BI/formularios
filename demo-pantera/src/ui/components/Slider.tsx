import type React from 'react';
import { cn } from './utils';

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> { 'data-testid'?: string; }

export function Slider({ className, children, ...props }: SliderProps): React.JSX.Element {
  return (
    <div className={cn('slider-base', className)} {...props}>
      {children || 'Slider'}
    </div>
  );
}
