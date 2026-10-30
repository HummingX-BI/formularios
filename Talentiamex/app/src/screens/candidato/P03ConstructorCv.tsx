// P03 · HU-2.1, HU-2.2
import { Navigate, useParams } from 'react-router-dom';
import { useDemoStore } from '@/store/useDemoStore';
import { Paso1Datos } from './cv/Paso1Datos';
import { Paso2Busqueda } from './cv/Paso2Busqueda';
import { Paso3Experiencia } from './cv/Paso3Experiencia';
import { Paso4Estudios } from './cv/Paso4Estudios';
import { Paso5Habilidades } from './cv/Paso5Habilidades';
import { TOTAL_PASOS_CV } from './cv/pasosCv';

export default function P03ConstructorCv() {
  const { n } = useParams();
  const paso = Number(n);
  const candidato = useDemoStore((s) =>
    s.sesion?.rol === 'candidato' ? s.candidatos.find((c) => c.id === s.sesion?.id) : undefined,
  );

  if (!Number.isInteger(paso) || paso < 1 || paso > TOTAL_PASOS_CV) {
    return <Navigate to="/candidato/cv/paso/1" replace />;
  }
  if (!candidato) return <Navigate to="/entrar" replace />;

  switch (paso) {
    case 1:
      return <Paso1Datos key={candidato.id} candidato={candidato} />;
    case 2:
      return <Paso2Busqueda key={candidato.id} candidato={candidato} />;
    case 3:
      return <Paso3Experiencia key={candidato.id} candidato={candidato} />;
    case 4:
      return <Paso4Estudios key={candidato.id} candidato={candidato} />;
    default:
      return <Paso5Habilidades key={candidato.id} candidato={candidato} />;
  }
}
