import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

interface ChipsSeleccionProps {
  etiqueta: string;
  sugerencias: string[];
  seleccion: string[];
  onCambio: (seleccion: string[]) => void;
  /** Texto del campo para agregar algo que no está en las sugerencias. */
  etiquetaAgregar: string;
  ayuda?: string;
}

/** Chips que se activan y desactivan, más un campo para agregar los propios. */
export function ChipsSeleccion({
  etiqueta,
  sugerencias,
  seleccion,
  onCambio,
  etiquetaAgregar,
  ayuda,
}: ChipsSeleccionProps) {
  const [nuevo, setNuevo] = useState('');
  const todos = [...sugerencias, ...seleccion.filter((s) => !sugerencias.includes(s))];

  const alternar = (valor: string) =>
    onCambio(
      seleccion.includes(valor) ? seleccion.filter((s) => s !== valor) : [...seleccion, valor],
    );

  const agregar = () => {
    const texto = nuevo.trim();
    if (!texto) return;
    if (!seleccion.includes(texto)) onCambio([...seleccion, texto]);
    setNuevo('');
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-texto">{etiqueta}</p>
      {ayuda && <p className="mb-2 text-sm text-texto-2">{ayuda}</p>}
      <div className="flex flex-wrap gap-2">
        {todos.map((t) => {
          const activo = seleccion.includes(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={activo}
              onClick={() => alternar(t)}
              className={cn(
                'min-h-10 rounded-chip border px-3.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
                activo
                  ? 'border-marca bg-marca-suave text-marca'
                  : 'border-borde bg-superficie text-texto-2 hover:bg-fondo',
              )}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          aria-label={etiquetaAgregar}
          placeholder={etiquetaAgregar}
          maxLength={60}
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              agregar();
            }
          }}
          className="min-h-12 min-w-0 flex-1 rounded-boton border border-borde bg-superficie px-3.5 text-base text-texto placeholder:text-texto-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marca"
        />
        <Button variante="secundario" icono={Plus} onClick={agregar}>
          Agregar
        </Button>
      </div>
    </div>
  );
}
