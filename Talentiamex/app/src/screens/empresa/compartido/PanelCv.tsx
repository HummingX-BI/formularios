import type { ReactNode } from 'react';
import { VistaPrevia } from '@/cv/VistaPrevia';
import type { Candidato } from '@/types';
import { PanelLateral } from '@/ui';

interface PanelCvProps {
  candidato: Candidato | undefined;
  onCerrar: () => void;
  /** Acciones al pie (Preseleccionar, Contactar…). */
  acciones?: ReactNode;
}

/** CV completo del candidato en la plantilla que él eligió. Se reutiliza en P12 y P13. */
export function PanelCv({ candidato, onCerrar, acciones }: PanelCvProps) {
  return (
    <PanelLateral
      abierto={candidato !== undefined}
      onCerrar={onCerrar}
      titulo={candidato ? `CV de ${candidato.nombre}` : 'CV'}
      pie={acciones}
    >
      {candidato && <VistaPrevia candidato={candidato} plantilla={candidato.plantilla} />}
    </PanelLateral>
  );
}
