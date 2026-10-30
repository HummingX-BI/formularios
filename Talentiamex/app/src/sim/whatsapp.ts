import type { MensajeWhatsApp } from '@/types';
import { useDemoStore } from '@/store/useDemoStore';
import type { PlantillaMensaje } from './plantillas';

export {
  plantillaRN06,
  plantillaRN07,
  plantillaRN08,
  plantillaRN09,
  type PlantillaMensaje,
} from './plantillas';

/** Agrega un mensaje al historial con la hora actual de la demo. */
export function enviar(plantilla: PlantillaMensaje): void {
  useDemoStore.getState().agregarMensajes([plantilla]);
}

export function noLeidos(
  mensajes: readonly MensajeWhatsApp[],
  para: MensajeWhatsApp['para'],
  destinatarioId: string,
): number {
  return mensajes.filter((m) => m.para === para && m.destinatarioId === destinatarioId && !m.leido)
    .length;
}

/** Avisa cada vez que llegan mensajes nuevos (para el toast "Nuevo WhatsApp" y el contador). */
export function alLlegarMensajes(cb: (nuevos: MensajeWhatsApp[]) => void): () => void {
  return useDemoStore.subscribe((estado, previo) => {
    if (estado.mensajes.length > previo.mensajes.length) {
      cb(estado.mensajes.slice(previo.mensajes.length));
    }
  });
}
