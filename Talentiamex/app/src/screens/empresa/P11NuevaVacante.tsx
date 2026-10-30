// P11 · HU-3.1, HU-3.2
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { puedePublicar } from '@/store/reglas';
import { useDemoStore } from '@/store/useDemoStore';
import { Button, Modal, ProgressBar, ScreenHeader, Stepper, StickyAction } from '@/ui';
import { Paso1DatosVacante } from './vacante/Paso1DatosVacante';
import {
  borradorDesde,
  borradorVacio,
  PASOS_VACANTE,
  TOTAL_PASOS_VACANTE,
  validarDatos,
  type BorradorVacante,
} from './vacante/borrador';

export default function P11NuevaVacante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hoy = useDemoStore((s) => s.hoy);
  const empresa = useDemoStore((s) =>
    s.sesion?.rol === 'empresa' ? s.empresas.find((e) => e.id === s.sesion?.id) : undefined,
  );
  const existente = useDemoStore((s) => s.vacantes.find((v) => v.id === id));

  const [paso, setPaso] = useState(1);
  const [borrador, setBorrador] = useState<BorradorVacante>(() =>
    existente ? borradorDesde(existente) : borradorVacio(empresa?.sector ?? ''),
  );
  const [intento, setIntento] = useState(false);

  if (!empresa) return <Navigate to="/entrar" replace />;
  if (id && (!existente || existente.empresaId !== empresa.id)) {
    return <Navigate to="/empresa" replace />;
  }

  const editando = Boolean(existente);
  // RD-04: sin prueba ni plan activo no se puede publicar (editar sí).
  const sinPlan = !editando && !puedePublicar(empresa, hoy);
  const info = PASOS_VACANTE[paso - 1];
  const errores = validarDatos(borrador);
  const cambiar = (parte: Partial<BorradorVacante>) => setBorrador((b) => ({ ...b, ...parte }));

  const siguiente = () => {
    if (paso === 1) {
      setIntento(true);
      if (Object.keys(errores).length > 0) return;
    }
    setIntento(false);
    setPaso((p) => Math.min(TOTAL_PASOS_VACANTE, p + 1));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <ScreenHeader
        titulo={`Paso ${paso} de ${TOTAL_PASOS_VACANTE} · ${info?.nombre ?? ''}`}
        subtitulo={info?.ayuda}
        migas={[
          { texto: 'Panel', to: '/empresa' },
          { texto: editando ? 'Editar vacante' : 'Nueva vacante' },
        ]}
      />
      <div className="mb-6 flex flex-col gap-3">
        <Stepper pasos={PASOS_VACANTE.map((p) => p.corto)} actual={paso} />
        <ProgressBar
          valor={(paso / TOTAL_PASOS_VACANTE) * 100}
          etiqueta="Avance de la vacante"
          mostrarPorcentaje
        />
      </div>

      <div className="flex flex-col gap-5 rounded-tarjeta bg-superficie p-4 shadow-1 md:p-6">
        {paso === 1 && (
          <Paso1DatosVacante
            borrador={borrador}
            onCambio={cambiar}
            errores={intento ? errores : {}}
          />
        )}
        {paso > 1 && <p className="text-base text-texto-2">Próximamente</p>}
      </div>

      <StickyAction>
        {paso > 1 && (
          <Button variante="secundario" icono={ArrowLeft} onClick={() => setPaso((p) => p - 1)}>
            Atrás
          </Button>
        )}
        <Button icono={ArrowRight} onClick={siguiente} className="flex-1 md:flex-none">
          Siguiente
        </Button>
      </StickyAction>

      <Modal
        abierto={sinPlan}
        onCerrar={() => navigate('/empresa')}
        titulo="Para publicar necesitas un plan"
        pie={
          <>
            <Button to="/empresa/planes">Elegir plan</Button>
            <Button variante="fantasma" onClick={() => navigate('/empresa')}>
              Volver al panel
            </Button>
          </>
        }
      >
        <p className="text-base text-texto">
          Empieza tu prueba gratis o contrata un plan para publicar vacantes.
        </p>
      </Modal>
    </div>
  );
}
