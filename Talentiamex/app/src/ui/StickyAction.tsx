import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface StickyActionProps {
  children: ReactNode;
  className?: string;
}

/** Botón principal fijo al fondo en móvil, con sombra superior; en escritorio queda en el flujo. */
export function StickyAction({ children, className }: StickyActionProps) {
  return (
    <>
      <div className="h-24 md:hidden" aria-hidden="true" />
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-30 bg-superficie px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-arriba',
          'md:static md:z-auto md:bg-transparent md:px-0 md:pb-0 md:pt-6 md:shadow-none',
          className,
        )}
      >
        <div className="mx-auto flex max-w-xl flex-col gap-2 md:mx-0 md:max-w-none md:flex-row md:justify-end">
          {children}
        </div>
      </div>
    </>
  );
}
