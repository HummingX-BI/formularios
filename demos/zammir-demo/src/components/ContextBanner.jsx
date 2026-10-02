import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContextBanner({ id, show, text, actionText, onAction }) {
  const [closed, setClosed] = useState(() => sessionStorage.getItem(`zammir_banner_${id}`) === 'true');

  if (closed || !show) return null;

  const handleClose = () => {
    setClosed(true);
    sessionStorage.setItem(`zammir_banner_${id}`, 'true');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        style={{
          background: 'rgba(27, 54, 93, 0.05)',
          border: '1px solid rgba(27, 54, 93, 0.1)',
          borderRadius: 'var(--r-md)',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{
            background: 'var(--c-laton)',
            color: '#fff',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            flexShrink: 0
          }}>
            !
          </div>
          <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--c-ink)' }}>
            {text}{' '}
            {actionText && (
              <span 
                onClick={onAction}
                style={{ color: 'var(--c-laton)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {actionText}
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--c-ink-muted)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
            padding: '0.25rem'
          }}
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
