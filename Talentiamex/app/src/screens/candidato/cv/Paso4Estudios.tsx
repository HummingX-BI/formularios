import { useState } from 'react';
import { documentosSugeridos, NIVELES_ESTUDIO } from '@/data/documentos';
import { useDemoStore } from '@/store/useDemoStore';
import type { Candidato } from '@/types';
import { ChipsSeleccion, Input, Select } from '@/ui';
import { PasoCv } from './PasoCv';

/** P03 · paso 4: estudios y documentos. Todo es opcional (pregunta abierta Q6). */
export function Paso4Estudios({ candidato }: { candidato: Candidato }) {
  const guardar = useDemoStore((s) => s.guardarPasoCv);
  const [nivel, setNivel] = useState(candidato.estudios.nivel);
  const [institucion, setInstitucion] = useState(candidato.estudios.institucion ?? '');
  const [documentos, setDocumentos] = useState(candidato.documentos);

  const niveles =
    NIVELES_ESTUDIO.includes(nivel) || !nivel ? NIVELES_ESTUDIO : [...NIVELES_ESTUDIO, nivel];

  const guardarPaso = () => {
    guardar(4, {
      estudios: { nivel, ...(institucion.trim() ? { institucion: institucion.trim() } : {}) },
      documentos,
    });
  };

  return (
    <PasoCv
      paso={4}
      onGuardar={guardarPaso}
      onSiguiente={() => {
        guardarPaso();
        return true;
      }}
    >
      <Select
        etiqueta="Nivel de estudios"
        name="nivel"
        placeholder="Elige una opción"
        opciones={niveles.map((n) => ({ valor: n, texto: n }))}
        value={nivel}
        onChange={(e) => setNivel(e.target.value)}
      />
      <Input
        etiqueta="Escuela o institución"
        name="institucion"
        placeholder="Ej. Escuela Nacional de Enfermería"
        value={institucion}
        onChange={(e) => setInstitucion(e.target.value)}
      />
      <ChipsSeleccion
        etiqueta="Documentos o certificaciones"
        ayuda="Toca los que tengas. Son opcionales."
        sugerencias={documentosSugeridos(candidato.sector)}
        seleccion={documentos}
        onCambio={setDocumentos}
        etiquetaAgregar="Otro documento o curso"
      />
    </PasoCv>
  );
}
