import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cotizacionDemo, ordenes } from '../data/mockData';
import '../styles/cliente.css';

const AmbientAudio = () => {
  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=ambient-classic-corporate-125959.mp3');
    audio.loop = true;
    audio.volume = 0.15;
    
    const playAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener('scroll', playAudio);
      window.removeEventListener('click', playAudio);
    };
    
    window.addEventListener('scroll', playAudio);
    window.addEventListener('click', playAudio);
    
    return () => {
      window.removeEventListener('scroll', playAudio);
      window.removeEventListener('click', playAudio);
      audio.pause();
    };
  }, []);
  return null;
};

export default function Cliente() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Transform scroll progress to horizontal translation (3 sections = 300vw width, move by -66.66% total)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.6666%"], { clamp: true });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0], { clamp: true });
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8], { clamp: true });
  
  const quoteOpacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0], { clamp: true });
  const quoteY = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [50, 0, -50], { clamp: true });
  
  const ctaOpacity = useTransform(scrollYProgress, [0.75, 1], [0, 1], { clamp: true });

  const proyectosPrevios = ordenes.filter(o => o.clienteId === cotizacionDemo.clienteId).length;
  const esRecurrente = proyectosPrevios > 0;
  const numeroProyecto = proyectosPrevios + 1;

  return (
    <div ref={containerRef} style={{ height: '300vh', position: 'relative', background: '#F8FAFC' }}>
      <AmbientAudio />
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <motion.div style={{ x, display: 'flex', height: '100%', width: '300vw', willChange: 'transform' }}>
          
          {/* Seccion 1: Saludo */}
          <section className="cli-section" style={{ width: '100vw', height: '100vh', flexShrink: 0 }}>
            <motion.div className="cli-content-wrapper" style={{ opacity: heroOpacity, scale: heroScale }}>
              <motion.div 
                className="cli-logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                ZAMMIR
              </motion.div>
              <motion.h1 
                className="cli-title-huge"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Hola,<br/>{cotizacionDemo.clienteNombre}.
              </motion.h1>
              
              {esRecurrente && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--c-ink-soft)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: '1rem',
                    borderTop: '1px solid rgba(38,36,31,0.2)',
                    paddingTop: '1rem',
                    display: 'inline-block'
                  }}
                >
                  Gracias por confiar de nuevo en nosotros. <br/>
                  Este es tu proyecto #{numeroProyecto} con ZAMMIR.
                </motion.div>
              )}

              <motion.div
                className="w-cue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                aria-hidden="true"
                style={{ bottom: '4rem', filter: 'invert(1)' }} /* adapt arrow to light bg */
              >
                <span className="w-cue-text" style={{ color: 'var(--c-ink)' }}>Scrollea hacia abajo</span>
                <div className="w-cue-line" style={{ background: 'linear-gradient(to bottom, var(--c-ink-muted), transparent)' }} />
              </motion.div>
            </motion.div>
          </section>

          {/* Seccion 2: Mensaje de precisión */}
          <section className="cli-section" style={{ width: '100vw', height: '100vh', flexShrink: 0 }}>
            <motion.div className="cli-content-wrapper cli-content-wrapper--centered" style={{ opacity: quoteOpacity, y: quoteY }}>
              <p className="cli-quote-large">
                "Sabemos que los detalles importan. Por eso, tu proyecto se está tratando con el mismo cuidado y precisión con el que tomamos las medidas."
              </p>
              <div className="cli-accent-line" />
            </motion.div>
          </section>

          {/* Seccion 3: CTA Cotizacion */}
          <section className="cli-section" style={{ width: '100vw', height: '100vh', flexShrink: 0 }}>
            <motion.div className="cli-content-wrapper cli-content-wrapper--centered" style={{ opacity: ctaOpacity }}>
              <div className="cli-info-box">
                <div className="cli-info-item">
                  <span className="cli-info-label">Folio del Proyecto</span>
                  <span className="cli-info-val">{cotizacionDemo.folio}</span>
                </div>
                <div className="cli-info-item">
                  <span className="cli-info-label">Fecha</span>
                  <span className="cli-info-val">{cotizacionDemo.fecha}</span>
                </div>
              </div>

              <button 
                className="cli-btn-primary" 
                onClick={() => navigate('/cliente-portal')}
              >
                Ver mi cotización
                <span>→</span>
              </button>
              
              <button className="cli-btn-text" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>
                ← Volver al inicio de la demo
              </button>
            </motion.div>
          </section>

        </motion.div>
      </div>
    </div>
  );
}