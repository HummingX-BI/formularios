import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StepperProps {
  pasos: string[];
  /** Paso actual, empezando en 1. */
  actual: number;
  className?: string;
}

/** Pasos numerados; los completados llevan palomita. En móvil solo se ve el nombre del paso actual. */
export function Stepper({ pasos, actual, className }: StepperProps) {
  return (
    <ol className={cn('flex items-start gap-2', className)} aria-label="Avance">
      {pasos.map((nombre, i) => {
        const numero = i + 1;
        const hecho = numero < actual;
        const enCurso = numero === actual;
        return (
          <li
            key={nombre}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center"
            aria-current={enCurso ? 'step' : undefined}
          >
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-chip text-sm font-semibold',
                hecho && 'bg-accion text-white',
                enCurso && 'bg-marca text-white',
                !hecho && !enCurso && 'bg-borde text-texto-2',
              )}
            >
              {hecho ? <Check size={16} aria-label="Completado" /> : numero}
            </span>
            <span
              className={cn(
                'text-xs font-medium sm:text-sm',
                enCurso ? 'text-texto' : 'hidden text-texto-2 sm:block',
              )}
            >
              {nombre}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
