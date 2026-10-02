import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie
} from 'recharts';
import { ordenes, cuentasPorCobrar, resumenHoy, cajeros } from '../data/mockData';
import ContextBanner from './ContextBanner';
import '../styles/reportes.css';

export default function Reportes({ toursVistos }) {
  const pendingOrders = ordenes.filter(o => o.estatus !== 'entregado').length;
  const enEspera = ordenes.filter(o => o.estatus === 'en espera').length;
  const enProceso = ordenes.filter(o => o.estatus === 'en proceso').length;
  const listos = ordenes.filter(o => o.estatus === 'listo para entrega').length;
  
  const totalCuentas = cuentasPorCobrar.reduce((sum, c) => sum + c.saldo, 0);

  // Data for Cajeros BarChart
  const cajeroData = cajeros.map(c => {
    const cobrado = c.id === 'luis' ? resumenHoy.ventaTotal * 0.4 : 
                    c.id === 'tono' ? resumenHoy.ventaTotal * 0.35 : 
                    resumenHoy.ventaTotal * 0.125;
    return { name: c.nombre.split(' ')[0], cobro: cobrado };
  });

  // Data for Products BarChart (Horizontal)
  const productData = [
    { name: 'Cancel Baño', uds: 8 },
    { name: 'Ventana AL 3"', uds: 5 },
    { name: 'Templado 9mm', uds: 4 },
  ];

  // Data for Trabajos PieChart
  const trabajosData = [
    { name: 'En espera', value: enEspera, color: '#A68A56' },
    { name: 'En proceso', value: enProceso, color: '#1B365D' },
    { name: 'Listos', value: listos, color: '#1E4620' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rep-container"
    >
      <ContextBanner 
        id="reportes_temprano"
        show={toursVistos && (!toursVistos.cotizador && !toursVistos.ordenes)}
        text="Tip: tus reportes se van a ver mejor conforme uses el resto del sistema — esto es una vista de ejemplo con datos de muestra."
      />
      <div className="rep-header">
        <h2 className="rep-title">Panel de Inteligencia (BI)</h2>
        <p className="rep-subtitle">
          Análisis automatizado de las operaciones. Detecta cuellos de botella y tendencias de venta.
        </p>
      </div>

      <div className="rep-grid">
        {/* 1. Ventas del día/semana/mes */}
        <div id="tour-rep-finanzas" className="rep-card" style={{ gridColumn: '1 / -1' }}>
          <div className="rep-card-title">Resumen Financiero</div>
          <div className="rep-metrics-row">
            <div className="rep-metric">
              <span className="rep-m-label">Venta de Hoy</span>
              <span className="rep-m-val">${resumenHoy.ventaTotal.toLocaleString()}</span>
              <span className="rep-m-delta positive">↑ 12% vs ayer</span>
            </div>
            <div className="rep-metric">
              <span className="rep-m-label">Venta Semanal</span>
              <span className="rep-m-val">$42,800</span>
              <span className="rep-m-delta positive">↑ 5% vs semana pasada</span>
            </div>
            <div className="rep-metric">
              <span className="rep-m-label">Venta Mensual</span>
              <span className="rep-m-val">$154,200</span>
              <span className="rep-m-delta negative">↓ 2% vs mes pasado</span>
            </div>
          </div>
        </div>

        {/* 2. Rendimiento Cajeros */}
        <div id="tour-rep-cajeros" className="rep-card" style={{ gridColumn: '1 / span 2' }}>
          <div className="rep-card-title">Cobros por Cajero (Hoy)</div>
          <div style={{ width: '100%', height: '220px', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <BarChart data={cajeroData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(124,133,146,0.2)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'var(--font-mono)', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} tick={{fontFamily: 'var(--font-mono)', fontSize: 10}} />
                <RechartsTooltip 
                  formatter={(val) => `$${val.toLocaleString()}`} 
                  contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderRadius: '4px' }} 
                  cursor={{fill: 'rgba(156,122,60,0.05)'}}
                />
                <Bar dataKey="cobro" radius={[4, 4, 0, 0]}>
                  {cajeroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#1B365D' : 'rgba(27,54,93,0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Top Productos */}
        <div id="tour-rep-top" className="rep-card">
          <div className="rep-card-title">Top Productos (Semana)</div>
          <div style={{ width: '100%', height: '220px', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <BarChart data={productData} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(124,133,146,0.2)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fontFamily: 'var(--font-mono)', fontSize: 10}} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'var(--font-mono)', fontSize: 10}} />
                <RechartsTooltip 
                  formatter={(val) => `${val} uds`} 
                  contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderRadius: '4px' }} 
                  cursor={{fill: 'rgba(124,133,146,0.05)'}}
                />
                <Bar dataKey="uds" fill="#1B365D" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Estado de Producción */}
        <div id="tour-rep-estado" className="rep-card">
          <div className="rep-card-title">Estado de Producción</div>
          <div style={{ display: 'flex', alignItems: 'center', height: '220px' }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={trabajosData} dataKey="value" innerRadius={40} outerRadius={70} stroke="none">
                    {trabajosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              <div className="rep-hero-metric" style={{ fontSize: '2rem' }}>{pendingOrders}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--c-ink-soft)', fontFamily: 'var(--font-mono)' }}>ÓRDENES ACTIVAS</div>
            </div>
          </div>
        </div>

        {/* 5. Riesgo de Cobranza */}
        <div id="tour-rep-cobranza" className="rep-card" style={{ gridColumn: 'span 2' }}>
          <div className="rep-card-title">Riesgo de Cobranza (Data Table)</div>
          <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(124,133,146,0.2)', color: 'var(--c-ink-muted)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>CLIENTE / ORDEN</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem' }}>DÍAS</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem' }}>SALDO</th>
                </tr>
              </thead>
              <tbody>
                {cuentasPorCobrar.map((cta, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(124,133,146,0.1)', backgroundColor: cta.diasDesde > 10 ? 'rgba(231,76,60,0.05)' : 'transparent' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--c-ink)' }}>{cta.clienteNombre || cta.clienteId}</span>
                      <br/>
                      <span style={{ fontSize: '0.7rem', color: 'var(--c-ink-soft)' }}>{cta.ordenId}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.75rem 0.5rem', color: cta.diasDesde > 10 ? '#C0392B' : 'var(--c-ink)' }}>
                      {cta.diasDesde}
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.75rem 0.5rem', fontWeight: 600, color: cta.diasDesde > 10 ? '#C0392B' : 'var(--c-ink)' }}>
                      ${cta.saldo.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
