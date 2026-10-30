import type { ReactNode } from 'react';
import type { Candidato } from '@/types';
import { ETIQUETA_DISPONIBILIDAD, ETIQUETA_TURNO } from '@/lib/etiquetas';
import { HojaA4 } from './HojaA4';
import { LIMITES, rangoFechas, recortar } from './utilCv';

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="border-b border-borde pb-1 font-titulo text-[13px] font-bold uppercase tracking-wider text-marca">
        {titulo}
      </h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

/** Plantilla Clásica: una columna, sobria. La foto es opcional. */
export function Clasica({ candidato: c }: { candidato: Candidato }) {
  const contacto = [c.celular, c.correo, c.zona].filter(Boolean).join('  ·  ');
  const experiencias = c.experiencias.slice(0, LIMITES.experiencias);

  return (
    <HojaA4>
      <div className="flex h-full flex-col px-14 py-12">
        <header className="flex items-start justify-between gap-6 border-b-2 border-marca pb-5">
          <div className="min-w-0">
            <h1 className="font-titulo text-[32px] font-bold leading-tight text-marca">
              {recortar(c.nombre, 60)}
            </h1>
            {c.puestoDeseado && (
              <p className="mt-1 text-[16px] font-medium text-texto">
                {recortar(c.puestoDeseado, 70)}
              </p>
            )}
            <p className="mt-2 text-[13px] text-texto-2">{contacto}</p>
            {c.puestoDeseado && (
              <p className="mt-1 text-[13px] text-texto-2">
                Turno {ETIQUETA_TURNO[c.turno].toLowerCase()} · Disponibilidad{' '}
                {ETIQUETA_DISPONIBILIDAD[c.disponibilidad].toLowerCase()}
              </p>
            )}
          </div>
          {c.fotoUrl && (
            <img
              src={c.fotoUrl}
              alt={`Foto de ${c.nombre}`}
              className="h-[96px] w-[96px] shrink-0 rounded-chip object-cover"
            />
          )}
        </header>

        {c.resumen.trim() && (
          <Seccion titulo="Perfil">
            <p className="text-[13.5px] leading-[1.5] text-texto">
              {recortar(c.resumen, LIMITES.resumen)}
            </p>
          </Seccion>
        )}

        <Seccion titulo="Experiencia laboral">
          {c.sinExperiencia || experiencias.length === 0 ? (
            <p className="text-[13.5px] text-texto-2">
              Buscando mi primer empleo, con ganas de aprender y crecer.
            </p>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {experiencias.map((e) => (
                <li key={`${e.puesto}-${e.desde}`}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[14px] font-semibold text-texto">
                      {recortar(e.puesto, 50)} · {recortar(e.empresa, 40)}
                    </p>
                    <p className="shrink-0 text-[12.5px] text-texto-2">{rangoFechas(e)}</p>
                  </div>
                  {e.descripcion && (
                    <p className="mt-0.5 text-[13px] leading-[1.45] text-texto-2">
                      {recortar(e.descripcion, LIMITES.descripcion)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Seccion>

        {(c.estudios.nivel || c.estudios.institucion) && (
          <Seccion titulo="Estudios">
            <p className="text-[13.5px] font-semibold text-texto">
              {recortar(c.estudios.nivel, 60)}
            </p>
            {c.estudios.institucion && (
              <p className="text-[13px] text-texto-2">{recortar(c.estudios.institucion, 80)}</p>
            )}
          </Seccion>
        )}

        {c.documentos.length > 0 && (
          <Seccion titulo="Documentos y certificaciones">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-[13px] text-texto">
              {c.documentos.slice(0, LIMITES.documentos).map((d) => (
                <li key={d}>• {recortar(d, 48)}</li>
              ))}
            </ul>
          </Seccion>
        )}

        {c.habilidades.length > 0 && (
          <Seccion titulo="Habilidades">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-texto">
              {c.habilidades.slice(0, LIMITES.habilidades).map((h) => (
                <li key={h}>• {recortar(h, 40)}</li>
              ))}
            </ul>
          </Seccion>
        )}
      </div>
    </HojaA4>
  );
}
