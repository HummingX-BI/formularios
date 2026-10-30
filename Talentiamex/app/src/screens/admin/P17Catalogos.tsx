// P17 · HU-8.3
import { ScreenHeader } from '@/ui';
import { SeccionEtiquetas } from './catalogos/SeccionEtiquetas';
import { SeccionPlanes } from './catalogos/SeccionPlanes';
import { SeccionSectores } from './catalogos/SeccionSectores';

export default function P17Catalogos() {
  return (
    <div className="flex flex-col gap-10">
      <ScreenHeader titulo="Catálogos" subtitulo="Agrega sectores y ajusta planes sin programar" />
      <SeccionSectores />
      <SeccionEtiquetas />
      <SeccionPlanes />
    </div>
  );
}
