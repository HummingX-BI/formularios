import type { ReactNode } from 'react';
import { Card } from '@/ui';

export interface ColumnaGestion<T> {
  id: string;
  titulo: string;
  render: (fila: T) => ReactNode;
}

interface TablaGestionProps<T> {
  etiqueta: string;
  filas: T[];
  clave: (fila: T) => string;
  /** La primera columna es el título de la tarjeta en móvil. */
  columnas: ColumnaGestion<T>[];
  acciones: (fila: T) => ReactNode;
}

/** Tabla en escritorio; en móvil cada fila se convierte en una tarjeta. */
export function TablaGestion<T>({
  etiqueta,
  filas,
  clave,
  columnas,
  acciones,
}: TablaGestionProps<T>) {
  const [principal, ...resto] = columnas;

  return (
    <>
      <div className="hidden overflow-x-auto rounded-tarjeta bg-superficie shadow-1 md:block">
        <table className="w-full border-collapse text-left text-base">
          <caption className="sr-only">{etiqueta}</caption>
          <thead>
            <tr className="border-b border-borde text-sm text-texto-2">
              {columnas.map((c) => (
                <th key={c.id} scope="col" className="p-3 font-semibold">
                  {c.titulo}
                </th>
              ))}
              <th scope="col" className="p-3 font-semibold">
                <span className="sr-only">Acción</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={clave(f)} className="border-b border-borde last:border-b-0">
                {columnas.map((c) => (
                  <td key={c.id} className="p-3 text-texto">
                    {c.render(f)}
                  </td>
                ))}
                <td className="p-3 text-right">{acciones(f)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul aria-label={etiqueta} className="flex flex-col gap-3 md:hidden">
        {filas.map((f) => (
          <li key={clave(f)}>
            <Card className="flex flex-col gap-2">
              {principal && (
                <div className="font-titulo text-lg font-semibold text-texto">
                  {principal.render(f)}
                </div>
              )}
              <dl className="flex flex-col gap-1.5">
                {resto.map((c) => (
                  <div key={c.id} className="flex items-baseline justify-between gap-3 text-base">
                    <dt className="shrink-0 text-texto-2">{c.titulo}</dt>
                    <dd className="text-right text-texto">{c.render(f)}</dd>
                  </div>
                ))}
              </dl>
              <div className="pt-1">{acciones(f)}</div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
