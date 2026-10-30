// P07 · HU-4.2
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AlertTriangle, Briefcase, CheckCircle2, MapPin, Send } from 'lucide-react';
import { VIGENCIA_VACANTE_DIAS } from '@/data/config';
import { cargaSimulada } from '@/lib/esperar';
import { sumarDias } from '@/lib/fechas';
import { ETIQUETA_TURNO } from '@/lib/etiquetas';
import { fechaCorta, moneda } from '@/lib/formato';
import { coincide, cvFaltantes, diasRestantes } from '@/store/reglas';
import { useDemoStore } from '@/store/useDemoStore';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  GrupoOpciones,
  Modal,
  ScreenHeader,
  SectorChip,
  StickyAction,
  useToast,
  VigenciaBar,
} from '@/ui';

type Paso = 'incompleto' | 'preguntas' | 'confirmacion' | null;
type Respuesta = 'si' | 'no' | '';

const OPCIONES_SI_NO: { valor: 'si' | 'no'; texto: string }[] = [
  { valor: 'si', texto: 'Sí' },
  { valor: 'no', texto: 'No' },
];

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="font-titulo text-lg font-semibold text-texto">{titulo}</h2>
      <ul className="mt-2 list-disc pl-5 text-base text-texto">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

export default function P07Vacante() {
  const { id } = useParams();
  const toast = useToast();
  const hoy = useDemoStore((s) => s.hoy);
  const postularse = useDemoStore((s) => s.postularse);
  const vacante = useDemoStore((s) => s.vacantes.find((v) => v.id === id));
  const empresa = useDemoStore((s) => s.empresas.find((e) => e.id === vacante?.empresaId));
  const candidato = useDemoStore((s) =>
    s.sesion?.rol === 'candidato' ? s.candidatos.find((c) => c.id === s.sesion?.id) : undefined,
  );
  const postulado = useDemoStore((s) =>
    s.postulaciones.some((p) => p.vacanteId === id && p.candidatoId === s.sesion?.id),
  );

  const [paso, setPaso] = useState<Paso>(null);
  const [respuestas, setRespuestas] = useState<Record<string, Respuesta>>({});
  const [intento, setIntento] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (!candidato) return <Navigate to="/entrar" replace />;
  if (!vacante || !empresa) {
    return (
      <EmptyState
        icono={Briefcase}
        titulo="No encontramos esta vacante"
        texto="Puede que ya no esté publicada."
        accion={<Button to="/candidato/vacantes">Buscar vacantes</Button>}
      />
    );
  }

  const faltantes = cvFaltantes(candidato);
  const dias = diasRestantes(vacante, hoy);
  const abierta = vacante.estado === 'activa';
  const sinRespuesta = vacante.preguntas.some((p) => !respuestas[p.id]);

  const enviar = async () => {
    setEnviando(true);
    await cargaSimulada();
    const resultado = postularse(
      vacante.id,
      Object.fromEntries(vacante.preguntas.map((p) => [p.id, respuestas[p.id] === 'si'])),
    );
    setEnviando(false);
    if (resultado.ok) {
      setPaso('confirmacion');
    } else if (resultado.motivo === 'duplicada') {
      setPaso(null);
      toast.info('Ya te postulaste a esta vacante');
    } else if (resultado.motivo === 'cv_incompleto') {
      setPaso('incompleto');
    } else {
      setPaso(null);
      toast.error('Esta vacante ya no recibe postulaciones');
    }
  };

  const empezar = () => {
    if (faltantes.length > 0) {
      setPaso('incompleto');
    } else if (vacante.preguntas.length > 0) {
      setIntento(false);
      setPaso('preguntas');
    } else {
      void enviar();
    }
  };

  const mandarRespuestas = () => {
    setIntento(true);
    if (sinRespuesta) return;
    void enviar();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <ScreenHeader
        titulo={`${vacante.puesto} en ${empresa.nombre}`}
        subtitulo="Revisa los detalles y postúlate"
        migas={[{ texto: 'Vacantes', to: '/candidato/vacantes' }, { texto: vacante.puesto }]}
      />

      <div className="flex flex-col gap-5">
        <Card className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <SectorChip sector={vacante.sector} />
            {coincide(candidato, vacante) && <Badge tono="verde">Coincide contigo</Badge>}
            {postulado && <Badge tono="gris">Ya te postulaste</Badge>}
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-texto-2">Sueldo</dt>
              <dd className="text-lg font-semibold text-texto">{moneda(vacante.sueldo)} al mes</dd>
            </div>
            <div>
              <dt className="text-sm text-texto-2">Turno</dt>
              <dd className="text-lg font-semibold text-texto">{ETIQUETA_TURNO[vacante.turno]}</dd>
            </div>
            <div>
              <dt className="text-sm text-texto-2">Contrato</dt>
              <dd className="text-base text-texto">{vacante.contrato || 'Por definir'}</dd>
            </div>
            <div>
              <dt className="text-sm text-texto-2">Zona</dt>
              <dd className="flex items-center gap-1.5 text-base text-texto">
                <MapPin size={16} className="text-texto-3" aria-hidden="true" />
                {vacante.zona}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="flex flex-col gap-5">
          <section>
            <h2 className="font-titulo text-lg font-semibold text-texto">Sobre el puesto</h2>
            <p className="mt-2 text-base text-texto">{vacante.descripcion}</p>
          </section>
          <Lista titulo="Requisitos" items={vacante.requisitos} />
          <Lista titulo="Prestaciones" items={vacante.prestaciones} />
        </Card>

        <Card>
          <h2 className="mb-2 font-titulo text-lg font-semibold text-texto">Vigencia</h2>
          <VigenciaBar dias={dias} />
          <p className="mt-2 text-sm text-texto-2">
            Publicada por {VIGENCIA_VACANTE_DIAS} días, vence el{' '}
            {fechaCorta(sumarDias(vacante.publicadaEl, VIGENCIA_VACANTE_DIAS))}.
          </p>
        </Card>
      </div>

      <StickyAction>
        {postulado ? (
          <Button
            icono={CheckCircle2}
            variante="secundario"
            disabled
            className="flex-1 md:flex-none"
          >
            Ya te postulaste
          </Button>
        ) : abierta ? (
          <Button
            icono={Send}
            cargando={enviando && paso === null}
            onClick={empezar}
            className="flex-1 md:flex-none"
          >
            Postularme en un clic
          </Button>
        ) : (
          <Button variante="secundario" disabled className="flex-1 md:flex-none">
            Esta vacante ya no recibe postulaciones
          </Button>
        )}
      </StickyAction>

      <Modal
        abierto={paso === 'incompleto'}
        onCerrar={() => setPaso(null)}
        titulo="Antes de postularte"
        pie={
          <>
            <Button to="/candidato/cv/paso/1">Completar mi CV</Button>
            <Button variante="fantasma" onClick={() => setPaso(null)}>
              Ahora no
            </Button>
          </>
        }
      >
        <p className="flex items-center gap-2 text-base font-semibold text-alerta">
          <AlertTriangle size={20} aria-hidden="true" />
          Te falta completar:
        </p>
        <ul className="mt-2 list-disc pl-5 text-base text-texto">
          {faltantes.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Modal>

      <Modal
        abierto={paso === 'preguntas'}
        onCerrar={() => !enviando && setPaso(null)}
        titulo={`Preguntas de ${empresa.nombre}`}
        pie={
          <Button
            icono={Send}
            cargando={enviando}
            onClick={mandarRespuestas}
            className="w-full md:w-auto"
          >
            Enviar postulación
          </Button>
        }
      >
        <p className="mb-4 text-base text-texto-2">Responde con sinceridad. Es rápido.</p>
        <div className="flex flex-col gap-5">
          {vacante.preguntas.map((p) => (
            <GrupoOpciones<'si' | 'no'>
              key={p.id}
              etiqueta={p.texto}
              opciones={OPCIONES_SI_NO}
              valor={respuestas[p.id] ?? ''}
              onCambio={(v) => setRespuestas((r) => ({ ...r, [p.id]: v }))}
              error={intento && !respuestas[p.id] ? 'Elige Sí o No' : undefined}
            />
          ))}
        </div>
      </Modal>

      <Modal
        abierto={paso === 'confirmacion'}
        onCerrar={() => setPaso(null)}
        titulo="¡Listo!"
        pie={
          <>
            <Button to="/candidato/postulaciones">Ver mis postulaciones</Button>
            <Button variante="secundario" to="/candidato/vacantes">
              Seguir buscando
            </Button>
          </>
        }
      >
        <p className="text-base text-texto">Tu postulación llegó a {empresa.nombre}.</p>
        <p className="mt-2 text-base text-texto-2">
          Te avisaremos por WhatsApp cuando haya novedades.
        </p>
      </Modal>
    </div>
  );
}
