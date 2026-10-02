import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TourOverlay({ steps, onFinish, onStepChange }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);

  const step = steps[stepIndex];

  useEffect(() => {
    let intervalId;
    const updateRect = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        // Asegurar que el elemento esté visible antes de medir
        if (el.scrollIntoViewIfNeeded) {
          el.scrollIntoViewIfNeeded();
        }
        const r = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        const radius = parseFloat(computedStyle.borderRadius) || 0;
        
        setRect({
          top: r.top - 4,
          left: r.left - 4,
          width: r.width + 8,
          height: r.height + 8,
          radius: radius > 0 ? radius + 4 : 8
        });
      }
    };
    
    // Ejecutar inmediatamente y luego continuamente cada 50ms para atrapar montajes retrasados por AnimatePresence mode="wait" y animaciones
    updateRect();
    intervalId = setInterval(updateRect, 50);

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [step]);

  // Call onStepChange if provided (so parent can change tabs)
  useEffect(() => {
    if (onStepChange && step.action) {
      onStepChange(step.action);
    }
  }, [stepIndex, onStepChange, step]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  let tooltipTop = 0;
  let tooltipLeft = 0;
  if (rect) {
    const tooltipWidth = 320;
    const tooltipHeight = 160;

    tooltipTop = step.placement === 'bottom' ? rect.top + rect.height + 16 : rect.top;
    tooltipLeft = step.placement === 'right' ? rect.left + rect.width + 16 : 
                  step.placement === 'left' ? rect.left - tooltipWidth - 16 : rect.left;

    if (tooltipLeft + tooltipWidth > window.innerWidth) tooltipLeft = window.innerWidth - tooltipWidth - 16;
    if (tooltipLeft < 16) tooltipLeft = 16;
    
    if (tooltipTop + tooltipHeight > window.innerHeight) {
      tooltipTop = window.innerHeight - tooltipHeight - 16;
      if (step.placement === 'bottom' && rect.top > tooltipHeight + 32) {
        tooltipTop = rect.top - tooltipHeight - 16;
      }
    }
    if (tooltipTop < 16) tooltipTop = 16;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999,
    }}>
      {/* Background Block & Mask */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx={rect.radius}
                fill="black"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(38,36,31,0.75)" mask="url(#tour-mask)" />
      </svg>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        {rect && (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.15 }}
            style={{
              position: 'absolute',
              top: tooltipTop,
              left: tooltipLeft,
              background: 'var(--c-paper)',
              padding: '1.5rem',
              borderRadius: 'var(--r-md)',
              width: '320px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(156,122,60,0.3)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--c-ink)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              {step.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--c-ink-soft)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {step.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={onFinish}
                style={{ background: 'none', border: 'none', color: 'var(--c-ink-muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
              >
                Saltar recorrido
              </button>
              <button 
                onClick={handleNext}
                style={{ background: 'var(--c-laton)', color: 'var(--c-paper)', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}
              >
                {stepIndex === steps.length - 1 ? 'Entendido' : 'Siguiente'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
