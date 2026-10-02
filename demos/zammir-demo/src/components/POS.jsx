import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cajeros, catalogo, resumenHoy, negocio } from '../data/mockData';
import ComprobanteTrabajo from './ComprobanteTrabajo';
import '../styles/pos.css';

export default function POS() {
  const [cajeroActivo, setCajeroActivo] = useState(cajeros[0].id);
  const [view, setView] = useState('venta'); // 'venta' | 'corte'
  const [cart, setCart] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  
  const [isPrinting, setIsPrinting] = useState(false);
  const [printedCart, setPrintedCart] = useState([]);

  // Filtrar solo productos que se puedan vender rápido (estándar, servicios)
  const productosVentaRapida = catalogo.filter(p => p.tipo !== 'a medida');

  const addToCart = (producto) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === producto.id);
      if (exists) {
        return prev.map(item => item.id === producto.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...producto, qty: 1 }];
    });
  };

  const totalCart = cart.reduce((sum, item) => sum + (item.precio * item.qty), 0);

  const [ventaToPrint, setVentaToPrint] = useState(null);

  const handleCobrar = () => {
    if (cart.length > 0) {
      const folio = `VM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setVentaToPrint({
        id: folio,
        fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }),
        items: cart,
        total: totalCart
      });
      setPrintedCart(cart);
      setCart([]);
      setIsPrinting(true);
      setTimeout(() => {
        setIsPrinting(false);
      }, 3500); // Ticket visible for 3.5s
    }
  };

  // Simular un corte para el cajero activo (un tercio del total de hoy + lo que haya en carrito si lo cobrara)
  const cajeroObj = cajeros.find(c => c.id === cajeroActivo);
  const corteCajero = {
    total: resumenHoy.ventaTotal * 0.4,
    efectivo: resumenHoy.efectivo * 0.4,
    transferencia: resumenHoy.transferencia * 0.4,
    operaciones: 6
  };

  return (
    <div className="pos-container">
      <div className="pos-header">
        <h2 className="pos-title">Mostrador</h2>
        <div id="tour-pos-cajero" className="pos-cajero-select">
          <span className="pos-cajero-label">Cajero Actual:</span>
          <select 
            className="pos-cajero-dropdown"
            value={cajeroActivo}
            onChange={(e) => setCajeroActivo(e.target.value)}
          >
            {cajeros.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} ({c.rol})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pos-tabs">
        <button 
          id="tour-pos-venta"
          className={`pos-tab ${view === 'venta' ? 'active' : ''}`}
          onClick={() => setView('venta')}
        >
          Venta de Mostrador
        </button>
        <button 
          id="tour-pos-corte"
          className={`pos-tab ${view === 'corte' ? 'active' : ''}`}
          onClick={() => setView('corte')}
        >
          Corte de Caja
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'venta' && (
          <motion.div 
            key="venta"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="pos-grid"
          >
            <div id="tour-pos-catalog" className="pos-box">
              <div className="pos-box-title">Catálogo Rápido</div>
              <div className="pos-product-grid">
                {productosVentaRapida.map(p => (
                  <div key={p.id} className="pos-product-card" onClick={() => addToCart(p)}>
                    <span className="pos-product-name">{p.nombre}</span>
                    <span className="pos-product-price">${p.precio.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="tour-pos-cart" className="pos-box" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div className="pos-box-title">Ticket Actual</div>
              
              <AnimatePresence>
                {isPrinting && (
                  <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    style={{
                      position: 'absolute',
                      top: '3rem',
                      left: '5%',
                      width: '90%',
                      background: '#fff',
                      border: '1px dashed #ccc',
                      borderBottom: '4px jagged #ccc', // Fake jagged edge
                      padding: '1.5rem',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                      zIndex: 50,
                      pointerEvents: 'none',
                      color: '#333'
                    }}
                  >
                    <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 600 }}>*** ZAMMIR ***</div>
                    <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', marginBottom: '1rem', color: '#666' }}>COMPROBANTE DE VENTA</div>
                    {printedCart.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                        <span>{item.qty}x {item.nombre.substring(0,18)}</span>
                        <span>${(item.precio * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px dashed #ccc', marginTop: '1rem', paddingTop: '1rem', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                      TOTAL: ${printedCart.reduce((s,i) => s + i.precio * i.qty, 0).toLocaleString()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pos-cart-list">
                {cart.length === 0 ? (
                  <div style={{ color: 'var(--c-ink-muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
                    Agrega productos para cobrar...
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="pos-cart-item">
                      <span>{item.qty}x {item.nombre}</span>
                      <span style={{ fontWeight: 600 }}>${(item.precio * item.qty).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pos-pay-methods">
                <button 
                  className={`pos-pay-btn ${metodoPago === 'efectivo' ? 'active' : ''}`}
                  onClick={() => setMetodoPago('efectivo')}
                >
                  Efectivo
                </button>
                <button 
                  className={`pos-pay-btn ${metodoPago === 'transferencia' ? 'active' : ''}`}
                  onClick={() => setMetodoPago('transferencia')}
                >
                  Transferencia
                </button>
              </div>

              <div className="pos-cart-total">
                <span className="pos-cart-total-label">Total</span>
                <span className="pos-cart-total-val">${totalCart.toLocaleString('es-MX', {minimumFractionDigits:2})}</span>
              </div>

              <button className="pos-cobrar-btn" disabled={cart.length === 0 || isPrinting} onClick={handleCobrar}>
                {isPrinting ? 'Imprimiendo...' : 'Cobrar e Imprimir Ticket'}
              </button>
            </div>
          </motion.div>
        )}

        {view === 'corte' && (
          <motion.div
            key="corte"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="pos-corte-grid"
          >
            <div className="pos-corte-card" style={{ position: 'relative' }}>
              <div className="pos-box-title">Corte de Turno — {cajeroObj.nombre}</div>
              
              <div className="dash-tooltip">
                ?
                <div className="dash-tooltip-text" style={{ bottom: '130%', right: 0 }}>
                  Actualmente cobran de memoria y el dinero se mezcla. Con esto, sabes exactamente cuánto debe tener cada persona en la bolsa o cajón al terminar su turno.
                </div>
              </div>

              <div className="pos-corte-hero">
                ${corteCajero.total.toLocaleString('es-MX', {minimumFractionDigits:2})}
              </div>
              <div className="pos-corte-row">
                <span className="pos-corte-label">Efectivo en caja:</span>
                <span className="pos-corte-val" style={{ color: 'var(--c-success)' }}>${corteCajero.efectivo.toLocaleString()}</span>
              </div>
              <div className="pos-corte-row">
                <span className="pos-corte-label">Transferencias reportadas:</span>
                <span className="pos-corte-val">${corteCajero.transferencia.toLocaleString()}</span>
              </div>
              <div className="pos-corte-row">
                <span className="pos-corte-label">Tickets cobrados:</span>
                <span className="pos-corte-val">{corteCajero.operaciones}</span>
              </div>
            </div>

            <div className="pos-corte-card" style={{ background: 'var(--c-panel)', border: 'none' }}>
              <div className="pos-box-title">Corte Consolidado (Día Completo)</div>
              <div className="pos-corte-hero">
                ${resumenHoy.ventaTotal.toLocaleString('es-MX', {minimumFractionDigits:2})}
              </div>
              <div className="pos-corte-row">
                <span className="pos-corte-label">Total Efectivo:</span>
                <span className="pos-corte-val" style={{ color: 'var(--c-success)' }}>${resumenHoy.efectivo.toLocaleString()}</span>
              </div>
              <div className="pos-corte-row">
                <span className="pos-corte-label">Total Transferencias:</span>
                <span className="pos-corte-val">${resumenHoy.transferencia.toLocaleString()}</span>
              </div>
              <div className="pos-corte-row">
                <span className="pos-corte-label">Trabajos listos o entregados:</span>
                <span className="pos-corte-val">{resumenHoy.trabajosListos + resumenHoy.trabajosEntregados}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vista previa modal del comprobante */}
      {ventaToPrint && (
        <div className="comp-preview-overlay" data-lenis-prevent="true">
          <div className="comp-preview-actions">
            <button onClick={() => setVentaToPrint(null)}>Cerrar</button>
            <button className="primary" onClick={() => window.print()}>
              Imprimir / PDF
            </button>
          </div>
          <div className="print-only-wrapper">
            <ComprobanteTrabajo
              folio={ventaToPrint.id}
              fecha={ventaToPrint.fecha}
              cliente="Mostrador (Público General)"
              telefono=""
              producto={ventaToPrint.items.map(i => i.nombre).join(', ')}
              medidas="N/A"
              total={ventaToPrint.total}
              anticipo={ventaToPrint.total}
              saldo={0}
              garantiaMeses={negocio.garantiaMeses}
              esVentaDirecta={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
