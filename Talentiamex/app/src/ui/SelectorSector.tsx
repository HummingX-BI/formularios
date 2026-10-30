import { useDemoStore } from '@/store/useDemoStore';
import type { SectorId } from '@/types';
import { cn } from '@/lib/cn';
import { Icono } from './Icono';

interface SelectorSectorProps {
  etiqueta: string;
  valor: SectorId;
  onCambio: (sector: SectorId) => void;
  error?: string | undefined;
}

/** Elige un sector con chips del color de cada uno (RN-11). */
export function SelectorSector({ etiqueta, valor, onCambio, error }: SelectorSectorProps) {
  const sectores = useDemoStore((s) => s.sectores);
  return (
    <div>
      <p id="selector-sector" className="mb-1.5 text-sm font-medium text-texto">
        {etiqueta}
      </p>
      <div role="radiogroup" aria-labelledby="selector-sector" className="flex flex-wrap gap-2">
        {sectores.map((s) => {
          const activo = s.id === valor;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => onCambio(s.id)}
              className={cn(
                'inline-flex min-h-12 items-center gap-2 rounded-chip border-2 px-4 text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca',
                activo ? 'border-current' : 'border-transparent',
              )}
              style={{ backgroundColor: s.colorSuave, color: s.color }}
            >
              <Icono nombre={s.icono} size={18} />
              {s.nombre}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
