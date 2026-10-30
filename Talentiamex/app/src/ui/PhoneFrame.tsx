import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/** Marco de celular de 390 × 844 px. Lo fijo (barras, botones) queda dentro del marco. */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div className={cn('mx-auto w-fit rounded-[3rem] bg-texto p-3 shadow-2', className)}>
      <div
        className="relative overflow-hidden rounded-[2.4rem] bg-fondo"
        style={{ width: 390, height: 844 }}
      >
        <div
          className="absolute left-1/2 top-2 z-10 h-6 w-28 -translate-x-1/2 rounded-chip bg-texto"
          aria-hidden="true"
        />
        {/* translateZ(0) hace que los elementos fixed se ubiquen dentro del marco */}
        <div className="h-full w-full overflow-y-auto pt-8" style={{ transform: 'translateZ(0)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
