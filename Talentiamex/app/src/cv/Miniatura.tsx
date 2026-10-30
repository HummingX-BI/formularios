import type { Candidato, PlantillaCv } from '@/types';
import { PLANTILLAS_CV } from './plantillas';
import { A4_ALTO, A4_ANCHO } from './utilCv';

interface MiniaturaProps {
  candidato: Candidato;
  plantilla: PlantillaCv;
  /** Ancho en píxeles de la miniatura. */
  ancho: number;
}

/** La plantilla real reducida; no recibe clics ni foco. */
export function Miniatura({ candidato, plantilla, ancho }: MiniaturaProps) {
  const Plantilla = PLANTILLAS_CV[plantilla];
  const escala = ancho / A4_ANCHO;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none overflow-hidden rounded border border-borde bg-superficie"
      style={{ width: ancho, height: Math.round(A4_ALTO * escala) }}
    >
      <div style={{ width: A4_ANCHO, transform: `scale(${escala})`, transformOrigin: 'top left' }}>
        <Plantilla candidato={candidato} />
      </div>
    </div>
  );
}
