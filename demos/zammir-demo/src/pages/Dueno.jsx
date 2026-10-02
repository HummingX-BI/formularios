import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Cotizador from '../components/Cotizador';
import Ordenes from '../components/Ordenes';
import POS from '../components/POS';
import Reportes from '../components/Reportes';
import Catalogo from '../components/Catalogo';
import TourOverlay from '../components/TourOverlay';
import PrimerosPasos from '../components/PrimerosPasos';
import '../styles/dueno.css';
import { negocio } from '../data/mockData';

const NAV_ITEMS = [
  { 
    id: 'catalogo', 
    label: 'Catálogo',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
  },
  { 
    id: 'cotizador', 
    label: 'Cotizador',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  },
  { 
    id: 'ordenes', 
    label: 'Órdenes de Trabajo',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
  },
  { 
    id: 'pos', 
    label: 'Mostrador',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
  },
  { 
    id: 'reportes', 
    label: 'Reportes',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
  }
];

const GLOBAL_STEPS = [
  {
    targetId: 'tour-sidebar',
    title: 'Tu panel de control central',
    description: 'Esta es tu barra de navegación. Desde aquí controlas absolutamente todo tu negocio, en un solo lugar.',
    placement: 'right'
  },
  {
    targetId: 'tour-target-dash-btn',
    action: 'dashboard',
    title: 'Dashboard',
    description: 'Tu vista de pájaro. Aquí ves la salud general del negocio, cuánto ha entrado hoy y qué urge cobrar.',
    placement: 'right'
  },
  {
    targetId: 'tour-nav-catalogo',
    action: 'catalogo',
    title: 'Catálogo Central',
    description: 'Cambia un precio aquí y se actualizará automáticamente en tus cotizaciones y caja.',
    placement: 'right'
  },
  {
    targetId: 'tour-nav-cotizador',
    action: 'cotizador',
    title: 'Cotizador Inteligente',
    description: 'Calcula precios en vivo con el cliente enfrente y mándale un PDF por WhatsApp en segundos.',
    placement: 'right'
  },
  {
    targetId: 'tour-nav-ordenes',
    action: 'ordenes',
    title: 'Órdenes de Trabajo',
    description: 'El seguimiento exacto de cada proyecto. Olvídate de los papeles perdidos y los post-its.',
    placement: 'right'
  },
  {
    targetId: 'tour-nav-pos',
    action: 'pos',
    title: 'Mostrador',
    description: 'Cobra rápidamente e imprime tickets. Al finalizar el día, aquí haces tus cortes de caja.',
    placement: 'right'
  },
  {
    targetId: 'tour-nav-reportes',
    action: 'reportes',
    title: 'Reportes Financieros',
    description: 'Métricas claras y al grano para entender si estás ganando o perdiendo dinero este mes.',
    placement: 'right'
  }
];

const DASHBOARD_STEPS = [
  {
    targetId: 'tour-ventas',
    title: 'Ventas al Segundo',
    description: 'Saber cuánto entró hoy (efectivo vs transferencia) evita que el dinero se mezcle. Cuentas claras al final del día.',
    placement: 'bottom'
  },
  {
    targetId: 'tour-cpc',
    title: 'Que nada se te escape',
    description: 'Dinero que ya es tuyo pero sigue en la calle. Lo rojo son deudas vencidas con más de 10 días.',
    placement: 'bottom'
  },
  {
    targetId: 'tour-tendencias',
    title: 'Tendencias a simple vista',
    description: 'Identifica los días fuertes de la semana sin tener que exportar a Excel.',
    placement: 'right'
  },
  {
    targetId: 'tour-pipeline',
    title: 'Producción Ordenada',
    description: '¿Qué se debe cortar hoy? ¿Qué se instala mañana? Aquí tu equipo ve su lista de pendientes.',
    placement: 'left'
  }
];

const COTIZADOR_STEPS = [
  {
    targetId: 'tour-cot-form',
    title: 'Cálculo Profesional',
    description: 'Elige el cristal o aluminio, mete las medidas y el precio sale al instante sin arrastrar el lápiz.',
    placement: 'right'
  },
  {
    targetId: 'tour-cot-live',
    title: 'Precio Transparente',
    description: 'El cliente ve el precio formándose en vivo. Eso transmite mucha más confianza que un papel hecho a mano.',
    placement: 'left'
  }
];

// Nuevos tours locales
const POS_STEPS = [
  { targetId: 'tour-pos-catalog', title: 'Catálogo Rápido', description: 'Toca los productos para agregarlos al carrito al instante.', placement: 'right' },
  { targetId: 'tour-pos-cart', title: 'Ticket y Cobro', description: 'Aquí ves el resumen, eliges el método de pago e imprimes el comprobante con un clic.', placement: 'left' },
  { targetId: 'tour-pos-cajero', title: 'Asignación de Cajero', description: 'Selecciona quién está cobrando en este momento. Todas las ventas rápidas quedarán registradas a su nombre para evitar confusiones de dinero.', placement: 'bottom' },
  { targetId: 'tour-pos-venta', title: 'Venta de Mostrador', description: 'Usa esta función para cobrar artículos rápidos de stock o cortes simples sin tener que levantar todo un folio de proyecto formal.', placement: 'bottom' },
  { targetId: 'tour-pos-corte', title: 'Corte de Caja', description: 'Al final del turno, aquí cuadras todo lo vendido en mostrador. El dinero "chico" de la tienda ya no se mezclará con los grandes anticipos.', placement: 'bottom' }
];

