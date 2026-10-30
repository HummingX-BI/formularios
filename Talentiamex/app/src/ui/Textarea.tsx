import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Campo } from './Campo';
import { CLASE_CONTROL, describedBy } from './estilosCampo';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  etiqueta: string;
  ayuda?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { etiqueta, ayuda, error, className, rows = 4, ...resto },
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
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, ayuda, error)}
        className={cn(CLASE_CONTROL, 'py-3', error ? 'border-error' : 'border-borde', className)}
        {...resto}
      />
    </Campo>
  );
});
