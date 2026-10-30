// P18 · HU-7.1 a HU-7.4
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCheck, MessageCircle, Phone, Video } from 'lucide-react';
import { CLINICA, MARIANA } from '@/data/personajes';
import { cn } from '@/lib/cn';
import { fechaCorta } from '@/lib/formato';
import { useDemoStore } from '@/store/useDemoStore';
import type { MensajeWhatsApp } from '@/types';
import { PanelLateral, PhoneFrame } from '@/ui';
import { useDemoUi } from './useDemoUi';

type Vista = 'empresa' | 'candidato';

const ESPERA_ESCRIBIENDO_MS = 800;
const ALTO_MARCO = 868;
const ANCHO_MARCO = 414;

/** Convierte *texto* en negritas, como en WhatsApp. */
function conNegritas(texto: string): ReactNode[] {
  return texto.split(/\*(.+?)\*/g).map((parte, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {parte}
      </strong>
    ) : (
      parte
    ),
  );
}

function Escribiendo() {
  return (
    <div
      className="flex w-fit items-center gap-1 rounded-boton rounded-tl-none bg-wa-entrada px-3 py-3 shadow-1"
      role="status"
      aria-label="Talentiamex está escribiendo"
    >
      {[0, 150, 300].map((retraso) => (
        <span
          key={retraso}
          className="h-2 w-2 animate-pulse rounded-chip bg-texto-3"
          style={{ animationDelay: `${retraso}ms` }}
        />
      ))}
    </div>
  );
}

function Burbuja({
  mensaje,
  onBoton,
}: {
  mensaje: MensajeWhatsApp;
  onBoton?: (m: MensajeWhatsApp) => void;
}) {
  return (
    <div className="flex max-w-[85%] flex-col gap-1">
      <div className="rounded-boton rounded-tl-none bg-wa-entrada px-3 py-2 text-[15px] leading-snug text-texto shadow-1">
        <p className="whitespace-pre-line">{conNegritas(mensaje.texto)}</p>
        <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-texto-3">
          {mensaje.hora.slice(11, 16)}
          <CheckCheck size={15} className="text-info" aria-label="Leído" />
        </p>
      </div>
      {mensaje.boton && (
        <button
          type="button"
          onClick={() => onBoton?.(mensaje)}
          className="min-h-10 rounded-boton bg-wa-entrada px-3 text-center text-[15px] font-medium text-info shadow-1 hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
        >
          {mensaje.boton.texto}
        </button>
      )}
    </div>
  );
}

interface SimuladorProps {
  /** Qué hacer cuando se toca el botón de un mensaje (navegar a su ruta). */
  onBoton?: (mensaje: MensajeWhatsApp) => void;
}

