import { useId } from 'react';
import { cn } from '@/lib/cn';

interface ToggleProps {
  activo: boolean;
  onCambio: (activo: boolean) => void;
  etiqueta: string;
  ayuda?: string;
  disabled?: boolean;
  className?: string;
}

/** Interruptor con etiqueta a la izquierda. */
export function Toggle({ activo, onCambio, etiqueta, ayuda, disabled, className }: ToggleProps) {
  const id = useId();
  return (
    <div className={cn('flex min-h-12 items-center justify-between gap-4 py-2', className)}>
      <div>
        <span id={`${id}-etiqueta`} className="text-base text-texto">
          {etiqueta}
        </span>
        {ayuda && <p className="text-sm text-texto-2">{ayuda}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={activo}
        aria-labelledby={`${id}-etiqueta`}
        disabled={disabled}
        onClick={() => onCambio(!activo)}
        className={cn(
          'relative h-8 w-14 shrink-0 rounded-chip transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca disabled:opacity-60',
          activo ? 'bg-accion' : 'bg-texto-3',
        )}
      >
        <span
          className={cn(
            'absolute top-1 h-6 w-6 rounded-chip bg-superficie shadow-1 transition-all',
            activo ? 'left-7' : 'left-1',
          )}
        />
      </button>
    </div>
  );
}
