import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

interface PanelLateralProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
  /** Botones fijos al pie del panel. */
  pie?: ReactNode;
  /** Ancho máximo en escritorio (clase de Tailwind). */
  ancho?: string;
}

const ENFOCABLES =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Panel que entra por la derecha en escritorio y ocupa toda la pantalla en móvil. */
export function PanelLateral({
  abierto,
  onCerrar,
  titulo,
  children,
  pie,
  ancho = 'md:max-w-3xl',
}: PanelLateralProps) {
  const panel = useRef<HTMLDivElement>(null);
  const sinMovimiento = useReducedMotion();

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      // Si hay otro diálogo encima (por ejemplo, Contactar), a ese le toca el teclado.
      const dialogos = document.querySelectorAll('[role=dialog]');
      if (dialogos[dialogos.length - 1] !== panel.current) return;
      if (e.key === 'Escape') {
        onCerrar();
        return;
      }
      if (e.key !== 'Tab') return;
      const lista = Array.from(panel.current.querySelectorAll<HTMLElement>(ENFOCABLES));
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (!primero || !ultimo) return;
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = overflow;
      previo?.focus();
    };
  }, [abierto, onCerrar]);

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <motion.div
            className="absolute inset-0 bg-texto/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCerrar}
            aria-hidden="true"
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
            tabIndex={-1}
            initial={sinMovimiento ? false : { x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={sinMovimiento ? { opacity: 0 } : { x: 48, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`relative flex h-full w-full flex-col bg-fondo shadow-2 outline-none ${ancho}`}
          >
            <div className="flex items-center justify-between gap-4 border-b border-borde bg-superficie p-4">
              <h2 className="min-w-0 truncate font-titulo text-lg font-semibold text-texto">
                {titulo}
              </h2>
              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-boton text-texto-2 hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
            {pie && (
              <div className="flex flex-wrap gap-2 border-t border-borde bg-superficie p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {pie}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
