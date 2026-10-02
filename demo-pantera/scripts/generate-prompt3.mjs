import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

// 1. Store
const storeContent = `import { create } from 'zustand';

export type PeriodPreset = 'mes_actual' | 'ultimos_3_meses' | 'ultimos_6_meses' | 'anio' | '24_meses' | 'personalizado';
export type PoolFilter = 'todas' | 'principal' | 'infantil';

export interface AppState {
  period: PeriodPreset;
  dateRange: { start: string; end: string };
  poolFilter: PoolFilter;
  sidebarCollapsed: boolean;
  presentationMode: boolean;
  assistantOpen: boolean;
  seed: number;
  
  // session state
  planActions: any[];
  savedScenarios: any[];
  dismissedAlerts: any[];
  acceptedRecommendations: any[];
  postponedRecommendations: any[];
  discardedRecommendations: any[];

  setPeriod: (p: PeriodPreset) => void;
  setPoolFilter: (f: PoolFilter) => void;
  toggleSidebar: () => void;
  togglePresentation: () => void;
  toggleAssistant: () => void;
  resetDemo: () => void;
}

const initialState = {
  period: 'mes_actual' as PeriodPreset,
  dateRange: { start: '2026-09-01', end: '2026-09-30' },
  poolFilter: 'todas' as PoolFilter,
  sidebarCollapsed: false,
  presentationMode: false,
  assistantOpen: false,
  seed: 2026,
  planActions: [],
  savedScenarios: [],
  dismissedAlerts: [],
  acceptedRecommendations: [],
  postponedRecommendations: [],
  discardedRecommendations: [],
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setPeriod: (p) => set({ period: p }),
  setPoolFilter: (f) => set({ poolFilter: f }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  togglePresentation: () => set((s) => ({ presentationMode: !s.presentationMode })),
  toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),
  resetDemo: () => set({ ...initialState }),
}));
`;

fs.writeFileSync(path.join(srcDir, 'app', 'store.ts'), storeContent);

// 2. Registry
const rawModules = [
  "M1.1 Resumen ejecutivo [E]", "M1.2 Índice de salud del negocio [E]", "M1.3 Alertas y briefing semanal [S]", "M1.4 Centro de reportes [P]",
  "M2.1 Expediente 360 [S]", "M2.2 Inscripciones, reinscripciones y reservas [P]", "M2.3 Grupos y horarios [S]", "M2.4 Asistencia y reposiciones [P]", "M2.5 Niveles y progreso [S]", "M2.6 Lista de espera [P]", "M2.7 Credencial digital [P]",
  "M3.1 Directorio, turnos y horas [P]", "M3.2 Nómina y comisiones [P]", "M3.3 Ficha de desempeño del instructor [S]",
  "M4.1 Pagos y adeudos [P]", "M4.2 Estado de cuenta por familia [P]", "M4.3 Cartera vencida [S]", "M4.4 Ingreso real contra facturable [S]", "M4.5 Ticket promedio y LTV [E]", "M4.6 Rentabilidad [E]",
  "M5.1 CRM de prospectos [S]", "M5.2 Embudo [E]", "M5.3 Motivos de pérdida [S]", "M5.4 Fuentes de captación [S]", "M5.5 Agente de ventas autónomo [E]",
  "M6.1 Mapa de calor de ocupación [E]", "M6.2 Detector de saturación [E]", "M6.3 Optimizador de horarios [S]", "M6.4 Simulador de grupo nuevo [S]",
  "M7.1 Riesgo de baja [E]", "M7.2 Supervivencia [E]", "M7.3 Cohortes [E]", "M7.4 Motivos de baja [S]", "M7.5 Plan de retención [S]",
  "M8.1 Embudo de niveles [E]", "M8.2 Tiempo por nivel [S]", "M8.3 Efectividad por instructor [S]",
  "M9.1 Descriptiva [S]", "M9.2 Percentiles y cuantiles [S]", "M9.3 Binomial y Poisson [E]", "M9.4 Probabilidad condicional y Bayes [E]", "M9.5 Intervalos y pruebas de hipótesis [S]", "M9.6 Correlaciones [S]", "M9.7 Regresiones [E]", "M9.8 Series de tiempo y estacionalidad [S]",
  "M10.1 Catálogo y desempeño de modelos [S]", "M10.2 Segmentación de familias [E]", "M10.3 Pronóstico [E]", "M10.4 Simulación Monte Carlo [S]",
  "M11.1 Recomendaciones priorizadas [S]", "M11.2 Simulador de escenarios [E]", "M11.3 Plan de acción y medición [S]",
  "M12.1 Chat analítico [E]", "M12.2 Glosario y explicador [S]",
  "M13.1 SEO y analítica del sitio [S]", "M13.2 Notificaciones y campañas [P]", "M13.3 Catálogos y configuración [P]", "M13.4 Vistas previas y modo demo [P]"
];