/** Panel deslizable con un celular y la conversación de WhatsApp de Talentiamex. */
export function WhatsAppSimulator({ onBoton }: SimuladorProps) {
  const abierto = useDemoUi((s) => s.whatsappAbierto);
  const cerrar = useDemoUi((s) => s.cerrarWhatsApp);
  const hoy = useDemoStore((s) => s.hoy);
  const mensajes = useDemoStore((s) => s.mensajes);
  const sesion = useDemoStore((s) => s.sesion);
  const empresas = useDemoStore((s) => s.empresas);
  const candidatos = useDemoStore((s) => s.candidatos);

  const [vista, setVista] = useState<Vista>(sesion?.rol === 'candidato' ? 'candidato' : 'empresa');
  const [revelados, setRevelados] = useState<ReadonlySet<string>>(
    () => new Set(mensajes.map((m) => m.id)),
  );
  const [escribiendoPara, setEscribiendoPara] = useState<string | null>(null);
  const [altoVentana, setAltoVentana] = useState(window.innerHeight);

  // Cola de mensajes nuevos: cada uno "se escribe" 800 ms antes de aparecer.
  const vistos = useRef<Set<string>>(new Set(mensajes.map((m) => m.id)));
  const cola = useRef<MensajeWhatsApp[]>([]);
  const procesando = useRef(false);
  const ultimaLongitud = useRef(mensajes.length);

  useEffect(() => {
    const alRedimensionar = () => setAltoVentana(window.innerHeight);
    window.addEventListener('resize', alRedimensionar);
    return () => {
      window.removeEventListener('resize', alRedimensionar);
    };
  }, []);

  useEffect(() => {
    const procesar = () => {
      if (procesando.current) return;
      const siguiente = cola.current.shift();
      if (!siguiente) {
        setEscribiendoPara(null);
        return;
      }
      procesando.current = true;
      setEscribiendoPara(`${siguiente.para}:${siguiente.destinatarioId}`);
      setTimeout(() => {
        setRevelados((r) => new Set(r).add(siguiente.id));
        procesando.current = false;
        procesar();
      }, ESPERA_ESCRIBIENDO_MS);
    };

    // Si se reinició la demo, se vuelve a empezar desde los mensajes actuales.
    if (mensajes.length < ultimaLongitud.current) {
      vistos.current = new Set(mensajes.map((m) => m.id));
      cola.current = [];
      setRevelados(new Set(mensajes.map((m) => m.id)));
    }
    ultimaLongitud.current = mensajes.length;

    const nuevos = mensajes.filter((m) => !vistos.current.has(m.id));
    if (nuevos.length === 0) return;
    nuevos.forEach((m) => vistos.current.add(m.id));
    cola.current.push(...nuevos);
    procesar();
  }, [mensajes]);

  const destinatarioId = useMemo(() => {
    if (sesion?.rol === vista) return sesion.id;
    const personaje =
      vista === 'empresa'
        ? empresas.find((e) => e.correo === CLINICA.correo)
        : candidatos.find((c) => c.correo === MARIANA.correo);
    if (personaje) return personaje.id;
    return [...mensajes].reverse().find((m) => m.para === vista)?.destinatarioId;
  }, [vista, sesion, empresas, candidatos, mensajes]);

  const nombre =
    vista === 'empresa'
      ? empresas.find((e) => e.id === destinatarioId)?.contacto
      : candidatos.find((c) => c.id === destinatarioId)?.nombre;

  const chat = mensajes.filter(
    (m) => m.para === vista && m.destinatarioId === destinatarioId && revelados.has(m.id),
  );
  const escribiendo = escribiendoPara === `${vista}:${destinatarioId}`;

  const fin = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fin.current?.scrollIntoView({ block: 'end' });
  }, [chat.length, escribiendo, abierto, vista]);

  const escala = Math.min(1, (altoVentana - 150) / ALTO_MARCO);

  // Agrupa por día para poner el separador ("Hoy", "29 oct 2026").
  const filas: { dia: string; mensajes: MensajeWhatsApp[] }[] = [];
  for (const m of chat) {
    const dia = m.hora.slice(0, 10);
    const ultima = filas.at(-1);
    if (ultima?.dia === dia) ultima.mensajes.push(m);
    else filas.push({ dia, mensajes: [m] });
  }

  return (
    <PanelLateral
      abierto={abierto}
      onCerrar={cerrar}
      titulo="Simulador de WhatsApp"
      ancho="md:max-w-lg"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          role="group"
          aria-label="Ver mensajes como"
          className="grid w-full max-w-xs grid-cols-2 gap-1 rounded-boton bg-borde p-1"
        >
          {(['empresa', 'candidato'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={vista === v}
              onClick={() => setVista(v)}
              className={cn(
                'min-h-11 rounded-boton text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
                vista === v ? 'bg-superficie text-marca shadow-1' : 'text-texto-2 hover:text-texto',
              )}
            >
              {v === 'empresa' ? 'Empresa' : 'Candidato'}
            </button>
          ))}
        </div>

        <div style={{ width: ANCHO_MARCO * escala, height: ALTO_MARCO * escala }}>
          <div
            style={{
              transform: `scale(${escala})`,
              transformOrigin: 'top left',
              width: ANCHO_MARCO,
            }}
          >
            <PhoneFrame>
              <div className="flex h-full flex-col">
                <header className="flex items-center gap-3 bg-wa-encabezado px-3 py-2.5 text-white">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-chip bg-superficie font-titulo text-lg font-bold text-marca">
                    T
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold leading-tight">Talentiamex</p>
                    <p className="truncate text-xs opacity-80">
                      {nombre ? `Para ${nombre}` : 'en línea'}
                    </p>
                  </div>
                  <Video size={20} aria-hidden="true" />
                  <Phone size={18} aria-hidden="true" />
                </header>

                <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-wa-fondo p-3">
                  {chat.length === 0 && !escribiendo && (
                    <p className="m-auto flex max-w-[15rem] flex-col items-center gap-2 text-center text-sm text-texto-2">
                      <MessageCircle size={28} aria-hidden="true" />
                      Aún no hay mensajes. Aquí llegarán los avisos de Talentiamex.
                    </p>
                  )}
                  {filas.map((fila) => (
                    <div key={fila.dia} className="flex flex-col gap-2">
                      <p className="mx-auto rounded-chip bg-superficie px-3 py-0.5 text-xs font-medium text-texto-2 shadow-1">
                        {fila.dia === hoy ? 'Hoy' : fechaCorta(fila.dia)}
                      </p>
                      {fila.mensajes.map((m) => (
                        <Burbuja key={m.id} mensaje={m} {...(onBoton ? { onBoton } : {})} />
                      ))}
                    </div>
                  ))}
                  {escribiendo && <Escribiendo />}
                  <div ref={fin} />
                </div>

                <footer className="bg-fondo px-3 py-2 text-sm text-texto-3">
                  <div className="rounded-chip bg-superficie px-4 py-2.5">Solo recibes avisos</div>
                </footer>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </PanelLateral>
  );
}
