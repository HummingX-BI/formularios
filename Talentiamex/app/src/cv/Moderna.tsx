import type { ReactNode } from 'react';
import type { Candidato } from '@/types';
import { ETIQUETA_DISPONIBILIDAD, ETIQUETA_TURNO } from '@/lib/etiquetas';
import { useDemoStore } from '@/store/useDemoStore';
import { HojaA4 } from './HojaA4';
import { iniciales, LIMITES, rangoFechas, recortar } from './utilCv';

function Titulo({ children, claro = false }: { children: ReactNode; claro?: boolean }) {
  return (
    <h2
      className={`font-titulo text-[12.5px] font-bold uppercase tracking-wider ${claro ? 'text-white' : 'text-texto'}`}
    >
      {children}
    </h2>
  );
}

/** Plantilla Moderna: columna lateral con el color del sector y foto circular. */
export function Moderna({ candidato: c }: { candidato: Candidato }) {
  const sector = useDemoStore((s) => s.sectores.find((x) => x.id === c.sector));
  const color = sector?.color ?? 'var(--color-marca)';
  const experiencias = c.experiencias.slice(0, LIMITES.experiencias);

  return (
    <HojaA4>
      <div className="flex h-full">
        <aside
          className="flex w-[262px] shrink-0 flex-col gap-6 px-7 py-12 text-white"
          style={{ backgroundColor: color }}
        >
          {c.fotoUrl ? (
            <img
              src={c.fotoUrl}
              alt={`Foto de ${c.nombre}`}
              className="mx-auto h-[140px] w-[140px] rounded-chip border-4 border-white object-cover"
            />
          ) : (
            <div className="mx-auto flex h-[140px] w-[140px] items-center justify-center rounded-chip border-4 border-white bg-white/20 font-titulo text-[48px] font-bold">
              {iniciales(c.nombre)}
            </div>
          )}

          <section>
            <Titulo claro>Contacto</Titulo>
            <ul className="mt-2 flex flex-col gap-1.5 text-[12.5px] leading-snug">
              <li>{c.celular}</li>
              <li className="break-all">{c.correo}</li>
              <li>{c.zona}</li>
            </ul>
          </section>

          {c.habilidades.length > 0 && (
            <section>
              <Titulo claro>Habilidades</Titulo>
              <ul className="mt-2 flex flex-col gap-1.5 text-[12.5px] leading-snug">
                {c.habilidades.slice(0, LIMITES.habilidades).map((h) => (
                  <li key={h}>• {recortar(h, 34)}</li>
                ))}
              </ul>
            </section>
          )}

          {c.documentos.length > 0 && (
            <section>
              <Titulo claro>Documentos</Titulo>
              <ul className="mt-2 flex flex-col gap-1.5 text-[12.5px] leading-snug">
                {c.documentos.slice(0, LIMITES.documentos).map((d) => (
                  <li key={d}>• {recortar(d, 42)}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-auto">
            <Titulo claro>Disponibilidad</Titulo>
            <p className="mt-2 text-[12.5px] leading-snug">
              Turno {ETIQUETA_TURNO[c.turno].toLowerCase()}
              <br />
              {ETIQUETA_DISPONIBILIDAD[c.disponibilidad]}
            </p>
          </section>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col px-9 py-12">
          <header>
            <h1 className="font-titulo text-[30px] font-bold leading-tight" style={{ color }}>
              {recortar(c.nombre, 50)}
            </h1>
            {c.puestoDeseado && (
              <p className="mt-1 text-[16px] font-medium text-texto-2">
                {recortar(c.puestoDeseado, 60)}
              </p>
            )}
          </header>

          {c.resumen.trim() && (
            <section className="mt-6">
              <Titulo>Perfil</Titulo>
              <p className="mt-2 text-[13px] leading-[1.5] text-texto">
                {recortar(c.resumen, LIMITES.resumen)}
              </p>
            </section>
          )}

          <section className="mt-6">
            <Titulo>Experiencia</Titulo>
            {c.sinExperiencia || experiencias.length === 0 ? (
              <p className="mt-2 text-[13px] text-texto-2">
                Buscando mi primer empleo, con ganas de aprender y crecer.
              </p>
            ) : (
              <ul className="mt-2 flex flex-col gap-4">
                {experiencias.map((e) => (
                  <li
                    key={`${e.puesto}-${e.desde}`}
                    className="border-l-2 pl-3"
                    style={{ borderColor: color }}
                  >
                    <p className="text-[13.5px] font-semibold text-texto">
                      {recortar(e.puesto, 46)}
                    </p>
                    <p className="text-[12.5px] text-texto-2">
                      {recortar(e.empresa, 36)} · {rangoFechas(e)}
                    </p>
                    {e.descripcion && (
                      <p className="mt-1 text-[12.5px] leading-[1.45] text-texto">
                        {recortar(e.descripcion, LIMITES.descripcion)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {(c.estudios.nivel || c.estudios.institucion) && (
            <section className="mt-6">
              <Titulo>Estudios</Titulo>
              <p className="mt-2 text-[13.5px] font-semibold text-texto">
                {recortar(c.estudios.nivel, 60)}
              </p>
              {c.estudios.institucion && (
                <p className="text-[12.5px] text-texto-2">{recortar(c.estudios.institucion, 70)}</p>
              )}
            </section>
          )}
        </div>
      </div>
    </HojaA4>
  );
}
