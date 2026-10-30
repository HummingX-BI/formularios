import type { ReactNode } from 'react';
import type { EstadoPostulacion } from '@/types';
import { cn } from '@/lib/cn';

export type TonoBadge = 'verde' | 'ambar' | 'rojo' | 'gris';

const TONOS: Record<TonoBadge, string> = {
  verde: 'bg-accion-suave text-accion-hover',
  ambar: 'bg-alerta-suave text-alerta',
  rojo: 'bg-error-suave text-error',
  gris: 'bg-borde text-texto-2',
};

interface BadgeProps {
  tono?: TonoBadge;
  children: ReactNode;
  className?: string;
}

export function Badge({ tono = 'gris', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-chip px-2.5 py-0.5 text-sm font-medium',
        TONOS[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

const POSTULACION: Record<EstadoPostulacion, { tono: TonoBadge; texto: string }> = {
  enviada: { tono: 'gris', texto: 'Enviada' },
  en_revision: { tono: 'ambar', texto: 'En revisión' },
  preseleccionado: { tono: 'verde', texto: 'Preseleccionado' },
  descartado: { tono: 'rojo', texto: 'Descartado' },
};

export function BadgePostulacion({ estado }: { estado: EstadoPostulacion }) {
  const { tono, texto } = POSTULACION[estado];
  return <Badge tono={tono}>{texto}</Badge>;
}

/** Resultado de las preguntas de descarte (RD-03). */
export function BadgeDescarte({ cumple }: { cumple: boolean }) {
  return cumple ? <Badge tono="verde">Cumple descarte</Badge> : <Badge tono="rojo">No cumple</Badge>;
}
