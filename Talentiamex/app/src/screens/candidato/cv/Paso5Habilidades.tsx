import { useState } from 'react';
import { useDemoStore } from '@/store/useDemoStore';
import type { Candidato } from '@/types';
import { ChipsSeleccion, Textarea } from '@/ui';
import { PasoCv } from './PasoCv';

/** P03 · paso 5: habilidades y resumen. Termina con "Ver mi CV" hacia P04. */
export function Paso5Habilidades({ candidato }: { candidato: Candidato }) {
  const guardar = useDemoStore((s) => s.guardarPasoCv);
  const sugerencias = useDemoStore(
    (s) => s.sectores.find((x) => x.id === candidato.sector)?.habilidades ?? [],
  );
  const [habilidades, setHabilidades] = useState(candidato.habilidades);
  const [resumen, setResumen] = useState(candidato.resumen);

  const guardarPaso = () => guardar(5, { habilidades, resumen: resumen.trim() });

  return (
    <PasoCv
      paso={5}
      onGuardar={guardarPaso}
      onSiguiente={() => {
        guardarPaso();
        return true;
      }}
    >
      <ChipsSeleccion
        etiqueta="Habilidades"
        ayuda="Toca las que sepas hacer bien."
        sugerencias={sugerencias}
        seleccion={habilidades}
        onCambio={setHabilidades}
        etiquetaAgregar="Otra habilidad"
      />
      <Textarea
        etiqueta="Resumen"
        name="resumen"
        rows={4}
        maxLength={300}
        ayuda="Dos o tres líneas sobre ti y lo que buscas."
        placeholder="Ej. Enfermera con 4 años de experiencia en hospital, responsable y con trato amable. Busco un empleo estable en turno nocturno."
        value={resumen}
        onChange={(e) => setResumen(e.target.value)}
      />
    </PasoCv>
  );
}
