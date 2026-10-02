import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ordenes as mockOrdenes, clientes, cajeros, negocio } from '../data/mockData';
import ContextBanner from './ContextBanner';
import ComprobanteTrabajo from './ComprobanteTrabajo';
import '../styles/ordenes.css';

const COLUMNAS = [
  { id: 'en espera', titulo: 'En Espera', color: '#A68A56' },
  { id: 'en proceso', titulo: 'En Proceso', color: '#1B365D' },
  { id: 'listo para entrega', titulo: 'Listo para Entrega', color: '#1E4620' },
  { id: 'entregado', titulo: 'Entregado', color: '#4A5568' }
];

export default function Ordenes({ toursVistos, onNavigate }) {
  const [ordenesList, setOrdenesList] = useState(() => 
    mockOrdenes.map(o => ({
      ...o,
      garantia: o.instalacion || o.total > 5000
    }))
  );
  
  const [ordenToPrint, setOrdenToPrint] = useState(null);

  const avanzarEstatus = (ordenId, estatusActual) => {
    const currentIndex = COLUMNAS.findIndex(c => c.id === estatusActual);
    if (currentIndex < COLUMNAS.length - 1) {
      const nextEstatus = COLUMNAS[currentIndex + 1].id;
      setOrdenesList(prev => 
        prev.map(o => o.id === ordenId ? { ...o, estatus: nextEstatus } : o)
      );
    }
  };

  const getClienteNombre = (id) => clientes.find(c => c.id === id)?.nombre || 'Cliente M.';

  // KPIs
  const activas = ordenesList.filter(o => o.estatus !== 'entregado');
  const valorProduccion = activas.filter(o => ['en espera', 'en proceso'].includes(o.estatus)).reduce((sum, o) => sum + o.total, 0);
  const valorListos = activas.filter(o => o.estatus === 'listo para entrega').reduce((sum, o) => sum + o.saldoPendiente, 0);

  // Data for Funnel/Pipeline Chart
  const funnelData = COLUMNAS.map(col => ({
    name: col.titulo,
    cantidad: ordenesList.filter(o => o.estatus === col.id).length,
    color: col.color
  }));

  return (
    <div className="ord-container">
      <ContextBanner 
        id="ordenes_cotizador"
        show={toursVistos && !toursVistos.cotizador}
        text="Tip: aún no has generado ninguna cotización nueva en esta sesión. Te invitamos a hacer una prueba para verla aquí."
        actionText="Ir al Cotizador →"
        onAction={() => onNavigate('cotizador')}
      />
      <div className="ord-header-info">
        <h2 className="ord-title">Pipeline Analítico</h2>
        <div className="dash-tooltip" style={{position:'static'}}>
          ?
          <div className="dash-tooltip-text" style={{ bottom: 'auto', top: '130%', right: 'auto', left: 0, width: '260px' }}>
            Controla tu producción con visión ejecutiva. Identifica cuellos de botella y gestiona el valor retenido en el taller.
          </div>
        </div>
      </div>
      
      {/* KPIs Superiores */}
      <div id="tour-ord-kpi" className="ord-kpi-row">
        <div className="ord-kpi-card">
          <div>
            <div className="ord-kpi-label">Valor en Producción</div>
            <div className="ord-kpi-val" style={{ color: 'var(--c-ink)' }}>${valorProduccion.toLocaleString()}</div>
          </div>
          <div className="ord-kpi-icon" style={{ background: 'rgba(27,54,93,0.1)', color: '#1B365D' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          </div>
        </div>
        <div className="ord-kpi-card">
          <div>
            <div className="ord-kpi-label">Por Cobrar (Listos)</div>
            <div className="ord-kpi-val" style={{ color: '#1E4620' }}>${valorListos.toLocaleString()}</div>
          </div>
          <div className="ord-kpi-icon" style={{ background: 'rgba(30,70,32,0.1)', color: '#1E4620' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
      </div>

      <div className="ord-dashboard">
        {/* Gráfica Funnel (Volumen por etapa) */}
        <div id="tour-ord-volumen" className="ord-funnel-section">
          <div className="ord-section-title">Volumen por Etapa</div>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer>
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--c-ink-soft)'}} width={120} />
                <Tooltip 
                  cursor={{fill: 'rgba(124,133,146,0.05)'}}
                  contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderRadius: '4px' }}
                  formatter={(val) => [`${val} Órdenes`, 'Cantidad']}
                />
                <Bar dataKey="cantidad" radius={[0, 4, 4, 0]} barSize={24}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla Analítica */}
        <div id="tour-ord-table" className="ord-table-section">
          <div className="ord-section-title">Gestión de Órdenes</div>
          <div className="ord-table-wrapper">
            <table className="ord-data-table">
              <thead>
                <tr>
                  <th>Folio / Cliente</th>
                  <th>Descripción</th>
                  <th>Estatus</th>
                  <th style={{ textAlign: 'right' }}>Saldo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {ordenesList.filter(o => o.estatus !== 'entregado').map(orden => {
                    const statusObj = COLUMNAS.find(c => c.id === orden.estatus);
                    return (
                      <motion.tr 
                        layout
                        key={orden.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scaleY: 0.8 }}
                      >
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--c-ink)', fontSize: '0.9rem' }}>{getClienteNombre(orden.clienteId)}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--c-ink-muted)' }}>{orden.id}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', color: 'var(--c-ink-soft)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {orden.descripcion}
                          </div>
                          {orden.garantia && (
                            <div className="ord-garantia-badge">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                              </svg>
                              Garantía
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusObj.color }} />
                            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: statusObj.color, textTransform: 'uppercase', fontWeight: 600 }}>
                              {statusObj.titulo}
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: orden.saldoPendiente > 0 ? '#C0392B' : 'var(--c-ink-soft)' }}>
                            ${orden.saldoPendiente.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ width: '160px' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                              className="ord-action-btn"
                              style={{ background: 'transparent', color: 'var(--c-ink-soft)', border: '1px solid rgba(124,133,146,0.3)', padding: '0.4rem' }}
                              onClick={() => setOrdenToPrint(orden)}
                              title="Generar Comprobante"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            </button>
                            <button 
                              className="ord-action-btn"
                              onClick={() => avanzarEstatus(orden.id, orden.estatus)}
                            >
                              Avanzar →
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Vista previa modal del comprobante */}
      {ordenToPrint && (
        <div className="comp-preview-overlay" data-lenis-prevent="true">
          <div className="comp-preview-actions">
            <button onClick={() => setOrdenToPrint(null)}>Cerrar</button>
            <button className="primary" onClick={() => window.print()}>
              Imprimir / PDF
            </button>
          </div>
          <div className="print-only-wrapper">
            <ComprobanteTrabajo
              folio={ordenToPrint.id}
              fecha={ordenToPrint.fecha}
              cliente={getClienteNombre(ordenToPrint.clienteId)}
              telefono=""
              producto={ordenToPrint.descripcion}
              medidas="Según proyecto"
              total={ordenToPrint.total}
              anticipo={ordenToPrint.total - ordenToPrint.saldoPendiente}
              saldo={ordenToPrint.saldoPendiente}
              garantiaMeses={negocio.garantiaMeses}
              esVentaDirecta={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
