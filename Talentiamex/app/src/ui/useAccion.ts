import { useCallback, useState } from 'react';
import { cargaSimulada } from '@/lib/esperar';

/**
 * Acciones que en el producto real irían al servidor: muestran de 300 a 600 ms de carga
 * (el botón con la misma clave se ve ocupado) y luego se ejecutan.
 */
export function useAccion() {
  const [ocupado, setOcupado] = useState<string | null>(null);

  const ejecutar = useCallback(
    async (clave: string, accion: () => void): Promise<void> => {
      if (ocupado !== null) return;
      setOcupado(clave);
      await cargaSimulada();
      accion();
      setOcupado(null);
    },
    [ocupado],
  );

  return { ocupado, ejecutar };
}
