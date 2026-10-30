import { ZONAS } from '@/data/zonas';
import {
  PRESTACIONES_SUGERIDAS,
  REQUISITOS_SUGERIDOS,
  TIPOS_CONTRATO,
} from '@/data/sugerenciasVacante';
import { cn } from '@/lib/cn';
import { ETIQUETA_TURNO } from '@/lib/etiquetas';
import { useDemoStore } from '@/store/useDemoStore';
import type { Turno } from '@/types';
import { ChipsSeleccion, GrupoOpciones, Input, Select, SelectorSector, Textarea } from '@/ui';
import type { BorradorVacante, ErroresDatos } from './borrador';

const TURNOS: Turno[] = ['matutino', 'vespertino', 'nocturno', 'mixto', 'rotativo'];

interface Paso1Props {
  borrador: BorradorVacante;
  onCambio: (parte: Partial<BorradorVacante>) => void;
  /** Errores que se deben mostrar ahora (vacío hasta que se intenta avanzar). */
  errores: ErroresDatos;
}

/** P11 · paso 1: datos de la vacante. */
export function Paso1DatosVacante({ borrador: b, onCambio, errores }: Paso1Props) {
  const sugerencias = useDemoStore((s) => s.sectores.find((x) => x.id === b.sector)?.puestos ?? []);

  return (
    <>
      <SelectorSector
        etiqueta="Sector"
        valor={b.sector}
        onCambio={(sector) => onCambio({ sector })}
        error={errores.sector}
      />

      <div>
        <Input
          etiqueta="Puesto"
          name="puesto"
          value={b.puesto}
          onChange={(e) => onCambio({ puesto: e.target.value })}
          error={errores.puesto}
        />
        {sugerencias.length > 0 && (
          <div className="mt-2">
            <p className="mb-1.5 text-sm text-texto-2">Algunas ideas:</p>
            <div className="flex flex-wrap gap-2">
              {sugerencias.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onCambio({ puesto: p })}
                  className={cn(
                    'min-h-10 rounded-chip border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
                    b.puesto === p
                      ? 'border-marca bg-marca-suave text-marca'
                      : 'border-borde bg-superficie text-texto-2 hover:bg-fondo',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Select
          etiqueta="Alcaldía o municipio"
          name="zona"
          placeholder="Elige una opción"
          opciones={ZONAS.map((z) => ({ valor: z, texto: z }))}
          value={b.zona}
          onChange={(e) => onCambio({ zona: e.target.value })}
          error={errores.zona}
        />
        <Input
          etiqueta="Sueldo mensual (MXN)"
          name="sueldo"
          inputMode="numeric"
          placeholder="14500"
          value={b.sueldo}
          onChange={(e) => onCambio({ sueldo: e.target.value.replace(/\D/g, '').slice(0, 6) })}
          error={errores.sueldo}
        />
      </div>

      <GrupoOpciones
        etiqueta="Turno"
        opciones={TURNOS.map((t) => ({ valor: t, texto: ETIQUETA_TURNO[t] }))}
        valor={b.turno}
        onCambio={(turno) => onCambio({ turno })}
        error={errores.turno}
      />

      <Select
        etiqueta="Tipo de contrato"
        name="contrato"
        placeholder="Elige una opción"
        opciones={TIPOS_CONTRATO.map((t) => ({ valor: t, texto: t }))}
        value={b.contrato}
        onChange={(e) => onCambio({ contrato: e.target.value })}
        error={errores.contrato}
      />

      <Textarea
        etiqueta="Descripción del puesto"
        name="descripcion"
        rows={4}
        placeholder="Ej. Atención de pacientes en piso, toma de signos vitales y registro en expediente."
        value={b.descripcion}
        onChange={(e) => onCambio({ descripcion: e.target.value })}
        error={errores.descripcion}
      />

      <ChipsSeleccion
        etiqueta="Requisitos"
        ayuda="Toca los que pidas. Son opcionales."
        sugerencias={REQUISITOS_SUGERIDOS}
        seleccion={b.requisitos}
        onCambio={(requisitos) => onCambio({ requisitos })}
        etiquetaAgregar="Otro requisito"
      />

      <ChipsSeleccion
        etiqueta="Prestaciones"
        ayuda="Lo que ofreces además del sueldo."
        sugerencias={PRESTACIONES_SUGERIDAS}
        seleccion={b.prestaciones}
        onCambio={(prestaciones) => onCambio({ prestaciones })}
        etiquetaAgregar="Otra prestación"
      />
    </>
  );
}
