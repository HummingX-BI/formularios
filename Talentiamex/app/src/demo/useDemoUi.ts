import { create } from 'zustand';

interface EstadoUiDemo {
  /** Muestra la app dentro del marco de celular (en escritorio). */
  vistaCelular: boolean;
  /** El panel completo se oculta con la tecla D (para capturas o pantalla compartida). */
  panelVisible: boolean;
  /** Simulador de WhatsApp (P18). */
  whatsappAbierto: boolean;
  alternarVistaCelular: () => void;
  alternarPanelVisible: () => void;
  abrirWhatsApp: () => void;
  cerrarWhatsApp: () => void;
}

/** Estado de la interfaz de la demo; no se guarda, se reinicia al recargar. */
export const useDemoUi = create<EstadoUiDemo>((set) => ({
  vistaCelular: false,
  panelVisible: true,
  whatsappAbierto: false,
  alternarVistaCelular: () => set((s) => ({ vistaCelular: !s.vistaCelular })),
  alternarPanelVisible: () => set((s) => ({ panelVisible: !s.panelVisible })),
  abrirWhatsApp: () => set({ whatsappAbierto: true }),
  cerrarWhatsApp: () => set({ whatsappAbierto: false }),
}));
