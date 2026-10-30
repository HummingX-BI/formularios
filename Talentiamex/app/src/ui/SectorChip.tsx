import type { SectorId } from '@/types';
import { useDemoStore } from '@/store/useDemoStore';
import { Icono } from './Icono';

interface SectorChipProps {
  sector: SectorId;
  /** Solo el ícono, para espacios chicos (el nombre queda como texto accesible). */
  soloIcono?: boolean;
}

/** Etiqueta de sector con el color e ícono que define el catálogo (RN-11). */
export function SectorChip({ sector, soloIcono = false }: SectorChipProps) {
  const datos = useDemoStore((s) => s.sectores.find((x) => x.id === sector));
  if (!datos) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-chip px-3 py-1 text-sm font-medium"
      style={{ backgroundColor: datos.colorSuave, color: datos.color }}
    >
      <Icono nombre={datos.icono} size={16} />
      {soloIcono ? <span className="sr-only">{datos.nombre}</span> : datos.nombre}
    </span>
  );
}
