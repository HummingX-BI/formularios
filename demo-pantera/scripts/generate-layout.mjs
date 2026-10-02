import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

// Login Page
const loginDir = path.join(srcDir, 'modules', 'login');
if (!fs.existsSync(loginDir)) fs.mkdirSync(loginDir, { recursive: true });

const loginContent = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/components';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ice-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft-blue p-8 border border-ice-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-display font-bold text-2xl">CA</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Club Azulejo - Escuela de Natación</h1>
          <p className="text-text-secondary mt-2">Panel de administración</p>
        </div>

        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 text-blue-800 text-sm rounded-lg p-3 text-center mb-6">
            Acceso de demostración
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Usuario</label>
            <input type="text" disabled value="demo@clubazulejo.com" className="w-full px-3 py-2 border rounded-md bg-ice-50 text-text-tenue" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Contraseña</label>
            <input type="password" disabled value="********" className="w-full px-3 py-2 border rounded-md bg-ice-50 text-text-tenue" />
          </div>

          <Button variant="primary" className="w-full mt-4" onClick={() => navigate('/c01/m1-1')}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(loginDir, 'LoginPage.tsx'), loginContent);

// NotFound Page
const notFoundContent = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/components';
import { SearchX } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <SearchX className="h-20 w-20 text-text-tenue mb-4" />
      <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Página no encontrada</h1>
      <p className="text-text-secondary mb-6">El módulo o ruta que buscas no existe en esta demostración.</p>
      <Button variant="primary" onClick={() => navigate('/c01/m1-1')}>Ir al inicio (M1.1)</Button>
    </div>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'modules', 'login', 'NotFoundPage.tsx'), notFoundContent); // just put it in login for simplicity or UI, I'll put it in UI

fs.writeFileSync(path.join(srcDir, 'ui', 'NotFoundPage.tsx'), notFoundContent);


// Router
const routerContent = `import { HashRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/ui/DashboardLayout';
import { LoginPage } from '@/modules/login/LoginPage';
import { DesignGallery } from '@/modules/design/DesignGallery';
import { NotFoundPage } from '@/ui/NotFoundPage';
import { MODULE_REGISTRY } from '@/modules/registry';
import React, { Suspense } from 'react';
import { ModulePlaceholder } from '@/ui/ModulePlaceholder';

export function AppRouter(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/_design" element={<DesignGallery />} />
        
        <Route element={<DashboardLayout />}>
          {MODULE_REGISTRY.map(mod => (
            <Route 
              key={mod.id} 
              path={mod.route} 
              element={
                <Suspense fallback={<div className="p-8">Cargando...</div>}>
                  <mod.component />
                </Suspense>
              } 
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'app', 'router.tsx'), routerContent);

// DashboardLayout (Sidebar, Topbar, Main, Footer, Shortcuts)
const layoutContent = `import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/app/store';
import { CATEGORIES, MODULE_REGISTRY } from '@/modules/registry';
import { Search, Bell, Bot, ChevronDown, ChevronRight, LayoutDashboard, GraduationCap, Users, CircleDollarSign, TrendingUp, Maximize, HeartHandshake, Medal, BarChart3, BrainCircuit, Lightbulb, MessageSquare, Settings } from 'lucide-react';
import { cn } from './components/utils';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, GraduationCap, Users, CircleDollarSign, TrendingUp, Maximize, HeartHandshake, Medal, BarChart3, BrainCircuit, Lightbulb, MessageSquare, Settings
};

