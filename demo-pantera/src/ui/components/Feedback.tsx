import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Buttons';

// InfoPopover
export const InfoPopover: React.FC<{ title: string; description: string; formula?: string }> = ({ title, description, formula }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button 
        className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-ice-100 text-secundario hover:bg-sky-200 hover:text-navy-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen(!open)}
        aria-label="Más información"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-64 p-4 mt-2 -translate-x-1/2 left-1/2 bg-navy-900 text-white text-sm rounded-lg shadow-xl"
          >
            <h4 className="font-bold font-jakarta mb-1">{title}</h4>
            <p className="text-ice-100 mb-2">{description}</p>
            {formula && (
              <div className="bg-blue-800 p-2 rounded font-mono text-xs text-sky-200">
                {formula}
              </div>
            )}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-navy-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Tooltip (simplified wrapper for hover)
export const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-navy-900 rounded whitespace-nowrap"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// EmptyState
export const EmptyState: React.FC<{ title: string; description: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-ice-100 rounded-xl bg-ice-50/50">
    <div className="w-16 h-16 rounded-full bg-ice-100 flex items-center justify-center text-sky-400 mb-4">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>
    <h3 className="text-lg font-bold text-navy-900 font-jakarta mb-1">{title}</h3>
    <p className="text-secundario max-w-sm mx-auto mb-4">{description}</p>
    {action}
  </div>
);

// ErrorState
export const ErrorState: React.FC<{ title: string; error: string; onRetry?: () => void }> = ({ title, error, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center border border-red-200 rounded-xl bg-red-50">
    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-coral mb-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    </div>
    <h3 className="text-base font-bold text-red-900 mb-1">{title}</h3>
    <p className="text-red-700 text-sm mb-4">{error}</p>
    {onRetry && <Button variant="danger" size="sm" onClick={onRetry}>Intentar de nuevo</Button>}
  </div>
);

// Skeleton
export const Skeleton: React.FC<{ className?: string }> = ({ className = "h-4 w-full" }) => (
  <div className={`animate-pulse bg-ice-100 rounded ${className}`}></div>
);

// ProgressBar
export const ProgressBar: React.FC<{ value: number; max?: number; colorClass?: string }> = ({ value, max = 100, colorClass = "bg-blue-600" }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-ice-100 rounded-full h-2 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`h-full ${colorClass}`} 
      />
    </div>
  );
};

// Toast
export const Toast: React.FC<{ message: string; type?: 'success' | 'error' | 'info'; onClose: () => void }> = ({ message, type = 'info', onClose }) => {
  const types = {
    success: 'bg-verde-agua text-white',
    error: 'bg-coral text-white',
    info: 'bg-navy-900 text-white'
  };

  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 ${types[type]} z-50`}
    >
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="opacity-80 hover:opacity-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </motion.div>
  );
};
