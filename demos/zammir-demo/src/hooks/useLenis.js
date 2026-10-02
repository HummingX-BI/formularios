import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * useLenis — hook que inicializa Lenis smooth scroll en toda la app.
 * Usa GSAP ScrollTrigger si está disponible para sincronización.
 * @returns instancia de Lenis (para uso en componentes si se necesita control manual)
 */
export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Exponer lenis globalmente para GSAP ScrollTrigger
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return lenisRef;
}