const parsedModules = rawModules.map(m => {
  const parts = m.split(' ');
  const catMod = parts[0].substring(1).split('.');
  const cat = catMod[0];
  const mod = catMod[1];
  const levelStr = parts[parts.length - 1];
  const level = levelStr.substring(1, 2);
  const title = parts.slice(1, parts.length - 1).join(' ');
  
  const id = "M" + cat + "." + mod;
  const route = "/c" + cat.padStart(2, '0') + "/m" + cat + "-" + mod;
  return { id, categoryId: parseInt(cat, 10), title, level, route, shortDescription: "Desc para " + title, businessQuestion: "¿Pregunta de negocio?", icon: "Activity" };
});

const registryContent = `import { lazy } from 'react';
import type { ElementType } from 'react';

export type ModuleLevel = 'E' | 'S' | 'P';

export interface AppModule {
  id: string;
  categoryId: number;
  title: string;
  level: ModuleLevel;
  route: string;
  icon: string;
  shortDescription: string;
  businessQuestion: string;
  component: React.LazyExoticComponent<ElementType>;
}

export const MODULE_REGISTRY: AppModule[] = [
${parsedModules.map(m => `  {
    id: "${m.id}",
    categoryId: ${m.categoryId},
    title: "${m.title}",
    level: "${m.level}",
    route: "${m.route}",
    icon: "${m.icon}",
    shortDescription: "${m.shortDescription}",
    businessQuestion: "${m.businessQuestion}",
    component: lazy(() => import('@/ui/ModulePlaceholder').then(m => ({ default: () => <m.ModulePlaceholder id="${m.id}" /> })))
  },`).join('\n')}
];

export const CATEGORIES = [
  { id: 1, title: 'Centro de mando', icon: 'LayoutDashboard' },
  { id: 2, title: 'Operación académica', icon: 'GraduationCap' },
  { id: 3, title: 'Personal e instructores', icon: 'Users' },
  { id: 4, title: 'Cobranza y finanzas', icon: 'CircleDollarSign' },
  { id: 5, title: 'Embudo comercial', icon: 'TrendingUp' },
  { id: 6, title: 'Capacidad y ocupación', icon: 'Maximize' },
  { id: 7, title: 'Retención y churn', icon: 'HeartHandshake' },
  { id: 8, title: 'Desempeño pedagógico', icon: 'Medal' },
  { id: 9, title: 'Laboratorio estadístico', icon: 'BarChart3' },
  { id: 10, title: 'Machine Learning', icon: 'BrainCircuit' },
  { id: 11, title: 'Prescriptivo', icon: 'Lightbulb' },
  { id: 12, title: 'Asistente IA', icon: 'MessageSquare' },
  { id: 13, title: 'Sitio y configuración', icon: 'Settings' }
];
`;

fs.writeFileSync(path.join(srcDir, 'modules', 'registry.tsx'), registryContent);

// Test
const testContent = `import { describe, it, expect } from 'vitest';
import { MODULE_REGISTRY } from '@/modules/registry';

describe('Module Registry', () => {
  it('should have exactly 58 modules', () => {
    expect(MODULE_REGISTRY.length).toBe(58);
  });

  it('should have 19 [E], 27 [S], and 12 [P] modules', () => {
    const eCount = MODULE_REGISTRY.filter(m => m.level === 'E').length;
    const sCount = MODULE_REGISTRY.filter(m => m.level === 'S').length;
    const pCount = MODULE_REGISTRY.filter(m => m.level === 'P').length;

    expect(eCount).toBe(19);
    expect(sCount).toBe(27);
    expect(pCount).toBe(12);
  });
});
`;
fs.writeFileSync(path.join(srcDir, 'tests', 'registry.test.ts'), testContent);

// UI Components
const placeholderContent = `import React from 'react';
import { MODULE_REGISTRY } from '@/modules/registry';
import { ModulePage } from '@/ui/ModulePage';

export function ModulePlaceholder({ id }: { id: string }) {
  const mod = MODULE_REGISTRY.find(m => m.id === id);
  if (!mod) return <div>Module not found</div>;

  return (
    <ModulePage module={mod}>
      <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-ice-100 rounded-xl bg-ice-50/50">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Módulo en construcción</h2>
        <p className="text-text-secondary">{mod.shortDescription}</p>
      </div>
    </ModulePage>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'ui', 'ModulePlaceholder.tsx'), placeholderContent);

const pageContent = `import React from 'react';
import type { AppModule } from '@/modules/registry';

interface ModulePageProps {
  module: AppModule;
  children: React.ReactNode;
}

export function ModulePage({ module, children }: ModulePageProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Categoría {module.categoryId}</span>
          <span>/</span>
          <span className="font-medium text-text-primary">{module.id}</span>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-display font-bold text-text-primary">{module.title}</h1>
          <span className="px-2 py-1 bg-sky-200 text-blue-800 rounded-full text-xs font-bold">
            Nivel {module.level}
          </span>
        </div>
        {module.businessQuestion && (
          <p className="text-lg text-text-secondary mt-1">{module.businessQuestion}</p>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t text-sm text-text-tenue text-center">
        Fórmulas usadas: <em>Pendiente</em>
      </footer>
    </div>
  );
}
`;
fs.writeFileSync(path.join(srcDir, 'ui', 'ModulePage.tsx'), pageContent);

console.log('Prompt 3 scaffold created.');
