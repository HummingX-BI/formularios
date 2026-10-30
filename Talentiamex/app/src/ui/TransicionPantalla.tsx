import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/** Transición de pantalla: 200 ms, aparece con fade y 8 px de desplazamiento. */
export function TransicionPantalla({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const sinMovimiento = useReducedMotion();
  return (
    <motion.div
      key={pathname}
      initial={sinMovimiento ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
