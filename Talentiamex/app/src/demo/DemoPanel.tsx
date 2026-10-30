import { useEffect, useState } from 'react';
import {
  Building2,
  CalendarPlus,
  RotateCcw,
  Shield,
  Smartphone,
  MessageCircle,
  Sparkles,
  UserRound,
  X,
  Presentation,
} from 'lucide-react';
import { fechaCorta } from '@/lib/formato';
import { useDemoStore } from '@/store/useDemoStore';
import { Button, Modal, useToast } from '@/ui';
import { entrarComoAdmin, entrarComoClinica, entrarComoMariana, reiniciarDemo } from './sesiones';
import { useDemoUi } from './useDemoUi';

const BOTON_PANEL =
  'flex min-h-11 w-full items-center gap-2 rounded-boton border border-borde bg-superficie px-3 text-left text-sm font-medium text-texto hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca disabled:cursor-not-allowed disabled:opacity-50';

function esCampoDeTexto(destino: EventTarget | null): boolean {
  if (!(destino instanceof HTMLElement)) return false;
  return destino.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(destino.tagName);
}

/** Panel flotante para quien presenta la demo. La tecla D lo oculta o lo muestra. */
export function DemoPanel() {
  const [abierto, setAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const hoy = useDemoStore((s) => s.hoy);
  const noLeidos = useDemoStore((s) => s.mensajes.filter((m) => !m.leido).length);
  const avanzarDias = useDemoStore((s) => s.avanzarDias);
  const { vistaCelular, panelVisible, alternarVistaCelular, alternarPanelVisible, abrirWhatsApp } =
    useDemoUi();
  const toast = useToast();

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'd' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (esCampoDeTexto(e.target)) return;
      alternarPanelVisible();
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
    };
  }, [alternarPanelVisible]);

  if (!panelVisible) return null;

  const avanzar = (dias: number) => {
    avanzarDias(dias);
    toast.info(dias === 1 ? 'Avanzó 1 día' : `Avanzaron ${dias} días`);
  };

  const confirmarReinicio = () => {
    reiniciarDemo();
    setConfirmando(false);
    setAbierto(false);
    toast.exito('La demo volvió a su estado inicial');
  };

  return (
    <>
      <div className="fixed bottom-36 left-2 z-50 md:bottom-4 md:left-4 flex flex-col items-start gap-2">
        {abierto && (
          <section
            aria-label="Panel de demo"
            className="w-72 rounded-tarjeta bg-superficie p-4 shadow-2"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-titulo text-base font-semibold text-texto">Panel de demo</h2>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar panel de demo"
                className="flex h-9 w-9 items-center justify-center rounded-boton text-texto-2 hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <p className="text-sm text-texto-2">
              Fecha simulada: <strong className="text-texto">{fechaCorta(hoy)}</strong>
            </p>

            <h3 className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-texto-2">
              Cambiar de rol
            </h3>
            <div className="flex flex-col gap-2">
              <button type="button" className={BOTON_PANEL} onClick={entrarComoMariana}>
                <UserRound size={18} aria-hidden="true" /> Candidata · Mariana
              </button>
              <button type="button" className={BOTON_PANEL} onClick={entrarComoClinica}>
                <Building2 size={18} aria-hidden="true" /> Empresa · Clínica San Rafael
              </button>
              <button type="button" className={BOTON_PANEL} onClick={entrarComoAdmin}>
                <Shield size={18} aria-hidden="true" /> Administrador
              </button>
            </div>

            <h3 className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-texto-2">
              Avanzar días
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 5, 30].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="flex min-h-11 items-center justify-center gap-1 rounded-boton border border-borde bg-superficie text-sm font-semibold text-texto hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
                  onClick={() => avanzar(n)}
                >
                  <CalendarPlus size={16} aria-hidden="true" />+{n}
                </button>
              ))}
            </div>

            <h3 className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-texto-2">
              Herramientas
            </h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className={BOTON_PANEL}
                aria-pressed={vistaCelular}
                onClick={alternarVistaCelular}
              >
                <Smartphone size={18} aria-hidden="true" />
                {vistaCelular ? 'Salir de vista celular' : 'Vista celular'}
              </button>
              <button
                type="button"
                className={BOTON_PANEL}
                onClick={() => {
                  setAbierto(false);
                  abrirWhatsApp();
                }}
              >
                <MessageCircle size={18} aria-hidden="true" /> Abrir WhatsApp
                {noLeidos > 0 && (
                  <span className="ml-auto rounded-chip bg-error px-2 py-0.5 text-xs font-bold text-white">
                    {noLeidos}
                  </span>
                )}
              </button>
              <button type="button" className={BOTON_PANEL} disabled>
                <Sparkles size={18} aria-hidden="true" /> Autollenar (próximamente)
              </button>
              <button type="button" className={BOTON_PANEL} onClick={() => setConfirmando(true)}>
                <RotateCcw size={18} aria-hidden="true" /> Reiniciar demo
              </button>
            </div>
            <p className="mt-3 text-xs text-texto-2">Tecla D: ocultar o mostrar este panel.</p>
          </section>
        )}
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-label="Panel de demo"
          aria-expanded={abierto}
          className="relative flex h-12 w-12 items-center justify-center rounded-chip bg-texto text-white opacity-70 shadow-2 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
        >
          <Presentation size={22} aria-hidden="true" />
          {noLeidos > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-chip bg-error px-1 text-xs font-bold text-white">
              {noLeidos}
            </span>
          )}
        </button>
      </div>

      <Modal
        abierto={confirmando}
        onCerrar={() => setConfirmando(false)}
        titulo="¿Reiniciar la demo?"
        pie={
          <>
            <Button variante="peligro" onClick={confirmarReinicio}>
              Sí, reiniciar
            </Button>
            <Button variante="secundario" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
          </>
        }
      >
        <p className="text-base text-texto-2">
          Se borra todo lo que hiciste y la fecha vuelve al 30 oct 2026.
        </p>
      </Modal>
    </>
  );
}
