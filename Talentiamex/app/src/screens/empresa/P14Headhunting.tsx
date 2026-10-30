// P14 · HU-8.4
import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { ClipboardList, Inbox, Search, Send, Users, type LucideIcon } from 'lucide-react';
import { cargaSimulada } from '@/lib/esperar';
import { fechaCorta } from '@/lib/formato';
import { useDemoStore } from '@/store/useDemoStore';
import type { EstadoHeadhunting, SectorId } from '@/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  GrupoOpciones,
  Input,
  ScreenHeader,
  SectorChip,
  SelectorSector,
  Textarea,
  useToast,
} from '@/ui';
import type { TonoBadge } from '@/ui';

const PASOS: { icono: LucideIcon; titulo: string; texto: string }[] = [
  {
    icono: ClipboardList,
    titulo: 'Cuéntanos el puesto',
    texto: 'Llena el formulario con lo que necesitas.',
  },
  { icono: Search, titulo: 'Buscamos y filtramos', texto: 'Nuestros reclutadores buscan por ti.' },
  {
    icono: Users,
    titulo: 'Te presentamos finalistas',
    texto: 'Recibes solo perfiles que valen la pena.',
  },
];

const URGENCIAS = ['Esta semana', '2 semanas', '1 mes'] as const;

const ESTADO: Record<EstadoHeadhunting, { tono: TonoBadge; texto: string }> = {
  recibida: { tono: 'gris', texto: 'Recibida' },
  en_busqueda: { tono: 'ambar', texto: 'En búsqueda' },
  finalistas: { tono: 'verde', texto: 'Finalistas enviados' },
};

export default function P14Headhunting() {
  const toast = useToast();
  const empresa = useDemoStore((s) =>
    s.sesion?.rol === 'empresa' ? s.empresas.find((e) => e.id === s.sesion?.id) : undefined,
  );
  const solicitudes = useDemoStore((s) => s.solicitudes);
  const solicitarHeadhunting = useDemoStore((s) => s.solicitarHeadhunting);

  const [puesto, setPuesto] = useState('');
  const [sector, setSector] = useState<SectorId>(empresa?.sector ?? '');
  const [vacantes, setVacantes] = useState('1');
  const [urgencia, setUrgencia] = useState('');
  const [sueldoRango, setSueldoRango] = useState('');
  const [detalle, setDetalle] = useState('');
  const [intento, setIntento] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (!empresa) return <Navigate to="/entrar" replace />;

  const errores = {
    puesto: puesto.trim() ? undefined : 'Escribe el puesto que necesitas',
    sector: sector ? undefined : 'Elige el sector',
    vacantes: Number(vacantes) >= 1 ? undefined : 'Indica cuántas vacantes son',
    urgencia: urgencia ? undefined : 'Elige qué tan urgente es',
    sueldoRango: sueldoRango.trim() ? undefined : 'Escribe el rango de sueldo',
    detalle: detalle.trim() ? undefined : 'Cuéntanos qué lo hace difícil de cubrir',
  };
  const ver = (campo: keyof typeof errores) => (intento ? errores[campo] : undefined);
  const mias = solicitudes
    .filter((s) => s.empresaId === empresa.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setIntento(true);
    if (Object.values(errores).some(Boolean)) return;
    setEnviando(true);
    await cargaSimulada();
    solicitarHeadhunting({
      puesto: puesto.trim(),
      sector,
      vacantes: Number(vacantes),
      urgencia,
      sueldoRango: sueldoRango.trim(),
      detalle: detalle.trim(),
    });
    setEnviando(false);
    toast.exito('Recibimos tu solicitud. Un reclutador te contactará pronto');
    setPuesto('');
    setVacantes('1');
    setUrgencia('');
    setSueldoRango('');
    setDetalle('');
    setIntento(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <ScreenHeader
        titulo="Headhunting especializado"
        subtitulo="Nuestros reclutadores buscan por ti el perfil difícil"
      />

      <ol aria-label="Cómo funciona" className="mb-6 grid gap-3 md:grid-cols-3">
        {PASOS.map(({ icono: Icono, titulo, texto }, i) => (
          <li
            key={titulo}
            className="flex items-start gap-3 rounded-tarjeta bg-superficie p-4 shadow-1"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-chip bg-marca-suave text-marca">
              <Icono size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-texto-2">Paso {i + 1}</p>
              <p className="font-titulo text-base font-semibold text-texto">{titulo}</p>
              <p className="text-sm text-texto-2">{texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <Card>
        <form onSubmit={(e) => void enviar(e)} noValidate className="flex flex-col gap-5">
          <h2 className="font-titulo text-xl font-semibold text-texto">Cuéntanos qué buscas</h2>
          <Input
            etiqueta="Puesto"
            name="puesto"
            placeholder="Ej. Jefa de enfermería"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            error={ver('puesto')}
          />
          <SelectorSector
            etiqueta="Sector"
            valor={sector}
            onCambio={setSector}
            error={ver('sector')}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              etiqueta="Número de vacantes"
              name="vacantes"
              inputMode="numeric"
              value={vacantes}
              onChange={(e) => setVacantes(e.target.value.replace(/\D/g, '').slice(0, 2))}
              error={ver('vacantes')}
            />
            <Input
              etiqueta="Rango de sueldo mensual"
              name="sueldoRango"
              placeholder="Ej. $28,000–$32,000"
              value={sueldoRango}
              onChange={(e) => setSueldoRango(e.target.value)}
              error={ver('sueldoRango')}
            />
          </div>
          <GrupoOpciones
            etiqueta="¿Qué tan urgente es?"
            opciones={URGENCIAS.map((u) => ({ valor: u, texto: u }))}
            valor={urgencia as (typeof URGENCIAS)[number] | ''}
            onCambio={setUrgencia}
            error={ver('urgencia')}
          />
          <Textarea
            etiqueta="¿Qué lo hace difícil de cubrir?"
            name="detalle"
            rows={4}
            placeholder="Ej. Se requiere experiencia en gestión de turnos."
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            error={ver('detalle')}
          />
          <Button type="submit" icono={Send} cargando={enviando} anchoCompleto>
            Enviar solicitud
          </Button>
        </form>
      </Card>

      <section aria-label="Mis solicitudes" className="mt-8">
        <h2 className="mb-3 font-titulo text-xl font-semibold text-texto">Mis solicitudes</h2>
        {mias.length === 0 ? (
          <EmptyState
            icono={Inbox}
            titulo="Aún no tienes solicitudes"
            texto="Cuando envíes una, aquí verás cómo avanza la búsqueda."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {mias.map((s) => (
              <li key={s.id}>
                <Card className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-titulo text-lg font-semibold text-texto">{s.puesto}</h3>
                    <Badge tono={ESTADO[s.estado].tono}>{ESTADO[s.estado].texto}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-base text-texto-2">
                    <SectorChip sector={s.sector} />
                    <span>
                      {s.vacantes === 1 ? '1 vacante' : `${s.vacantes} vacantes`} · {s.urgencia}
                    </span>
                    <span>Enviada el {fechaCorta(s.fecha)}</span>
                  </div>
                  {s.reclutador && (
                    <p className="text-base text-texto">
                      Reclutador asignado: <strong className="font-semibold">{s.reclutador}</strong>
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
