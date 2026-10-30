import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Info, XCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ToastContext, type ToastApi, type TipoToast } from './toastContext';

const DURACION_MS = 3000;

interface ToastItem {
  id: number;
  tipo: TipoToast;
  mensaje: string;
}

const ESTILOS: Record<TipoToast, { icono: LucideIcon; clase: string }> = {
  exito: { icono: CheckCircle2, clase: 'border-accion text-accion-hover' },
  info: { icono: Info, clase: 'border-info text-info' },
  error: { icono: XCircle, clase: 'border-error text-error' },
};

let contador = 0;

/** Avisos breves en la esquina inferior; se van solos a los 3 s. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const sinMovimiento = useReducedMotion();

  const mostrar = useCallback((tipo: TipoToast, mensaje: string) => {
    const id = ++contador;
    setItems((actuales) => [...actuales, { id, tipo, mensaje }]);
    setTimeout(() => {
      setItems((actuales) => actuales.filter((t) => t.id !== id));
    }, DURACION_MS);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      exito: (m) => mostrar('exito', m),
      info: (m) => mostrar('info', m),
      error: (m) => mostrar('error', m),
    }),
    [mostrar],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-50 flex flex-col items-center gap-2 md:inset-x-auto md:bottom-6 md:right-6 md:items-end"
      >
        <AnimatePresence>
          {items.map((t) => {
            const { icono: Icono, clase } = ESTILOS[t.tipo];
            return (
              <motion.div
                key={t.id}
                initial={sinMovimiento ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'pointer-events-auto flex max-w-sm items-center gap-2 rounded-boton border-l-4 bg-superficie px-4 py-3 text-base font-medium shadow-2',
                  clase,
                )}
              >
                <Icono size={20} aria-hidden="true" />
                <span className="text-texto">{t.mensaje}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
