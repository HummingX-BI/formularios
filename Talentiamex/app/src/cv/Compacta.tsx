import type { ReactNode } from 'react';
import type { Candidato } from '@/types';
import { ETIQUETA_DISPONIBILIDAD, ETIQUETA_TURNO } from '@/lib/etiquetas';
import { moneda } from '@/lib/formato';
import { useDemoStore } from '@/store/useDemoStore';
import { HojaA4 } from './HojaA4';
import { LIMITES, rangoFechas, recortar } from './utilCv';

function Bloque({
  titulo,
  color,
  children,
}: {
  titulo: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-4">
      <h2
        className="mb-1.5 border-l-4 pl-2 font-titulo text-[12px] font-bold uppercase tracking-wider text-texto"
        style={{ borderColor: color }}
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}

/** Plantilla Compacta: todo en una hoja, pensada para puestos operativos. */
export function Compacta({ candidato: c }: { candidato: Candidato }) {
  const sector = useDemoStore((s) => s.sectores.find((x) => x.id === c.sector));
  const color = sector?.color ?? 'var(--color-marca)';
  const experiencias = c.experiencias.slice(0, LIMITES.experiencias);

  return (
    <HojaA4>
      <div className="flex h-full flex-col">
        <header
          className="flex items-center gap-5 px-10 py-7 text-white"
          style={{ backgroundColor: color }}
        >
          {c.fotoUrl && (
            <img
              src={c.fotoUrl}
              alt={`Foto de ${c.nombre}`}
              className="h-[84px] w-[84px] shrink-0 rounded-chip border-2 border-white object-cover"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-titulo text-[28px] font-bold leading-tight">
              {recortar(c.nombre, 50)}
            </h1>
            {c.puestoDeseado && (
              <p className="text-[15px] font-medium">{recortar(c.puestoDeseado, 60)}</p>
            )}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-x-4 bg-fondo px-10 py-3 text-[12px] text-texto">
          <p>{c.celular}</p>
          <p className="break-all">{c.correo}</p>
          <p>{c.zona}</p>
        </div>

        <div className="flex-1 px-10 pb-8 pt-1">
          <div className="grid grid-cols-3 gap-4 text-[12.5px] text-texto">
            <p className="mt-4">
              <span className="block text-[11px] font-semibold uppercase text-texto-2">Turno</span>
              {ETIQUETA_TURNO[c.turno]}
            </p>
            <p className="mt-4">
              <span className="block text-[11px] font-semibold uppercase text-texto-2">
                Disponibilidad
              </span>
              {ETIQUETA_DISPONIBILIDAD[c.disponibilidad]}
            </p>
            <p className="mt-4">
              <span className="block text-[11px] font-semibold uppercase text-texto-2">
                Sueldo esperado
              </span>
              {c.sueldoEsperado > 0 ? moneda(c.sueldoEsperado) : 'A tratar'}
            </p>
          </div>

          {c.resumen.trim() && (
            <Bloque titulo="Sobre mí" color={color}>
              <p className="text-[12.5px] leading-[1.45] text-texto">
                {recortar(c.resumen, LIMITES.resumen)}
              </p>
            </Bloque>
          )}

          <Bloque titulo="Experiencia" color={color}>
            {c.sinExperiencia || experiencias.length === 0 ? (
              <p className="text-[12.5px] text-texto-2">
                Buscando mi primer empleo, con ganas de aprender y crecer.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {experiencias.map((e) => (
                  <li key={`${e.puesto}-${e.desde}`} className="text-[12.5px]">
                    <p className="font-semibold text-texto">
                      {recortar(e.puesto, 44)} · {recortar(e.empresa, 34)}
                      <span className="ml-2 font-normal text-texto-2">{rangoFechas(e)}</span>
                    </p>
                    {e.descripcion && (
                      <p className="leading-[1.4] text-texto-2">
                        {recortar(e.descripcion, LIMITES.descripcion)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Bloque>

          {(c.estudios.nivel || c.estudios.institucion) && (
            <Bloque titulo="Estudios" color={color}>
              <p className="text-[12.5px] text-texto">
                <span className="font-semibold">{recortar(c.estudios.nivel, 50)}</span>
                {c.estudios.institucion && (
                  <span className="text-texto-2"> · {recortar(c.estudios.institucion, 60)}</span>
                )}
              </p>
            </Bloque>
          )}

          {c.habilidades.length > 0 && (
            <Bloque titulo="Habilidades" color={color}>
              <ul className="flex flex-wrap gap-1.5">
                {c.habilidades.slice(0, LIMITES.habilidades).map((h) => (
                  <li
                    key={h}
                    className="rounded-chip border px-2.5 py-0.5 text-[11.5px] font-medium text-texto"
                    style={{ borderColor: color }}
                  >
                    {recortar(h, 34)}
                  </li>
                ))}
              </ul>
            </Bloque>
          )}

          {c.documentos.length > 0 && (
            <Bloque titulo="Documentos" color={color}>
              <p className="text-[12.5px] text-texto">
                {c.documentos
                  .slice(0, LIMITES.documentos)
                  .map((d) => recortar(d, 42))
                  .join(' · ')}
              </p>
            </Bloque>
          )}
        </div>
      </div>
    </HojaA4>
  );
}
