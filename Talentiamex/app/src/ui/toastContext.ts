import { createContext } from 'react';

export type TipoToast = 'exito' | 'info' | 'error';

export interface ToastApi {
  exito: (mensaje: string) => void;
  info: (mensaje: string) => void;
  error: (mensaje: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);
