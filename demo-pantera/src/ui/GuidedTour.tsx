import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAppStore } from '@/app/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import { cn } from '@/ui/components/utils';

const TOUR_STEPS = [
  { 
    title: 'Punto de Partida', 
    desc: 'Comenzamos en el Panel General viendo el estado macro del negocio. La retención es la clave de nuestro caso de negocio.',
    route: '/c01/m1-1'
  },
  { 
    title: 'Análisis de Retención', 
    desc: 'Observa cómo la supervivencia cae drásticamente después de 6 meses. Necesitamos averiguar por qué.',
    route: '/c07/m7-2'
  },
  { 
    title: 'Segmentación de Familias', 
    desc: 'El algoritmo nos muestra que el grupo "Leales Sensibles" está en riesgo. Vamos a ver por qué.',
    route: '/c10/m10-2'
  },
  { 
    title: 'Saturación Operativa', 
    desc: 'Descubrimos que la alberca infantil los sábados está al 98% de capacidad. La calidad del servicio baja y los niños se van.',
    route: '/c06/m6-2'
  },
  { 
    title: 'Propuesta del Optimizador', 
    desc: 'El optimizador matemático reasigna a los grupos menos rentables y abre espacio para 40 nuevos alumnos el sábado.',
    route: '/c06/m6-3'
  },
  { 
    title: 'Impacto Financiero', 
    desc: 'Simulamos el impacto: esta pequeña acción mejora la retención general en un 3% y aumenta los ingresos mensuales.',
    route: '/c11/m11-2'
  },
  { 
    title: 'Centro de Recomendaciones', 
    desc: 'El sistema convierte el hallazgo en una tarea lista para ser aprobada y enviada a los coordinadores.',
    route: '/c11/m11-1'
  },
  { 
    title: 'El Plan en Acción', 
    desc: 'Finalmente, todas las aprobaciones se consolidan aquí, permitiendo dar seguimiento a la ejecución operativa real.',
    route: '/c11/m11-3'
  }
];

export function GuidedTour() {
  const { guidedTourActive, tourStep, setTourStep, toggleGuidedTour } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Escucha la tecla para avanzar (Flecha Derecha / Izquierda)
  useEffect(() => {
    if (!guidedTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        if (tourStep < TOUR_STEPS.length - 1) {
          const next = tourStep + 1;
          setTourStep(next);
          navigate(TOUR_STEPS[next]!.route);
        }
      }
      if (e.key === 'ArrowLeft') {
        if (tourStep > 0) {
          const prev = tourStep - 1;
          setTourStep(prev);
          navigate(TOUR_STEPS[prev]!.route);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guidedTourActive, tourStep, navigate, setTourStep]);

  // Asegura que si la ruta cambia manualmente, actualicemos el paso si coincide
  useEffect(() => {
    if (!guidedTourActive) return;
    const currentStepIndex = TOUR_STEPS.findIndex(s => s.route === location.pathname);
    if (currentStepIndex !== -1 && currentStepIndex !== tourStep) {
      setTourStep(currentStepIndex);
    }
  }, [location.pathname, guidedTourActive, tourStep, setTourStep]);

  if (!guidedTourActive) return null;

  const current = TOUR_STEPS[tourStep]!;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[400px] bg-white rounded-xl shadow-2xl border border-sky-100 flex flex-col pointer-events-auto transform transition-all animate-fade-in">
      <div className="bg-sky-600 text-white p-3 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Play className="w-4 h-4" /> Flujo G: Demo Ejecutiva ({tourStep + 1}/{TOUR_STEPS.length})
        </div>
        <button onClick={toggleGuidedTour} className="hover:text-sky-200 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4">
        <h4 className="font-bold text-navy-900 text-lg mb-1">{current.title}</h4>
        <p className="text-sm text-secundario leading-relaxed mb-4">
          {current.desc}
        </p>
        
        <div className="flex justify-between items-center mt-2">
          <button 
            onClick={() => {
              const prev = Math.max(0, tourStep - 1);
              setTourStep(prev);
              navigate(TOUR_STEPS[prev]!.route);
            }}
            disabled={tourStep === 0}
            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === tourStep ? "bg-sky-600 w-4" : "bg-sky-200"
                )} 
              />
            ))}
          </div>

          <button 
            onClick={() => {
              if (tourStep === TOUR_STEPS.length - 1) {
                toggleGuidedTour();
              } else {
                const next = tourStep + 1;
                setTourStep(next);
                navigate(TOUR_STEPS[next]!.route);
              }
            }}
            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            {tourStep === TOUR_STEPS.length - 1 ? <CheckIcon className="w-5 h-5 text-emerald-500" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  );
}
