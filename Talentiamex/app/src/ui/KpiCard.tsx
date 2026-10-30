import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Card } from './Card';

interface KpiCardProps {
  valor: string | number;
  etiqueta: string;
  icono?: LucideIcon;
  variacion?: { texto: string; tono?: 'positivo' | 'negativo' | 'neutro' };
}

const TONO = {
  positivo: 'text-accion-hover',
  negativo: 'text-error',
  neutro: 'text-texto-2',
} as const;

/** Cifra grande con su etiqueta y, si hace falta, cuánto cambió. */
export function KpiCard({ valor, etiqueta, icono: Icono, variacion }: KpiCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <p className="font-titulo text-[32px] font-bold leading-none tabular-nums text-texto">{valor}</p>
        {Icono && <Icono size={22} className="text-texto-3" aria-hidden="true" />}
      </div>
      <p className="mt-2 text-sm font-medium text-texto-2">{etiqueta}</p>
      {variacion && (
        <p className={cn('mt-1 text-sm font-medium', TONO[variacion.tono ?? 'neutro'])}>
          {variacion.texto}
        </p>
      )}
    </Card>
  );
}
