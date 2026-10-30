import { useState } from 'react';

type Valores = Record<string, string | boolean>;
export type Errores<T extends Valores> = Partial<Record<keyof T & string, string | undefined>>;

/**
 * Estado de un formulario con validación en línea: el error de un campo aparece
 * cuando la persona sale de él o al intentar enviar.
 */
export function useFormulario<T extends Valores>(inicial: T, validar: (v: T) => Errores<T>) {
  type Campo = keyof T & string;
  const [valores, setValores] = useState<T>(inicial);
  const [tocados, setTocados] = useState<ReadonlySet<Campo>>(new Set());
  const [intento, setIntento] = useState(false);
  const [externos, setExternos] = useState<Errores<T>>({});

  const errores = validar(valores);

  return {
    valores,
    cambiar: (campo: Campo, valor: T[Campo]) => {
      setValores((v) => ({ ...v, [campo]: valor }));
      setExternos((e) => ({ ...e, [campo]: undefined }));
    },
    tocar: (campo: Campo) => {
      setTocados((t) => new Set(t).add(campo));
    },
    /** Error que se muestra ahora mismo en el campo, si lo hay. */
    error: (campo: Campo): string | undefined =>
      externos[campo] ?? (intento || tocados.has(campo) ? errores[campo] : undefined),
    /** Marca el intento de envío; devuelve true si todo está bien. */
    validarEnvio: (): boolean => {
      setIntento(true);
      return Object.values(errores).every((e) => e === undefined);
    },
    forzarError: (campo: Campo, mensaje: string) => {
      setExternos((e) => ({ ...e, [campo]: mensaje }));
    },
  };
}
