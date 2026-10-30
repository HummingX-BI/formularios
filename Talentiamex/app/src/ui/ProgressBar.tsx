import { cn } from '@/lib/cn';

export type ColorBarra = 'accion' | 'marca' | 'alerta' | 'error';

const COLORES: Record<ColorBarra, string> = {
  accion: 'bg-accion',
  marca: 'bg-marca',
  alerta: 'bg-alerta',
  error: 'bg-error',
};

interface ProgressBarProps {
  /** Porcentaje de 0 a 100. */
  valor: number;
  etiqueta: string;
  /** Muestra el porcentaje a la derecha. */
  mostrarPorcentaje?: boolean;
  color?: ColorBarra;
  className?: string;
}

export function ProgressBar({
  valor,
  etiqueta,
  mostrarPorcentaje = false,
  color = 'accion',
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(valor)));
  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-label={etiqueta}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-2.5 w-full overflow-hidden rounded-chip bg-borde"
      >
        <div className={cn('h-full rounded-chip transition-[width] duration-300', COLORES[color])} style={{ width: `${pct}%` }} />
      </div>
      {mostrarPorcentaje && <p className="mt-1 text-right text-sm font-medium text-texto-2">{pct}%</p>}
    </div>
  );
}
