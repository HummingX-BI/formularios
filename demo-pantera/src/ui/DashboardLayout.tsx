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
  PlaySquare,
  Megaphone,
  FileText
} from 'lucide-react';
import { cn } from './components/utils';
import { GlobalSearch } from '@/app/search/GlobalSearch';
import { AlertsCenter } from './AlertsCenter';
import { ActionPlanDrawer } from './ActionPlanDrawer';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './ErrorBoundary';
import { GuidedTour } from './GuidedTour';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ExecutiveReportModal } from './ExecutiveReportModal';

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
  Megaphone,
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
  const [isReportOpen, setIsReportOpen] = useState(false);

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
        navigate('/mando/resumen');
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
            className="h-16 flex items-center justify-between px-5 border-b border-ice-100 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={toggleSidebar}
          >
            {!sidebarCollapsed && (
              <span className="font-display font-bold text-lg tracking-tight text-slate-800">Club Azulejo</span>
            )}
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-700 shadow-sm rounded-md flex items-center justify-center text-white font-bold shrink-0 text-sm">
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

              <button
                onClick={() => setIsReportOpen(true)}
                className="hidden lg:flex items-center gap-2 h-9 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-900/20 mr-2"
                title="Generar Reporte Ejecutivo"
              >
                <FileText className="w-4 h-4" />
                <span>Reporte Ejecutivo</span>
              </button>

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

        <footer className="bg-white border-t border-ice-100 py-2 px-6 flex items-center justify-end text-xs text-text-tenue shrink-0">
          <div className="flex items-center gap-4">
            {sessionChanges > 0 && (
              <span className="text-amber-600 font-medium">
                Parámetros ajustados ({sessionChanges})
              </span>
            )}
            <button
              className="hover:text-coral transition-colors"
              onClick={() => useAppStore.getState().resetDemo()}
            >
              Reiniciar escenario
            </button>
          </div>
        </footer>
      </div>

      {/* Assistant Overlay */}
      <ChatPanel />
      
      <ActionPlanDrawer />
      <ToastContainer />
      <GuidedTour />
      <ExecutiveReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
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
  const isDebug = import.meta.env.VITE_SHOW_DEBUG === 'true';
  const modules = MODULE_REGISTRY.filter((m) => m.categoryId === category.id && (isDebug || (!m.route.startsWith('/_') && m.visibility !== 'demo')));
  const isActiveGroup = modules.some((m) => m.route === currentPath);
  
  // Mantener abierto si el grupo contiene el módulo actual
  const [open, setOpen] = useState(isActiveGroup || category.id === 1); 

  const navigate = useNavigate();
  const Icon = iconMap[category.icon] || LayoutDashboard;

  if (modules.length === 0) return null;

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center justify-between px-5 py-2.5 text-sm font-semibold transition-all group',
          isActiveGroup
            ? 'text-blue-900'
            : 'text-slate-500 hover:text-slate-800',
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-4 h-4 transition-colors", isActiveGroup ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
          <span className="truncate tracking-wide">{category.title}</span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 opacity-40 transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 opacity-40 transition-transform" />
        )}
      </button>

      {open && (
        <div className="mt-1 mb-2 flex flex-col space-y-0.5">
          {modules.map((mod) => {
            const isModActive = currentPath === mod.route;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(mod.route)}
                className={cn(
                  'flex items-center justify-between pl-12 pr-5 py-2 text-[13px] transition-all relative overflow-hidden',
                  isModActive
                    ? 'text-blue-700 font-semibold bg-blue-50/50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80',
                )}
              >
                {isModActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"></span>
                )}
                <span className="truncate flex-1 text-left">
                  {mod.title.split(' [')[0]}
                </span>
                {mod.level === 'E' && (
                  <span
                    className={cn("w-1.5 h-1.5 rounded-full shrink-0 ml-2 shadow-sm", isModActive ? "bg-amber-400" : "bg-amber-300")}
                    title="Módulo Estratégico"
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
