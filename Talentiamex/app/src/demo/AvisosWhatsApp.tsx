import { useEffect } from 'react';
import { alLlegarMensajes } from '@/sim/whatsapp';
import { useToast } from '@/ui';

/** Muestra un aviso "Nuevo WhatsApp" cada vez que el sistema manda mensajes. */
export function AvisosWhatsApp() {
  const toast = useToast();
  useEffect(
    () =>
      alLlegarMensajes((nuevos) => {
        toast.info(nuevos.length === 1 ? 'Nuevo WhatsApp' : `${nuevos.length} WhatsApp nuevos`);
      }),
    [toast],
  );
  return null;
}
