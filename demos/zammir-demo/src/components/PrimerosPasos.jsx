import { motion } from 'framer-motion';

export default function PrimerosPasos({ toursVistos, onNavigate, onSkip }) {
  const steps = [
    {
      id: 'catalogo',
      num: 1,
      title: 'Organiza tu catálogo',
      desc: 'Define tus productos y precios base para que todo el equipo cobre lo mismo sin errores.',
      completed: toursVistos?.catalogo
    },
    {
      id: 'cotizador',
      num: 2,
      title: 'Haz tu primera cotización',
      desc: 'Calcula precios en vivo frente al cliente y envíale un PDF por WhatsApp para cerrar la venta rápido.',
      completed: toursVistos?.cotizador
    },
    {
      id: 'ordenes',
      num: 3,
      title: 'Da seguimiento a un trabajo',
      desc: 'Pasa un trabajo de "En Espera" a "En Proceso" para que tu equipo en el taller sepa qué hacer hoy.',
      completed: toursVistos?.ordenes
    },
    {
      id: 'pos',
      num: 4,
      title: 'Registra una venta de mostrador',
      desc: 'Cobra piezas estándar al instante y genera un ticket. Así el dinero no se mezcla en la bolsa.',
      completed: toursVistos?.pos
    },
    {
      id: 'dashboard',
      num: 5,
      title: 'Revisa cómo va tu negocio',
      desc: 'Mira tus cuentas por cobrar, ventas del día y salud financiera en una sola pantalla.',
      completed: toursVistos?.dashboard
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--c-ink)', marginBottom: '1rem', fontWeight: 700 }}>
          Primeros Pasos en ZAMMIR
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--c-ink-soft)', maxWidth: '600px', margin: '0 auto' }}>
          Para sacarle el máximo provecho a la plataforma, te sugerimos seguir este camino. Selecciona el primer paso para comenzar.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {steps.map((step) => {
          const isCompleted = step.completed;
          return (
            <motion.div 
              key={step.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onNavigate(step.id)}
              style={{
                background: isCompleted ? 'rgba(39, 174, 96, 0.05)' : 'var(--c-paper)',
                border: `1px solid ${isCompleted ? 'rgba(39, 174, 96, 0.3)' : 'rgba(124,133,146,0.2)'}`,
                padding: '1.5rem 2rem',
                borderRadius: 'var(--r-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'pointer',
                boxShadow: isCompleted ? 'none' : 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isCompleted ? '#27AE60' : 'var(--c-laton)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '1.2rem',
                flexShrink: 0
              }}>
                {isCompleted ? '✓' : step.num}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: isCompleted ? '#27AE60' : 'var(--c-ink)', marginBottom: '0.25rem', fontWeight: 700 }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--c-ink-soft)', margin: 0 }}>
                  {step.desc}
                </p>
              </div>
              <div style={{ color: isCompleted ? '#27AE60' : 'var(--c-laton)' }}>
                →
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={onSkip}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--c-ink-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            padding: '0.75rem 1.5rem',
            textDecoration: 'underline'
          }}
        >
          Explorar libremente
        </button>
      </div>
    </motion.div>
  );
}
