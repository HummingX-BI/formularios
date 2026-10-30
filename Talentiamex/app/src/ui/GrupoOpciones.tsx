import { useId } from 'react';
import { cn } from '@/lib/cn';

interface GrupoOpcionesProps<T extends string> {
  etiqueta: string;
  opciones: { valor: T; texto: string }[];
  valor: T | '';
  onCambio: (valor: T) => void;
  error?: string | undefined;
  className?: string;
}

/** Elige una opción entre pocas, con botones grandes (turno, disponibilidad, etc.). */
export function GrupoOpciones<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambio,
  error,
  className,
}: GrupoOpcionesProps<T>) {
  const id = useId();
  return (
    <div className={className}>
      <p id={id} className="mb-1.5 text-sm font-medium text-texto">
        {etiqueta}
      </p>
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-2">
        {opciones.map((o) => {
          const activo = o.valor === valor;
          return (
            <button
              key={o.valor}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => onCambio(o.valor)}
              className={cn(
                'min-h-12 rounded-boton border px-4 text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca',
                activo
                  ? 'border-marca bg-marca-suave text-marca'
                  : 'border-borde bg-superficie text-texto hover:bg-fondo',
              )}
            >
              {o.texto}
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