const ORDENES_STEPS = [
  { targetId: 'tour-ord-kpi', title: 'Métricas de Taller', description: '¿Cuánto dinero tienes atorado en el taller? Estos indicadores te dicen el valor exacto de la producción activa.', placement: 'bottom' },
  { targetId: 'tour-ord-table', title: 'Control de Estatus', description: 'Pasa las órdenes de "En Espera" a "En Proceso" o "Listo" con un clic, sin arrastrar papeles.', placement: 'top' },
  { targetId: 'tour-ord-volumen', title: 'Volumen por Etapa', description: 'Controla exactamente el flujo del taller. Observa cómo los trabajos avanzan desde "En Espera" hasta "Entregado" para que nunca se traspapele una orden y sepas qué está haciendo tu equipo hoy.', placement: 'top' }
];

const REPORTES_STEPS = [
  { targetId: 'tour-rep-finanzas', title: 'Salud Financiera', description: 'Compara si vendiste más que ayer, que la semana pasada o que el mes pasado.', placement: 'bottom' },
  { targetId: 'tour-rep-cajeros', title: 'Rendimiento', description: '¿Quién cobró más hoy? Ideal para pagar comisiones o medir productividad.', placement: 'right' },
  { targetId: 'tour-rep-cobranza', title: 'Alerta Roja', description: 'La lista negra de las deudas. Llama a estos clientes hoy mismo para recuperar tu dinero.', placement: 'top' },
  { targetId: 'tour-rep-top', title: 'Top Productos', description: 'Descubre de inmediato cuáles materiales te dejan más ganancias para planear mejor tus compras a proveedores.', placement: 'top' },
  { targetId: 'tour-rep-estado', title: 'Estado de Producción', description: 'Monitorea la carga real de tu taller. Sabiendo cuántas órdenes activas tienes, puedes prometer fechas de entrega más precisas a tus nuevos clientes.', placement: 'top' }
];

const CATALOGO_STEPS = [
  { targetId: 'tour-cat-header', title: 'Catálogo Único', description: 'Agrega y modifica productos. Cuando cambias un precio aquí, se actualiza en Mostrador y Cotizador automáticamente.', placement: 'bottom' },
  { targetId: 'tour-cat-resumen', title: 'Alertas de Stock', description: 'El sistema te avisa de inmediato qué productos estándar están a punto de agotarse.', placement: 'bottom' },
  { targetId: 'tour-cat-lista', title: 'Inventario Estructurado', description: 'Tus vidrios, aluminios y servicios organizados por categoría. Mantén tus precios de lista actualizados aquí, y tus vendedores siempre cotizarán con el precio correcto.', placement: 'top' }
];

