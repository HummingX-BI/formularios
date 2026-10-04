import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from './utils';
import { useAppStore } from '@/app/store';

export interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose?: (id: string) => void;
  duration?: number;
}

export function Toast({ id, title, message, type = 'info', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />
  };

  const bgs = {
    success: 'bg-emerald-50 border-emerald-100',
    info: 'bg-sky-50 border-sky-100',
    warning: 'bg-amber-50 border-amber-100',
    error: 'bg-red-50 border-red-100'
  };

  return (
    <div 
      className={cn("flex items-start p-4 mb-3 border rounded-lg shadow-lg pointer-events-auto transform transition-all duration-300 translate-y-0 opacity-100 w-80", bgs[type])}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        {message && <div className="mt-1 text-xs text-slate-600">{message}</div>}
      </div>
      {onClose && (
        <button onClick={() => onClose(id)} className="ml-3 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();
  
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-[100] flex flex-col pointer-events-none"
      role="region"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
}
