import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDemoStore } from '@/store/useDemoStore';
import { Button, Card, Icono, ICONOS_SECTOR, Input, SectorChip, useToast } from '@/ui';

const PALETA = [
  { variable: '--color-sector-1', nombre: 'Verde azulado' },
  { variable: '--color-sector-2', nombre: 'Rosa' },
  { variable: '--color-sector-3', nombre: 'Verde olivo' },
  { variable: '--color-sector-4', nombre: 'Índigo' },
  { variable: '--color-sector-5', nombre: 'Café' },
  { variable: '--color-sector-6', nombre: 'Gris azulado' },
];

/** Lista de sectores y formulario para agregar uno nuevo (aparece en los filtros de P06 y P13). */
export function SeccionSectores() {
  const toast = useToast();
  const sectores = useDemoStore((s) => s.sectores);
  const agregarSector = useDemoStore((s) => s.agregarSector);

  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('');
  const [icono, setIcono] = useState('');
  const [intento, setIntento] = useState(false);

  const normal = nombre.trim().toLowerCase();
  const errores = {
    nombre: !normal
      ? 'Escribe el nombre del sector'
      : sectores.some((s) => s.nombre.toLowerCase() === normal)
        ? 'Ya existe un sector con ese nombre'
        : undefined,
    color: color ? undefined : 'Elige un color',
    icono: icono ? undefined : 'Elige un ícono',
  };

  const agregar = (e: FormEvent) => {
    e.preventDefault();
    setIntento(true);
    if (Object.values(errores).some(Boolean)) return;
    const valor = `var(${color})`;
    agregarSector({
      nombre: nombre.trim(),
      color: valor,
      colorSuave: `color-mix(in srgb, ${valor} 14%, white)`,
      icono,
      puestos: [],
      habilidades: [],
    });
    toast.exito(`Agregaste el sector ${nombre.trim()}`);
    setNombre('');
    setColor('');
    setIcono('');
    setIntento(false);
  };

  return (
    <section aria-label="Sectores">
      <h2 className="mb-1 font-titulo text-xl font-semibold text-texto">Sectores</h2>
      <p className="mb-3 text-base text-texto-2">
        Cada sector tiene su color e ícono. Los nuevos aparecen en los filtros de vacantes y
        perfiles.
      </p>

      <ul className="mb-5 flex flex-wrap gap-2">
        {sectores.map((s) => (
          <li key={s.id}>
            <SectorChip sector={s.id} />
          </li>
        ))}
      </ul>

      <Card>
        <form onSubmit={agregar} noValidate className="flex flex-col gap-5">
          <h3 className="font-titulo text-lg font-semibold text-texto">Agregar sector</h3>
          <Input
            etiqueta="Nombre del sector"
            name="sector-nombre"
            placeholder="Ej. Logística y almacenes"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={intento ? errores.nombre : undefined}
          />

          <div>
            <p id="paleta-sector" className="mb-1.5 text-sm font-medium text-texto">
              Color
            </p>
            <div role="radiogroup" aria-labelledby="paleta-sector" className="flex flex-wrap gap-2">
              {PALETA.map((p) => (
                <button
                  key={p.variable}
                  type="button"
                  role="radio"
                  aria-checked={color === p.variable}
                  aria-label={p.nombre}
                  onClick={() => setColor(p.variable)}
                  className={cn(
                    'h-11 w-11 rounded-chip border-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca',
                    color === p.variable ? 'border-texto' : 'border-transparent',
                  )}
                  style={{ backgroundColor: `var(${p.variable})` }}
                />
              ))}
            </div>
            {intento && errores.color && (
              <p role="alert" className="mt-1.5 text-sm font-medium text-error">
                {errores.color}
              </p>
            )}
          </div>

          <div>
            <p id="iconos-sector" className="mb-1.5 text-sm font-medium text-texto">
              Ícono
            </p>
            <div role="radiogroup" aria-labelledby="iconos-sector" className="flex flex-wrap gap-2">
              {Object.keys(ICONOS_SECTOR).map((nombreIcono) => (
                <button
                  key={nombreIcono}
                  type="button"
                  role="radio"
                  aria-checked={icono === nombreIcono}
                  aria-label={nombreIcono}
                  onClick={() => setIcono(nombreIcono)}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-boton border text-texto focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
                    icono === nombreIcono
                      ? 'border-marca bg-marca-suave text-marca'
                      : 'border-borde bg-superficie hover:bg-fondo',
                  )}
                >
                  <Icono nombre={nombreIcono} size={22} />
                </button>
              ))}
            </div>
            {intento && errores.icono && (
              <p role="alert" className="mt-1.5 text-sm font-medium text-error">
                {errores.icono}
              </p>
            )}
          </div>

          <div>
            <Button type="submit" icono={Plus}>
              Agregar sector
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
