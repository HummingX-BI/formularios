import { CheckCircle2 } from 'lucide-react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface GoalMeterProps {
  etiqueta: string;
  actual: number;
  meta: number;
}

/** Medidor de meta grande ("x / 3") con barra y porcentaje. */
export function GoalMeter({ etiqueta, actual, meta }: GoalMeterProps) {
  const pct = meta > 0 ? Math.min(100, Math.round((actual / meta) * 100)) : 0;
  const cumplida = actual >= meta;
  return (
    <Card>
      <p className="text-sm font-medium text-texto-2">{etiqueta}</p>
      <p className="mt-1 font-titulo text-[32px] font-bold leading-none tabular-nums text-texto">
        {actual} <span className="text-texto-3">/ {meta}</span>
      </p>
      <ProgressBar valor={pct} etiqueta={`${etiqueta}: ${actual} de ${meta}`} className="mt-3" />
      <p className="mt-2 flex items-center gap-1 text-sm font-medium text-texto-2">
        {cumplida ? (
          <>
            <CheckCircle2 size={16} className="text-accion" aria-hidden="true" />
            <span className="text-accion-hover">Meta cumplida · {pct}%</span>
          </>
        ) : (
          <>{pct}% de la meta</>
        )}
      </p>
    </Card>
  );
}
