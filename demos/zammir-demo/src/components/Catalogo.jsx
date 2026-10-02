import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { catalogo } from '../data/mockData';
import '../styles/catalogo.css';

export default function Catalogo() {
  const [modalOpen, setModalOpen] = useState(false);

  // Agrupar catálogo lógicamente
  const categorias = [
    {
      id: 'claro',
      titulo: 'Vidrio Claro / Flotado',
      items: catalogo.filter(p => p.nombre.toLowerCase().includes('claro') || p.nombre.toLowerCase().includes('flotado'))
    },
    {
      id: 'templado',
      titulo: 'Vidrio Templado',
      items: catalogo.filter(p => p.nombre.toLowerCase().includes('templado'))
    },
    {
      id: 'espejo',
      titulo: 'Espejos',
      items: catalogo.filter(p => p.nombre.toLowerCase().includes('espejo'))
    },
    {
      id: 'termopanel',
      titulo: 'Cristal Doble / Termopanel',
      items: catalogo.filter(p => p.nombre.toLowerCase().includes('doble') || p.nombre.toLowerCase().includes('termopanel'))
    },
    {
      id: 'aluminio',
      titulo: 'Aluminio y Cancelería (Estándar)',
      items: catalogo.filter(p => p.nombre.toLowerCase().includes('aluminio') || p.nombre.toLowerCase().includes('cancelería') || p.nombre.toLowerCase().includes('mampara') || p.nombre.toLowerCase().includes('vitrina'))
    },
    {
      id: 'servicios',
      titulo: 'Servicios',
      items: catalogo.filter(p => p.tipo === 'servicio')
    }
  ];

  const handleFakeSubmit = (e) => {
    e.preventDefault();
    alert('Simulación: El nuevo producto ha sido agregado al catálogo centralizado.');
    setModalOpen(false);
  };

  // BI Data for Catalogo
  const pieData = categorias.map(c => ({
    name: c.titulo,
    value: c.items.length
  })).filter(c => c.value > 0);

  const COLORS = ['#1B365D', '#A68A56', '#1E4620', '#2A4B5C', '#5B2333', '#4A5568'];

  const bajoStock = catalogo.filter(p => p.stock !== null && p.stock < 5).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="cat-container"
    >
      <div id="tour-cat-header" className="cat-header">
        <div>
          <h2 className="cat-title">Catálogo Centralizado</h2>
          <div className="dash-tooltip" style={{position:'static', marginLeft:'0.5rem'}}>
            ?
            <div className="dash-tooltip-text" style={{ bottom: 'auto', top: '130%', left: 0, width: '280px' }}>
              No más libretas con precios tachados o buscar listas de precios viejas. Aquí tienes todo tu portafolio limpio, estandarizado y fácil de actualizar.
            </div>
          </div>
        </div>
        <button className="cat-btn-add" onClick={() => setModalOpen(true)}>
          + Agregar Producto
        </button>
      </div>

      {/* Resumen de Inventario BI */}
      <div id="tour-cat-resumen" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, background: 'var(--c-panel)', padding: '1.5rem', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--c-ink-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Distribución de Catálogo</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-ink)' }}>{catalogo.length} SKU's</div>
          </div>
          <div style={{ width: '120px', height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ flex: 1, background: 'var(--c-panel)', padding: '1.5rem', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--c-ink-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Alertas de Inventario</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: bajoStock > 0 ? '#C0392B' : '#27AE60' }}>
              {bajoStock}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--c-ink-soft)' }}>
              productos estándar con stock menor a 5 unidades. Considera reabastecer.
            </div>
          </div>
        </div>
      </div>

      <div id="tour-cat-lista">
        {categorias.map(cat => {
          if (cat.items.length === 0) return null;
          return (
            <div key={cat.id} className="cat-group">
            <div className="cat-group-title">
              {cat.titulo}
              <span className="cat-group-count">{cat.items.length}</span>
            </div>
            <div className="cat-table-wrapper">
              <table className="cat-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>SKU</th>
                    <th style={{ width: '40%' }}>Descripción</th>
                    <th style={{ width: '15%' }}>Tipo</th>
                    <th style={{ width: '15%', textAlign: 'right' }}>Unidad</th>
                    <th style={{ width: '15%', textAlign: 'right' }}>Precio Lista</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map(item => (
                    <tr key={item.id}>
                      <td><span className="cat-sku">{item.sku}</span></td>
                      <td style={{ fontWeight: 500 }}>{item.nombre}</td>
                      <td>
                        <span className={`cat-badge ${item.tipo === 'a medida' ? 'medida' : item.tipo === 'pieza estándar' ? 'pieza' : 'servicio'}`}>
                          {item.tipo}
                        </span>
                        {item.stock !== null && (
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: item.stock < 5 ? '#C0392B' : 'var(--c-ink-soft)', fontWeight: item.stock < 5 ? 700 : 400 }}>
                            (Stock: {item.stock})
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--c-ink-soft)' }}>
                        {item.unidad}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        ${item.precio.toLocaleString('es-MX', {minimumFractionDigits:2})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      </div>

      {/* Fake Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            className="cat-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="cat-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <button className="cat-modal-close" onClick={() => setModalOpen(false)}>×</button>
              <h3 className="cat-modal-title">Agregar al Catálogo</h3>
              <form className="cat-modal-form" onSubmit={handleFakeSubmit}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Nombre / Descripción</label>
                    <input type="text" placeholder="Ej. Espejo 6mm plata" required />
                  </div>
                  <div style={{ width: '100px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>SKU</label>
                    <input type="text" placeholder="ESP-06" required />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Tipo de Venta</label>
                    <select>
                      <option>A medida</option>
                      <option>Pieza estándar</option>
                      <option>Servicio</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Unidad de Medida</label>
                    <select>
                      <option>m²</option>
                      <option>pieza</option>
                      <option>visita</option>
                      <option>metro lineal</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <label>Precio Base de Lista ($ MXN)</label>
                  <input type="number" placeholder="0.00" required />
                </div>

                <button type="submit" className="cat-modal-btn">Guardar Producto</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
