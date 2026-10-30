import { useState } from 'react';
import {
  DISPONIBILIDADES,
  ETIQUETA_DISPONIBILIDAD,
  ETIQUETA_TURNO,
  TURNOS_CANDIDATO,
} from '@/lib/etiquetas';
import { cn } from '@/lib/cn';
import { useDemoStore } from '@/store/useDemoStore';
import type { Candidato, Disponibilidad, SectorId, Turno } from '@/types';
import { GrupoOpciones, Input, SelectorSector } from '@/ui';
import { PasoCv } from './PasoCv';

/** P03 · paso 2: sector, puesto, sueldo, turno y disponibilidad. */
export function Paso2Busqueda({ candidato }: { candidato: Candidato }) {
  const guardar = useDemoStore((s) => s.guardarPasoCv);
  const sectores = useDemoStore((s) => s.sectores);
  const [sector, setSector] = useState<SectorId>(candidato.sector);
  const [puesto, setPuesto] = useState(candidato.puestoDeseado);
  const [sueldo, setSueldo] = useState(
    candidato.sueldoEsperado > 0 ? String(candidato.sueldoEsperado) : '',
  );
  const [turno, setTurno] = useState<Turno | ''>(candidato.turno);
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad | ''>(
    candidato.disponibilidad,
  );
  const [intento, setIntento] = useState(false);

  const sugerencias = sectores.find((s) => s.id === sector)?.puestos ?? [];
  const sueldoNumero = Number(sueldo.replace(/\D/g, ''));

  const errores = {
    sector: sector ? undefined : 'Elige el sector donde quieres trabajar',
    puesto: puesto.trim() ? undefined : 'Escribe el puesto que buscas o elige uno',
    sueldo: sueldoNumero > 0 ? undefined : 'Escribe el sueldo mensual que esperas',
    turno: turno ? undefined : 'Elige un turno',
    disponibilidad: disponibilidad ? undefined : 'Elige cuándo puedes empezar',
  };
  const ver = (campo: keyof typeof errores) => (intento ? errores[campo] : undefined);

  const guardarPaso = () => {
    guardar(2, {
      sector,
      puestoDeseado: puesto.trim(),
      sueldoEsperado: sueldoNumero,
      ...(turno ? { turno } : {}),
      ...(disponibilidad ? { disponibilidad } : {}),
    });
  };

  return (
    <PasoCv
      paso={2}
      onGuardar={guardarPaso}
      onSiguiente={() => {
        setIntento(true);
        if (Object.values(errores).some(Boolean)) return false;
        guardarPaso();
        return true;
      }}
    >
      <SelectorSector etiqueta="Sector" valor={sector} onCambio={setSector} error={ver('sector')} />

      <div>
        <Input
          etiqueta="Puesto que buscas"
          name="puestoDeseado"
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          error={ver('puesto')}
        />
        {sugerencias.length > 0 && (
          <div className="mt-2">
            <p className="mb-1.5 text-sm text-texto-2">Algunas ideas:</p>
            <div className="flex flex-wrap gap-2">
              {sugerencias.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPuesto(p)}
                  className={cn(
                    'min-h-10 rounded-chip border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
                    puesto === p
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

      <Input
        etiqueta="Sueldo mensual que esperas (MXN)"
        name="sueldoEsperado"
        inputMode="numeric"
        placeholder="14000"
        ayuda="Lo que esperas ganar al mes, en pesos."
        value={sueldo}
        onChange={(e) => setSueldo(e.target.value.replace(/\D/g, '').slice(0, 6))}
        error={ver('sueldo')}
      />

      <GrupoOpciones
        etiqueta="Turno"
        opciones={TURNOS_CANDIDATO.map((t) => ({ valor: t, texto: ETIQUETA_TURNO[t] }))}
        valor={turno}
        onCambio={setTurno}
        error={ver('turno')}
      />

      <GrupoOpciones
        etiqueta="¿Cuándo puedes empezar?"
        opciones={DISPONIBILIDADES.map((d) => ({ valor: d, texto: ETIQUETA_DISPONIBILIDAD[d] }))}
        valor={disponibilidad}
        onCambio={setDisponibilidad}
        error={ver('disponibilidad')}
      />
    </PasoCv>
  );
}
