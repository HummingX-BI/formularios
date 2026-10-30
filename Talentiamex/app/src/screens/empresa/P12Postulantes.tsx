// P12 · HU-5.1
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Inbox,
  MessageCircle,
  Star,
  UserX,
  Undo2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { aniosExperiencia } from '@/store/reglas';
import { useDemoStore } from '@/store/useDemoStore';
import type { Candidato, EstadoPostulacion, Postulacion, Vacante } from '@/types';
import { Avatar, BadgeDescarte, Button, Card, EmptyState, ScreenHeader, useToast } from '@/ui';
import { ModalContactar } from './compartido/ModalContactar';
import { PanelCv } from './compartido/PanelCv';

type Pestana = 'nuevos' | 'revision' | 'preseleccionados' | 'descartados';

const PESTANAS: { id: Pestana; texto: string; estado: EstadoPostulacion }[] = [
  { id: 'nuevos', texto: 'Nuevos', estado: 'enviada' },
  { id: 'revision', texto: 'En revisión', estado: 'en_revision' },
  { id: 'preseleccionados', texto: 'Preseleccionados', estado: 'preseleccionado' },
  { id: 'descartados', texto: 'Descartados', estado: 'descartado' },
];

const VACIO: Record<Pestana, string> = {
  nuevos: 'No tienes postulantes nuevos por ahora.',
  revision: 'Aquí aparecen los postulantes que ya empezaste a revisar.',
  preseleccionados: 'Preselecciona a quienes quieras contactar.',
  descartados: 'No has descartado a nadie.',
};

