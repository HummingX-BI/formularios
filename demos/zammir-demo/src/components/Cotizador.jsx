import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { catalogo } from '../data/mockData';
import ContextBanner from './ContextBanner';
import '../styles/cotizador.css';

export default function Cotizador({ toursVistos, onNavigate }) {
  const [productoId, setProductoId] = useState('');
  const [ancho, setAncho] = useState('');
  const [alto, setAlto] = useState('');
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');

  // Encontrar producto seleccionado
  const productoSeleccionado = catalogo.find(p => p.id === productoId);

  // Calculo en vivo
  let precioCalculado = 0;
  let detalleMedida = '';

  if (productoSeleccionado) {
    if (productoSeleccionado.unidad === 'm²') {
      const a = parseFloat(ancho) || 0;
      const h = parseFloat(alto) || 0;
      const area = a * h;
      precioCalculado = area * productoSeleccionado.precio;
      detalleMedida = area > 0 ? `${a}m × ${h}m (${area.toFixed(2)} m²)` : 'Faltan medidas';
    } else {
      precioCalculado = productoSeleccionado.precio;
      detalleMedida = 'Pieza estándar';
    }
  }

  const today = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
  const folio = useMemo(() => `COT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, []);

  const isValid = productoSeleccionado && precioCalculado > 0 && cliente.length > 2;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    alert('Simulación: Se abriría WhatsApp Web con el documento adjunto o un enlace.');
  };

  return (
    <div className="cot-container">
      <ContextBanner 
        id="cotizador_catalogo"
        show={toursVistos && !toursVistos.catalogo}
        text="Tip: revisa primero tu catálogo para que tus cotizaciones salgan más rápido."
        actionText="Ir al Catálogo →"
        onAction={() => onNavigate('catalogo')}
      />
      
      <div className="cot-header-info">
        <h2 className="cot-title">
          Cotizador Inteligente
          <div className="dash-tooltip" style={{ position: 'relative', top: 0, right: 0 }}>
            ?
            <div className="dash-tooltip-text" style={{ bottom: 'auto', top: '130%', right: 0, width: '250px' }}>
              Crea cotizaciones precisas al instante. Todo cambio a la izquierda se refleja en el documento de la derecha.
            </div>
          </div>
        </h2>
      </div>

      <div className="cot-split-layout">
        {/* LADO IZQUIERDO: Controles */}
        <div className="cot-form-pane">
          <form id="tour-cot-form" onSubmit={(e) => e.preventDefault()}>
            <div className="cot-section-title">1. Producto o Servicio</div>
            <div className="cot-field">
              <label className="cot-label">Concepto a cotizar</label>
              <select 
                className="cot-select" 
                value={productoId} 
                onChange={e => setProductoId(e.target.value)}
                style={{ fontWeight: 500, color: productoId ? 'var(--c-ink)' : 'var(--c-ink-soft)' }}
              >
                <option value="">Buscar producto...</option>
                <optgroup label="Aluminio y Vidrio">
                  {catalogo.filter(p => p.unidad === 'm²').map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} — ${p.precio}/m²</option>
                  ))}
                </optgroup>
                <optgroup label="Piezas y Herrajes">
                  {catalogo.filter(p => p.unidad !== 'm²').map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} — ${p.precio}/{p.unidad}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <AnimatePresence>
              {productoSeleccionado?.unidad === 'm²' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="cot-grid-2">
                    <div className="cot-field">
                      <label className="cot-label">Ancho (m)</label>
                      <input 
                        type="number" step="0.01" 
                        className="cot-input" placeholder="Ej. 1.20"
                        value={ancho} onChange={e => setAncho(e.target.value)}
                      />
                    </div>
                    <div className="cot-field">
                      <label className="cot-label">Alto (m)</label>
                      <input 
                        type="number" step="0.01" 
                        className="cot-input" placeholder="Ej. 2.10"
                        value={alto} onChange={e => setAlto(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="cot-section-title">2. Datos del Cliente</div>
            <div className="cot-field">
              <label className="cot-label">Nombre del prospecto</label>
              <input 
                type="text" className="cot-input" placeholder="Ej. Arquitecto Raúl"
                value={cliente} onChange={e => setCliente(e.target.value)}
              />
            </div>
            <div className="cot-field">
              <label className="cot-label">Teléfono / Contacto</label>
              <input 
                type="tel" className="cot-input" placeholder="WhatsApp a 10 dígitos"
                value={telefono} onChange={e => setTelefono(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* LADO DERECHO: Workspace & Vista Previa */}
        <div className="cot-preview-workspace">
          <div className="cot-action-bar">
            <button className="cot-btn-mini cot-btn-wp" disabled={!isValid} onClick={handleWhatsApp}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              WhatsApp
            </button>
            <button className="cot-btn-mini cot-btn-pdf" disabled={!isValid} onClick={handlePrint}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Exportar
            </button>
          </div>

          <div id="tour-cot-live" className={`cot-doc ${!isValid ? 'empty-state' : ''}`}>
            <div className="cot-doc-header">
              <div className="cot-doc-logo">ZAMMIR</div>
              <div className="cot-doc-meta">
                Folio <strong>{folio}</strong><br/>
                Fecha {today}
              </div>
            </div>

            <div className="cot-doc-client">
              <div className="cot-doc-client-title">Cotizado Para</div>
              <strong>{cliente || '[Nombre del Cliente]'}</strong>
              <span>Tel: {telefono || '[Teléfono]'}</span>
            </div>

            <table className="cot-doc-table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th style={{ textAlign: 'right' }}>Detalle</th>
                  <th style={{ textAlign: 'right' }}>Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 500 }}>
                    {productoSeleccionado ? productoSeleccionado.nombre : '—'}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--c-ink-soft)' }}>
                    {productoSeleccionado ? detalleMedida : '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    ${precioCalculado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="cot-doc-total-row">
              <div className="cot-doc-total-box">
                <span className="cot-doc-total-label">Total Neto</span>
                <span className="cot-doc-total-val">
                  ${precioCalculado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="cot-doc-condiciones">
              <strong>Condiciones Generales:</strong><br/>
              Se requiere el 50% de anticipo para iniciar la fabricación o apartado de material. El saldo restante deberá ser liquidado contra entrega / instalación. Tiempo de entrega sujeto a disponibilidad de material y medición física final en obra. Vigencia de cotización: 15 días.
            </div>

            <div className="cot-doc-signature" style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '2rem' }}>
              <div style={{ textAlign: 'center', width: '250px' }}>
                <div style={{ borderBottom: '1px solid var(--c-ink)', marginBottom: '0.5rem' }}></div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--c-ink-soft)', textTransform: 'uppercase' }}>Firma de Autorización / Anticipo</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--c-ink-muted)', textAlign: 'right' }}>
                Generado por ZAMMIR Vidrio y Aluminio<br/>
                Gracias por su preferencia
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
