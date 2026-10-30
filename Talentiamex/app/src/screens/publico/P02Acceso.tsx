// P02 · HU-1.1, HU-1.2, HU-1.3
import { ScreenHeader } from '@/ui';

export type ModoAcceso = 'candidato' | 'empresa' | 'entrar';

export default function P02Acceso({ modo }: { modo: ModoAcceso }) {
  return (
    <ScreenHeader
      titulo={modo === 'entrar' ? 'Entra a tu cuenta' : 'Crea tu cuenta'}
      subtitulo={modo === 'entrar' ? 'Usa tu correo y contraseña' : 'Te toma menos de un minuto'}
    />
  );
}