function RespuestasDetalle({
  vacante,
  postulacion,
}: {
  vacante: Vacante;
  postulacion: Postulacion;
}) {
  if (vacante.preguntas.length === 0) {
    return <p className="text-base text-texto-2">Esta vacante no tiene preguntas de descarte.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {vacante.preguntas.map((p) => {
        const respuesta = postulacion.respuestas[p.id];
        const cumple = respuesta === p.respuestaEsperada;
        return (
          <li key={p.id} className="flex items-start gap-2 text-base text-texto">
            {cumple ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accion" aria-label="Cumple" />
            ) : (
              <XCircle size={20} className="mt-0.5 shrink-0 text-error" aria-label="No cumple" />
            )}
            <span>
              {p.texto}{' '}
              <strong className="font-semibold">
                Respondió: {respuesta === undefined ? 'Sin respuesta' : respuesta ? 'Sí' : 'No'}
              </strong>
              <span className="text-texto-2">
                {' '}
                · Esperabas: {p.respuestaEsperada ? 'Sí' : 'No'}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

interface TarjetaProps {
  postulacion: Postulacion;
  candidato: Candidato;
  vacante: Vacante;
  hoy: string;
  onEstado: (estado: EstadoPostulacion) => void;
  onVerCv: () => void;
  onContactar: () => void;
}

function TarjetaPostulante({
  postulacion: p,
  candidato: c,
  vacante,
  hoy,
  onEstado,
  onVerCv,
  onContactar,
}: TarjetaProps) {
  const [abierto, setAbierto] = useState(false);
  const anios = aniosExperiencia(c, hoy);
  const experiencia = c.sinExperiencia
    ? 'Sin experiencia'
    : anios === 1
      ? '1 año de experiencia'
      : `${anios} años de experiencia`;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar
          nombre={c.nombre}
          sector={c.sector}
          {...(c.fotoUrl ? { fotoUrl: c.fotoUrl } : {})}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-titulo text-lg font-semibold text-texto">{c.nombre}</h3>
          <p className="text-base text-texto-2">
            {c.zona} · {experiencia}
          </p>
          <div className="mt-2">
            <BadgeDescarte cumple={p.cumpleDescarte} />
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
          className="flex items-center gap-1 rounded text-base font-semibold text-marca hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
        >
          {abierto ? (
            <ChevronUp size={18} aria-hidden="true" />
          ) : (
            <ChevronDown size={18} aria-hidden="true" />
          )}
          {abierto ? 'Ocultar respuestas' : 'Ver respuestas'}
        </button>
        {abierto && (
          <div className="mt-3 rounded-boton bg-fondo p-3">
            <RespuestasDetalle vacante={vacante} postulacion={p} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
        {p.estado !== 'preseleccionado' && (
          <Button
            icono={Star}
            onClick={() => onEstado('preseleccionado')}
            className="col-span-3 sm:col-auto"
          >
            Preseleccionar
          </Button>
        )}
        {p.estado !== 'descartado' ? (
          <Button
            variante="secundario"
            icono={UserX}
            onClick={() => onEstado('descartado')}
            className="!px-2 sm:!px-5"
          >
            Descartar
          </Button>
        ) : (
          <Button
            variante="secundario"
            icono={Undo2}
            onClick={() => onEstado('en_revision')}
            className="!px-2 sm:!px-5"
          >
            Volver a revisión
          </Button>
        )}
        <Button variante="fantasma" icono={FileText} onClick={onVerCv} className="!px-2 sm:!px-5">
          Ver CV
        </Button>
        <Button
          variante="fantasma"
          icono={MessageCircle}
          onClick={onContactar}
          className="!px-2 sm:!px-5"
        >
          Contactar
        </Button>
      </div>
    </Card>
  );
}

export default function P12Postulantes() {
  const { id } = useParams();
  const toast = useToast();
  const hoy = useDemoStore((s) => s.hoy);
  const vacante = useDemoStore((s) => s.vacantes.find((v) => v.id === id));
  const empresaId = useDemoStore((s) => (s.sesion?.rol === 'empresa' ? s.sesion.id : undefined));
  const postulaciones = useDemoStore((s) => s.postulaciones);
  const candidatos = useDemoStore((s) => s.candidatos);
  const cambiarEstado = useDemoStore((s) => s.cambiarEstadoPostulacion);

  const delaVacante = postulaciones.filter((p) => p.vacanteId === id);
  const inicial =
    PESTANAS.find((t) => delaVacante.some((p) => p.estado === t.estado))?.id ?? 'nuevos';
  const [pestana, setPestana] = useState<Pestana>(inicial);
  const [verCvDe, setVerCvDe] = useState<string | null>(null);
  const [contactarA, setContactarA] = useState<string | null>(null);

  if (!empresaId) return <Navigate to="/entrar" replace />;
  if (!vacante || vacante.empresaId !== empresaId) return <Navigate to="/empresa" replace />;

  const actual = PESTANAS.find((t) => t.id === pestana) ?? PESTANAS[0];
  const lista = delaVacante.filter((p) => p.estado === actual?.estado);
  const total = delaVacante.length;

  const cambiar = (p: Postulacion, nombre: string, estado: EstadoPostulacion) => {
    cambiarEstado(p.id, estado);
    if (estado === 'preseleccionado') toast.exito(`Preseleccionaste a ${nombre}`);
    else if (estado === 'descartado') toast.info(`Descartaste a ${nombre}`);
    else toast.info(`${nombre} volvió a revisión`);
  };

  // Al abrir el CV de alguien nuevo, pasa a "En revisión".
  const abrirCv = (p: Postulacion) => {
    if (p.estado === 'enviada') cambiarEstado(p.id, 'en_revision');
    setVerCvDe(p.id);
  };
  const enPanel = delaVacante.find((p) => p.id === verCvDe);
  const candidatoPanel = candidatos.find((c) => c.id === enPanel?.candidatoId);
  const candidatoContacto = candidatos.find((c) => c.id === contactarA);

  return (
    <div className="mx-auto max-w-3xl">
      <ScreenHeader
        titulo={`${total === 1 ? '1 postulante' : `${total} postulantes`} para ${vacante.puesto}`}
        subtitulo="Revisa y decide quién avanza"
        migas={[{ texto: 'Panel', to: '/empresa' }, { texto: 'Postulantes' }]}
      />

      <div
        role="tablist"
        aria-label="Estado de los postulantes"
        className="mb-5 grid grid-cols-2 gap-1 rounded-boton bg-borde p-1 md:grid-cols-4"
      >
        {PESTANAS.map((t) => {
          const cuantos = delaVacante.filter((p) => p.estado === t.estado).length;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={pestana === t.id}
              onClick={() => setPestana(t.id)}
              className={cn(
                'min-h-11 rounded-boton px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca md:text-base',
                pestana === t.id
                  ? 'bg-superficie text-marca shadow-1'
                  : 'text-texto-2 hover:text-texto',
              )}
            >
              {t.texto} ({cuantos})
            </button>
          );
        })}
      </div>

      {lista.length === 0 ? (
        <EmptyState icono={Inbox} titulo="Nada por aquí" texto={VACIO[pestana]} />
      ) : (
        <ul className="flex flex-col gap-4">
          {lista.map((p) => {
            const candidato = candidatos.find((c) => c.id === p.candidatoId);
            if (!candidato) return null;
            return (
              <li key={p.id}>
                <TarjetaPostulante
                  postulacion={p}
                  candidato={candidato}
                  vacante={vacante}
                  hoy={hoy}
                  onEstado={(estado) => cambiar(p, candidato.nombre, estado)}
                  onVerCv={() => abrirCv(p)}
                  onContactar={() => setContactarA(candidato.id)}
                />
              </li>
            );
          })}
        </ul>
      )}

      <PanelCv
        candidato={candidatoPanel}
        onCerrar={() => setVerCvDe(null)}
        acciones={
          enPanel && candidatoPanel ? (
            <>
              {enPanel.estado !== 'preseleccionado' && (
                <Button
                  icono={Star}
                  onClick={() => cambiar(enPanel, candidatoPanel.nombre, 'preseleccionado')}
                >
                  Preseleccionar
                </Button>
              )}
              {enPanel.estado !== 'descartado' && (
                <Button
                  variante="secundario"
                  icono={UserX}
                  onClick={() => cambiar(enPanel, candidatoPanel.nombre, 'descartado')}
                >
                  Descartar
                </Button>
              )}
              <Button
                variante="fantasma"
                icono={MessageCircle}
                onClick={() => setContactarA(candidatoPanel.id)}
              >
                Contactar
              </Button>
            </>
          ) : undefined
        }
      />
      <ModalContactar
        candidato={candidatoContacto}
        vacante={vacante}
        onCerrar={() => setContactarA(null)}
      />
    </div>
  );
}