export function DashboardLayout(): React.JSX.Element {
  const { presentationMode, sidebarCollapsed, toggleSidebar, togglePresentation, assistantOpen, toggleAssistant, period, poolFilter, setPeriod, setPoolFilter, seed } = useAppStore();
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

  return (
    <div className="flex h-screen bg-ice-50 overflow-hidden font-sans">
      {/* Sidebar */}
      {!presentationMode && (
        <aside className={cn("bg-white border-r border-ice-100 flex flex-col transition-all duration-300", sidebarCollapsed ? "w-16" : "w-64")}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-ice-100 cursor-pointer" onClick={toggleSidebar}>
            {!sidebarCollapsed && <span className="font-display font-bold text-blue-800">CA Admin</span>}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">CA</div>
          </div>
          <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
            {!sidebarCollapsed ? CATEGORIES.map(cat => (
              <CategoryGroup key={cat.id} category={cat} currentPath={location.pathname} />
            )) : (
              <div className="flex flex-col items-center gap-4 mt-2">
                {CATEGORIES.map(cat => {
                  const Icon = iconMap[cat.icon] || LayoutDashboard;
                  return <Icon key={cat.id} className="w-5 h-5 text-text-secondary" title={cat.title} />;
                })}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        {!presentationMode && (
          <header className="h-16 bg-white border-b border-ice-100 flex items-center justify-between px-6 shrink-0">
            <div className="flex-1 max-w-xl flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tenue" />
                <input 
                  id="global-search"
                  type="text" 
                  placeholder="Buscar módulos (Ctrl+K)..." 
                  className="w-full pl-10 pr-4 py-2 bg-ice-50 border border-ice-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-4">
              <select 
                value={poolFilter} 
                onChange={e => setPoolFilter(e.target.value as any)}
                className="text-sm bg-ice-50 border-none rounded-md px-3 py-1.5 focus:ring-2 focus:ring-sky-400"
              >
                <option value="todas">Todas las albercas</option>
                <option value="principal">Alberca Principal</option>
                <option value="infantil">Alberca Infantil</option>
              </select>

              <select 
                value={period} 
                onChange={e => setPeriod(e.target.value as any)}
                className="text-sm bg-ice-50 border-none rounded-md px-3 py-1.5 focus:ring-2 focus:ring-sky-400"
              >
                <option value="mes_actual">Mes Actual</option>
                <option value="ultimos_3_meses">Últimos 3 Meses</option>
                <option value="anio">Año en Curso</option>
              </select>

              <div className="h-6 w-px bg-ice-100 mx-2"></div>

              <button className="relative p-2 text-text-secondary hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-state-coral rounded-full"></span>
              </button>
              
              <button onClick={toggleAssistant} className="p-2 text-text-secondary hover:text-blue-600 transition-colors">
                <Bot className="w-5 h-5" />
              </button>
            </div>
          </header>
        )}

        {/* Workspace */}
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-ice-100 py-2 px-6 flex items-center justify-between text-xs text-text-tenue shrink-0">
          <span>Datos de demostración simulados</span>
          <div className="flex items-center gap-4">
            <span>Seed: {seed}</span>
            <button className="hover:text-state-coral transition-colors" onClick={() => useAppStore.getState().resetDemo()}>Reiniciar demo</button>
          </div>
        </footer>
      </div>

      {/* Assistant Overlay */}
      {assistantOpen && (
        <div className="w-80 bg-white border-l border-ice-100 flex flex-col shadow-xl">
          <div className="p-4 border-b border-ice-100 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2"><Bot className="w-4 h-4 text-sky-400" /> Asistente Analítico</h3>
            <button onClick={toggleAssistant} className="text-text-tenue hover:text-text-primary">×</button>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center text-text-tenue text-sm">
            Panel vacío (Próximamente)
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryGroup({ category, currentPath }: { category: any, currentPath: string }) {
  const [open, setOpen] = useState(true);
  const modules = MODULE_REGISTRY.filter(m => m.categoryId === category.id);
  const isActive = modules.some(m => m.route === currentPath);
  const navigate = useNavigate();
  const Icon = iconMap[category.icon] || LayoutDashboard;

  return (
    <div className="mb-1">
      <button 
        onClick={() => setOpen(!open)} 
        className={cn("w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors", isActive ? "text-blue-800" : "text-text-secondary hover:text-text-primary hover:bg-ice-50")}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4" />
          <span className="truncate">{category.title}</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
      </button>
      
      {open && (
        <div className="mt-1 flex flex-col">
          {modules.map(mod => {
            const isModActive = currentPath === mod.route;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(mod.route)}
                className={cn(
                  "flex items-center justify-between pl-11 pr-4 py-1.5 text-xs transition-colors",
                  isModActive 
                    ? "bg-sky-50 text-blue-800 font-semibold border-r-2 border-blue-600" 
                    : "text-text-secondary hover:text-text-primary hover:bg-ice-50"
                )}
              >
                <span className="truncate flex-1 text-left">{mod.id} {mod.title.split(' [')[0]}</span>
                {mod.level === 'E' && <span className="w-1.5 h-1.5 rounded-full bg-state-ambar shrink-0 ml-2" title="Estrella"></span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'ui', 'DashboardLayout.tsx'), layoutContent);

console.log('Layout generated.');
