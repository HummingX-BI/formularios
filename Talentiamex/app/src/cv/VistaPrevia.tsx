import { useEffect, useRef, useState } from 'react';
import type { Candidato, PlantillaCv } from '@/types';
import { PLANTILLAS_CV } from './plantillas';
import { A4_ALTO, A4_ANCHO } from './utilCv';

interface VistaPreviaProps {
  candidato: Candidato;
  plantilla: PlantillaCv;
}

/** Vista previa de la hoja A4 escalada para que quepa en el ancho disponible. */
export function VistaPrevia({ candidato, plantilla }: VistaPreviaProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(A4_ANCHO);
  const Plantilla = PLANTILLAS_CV[plantilla];

  useEffect(() => {
    const el = contenedor.current;
    if (!el) return;
    const medir = () => setAncho(el.clientWidth);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => {
      observador.disconnect();
    };
  }, []);

  const escala = Math.min(1, ancho / A4_ANCHO);

  return (
    <div ref={contenedor} className="w-full min-w-0">
      <div
        role="img"
        aria-label={`Vista previa de tu CV con la plantilla ${plantilla}`}
        className="overflow-hidden rounded border border-borde bg-superficie shadow-2"
        style={{ width: A4_ANCHO * escala, height: Math.round(A4_ALTO * escala) }}
      >
        <div
          style={{ width: A4_ANCHO, transform: `scale(${escala})`, transformOrigin: 'top left' }}
        >
          <Plantilla candidato={candidato} />
        </div>
      </div>
    </div>
  );
}
