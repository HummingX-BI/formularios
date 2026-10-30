import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icono: LucideIcon;
  titulo: string;
  texto?: string;
  accion?: ReactNode;
}

export function EmptyState({ icono: Icono, titulo, texto, accion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-tarjeta border border-dashed border-borde bg-superficie px-6 py-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-chip bg-marca-suave text-marca">
        <Icono size={32} aria-hidden="true" />
      </span>
      <h2 className="font-titulo text-lg font-semibold text-texto">{titulo}</h2>
      {texto && <p className="max-w-sm text-base text-texto-2">{texto}</p>}
      {accion && <div className="mt-2">{accion}</div>}
    </div>
  );
}
