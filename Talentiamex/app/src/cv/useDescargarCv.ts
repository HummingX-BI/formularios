import { useState } from 'react';
import type { Candidato } from '@/types';
import { useToast } from '@/ui';
import { exportarPdf } from './exportarPdf';

/** Descarga el PDF del CV y avisa si algo falla. */
export function useDescargarCv() {
  const toast = useToast();
  const [descargando, setDescargando] = useState(false);

  const descargar = async (candidato: Candidato): Promise<boolean> => {
    setDescargando(true);
    try {
      await exportarPdf(candidato);
      return true;
    } catch {
      toast.error('No pudimos preparar tu PDF. Inténtalo otra vez');
      return false;
    } finally {
      setDescargando(false);
    }
  };

  return { descargar, descargando };
}
