import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/welcome.css';

const WORDS = ['Soluciones', 'en Vidrio', 'y Aluminio'];

const AmbientAudio = () => {
  useEffect(() => {
    // Royalty-free ambient corporate tone
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

export default function Welcome() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Transform scroll progress to horizontal translation (4 sections = 400vw width, move by -75% total)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"], { clamp: true });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0], { clamp: true });
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85], { clamp: true });
  
  const m1Opacity = useTransform(scrollYProgress, [0.15, 0.33, 0.5], [0, 1, 0], { clamp: true });
  const m1Y = useTransform(scrollYProgress, [0.15, 0.33, 0.5], [50, 0, -50], { clamp: true });
  
  const m3Opacity = useTransform(scrollYProgress, [0.45, 0.66, 0.85], [0, 1, 0], { clamp: true });
  const m3Scale = useTransform(scrollYProgress, [0.45, 0.66, 0.85], [0.9, 1, 1.1], { clamp: true });
  
  const ctaOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1], { clamp: true });

  return (
    <div ref={containerRef} style={{ height: '400vh', position: 'relative', background: '#26241F' }}>
      <AmbientAudio />
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <motion.div style={{ x, display: 'flex', height: '100%', width: '400vw', willChange: 'transform' }}>
          
          {/* Seccion 1: Bienvenida / Hero */}
          <section className="w-hero" style={{ width: '100vw', height: '100vh', flexShrink: 0 }}>
            <motion.div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: heroOpacity, scale: heroScale }}>
            <motion.div className="w-lines" aria-hidden="true">
              <div className="w-line-h w-line-h--top" />
              <div className="w-line-h w-line-h--mid" />
              <div className="w-line-h w-line-h--bot" />
              <div className="w-line-v w-line-v--left" />
              <div className="w-line-v w-line-v--right" />
            </motion.div>
            <motion.div
              className="w-badge"
              initial={{ opacity: 0, scale: 0.82, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.34,1.56,0.64,1] }}
            >
              ZAMMIR
            </motion.div>
            <h1 className="w-hero-title">
              {WORDS.map((word, i) => (
                <span key={i} className="w-word-clip">
                  <motion.span
                    className="w-word"
                    initial={{ y: '115%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.78, delay: 0.25 + i * 0.13, ease: [0.4,0,0.2,1] }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="w-hero-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1.1 }}
            >
              Otumba de Gómez Farías · Estado de México
            </motion.p>
            <motion.div
              className="w-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 1 }}
              aria-hidden="true"
            >
              <span className="w-cue-text">Scrollea hacia abajo</span>
              <div className="w-cue-line" />
            </motion.div>
            </motion.div>
          </section>

          {/* Seccion 2: Problema 1 */}
          <section className="w-moment w-m1" style={{ width: '100vw', height: '100vh', flexShrink: 0 }}>
            <motion.div className="w-moment-body" style={{ opacity: m1Opacity, y: m1Y }}>
              <p className="w-num">01</p>
              <h2 className="w-moment-h">
                Hoy llevas tu negocio de memoria.
              </h2>
              <p className="w-moment-p">
                Sin sistema, sin registro. Cada medida tomada en campo, cada precio acordado, cada cliente — todo vive en la cabeza o en un papel que puede perderse ese mismo día.
              </p>
              <div className="w-accent" />
            </motion.div>
          </section>

          {/* Seccion 3: Problema 2 y Transformacion */}
          <section className="w-moment w-m3" style={{ width: '100vw', height: '100vh', flexShrink: 0 }}>
            <div className="w-m3-glow" aria-hidden="true" />
            <motion.div className="w-moment-body" style={{ opacity: m3Opacity, scale: m3Scale }}>
              <p className="w-num w-num--gold">02</p>
              <h2 className="w-moment-h w-moment-h--light">
                Esto es lo que construimos para que no tengas que hacerlo así nunca más.
              </h2>
              <p className="w-moment-p w-moment-p--dim">
                Un sistema diseñado específicamente para ZAMMIR. Cotizaciones en segundos, órdenes de trabajo en pantalla, corte de caja sin sumar a mano.
              </p>
              <div className="w-accent w-accent--gold" />
            </motion.div>
          </section>

          {/* Seccion 4: Call to Action */}
          <section className="w-cta" style={{ width: '100vw', height: '100vh', flexShrink: 0 }}>
            <motion.div className="w-cta-body" style={{ opacity: ctaOpacity }}>
              <p className="w-cta-kicker">Elige tu experiencia</p>
              <h2 className="w-cta-h">
                ¿Desde qué ángulo quieres recorrer la demo?
              </h2>

              <div className="w-cta-grid">
                <button
                  id="btn-dueno"
                  className="w-btn w-btn--dark"
                  onClick={() => navigate('/dueno')}
                >
                  <div className="w-btn-pill">Dueño</div>
                  <p className="w-btn-name">Ver como Luis</p>
                  <p className="w-btn-desc">Dashboard · Cotizador · Órdenes · POS · Reportes</p>
                </button>

                <button
                  id="btn-cliente"
                  className="w-btn w-btn--light"
                  onClick={() => navigate('/cliente')}
                >
                  <div className="w-btn-pill w-btn-pill--light">Cliente</div>
                  <p className="w-btn-name w-btn-name--dark">Ver como cliente</p>
                  <p className="w-btn-desc w-btn-desc--dark">Cotización · Seguimiento de tu trabajo</p>
                </button>
              </div>

              <p className="w-cta-quote">
                Llevas año y medio cortando vidrio con precisión milimétrica.
                Es momento de que tu negocio se administre con esa misma precisión.
              </p>
            </motion.div>
          </section>

        </motion.div>
      </div>
    </div>
  );
}