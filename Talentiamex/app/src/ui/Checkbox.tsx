import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  etiqueta: string;
  ayuda?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { etiqueta, ayuda, className, ...resto },
  ref,
) {
  const id = useId();
  return (
    <div className={cn('flex min-h-12 items-start gap-3 py-2', className)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        aria-describedby={ayuda ? `${id}-ayuda` : undefined}
        className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded accent-accion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
        {...resto}
      />
      <div>
        <label htmlFor={id} className="cursor-pointer text-base text-texto">
          {etiqueta}
        </label>
        {ayuda && (
          <p id={`${id}-ayuda`} className="text-sm text-texto-2">
            {ayuda}
          </p>
        )}
      </div>
    </div>
  );
});
