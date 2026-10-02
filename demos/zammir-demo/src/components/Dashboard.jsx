import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, 
  PieChart, Pie, Cell, 
  ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { resumenHoy, ordenes, cuentasPorCobrar, historialVentas } from '../data/mockData';

// Helper component for count-up
function CountUp({ target, duration = 1.5 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
}

// Helper para limpiar el estatus
function EstatusBadge({ estatus }) {
  let color = '#1B365D'; // Navy Blue
  let label = 'Proceso';
  if (estatus === 'listo para entrega') { color = '#1E4620'; label = 'Listo'; } // Dark Green
  if (estatus === 'en espera') { color = '#546E7A'; label = 'Espera'; } // Slate

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, paddingLeft: '0.5rem' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const ordenesPendientes = ordenes.filter(o => o.estatus !== 'entregado').slice(0, 5);
  
  const COLORS = ['#1B365D', '#546E7A']; // Navy, Slate
  const pieData = [
    { name: 'Efectivo', value: resumenHoy.efectivo },
    { name: 'Transferencia', value: resumenHoy.transferencia }
  ];

  // Format data for Line chart (Historial)
  const chartData = historialVentas.map(h => ({
    fecha: h.fecha.substring(5), // keep MM-DD
    total: h.total
  })).reverse(); // Reverse if mockdata is newest first, but let's check. 
  // Actually, mockData dates go from 09-16 to 09-25. It's chronological. So no reverse needed. Let's just use it directly.

  return (
    <div className="dash-grid">
      
      {/* 1. Kpis Principales (Ventas y Desglose) */}
      <motion.div 
        id="tour-ventas"
        className="dash-card span-2 flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="dash-card-title">
          Ventas del Día & Medios de Pago
        </div>
        <div className="dash-tooltip">
          ?
          <div className="dash-tooltip-text">
            Saber exactamente cuánto entró hoy evita que el dinero se mezcle. Las cuentas claras al final del día dan paz mental.
          </div>
        </div>
        
        <div style={{ display: 'flex', flex: 1, gap: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div className="dash-val-large">
              $<CountUp target={resumenHoy.ventaTotal} />
            </div>
            <div className="dash-split">
              <div className="dash-split-col">
                <span className="dash-split-label">Efectivo</span>
                <span className="dash-split-val">${resumenHoy.efectivo.toLocaleString()}</span>
              </div>
              <div className="dash-split-col">
                <span className="dash-split-label">Transferencia</span>
                <span className="dash-split-val">${resumenHoy.transferencia.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1, height: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderRadius: '4px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 2. Cuentas por Cobrar (Urgentes) */}
      <motion.div 
        id="tour-cpc"
        className="dash-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="dash-card-title">
          Cuentas por Cobrar
        </div>
        <div className="dash-tooltip">
          ?
          <div className="dash-tooltip-text">
            Dinero que ya es tuyo pero sigue en la calle. Rojo indica que han pasado más de 10 días desde el trabajo.
          </div>
        </div>
        <div className="dash-list">
          {cuentasPorCobrar.slice(0, 4).map((cta, i) => (
            <div key={i} className="dash-list-item" style={{ background: cta.diasDesde > 10 ? 'rgba(192,57,43,0.08)' : 'rgba(244,241,236,0.5)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>{cta.clienteNombre || cta.clienteId}</span>
                <span style={{ fontSize: '0.75rem', color: cta.diasDesde > 10 ? '#C0392B' : 'var(--c-ink-muted)' }}>Hace {cta.diasDesde} días</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: cta.diasDesde > 10 ? '#C0392B' : 'var(--c-ink)' }}>
                ${cta.saldo.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. Gráfica de Tendencia (Ventas de los últimos 10 días) */}
      <motion.div 
        id="tour-tendencias"
        className="dash-card span-2 flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="dash-card-title">
          Tendencia de Ingresos (Últimos 10 días)
        </div>
        <div style={{ flex: 1, minHeight: '220px', marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historialVentas} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B365D" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1B365D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(124,133,146,0.2)" />
              <XAxis dataKey="fecha" tickFormatter={(val) => val.substring(5)} axisLine={false} tickLine={false} tick={{fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--c-ink-muted)'}} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} tick={{fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--c-ink-muted)'}} />
              <RechartsTooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
                labelFormatter={(label) => `Fecha: ${label}`}
                contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderRadius: '4px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="total" stroke="#1B365D" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 4. Trabajos Pendientes (Pipeline Snapshot) */}
      <motion.div 
        id="tour-pipeline"
        className="dash-card flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="dash-card-title">
          Pipeline de Producción
        </div>
        <div className="dash-list" style={{ marginTop: '0.5rem', flex: 1 }}>
          {ordenesPendientes.map((orden) => (
            <div key={orden.id} className="dash-list-item" style={{ padding: '0.6rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden', flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--c-ink)' }}>{orden.id}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--c-ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{orden.descripcion}</span>
              </div>
              <EstatusBadge estatus={orden.estatus} />
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
