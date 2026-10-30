import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Campo } from './Campo';
import { CLASE_CONTROL, describedBy } from './estilosCampo';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  etiqueta: string;
  ayuda?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { etiqueta, ayuda, error, className, ...resto },
  ref,
) {
  const id = useId();
  return (
    <Campo
      id={id}
      etiqueta={etiqueta}
      {...(ayuda !== undefined && { ayuda })}
      {...(error !== undefined && { error })}
    >
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, ayuda, error)}
        className={cn(CLASE_CONTROL, error ? 'border-error' : 'border-borde', className)}
        {...resto}
      />
    </Campo>
  );
});
