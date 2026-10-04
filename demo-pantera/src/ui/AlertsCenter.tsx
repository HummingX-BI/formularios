import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/app/store';
import { useDataset } from '@/data/hooks';
import { useNavigate } from 'react-router-dom';

export function AlertsCenter() {
  const [open, setOpen] = useState(false);
  const { dismissedAlerts, dismissAlert } = useAppStore();
  const dataset = useDataset();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alerts = React.useMemo(() => {
    const engineAlerts = [
      { id: 'a1', title: 'Caída de retención', desc: 'Retención nivel principiante < 75%', type: 'warning' },
      { id: 'a2', title: 'Ocupación crítica', desc: 'Grupo Sab-10AM al 100%', type: 'error' },
      { id: 'a3', title: 'Oportunidad de ingreso', desc: '15 alumnos en lista de espera', type: 'info' }
    ];
    return engineAlerts.filter(a => !dismissedAlerts.includes(a.id));
  }, [dismissedAlerts]);

  const unreadCount = alerts.length;

  return (
    <div ref={wrapperRef} className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-500 hover:text-sky-600 transition-colors"
        aria-label="Centro de alertas"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        <div aria-live="polite" className="sr-only">
          {unreadCount > 0 ? `${unreadCount} alertas nuevas` : 'Sin alertas nuevas'}
        </div>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center" aria-hidden="true">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50">
          <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Centro de Alertas</h3>
            <button onClick={() => navigate('/c01/m1-3')} className="text-xs text-sky-600 font-semibold hover:underline flex items-center">
              Ver todas <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                No hay alertas pendientes
              </div>
            ) : (
              <div className="flex flex-col">
                {alerts.map(a => (
                  <div key={a.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 group">
                    <div className="mt-0.5 shrink-0">
                      {a.type === 'error' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : 
                       a.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : 
                       <Info className="w-4 h-4 text-sky-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-800 leading-tight mb-1">{a.title}</div>
                      <div className="text-xs text-slate-500 mb-2">{a.desc}</div>
                      <div className="flex gap-2">
                        <button onClick={() => { setOpen(false); navigate('/c01/m1-3'); }} className="text-xs font-semibold text-sky-600 hover:underline">Resolver</button>
                        <button onClick={() => dismissAlert(a.id)} className="text-xs font-medium text-slate-400 hover:text-slate-700 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Descartar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
