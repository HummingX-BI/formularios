import { create } from 'zustand';

export type PeriodPreset =
  'mes_actual' | 'ultimos_3_meses' | 'ultimos_6_meses' | 'anio' | '24_meses' | 'personalizado';
export type PoolFilter = 'todas' | 'principal' | 'infantil';

export interface ToastData {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export interface AppState {
  period: PeriodPreset;
  dateRange: { start: string; end: string };
  poolFilter: PoolFilter;
  sidebarCollapsed: boolean;
  presentationMode: boolean;
  assistantOpen: boolean;
  seed: number;
  setSeed: (s: number) => void;

  sessionChanges: number;
  incrementSessionChanges: () => void;
  
  actionPlanOpen: boolean;
  toggleActionPlan: () => void;

  chatIsOpen: boolean;
  chatIsTyping: boolean;
  chatMessages: any[];
  toggleChat: () => void;
  setChatTyping: (t: boolean) => void;
  addChatMessage: (msg: any) => void;
  clearChat: () => void;

  activeExplanationContext: string | null;
  setExplanationContext: (id: string | null) => void;

  configOverrides: any;
  updateOverrides: (overrides: any) => void;

  guidedTourActive: boolean;
  tourStep: number;
  toggleGuidedTour: () => void;
  setTourStep: (step: number) => void;

  toasts: ToastData[];
  addToast: (t: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;

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
  updateRecommendationStatus: (
    recId: string,
    status: 'accepted' | 'postponed' | 'dismissed',
  ) => void;
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
  sessionChanges: 0,
  actionPlanOpen: false,
  guidedTourActive: false,
  tourStep: 0,
  toasts: [] as ToastData[],
  chatIsOpen: false,
  chatIsTyping: false,
  chatMessages: [],
  activeExplanationContext: null,
  configOverrides: {},
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setSeed: (s) => set({ seed: s }),
  setPeriod: (p) => set({ period: p }),
  setPoolFilter: (f) => set({ poolFilter: f }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  togglePresentation: () => set((s) => ({ presentationMode: !s.presentationMode })),
  toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),
  resetDemo: () => set({ ...initialState }),
  incrementSessionChanges: () => set((s) => ({ sessionChanges: s.sessionChanges + 1 })),
  toggleActionPlan: () => set((s) => ({ actionPlanOpen: !s.actionPlanOpen })),
  toggleChat: () => set((s) => ({ chatIsOpen: !s.chatIsOpen })),
  setChatTyping: (t) => set({ chatIsTyping: t }),
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
  setExplanationContext: (id) => set({ activeExplanationContext: id }),
  updateOverrides: (overrides) => set((s) => ({ configOverrides: { ...s.configOverrides, ...overrides } })),
  toggleGuidedTour: () => set((s) => ({ guidedTourActive: !s.guidedTourActive, tourStep: 0 })),
  setTourStep: (step) => set({ tourStep: step }),
  addToast: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: Math.random().toString(36).substring(7) }] })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter(toast => toast.id !== id) })),
  addPlanAction: (action) => set((s) => ({ planActions: [...s.planActions, action], sessionChanges: s.sessionChanges + 1 })),
  dismissAlert: (alertId) => set((s) => ({ dismissedAlerts: [...s.dismissedAlerts, alertId], sessionChanges: s.sessionChanges + 1 })),
  updateRecommendationStatus: (recId, status) =>
    set((s) => {
      if (status === 'accepted')
        return { acceptedRecommendations: [...s.acceptedRecommendations, recId] };
      if (status === 'postponed')
        return { postponedRecommendations: [...s.postponedRecommendations, recId] };
      if (status === 'dismissed')
        return { discardedRecommendations: [...s.discardedRecommendations, recId] };
      return s;
    }),
}));
