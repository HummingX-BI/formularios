import type { KeyboardEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Hace que toda la tarjeta sea un enlace. */
  to?: string;
  /** Hace que toda la tarjeta sea clicable. */
  onClick?: () => void;
  'aria-label'?: string;
}

const BASE = 'block rounded-tarjeta bg-superficie p-4 shadow-1 md:p-5';
const CLICABLE =
  'cursor-pointer transition-shadow hover:shadow-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca';

export function Card({ children, className, to, onClick, 'aria-label': etiqueta }: CardProps) {
  if (to) {
    return (
      <Link to={to} aria-label={etiqueta} className={cn(BASE, CLICABLE, className)}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={etiqueta}
        onClick={onClick}
        onKeyDown={alTeclear}
        className={cn(BASE, CLICABLE, className)}
      >
        {children}
      </div>
    );
  }
  return <div className={cn(BASE, className)}>{children}</div>;
}
