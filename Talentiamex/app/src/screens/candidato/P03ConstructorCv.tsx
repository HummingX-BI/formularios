// P03 · HU-2.1, HU-2.2
import { useParams } from 'react-router-dom';
import { ScreenHeader } from '@/ui';

export default function P03ConstructorCv() {
  const { n } = useParams();
  const paso = Math.min(5, Math.max(1, Number(n) || 1));
  return (
    <ScreenHeader
      titulo={`Paso ${paso} de 5`}
      subtitulo="Arma tu CV, es gratis"
      paso={{ actual: paso, total: 5 }}
    />
  );
}
