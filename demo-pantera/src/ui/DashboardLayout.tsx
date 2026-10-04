import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { CATEGORIES, MODULE_REGISTRY } from '@/modules/registry';
import {
  Bot,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  GraduationCap,
  Users,
  CircleDollarSign,
  TrendingUp,
  Maximize,
  HeartHandshake,
  Medal,
  BarChart3,
  BrainCircuit,
  Lightbulb,
  MessageSquare,
  Settings,
  CheckSquare,
  PlaySquare
} from 'lucide-react';
import { cn } from './components/utils';
import { GlobalSearch } from '@/app/search/GlobalSearch';
import { AlertsCenter } from './AlertsCenter';
import { ActionPlanDrawer } from './ActionPlanDrawer';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './ErrorBoundary';
import { GuidedTour } from './GuidedTour';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  GraduationCap,
  Users,
  CircleDollarSign,
  TrendingUp,
  Maximize,
  HeartHandshake,
  Medal,
  BarChart3,
  BrainCircuit,
  Lightbulb,
  MessageSquare,
  Settings,
};

export function DashboardLayout(): React.JSX.Element {
  const {
    presentationMode,
    sidebarCollapsed,
    toggleSidebar,
    togglePresentation,
    assistantOpen,
    toggleAssistant,
    period,
    poolFilter,
    setPeriod,
    setPoolFilter,
    seed,
    sessionChanges,
    toggleActionPlan,
    toggleGuidedTour,
    guidedTourActive
  } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Keyboard shortcuts
  useEffect(() => {
    let lastKey = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
      if (e.key.toLowerCase() === 'p') {
        togglePresentation();
      }
      if (e.key.toLowerCase() === 'h' && lastKey.toLowerCase() === 'g') {
        navigate('/c01/m1-1');
      }
      lastKey = e.key;
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, togglePresentation]);

  // Actualizar título de documento
  useEffect(() => {
    const mod = MODULE_REGISTRY.find(m => m.route === location.pathname);
    if (mod) {
      document.title = `${mod.id} ${mod.title} - Club Azulejo CA`;
    } else {
      document.title = 'Club Azulejo CA';
    }
  }, [location.pathname]);

  return (
    <div className={cn(
      "flex h-screen overflow-hidden font-sans",
      presentationMode ? "presentation-mode scale-100 bg-white" : "bg-ice-50"
    )}>
      {/* Sidebar */}
      {!presentationMode && (
        <aside
          className={cn(
            'bg-white border-r border-ice-100 flex flex-col transition-all duration-300 no-print',
            sidebarCollapsed ? 'w-16' : 'w-64',
          )}
          aria-label="Menú principal"
        >
          <div
            className="h-16 flex items-center justify-between px-4 border-b border-ice-100 cursor-pointer"
            onClick={toggleSidebar}
          >
            {!sidebarCollapsed && (
              <span className="font-display font-bold text-blue-800">CA Admin</span>
            )}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
              CA
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
            {!sidebarCollapsed ? (
              CATEGORIES.map((cat) => (
                <CategoryGroup key={cat.id} category={cat} currentPath={location.pathname} />
              ))
            ) : (
              <div className="flex flex-col items-center gap-4 mt-2">
                {CATEGORIES.map((cat) => {
                  const Icon = iconMap[cat.icon] || LayoutDashboard;
                  return (
                    <Icon key={cat.id} className="w-5 h-5 text-text-secondary" title={cat.title} />
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-500",
        presentationMode ? "p-4 text-lg [&_.module-card]:scale-105 [&_.module-card]:transform-origin-top-left" : ""
      )}>
        {/* Topbar */}
        {!presentationMode && (
          <header className="h-16 bg-white border-b border-ice-100 flex items-center justify-between px-6 shrink-0 no-print" aria-label="Barra superior">
            <div className="flex-1 max-w-xl flex items-center">
              <GlobalSearch />
            </div>

            <div className="flex items-center gap-4 ml-4">
              <select
                value={poolFilter}
                onChange={(e) => setPoolFilter(e.target.value as never)}
                className="text-sm bg-ice-50 border-none rounded-md px-3 py-1.5 focus:ring-2 focus:ring-sky-400"
              >
                <option value="todas">Todas las albercas</option>
                <option value="principal">Alberca Principal</option>
                <option value="infantil">Alberca Infantil</option>
              </select>

              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as never)}
                className="text-sm bg-ice-50 border-none rounded-md px-3 py-1.5 focus:ring-2 focus:ring-sky-400"
              >
                <option value="mes_actual">Mes Actual</option>
                <option value="ultimos_3_meses">Últimos 3 Meses</option>
                <option value="anio">Año en Curso</option>
              </select>

              <div className="h-6 w-px bg-ice-100 mx-2"></div>

              <AlertsCenter />

              <button 
                onClick={toggleActionPlan}
                className="p-2 text-text-secondary hover:text-blue-600 transition-colors"
                title="Plan de Acción"
                aria-label="Abrir plan de acción"
              >
                <CheckSquare className="w-5 h-5" aria-hidden="true" />
              </button>

              <button 
                onClick={toggleGuidedTour}
                className={cn(
                  "p-2 transition-colors rounded",
                  guidedTourActive ? "bg-sky-100 text-sky-600" : "text-text-secondary hover:text-blue-600"
                )}
                title="Guion de Presentación"
              >
                <PlaySquare className="w-5 h-5" />
              </button>

              <button 
                onClick={toggleGuidedTour}
                className={cn(
                  "p-2 transition-colors rounded",
                  guidedTourActive ? "bg-sky-100 text-sky-600" : "text-text-secondary hover:text-blue-600"
                )}
                title="Guion de Presentación"
              >
                <PlaySquare className="w-5 h-5" />
              </button>

              <button
                onClick={toggleAssistant}
                className="p-2 text-text-secondary hover:text-blue-600 transition-colors"
                aria-label="Abrir asistente de IA"
              >
                <Bot className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </header>
        )}

        {/* Workspace */}
        <main className="flex-1 overflow-y-auto relative" role="main" aria-label="Contenido principal">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-ice-100 py-2 px-6 flex items-center justify-between text-xs text-text-tenue shrink-0">
          <span>Datos de demostración simulados</span>
          <div className="flex items-center gap-4">
            {sessionChanges > 0 && (
              <span className="text-amber-600 font-medium">
                Sesión modificada ({sessionChanges} cambios)
              </span>
            )}
            <span>Seed: {seed}</span>
            <button
              className="hover:text-state-coral transition-colors"
              onClick={() => useAppStore.getState().resetDemo()}
            >
              Reiniciar demo
            </button>
          </div>
        </footer>
      </div>

      {/* Assistant Overlay */}
      {assistantOpen && (
        <div className="w-80 bg-white border-l border-ice-100 flex flex-col shadow-xl">
          <div className="p-4 border-b border-ice-100 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-400" /> Asistente Analítico
            </h3>
            <button onClick={toggleAssistant} className="text-text-tenue hover:text-text-primary" aria-label="Cerrar asistente">
              ×
            </button>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center text-text-tenue text-sm">
            Panel vacío (Próximamente)
          </div>
        </div>
      )}
      
      <ActionPlanDrawer />
      <ToastContainer />
      <GuidedTour />
    </div>
  );
}

function CategoryGroup({
  category,
  currentPath,
}: {
  category: { id: number; title: string; icon: string };
  currentPath: string;
}) {
  const [open, setOpen] = useState(true);
  const isDebug = import.meta.env.VITE_SHOW_DEBUG === 'true';
  const modules = MODULE_REGISTRY.filter((m) => m.categoryId === category.id && (isDebug || !m.route.startsWith('/_')));
  const isActive = modules.some((m) => m.route === currentPath);
  const navigate = useNavigate();
  const Icon = iconMap[category.icon] || LayoutDashboard;

  if (modules.length === 0) return null;

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'text-blue-800'
            : 'text-text-secondary hover:text-text-primary hover:bg-ice-50',
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4" />
          <span className="truncate">{category.title}</span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 opacity-50" />
        ) : (
          <ChevronRight className="w-4 h-4 opacity-50" />
        )}
      </button>

      {open && (
        <div className="mt-1 flex flex-col">
          {modules.map((mod) => {
            const isModActive = currentPath === mod.route;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(mod.route)}
                className={cn(
                  'flex items-center justify-between pl-11 pr-4 py-1.5 text-xs transition-colors',
                  isModActive
                    ? 'bg-sky-50 text-blue-800 font-semibold border-r-2 border-blue-600'
                    : 'text-text-secondary hover:text-text-primary hover:bg-ice-50',
                )}
              >
                <span className="truncate flex-1 text-left">
                  {mod.id} {mod.title.split(' [')[0]}
                </span>
                {mod.level === 'E' && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-state-ambar shrink-0 ml-2"
                    title="Estrella"
                  ></span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
