import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CampoProps {
  id: string;
  etiqueta: string;
  ayuda?: string | undefined;
  error?: string | undefined;
  children: ReactNode;
  className?: string;
}

/** Etiqueta arriba, ayuda abajo y error en rojo bajo el campo. */
export function Campo({ id, etiqueta, ayuda, error, children, className }: CampoProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-texto">
        {etiqueta}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-error">
          {error}
        </p>
      ) : (
        ayuda && (
          <p id={`${id}-ayuda`} className="text-sm text-texto-2">
            {ayuda}
          </p>
        )
      )}
    </div>
  );
}