export default function Dueno() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('zammir_onboarding_done') === 'true' ? 'dashboard' : 'onboarding';
  });
  
  const [toursVistos, setToursVistos] = useState(() => {
    const guardado = localStorage.getItem('zammir_tours');
    if (guardado) return JSON.parse(guardado);
    return { global: false, dashboard: false, cotizador: false, ordenes: false, pos: false, reportes: false, catalogo: false };
  });

  const [currentTour, setCurrentTour] = useState(null);

  useEffect(() => {
    if (currentTour === 'global') return;

    if (!toursVistos[activeTab]) {
      if (activeTab === 'dashboard') setCurrentTour('dashboard');
      else if (activeTab === 'cotizador') setCurrentTour('cotizador');
      else if (activeTab === 'pos') setCurrentTour('pos');
      else if (activeTab === 'ordenes') setCurrentTour('ordenes');
      else if (activeTab === 'reportes') setCurrentTour('reportes');
      else if (activeTab === 'catalogo') setCurrentTour('catalogo');
    }
  }, [activeTab, toursVistos, currentTour]);

  const marcarVisto = (tourName) => {
    const nuevosTours = { ...toursVistos, [tourName]: true };
    setToursVistos(nuevosTours);
    localStorage.setItem('zammir_tours', JSON.stringify(nuevosTours));
  };

  const handleFinishTour = () => {
    if (currentTour) {
      marcarVisto(currentTour);
    }
    setCurrentTour(null);
    // Si acaba de terminar el global, asegurarse que regrese al dashboard sin lanzar su tour enseguida (porque ya se marcó como visto o se pospone)
    if (currentTour === 'global') {
      setActiveTab('dashboard');
    }
  };

  const handleStartGlobalTour = () => {
    setActiveTab('dashboard');
    setCurrentTour('global');
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab !== 'onboarding') {
      sessionStorage.setItem('zammir_onboarding_done', 'true');
    }
  };

  const fecha = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  let activeSteps = null;
  if (currentTour === 'global') activeSteps = GLOBAL_STEPS;
  if (currentTour === 'dashboard') activeSteps = DASHBOARD_STEPS;
  if (currentTour === 'cotizador') activeSteps = COTIZADOR_STEPS;
  if (currentTour === 'pos') activeSteps = POS_STEPS;
  if (currentTour === 'ordenes') activeSteps = ORDENES_STEPS;
  if (currentTour === 'reportes') activeSteps = REPORTES_STEPS;
  if (currentTour === 'catalogo') activeSteps = CATALOGO_STEPS;

  return (
    <div className="d-layout">
      {/* Sidebar */}
      <aside className="d-sidebar" id="tour-sidebar">
        <div 
          className="d-logo" 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
          onClick={() => handleTabChange('dashboard')}
        >
          ZAMMIR 
          <span style={{ fontSize: '0.6rem', background: 'var(--c-laton)', color: '#fff', padding: '0.2rem 0.4rem', borderRadius: '4px', letterSpacing: '0.1em' }}>PRO</span>
        </div>
        <nav className="d-nav">
          <button 
            id="tour-target-dash-btn"
            className={`d-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
            style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </button>
          
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--c-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '1rem', marginBottom: '0.5rem' }}>Flujo de Trabajo</div>
          {NAV_ITEMS.map((item, index) => {
            const isCompleted = toursVistos[item.id];
            return (
              <button 
                key={item.id}
                id={`tour-nav-${item.id}`}
                className={`d-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleTabChange(item.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className="nav-icon" style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: activeTab === item.id ? 'var(--c-laton)' : 'var(--c-ink-soft)',
                    transition: 'color 0.2s'
                  }}>
                    {item.icon}
                  </span>
                  <span style={{ fontWeight: activeTab === item.id ? 600 : 400 }}>{item.label}</span>
                </div>
                {isCompleted && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            );
          })}
          <div className="d-nav-spacer" style={{ flex: 1 }} />
          <button 
            className="d-nav-item" 
            style={{ fontSize: '0.8rem', color: 'var(--c-laton)', opacity: 0.8 }}
            onClick={handleStartGlobalTour}
          >
            ¿Qué hace esto? (Tour)
          </button>
          {activeTab !== 'onboarding' && (
            <button 
              className="d-nav-item" 
              style={{ fontSize: '0.8rem', color: 'var(--c-ink-soft)', marginTop: '0.5rem' }}
              onClick={() => setActiveTab('onboarding')}
            >
              Ver Primeros Pasos
            </button>
          )}
          <button 
            className="d-nav-item" 
            style={{ marginTop: '0.5rem', color: 'var(--c-ink-muted)' }}
            onClick={() => {
              // Limpiar todo el cache al salir para facilidad de la demo
              localStorage.removeItem('zammir_tours');
              sessionStorage.removeItem('zammir_onboarding_done');
              navigate('/');
            }}
          >
            ← Volver al inicio
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="d-main" id="tour-main-content">
        <header className="d-header">
          <div>
            <div className="d-header-date">{fecha}</div>
            <h1 className="d-header-title">Hola, Luis.</h1>
          </div>
          <div className="d-header-quote">
            "Cada medida que tomas hoy es un trabajo que vas a entregar bien hecho. Haz que tu administración refleje esa misma calidad."
          </div>
        </header>

        <div className="d-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'onboarding' && (
                <PrimerosPasos 
                  toursVistos={toursVistos}
                  onNavigate={handleTabChange}
                  onSkip={() => handleTabChange('dashboard')}
                />
              )}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'cotizador' && <Cotizador toursVistos={toursVistos} onNavigate={handleTabChange} />}
              {activeTab === 'ordenes' && <Ordenes toursVistos={toursVistos} onNavigate={handleTabChange} />}
              {activeTab === 'pos' && <POS />}
              {activeTab === 'reportes' && <Reportes toursVistos={toursVistos} />}
              {activeTab === 'catalogo' && <Catalogo />}
              {activeTab !== 'onboarding' && activeTab !== 'dashboard' && activeTab !== 'cotizador' && activeTab !== 'ordenes' && activeTab !== 'pos' && activeTab !== 'reportes' && activeTab !== 'catalogo' && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--c-ink-muted)' }}>
                  Módulo de {NAV_ITEMS.find(n => n.id === activeTab).label} en construcción.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {activeSteps && (
        <TourOverlay 
          steps={activeSteps} 
          onFinish={handleFinishTour}
          onStepChange={(newTab) => {
            if (newTab && newTab !== activeTab) {
              handleTabChange(newTab);
            }
          }}
        />
      )}

      {/* Botón flotante de orientación */}
      {activeTab !== 'onboarding' && (
        <motion.button
          className="tour-fab print-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('onboarding')}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--c-laton)',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: '0.75rem 1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 15px rgba(27,54,93,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 100
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          ¿Por dónde empiezo?
        </motion.button>
      )}
    </div>
  );
}