import { VIGENCIA_VACANTE_DIAS } from '@/data/config';
import { estadoVigencia, type Vigencia } from '@/store/reglas';
import { ProgressBar, type ColorBarra } from './ProgressBar';

const COLOR: Record<Vigencia, ColorBarra> = {
  verde: 'accion',
  ambar: 'alerta',
  rojo: 'error',
};

function texto(dias: number): string {
  if (dias < 0) return 'Venció';
  if (dias === 0) return 'Vence hoy';
  return dias === 1 ? 'Queda 1 día' : `Quedan ${dias} días`;
}

interface VigenciaBarProps {
  /** Días restantes de la vacante (negativo si ya venció). */
  dias: number;
}

/** Barra de 30 días: verde con más de 5 días, ámbar de 1 a 5, rojo si vence hoy o venció. */
export function VigenciaBar({ dias }: VigenciaBarProps) {
  const pct = (Math.max(0, dias) / VIGENCIA_VACANTE_DIAS) * 100;
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-texto-2">{texto(dias)}</p>
      <ProgressBar
        valor={pct}
        etiqueta={`Vigencia: ${texto(dias)}`}
        color={COLOR[estadoVigencia(dias)]}
      />
    </div>
  );
}
