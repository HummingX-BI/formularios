import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import type { Candidato, Experiencia } from '@/types';
import { Button, Checkbox, Input, Textarea } from '@/ui';
import { PasoCv } from './PasoCv';

interface Borrador {
  clave: number;
  puesto: string;
  empresa: string;
  desde: string;
  hasta: string;
  actual: boolean;
  descripcion: string;
}

let contador = 0;

function vacio(): Borrador {
  return {
    clave: ++contador,
    puesto: '',
    empresa: '',
    desde: '',
    hasta: '',
    actual: false,
    descripcion: '',
  };
}

function desdeExperiencia(e: Experiencia): Borrador {
  return {
    clave: ++contador,
    puesto: e.puesto,
    empresa: e.empresa,
    desde: e.desde,
    hasta: e.hasta ?? '',
    actual: e.hasta === undefined,
    descripcion: e.descripcion ?? '',
  };
}

function aExperiencia(b: Borrador): Experiencia {
  return {
    puesto: b.puesto.trim(),
    empresa: b.empresa.trim(),
    desde: b.desde,
    ...(b.actual || !b.hasta ? {} : { hasta: b.hasta }),
    ...(b.descripcion.trim() ? { descripcion: b.descripcion.trim() } : {}),
  };
}

interface ErroresExperiencia {
  puesto?: string;
  empresa?: string;
  desde?: string;
  hasta?: string;
}

function validar(b: Borrador): ErroresExperiencia {
  const e: ErroresExperiencia = {};
  if (!b.puesto.trim()) e.puesto = 'Escribe el puesto';
  if (!b.empresa.trim()) e.empresa = 'Escribe dónde trabajaste';
  if (!b.desde) e.desde = 'Elige desde cuándo';
  if (!b.actual && b.hasta && b.desde && b.hasta < b.desde) {
    e.hasta = 'La fecha final no puede ser antes de la inicial';
  }
  return e;
}

/** P03 · paso 3: experiencias (varias) o "Aún no tengo experiencia" (RD-01). */
export function Paso3Experiencia({ candidato }: { candidato: Candidato }) {
  const guardar = useDemoStore((s) => s.guardarPasoCv);
  const [sinExperiencia, setSinExperiencia] = useState(candidato.sinExperiencia);
  const [items, setItems] = useState<Borrador[]>(() =>
    candidato.experiencias.length > 0 ? candidato.experiencias.map(desdeExperiencia) : [vacio()],
  );
  const [intento, setIntento] = useState(false);

  const cambiar = (clave: number, parte: Partial<Borrador>) =>
    setItems((lista) => lista.map((b) => (b.clave === clave ? { ...b, ...parte } : b)));

  const guardarPaso = () => {
    const completas = items.filter((b) => Object.keys(validar(b)).length === 0);
    guardar(3, {
      sinExperiencia,
      experiencias: sinExperiencia ? [] : completas.map(aExperiencia),
    });
  };

  return (
    <PasoCv
      paso={3}
      onGuardar={guardarPaso}
      onSiguiente={() => {
        setIntento(true);
        if (!sinExperiencia && items.some((b) => Object.keys(validar(b)).length > 0)) return false;
        guardarPaso();
        return true;
      }}
    >
      <Checkbox
        etiqueta="Aún no tengo experiencia"
        ayuda="No pasa nada: puedes armar tu CV y postularte igual."
        name="sinExperiencia"
        checked={sinExperiencia}
        onChange={(e) => setSinExperiencia(e.target.checked)}
      />

      {!sinExperiencia && (
        <>
          {items.map((b, i) => {
            const errores = intento ? validar(b) : {};
            return (
              <fieldset
                key={b.clave}
                className="flex flex-col gap-4 rounded-boton border border-borde p-4"
              >
                <legend className="px-1 text-sm font-semibold text-texto-2">
                  Experiencia {i + 1}
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    etiqueta="Puesto"
                    name={`puesto-${i}`}
                    value={b.puesto}
                    onChange={(e) => cambiar(b.clave, { puesto: e.target.value })}
                    error={errores.puesto}
                  />
                  <Input
                    etiqueta="Lugar de trabajo"
                    name={`empresa-${i}`}
                    value={b.empresa}
                    onChange={(e) => cambiar(b.clave, { empresa: e.target.value })}
                    error={errores.empresa}
                  />
                  <Input
                    etiqueta="Desde"
                    name={`desde-${i}`}
                    type="month"
                    value={b.desde}
                    onChange={(e) => cambiar(b.clave, { desde: e.target.value })}
                    error={errores.desde}
                  />
                  <Input
                    etiqueta="Hasta"
                    name={`hasta-${i}`}
                    type="month"
                    value={b.actual ? '' : b.hasta}
                    disabled={b.actual}
                    onChange={(e) => cambiar(b.clave, { hasta: e.target.value })}
                    error={errores.hasta}
                  />
                </div>
                <Checkbox
                  etiqueta="Trabajo aquí actualmente"
                  name={`actual-${i}`}
                  checked={b.actual}
                  onChange={(e) => cambiar(b.clave, { actual: e.target.checked })}
                />
                <Textarea
                  etiqueta="¿Qué hacías?"
                  name={`descripcion-${i}`}
                  rows={3}
                  placeholder="Ej. Atendía pacientes, tomaba signos vitales y registraba en el expediente."
                  value={b.descripcion}
                  onChange={(e) => cambiar(b.clave, { descripcion: e.target.value })}
                />
                {items.length > 1 && (
                  <div>
                    <Button
                      variante="fantasma"
                      icono={Trash2}
                      onClick={() => setItems((l) => l.filter((x) => x.clave !== b.clave))}
                    >
                      Quitar esta experiencia
                    </Button>
                  </div>
                )}
              </fieldset>
            );
          })}
          <div>
            <Button
              variante="secundario"
              icono={Plus}
              onClick={() => setItems((l) => [...l, vacio()])}
            >
              Agregar otra
            </Button>
          </div>
        </>
      )}
    </PasoCv>
  );
}
