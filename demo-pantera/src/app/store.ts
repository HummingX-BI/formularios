import { create } from 'zustand';

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
  
  addPlanAction: (action: any) => void;
  dismissAlert: (alertId: string) => void;
  updateRecommendationStatus: (recId: string, status: 'accepted' | 'postponed' | 'dismissed') => void;
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
  addPlanAction: (action) => set((s) => ({ planActions: [...s.planActions, action] })),
  dismissAlert: (alertId) => set((s) => ({ dismissedAlerts: [...s.dismissedAlerts, alertId] })),
  updateRecommendationStatus: (recId, status) => set((s) => {
    if (status === 'accepted') return { acceptedRecommendations: [...s.acceptedRecommendations, recId] };
    if (status === 'postponed') return { postponedRecommendations: [...s.postponedRecommendations, recId] };
    if (status === 'dismissed') return { discardedRecommendations: [...s.discardedRecommendations, recId] };
    return s;
  })
}));
