import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('Inicializando...');

  useEffect(() => {
    // Total wait ~ 2.5s
    const steps = [
      { p: 20, m: 'Generando alumnos...', t: 400 },
      { p: 50, m: 'Simulando pagos...', t: 900 },
      { p: 80, m: 'Calculando indicadores...', t: 1600 },
      { p: 100, m: 'Listo', t: 2300 }
    ];

    steps.forEach(({ p, m, t }) => {
      setTimeout(() => {
        setProgress(p);
        setMsg(m);
        if (p === 100) {
          setTimeout(onComplete, 200);
        }
      }, t);
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center font-sans">
      <div className="relative w-32 h-32 mb-8">
        {/* Drops and waves */}
        <div className="absolute inset-0 bg-sky-100 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-4 bg-sky-200 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute inset-8 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white overflow-hidden">
          {/* Wave effect */}
          <div className="absolute bottom-0 left-0 right-0 bg-sky-400 opacity-50" style={{ height: `${progress}%`, transition: 'height 0.3s ease' }}></div>
          <span className="relative font-bold text-2xl z-10 text-white">CA</span>
        </div>
      </div>
      
      <div className="w-64 max-w-sm">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-center text-sm font-semibold text-slate-500 animate-pulse">
          {msg}
        </div>
      </div>
    </div>
  );
}
