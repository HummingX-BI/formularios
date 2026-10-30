import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { Button, Card, Select, useToast } from '@/ui';

interface EditorProps {
  etiqueta: string;
  valores: string[];
  onCambio: (valores: string[]) => void;
  agregar: string;
}

/** Chips con botón para quitar y un campo para agregar. Los cambios se guardan al momento. */
function EditorEtiquetas({ etiqueta, valores, onCambio, agregar }: EditorProps) {
  const [nuevo, setNuevo] = useState('');

  const sumar = () => {
    const texto = nuevo.trim();
    if (!texto) return;
    if (!valores.some((v) => v.toLowerCase() === texto.toLowerCase()))
      onCambio([...valores, texto]);
    setNuevo('');
  };

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-texto">{etiqueta}</p>
      {valores.length === 0 ? (
        <p className="mb-2 text-base text-texto-2">Aún no hay etiquetas.</p>
      ) : (
        <ul className="mb-3 flex flex-wrap gap-2">
          {valores.map((v) => (
            <li
              key={v}
              className="inline-flex items-center gap-1 rounded-chip bg-marca-suave py-1 pl-3 pr-1 text-sm font-medium text-marca"
            >
              {v}
              <button
                type="button"
                aria-label={`Quitar ${v}`}
                onClick={() => onCambio(valores.filter((x) => x !== v))}
                className="flex h-7 w-7 items-center justify-center rounded-chip hover:bg-superficie focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          aria-label={agregar}
          placeholder={agregar}
          maxLength={60}
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sumar();
            }
          }}
          className="min-h-12 min-w-0 flex-1 rounded-boton border border-borde bg-superficie px-3.5 text-base text-texto placeholder:text-texto-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marca"
        />
        <Button variante="secundario" icono={Plus} onClick={sumar}>
          Agregar
        </Button>
      </div>
    </div>
  );
}

/** Etiquetas de habilidades y puestos sugeridos de cada sector. */
export function SeccionEtiquetas() {
  const toast = useToast();
  const sectores = useDemoStore((s) => s.sectores);
  const actualizarSector = useDemoStore((s) => s.actualizarSector);
  const [elegido, setElegido] = useState('');

  const sector = sectores.find((s) => s.id === (elegido || sectores[0]?.id));

  return (
    <section aria-label="Etiquetas por sector">
      <h2 className="mb-1 font-titulo text-xl font-semibold text-texto">Etiquetas por sector</h2>
      <p className="mb-3 text-base text-texto-2">
        Las habilidades y los puestos sugeridos que ven candidatos y empresas.
      </p>
      <Card className="flex flex-col gap-5">
        <Select
          etiqueta="Sector"
          name="sector-etiquetas"
          opciones={sectores.map((s) => ({ valor: s.id, texto: s.nombre }))}
          value={sector?.id ?? ''}
          onChange={(e) => setElegido(e.target.value)}
        />
        {sector && (
          <>
            <EditorEtiquetas
              etiqueta="Habilidades"
              valores={sector.habilidades}
              agregar="Nueva habilidad"
              onCambio={(habilidades) => {
                actualizarSector(sector.id, { habilidades });
                toast.exito('Etiquetas guardadas');
              }}
            />
            <EditorEtiquetas
              etiqueta="Puestos sugeridos"
              valores={sector.puestos}
              agregar="Nuevo puesto"
              onCambio={(puestos) => {
                actualizarSector(sector.id, { puestos });
                toast.exito('Etiquetas guardadas');
              }}
            />
          </>
        )}
      </Card>
    </section>
  );
}
