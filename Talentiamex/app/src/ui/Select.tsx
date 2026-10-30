import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Campo } from './Campo';
import { CLASE_CONTROL, describedBy } from './estilosCampo';

export interface OpcionSelect {
  valor: string;
  texto: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  etiqueta: string;
  opciones: OpcionSelect[];
  /** Texto de la opción vacía inicial. */
  placeholder?: string;
  ayuda?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { etiqueta, opciones, placeholder, ayuda, error, className, ...resto },
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
      <select
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, ayuda, error)}
        className={cn(CLASE_CONTROL, error ? 'border-error' : 'border-borde', className)}
        {...resto}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </Campo>
  );
});
