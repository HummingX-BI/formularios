import { ArrowRight, Building2, Clock, MapPin, Wallet } from 'lucide-react';
import { diasEntre } from '@/lib/fechas';
import { ETIQUETA_TURNO } from '@/lib/etiquetas';
import { moneda } from '@/lib/formato';
import type { Vacante } from '@/types';
import { Badge, Button, Card, SectorChip } from '@/ui';

function haceCuanto(dias: number): string {
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'ayer';
  return `hace ${dias} días`;
}

interface VacanteCardProps {
  vacante: Vacante;
  empresa: string;
  hoy: string;
  coincide: boolean;
  postulado: boolean;
}

/** Tarjeta de vacante para el candidato (P06). */
export function VacanteCard({ vacante: v, empresa, hoy, coincide, postulado }: VacanteCardProps) {
  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <SectorChip sector={v.sector} />
        {coincide && <Badge tono="verde">Coincide contigo</Badge>}
        {postulado && <Badge tono="gris">Ya te postulaste</Badge>}
      </div>

      <div>
        <h3 className="font-titulo text-lg font-semibold text-texto">{v.puesto}</h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-base text-texto-2">
          <Building2 size={16} aria-hidden="true" />
          {empresa}
        </p>
      </div>

      <ul className="flex flex-col gap-1.5 text-base text-texto">
        <li className="flex items-center gap-2">
          <MapPin size={16} className="text-texto-3" aria-hidden="true" />
          {v.zona}
        </li>
        <li className="flex items-center gap-2">
          <Wallet size={16} className="text-texto-3" aria-hidden="true" />
          {moneda(v.sueldo)} al mes
        </li>
        <li className="flex items-center gap-2">
          <Clock size={16} className="text-texto-3" aria-hidden="true" />
          Turno {ETIQUETA_TURNO[v.turno].toLowerCase()} ·{' '}
          {haceCuanto(diasEntre(v.publicadaEl, hoy))}
        </li>
      </ul>

      <div className="mt-auto pt-1">
        <Button
          to={`/candidato/vacantes/${v.id}`}
          icono={ArrowRight}
          variante={postulado ? 'secundario' : 'primario'}
          anchoCompleto
        >
          Ver vacante
        </Button>
      </div>
    </Card>
  );
}
