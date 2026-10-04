import type React from 'react';
import { cn } from './utils';

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

export function CodeBlock({ className, children, ...props }: CodeBlockProps): React.JSX.Element {
  return (
    <div className={cn('codeblock-base', className)} {...props}>
      {children || 'CodeBlock'}
    </div>
  );
}
