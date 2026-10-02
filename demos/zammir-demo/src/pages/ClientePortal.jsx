import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cotizacionDemo, timelineDemo, negocio } from '../data/mockData';
import '../styles/clientePortal.css';

export default function ClientePortal() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAccept = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setIsAccepted(true);
      setShowCelebration(false);
    }, 1500);
  };

  const getStepIcon = (estatus, isCompleted) => {
    const color = isCompleted ? '#1B365D' : '#0F172A';
    switch (estatus) {
      case 'cotización enviada':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'anticipo recibido':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
            <rect x="2" y="6" width="20" height="12"></rect>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 12h.01M18 12h.01"></path>
          </svg>
        );
      case 'medición realizada':
        // Ruler / Escuadra
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
            <path d="M21 3L3 21l-2-2L19 1l2 2z"></path>
            <path d="M16 4l4 4M12 8l4 4M8 12l4 4M4 16l4 4"></path>
          </svg>
        );
      case 'en fabricación':
        // Glass cutter / Geometric shapes
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
            <polygon points="12 2 15 8 22 9 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9 9 8 12 2"></polygon>
            <line x1="12" y1="2" x2="12" y2="22"></line>
          </svg>
        );
      case 'listo para instalación':
        // Truck / Logistics
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        );
      case 'instalación y entrega':
        // Window frame
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
            <rect x="3" y="3" width="18" height="18"></rect>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="12" y1="3" x2="12" y2="21"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cp-layout">
      <div className="cp-container">
        <div className="cp-logo-center">ZAMMIR</div>
        
        <AnimatePresence mode="wait">
          {!isAccepted ? (
            <motion.div
              key="pdf-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="cp-pdf-card">
                <div className="cp-pdf-header">
                  <div className="cp-pdf-title">Cotización Formal</div>
                  <div className="cp-pdf-folio">{cotizacionDemo.folio}</div>
                </div>
                <div className="cp-pdf-body">
                  {cotizacionDemo.direccionInstalacion && (
                    <div style={{ paddingBottom: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--c-ink)' }}>
                      <div className="cp-pdf-title" style={{ marginBottom: '0.2rem' }}>Lugar de Instalación</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--c-ink)' }}>
                        {cotizacionDemo.direccionInstalacion}
                      </div>
                    </div>
                  )}
                  {cotizacionDemo.items.map((item, idx) => (
                    <div key={idx} className="cp-item">
                      <div className="cp-item-desc">
                        <div style={{ marginBottom: '0.3rem' }}>{item.cantidad}x {item.descripcion}</div>
                        {item.dimensiones && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--c-ink-soft)', textTransform: 'uppercase' }}>
                            DIM: {item.dimensiones}
                          </div>
                        )}
                      </div>
                      <div className="cp-item-price">
                        ${item.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                      </div>
                    </div>
                  ))}

                  <div className="cp-totals">
                    <div className="cp-total-row">
                      <span>Subtotal</span>
                      <span>${cotizacionDemo.subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="cp-total-row grand">
                      <span>Total</span>
                      <span>${cotizacionDemo.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="cp-total-row" style={{ color: 'var(--c-laton)' }}>
                      <span>Anticipo requerido</span>
                      <span>${cotizacionDemo.anticipo.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>

                  <div className="cp-condiciones">
                    <strong>Condiciones:</strong><br/>
                    {cotizacionDemo.condiciones}<br/><br/>
                    {cotizacionDemo.notas}
                  </div>
                </div>
              </div>

              <motion.button 
                className="cp-btn-accept"
                onClick={handleAccept}
                whileTap={{ scale: 0.96 }}
              >
                {showCelebration ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    ¡Cotización Aceptada! ✓
                  </motion.div>
                ) : (
                  "Aceptar Cotización"
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="timeline-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="cp-timeline">
                <h3 className="cp-tl-title">Seguimiento de tu Proyecto</h3>
                
                {timelineDemo.map((step, i) => {
                  const isCompleted = step.completado;
                  const isActive = !isCompleted && (i === 0 || timelineDemo[i-1].completado);
                  
                  return (
                    <div key={i} className={`cp-tl-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                      <div className="cp-tl-dot">
                        {getStepIcon(step.estatus, isCompleted || isActive)}
                      </div>
                      <div className="cp-tl-content">
                        <div className="cp-tl-status">{step.estatus}</div>
                        <div className="cp-tl-desc">{step.descripcion}</div>
                        {step.fecha && <div style={{ fontSize: '0.75rem', color: 'var(--c-ink-muted)', marginTop: '0.2rem' }}>{step.fecha}</div>}
                      </div>
                    </div>
                  );
                })}

                <div className="cp-garantia">
                  <div className="cp-garantia-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B365D" strokeWidth="1" strokeLinecap="square">
                      <polygon points="12 2 22 7 22 17 12 22 2 17 2 7 12 2"></polygon>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                  </div>
                  <div className="cp-garantia-text">
                    <h4>Sello de Calidad ZAMMIR</h4>
                    <p>Este proyecto cuenta con garantía de servicio y herrajes por {negocio.garantiaMeses} meses. Tu inversión está protegida.</p>
                  </div>
                </div>

              </div>
              
              <div style={{ textAlign: 'center' }}>
                <a href="#" style={{ color: 'var(--c-ink-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
                  ¿Necesitas ayuda? Contáctanos por WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
