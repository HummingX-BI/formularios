import { motion, useReducedMotion } from 'framer-motion';

/** Palomita de éxito que se dibuja sola. */
export function CheckAnimado({ tamano = 72 }: { tamano?: number }) {
  const sinMovimiento = useReducedMotion();
  const duracion = sinMovimiento ? 0 : 0.5;
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 72 72"
      fill="none"
      role="img"
      aria-label="Listo"
      className="text-accion"
    >
      <motion.circle
        cx="36"
        cy="36"
        r="32"
        stroke="currentColor"
        strokeWidth="5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: duracion }}
      />
      <motion.path
        d="M22 37 L32 47 L51 26"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: duracion, delay: sinMovimiento ? 0 : 0.35 }}
      />
    </svg>
  );
}
