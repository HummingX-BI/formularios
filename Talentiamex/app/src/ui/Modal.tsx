import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
  /** Botones al pie. */
  pie?: ReactNode;
  className?: string;
}

const ENFOCABLES =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Modal centrado en escritorio y hoja inferior en móvil. */
export function Modal({ abierto, onCerrar, titulo, children, pie, className }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const sinMovimiento = useReducedMotion();

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCerrar();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
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
        <div className="fixed inset-0 z-40 flex items-end justify-center md:items-center md:p-6">
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
            initial={sinMovimiento ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={sinMovimiento ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative flex max-h-[90vh] w-full flex-col rounded-t-tarjeta bg-superficie shadow-2 outline-none md:max-w-lg md:rounded-tarjeta',
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4 p-5 pb-3">
              <h2 className="font-titulo text-lg font-semibold text-texto">{titulo}</h2>
              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-boton text-texto-2 hover:bg-fondo focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pb-5">{children}</div>
            {pie && (
              <div className="flex flex-col gap-2 border-t border-borde p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:flex-row md:justify-end">
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

export { Modal as BottomSheet };
