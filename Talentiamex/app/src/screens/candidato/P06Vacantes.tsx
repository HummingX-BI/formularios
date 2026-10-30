// P06 · HU-4.1
import { useMemo, useState } from 'react';
import { Briefcase, FilterX } from 'lucide-react';
import { ZONAS } from '@/data/zonas';
import { cn } from '@/lib/cn';
import { ETIQUETA_TURNO } from '@/lib/etiquetas';
import { moneda } from '@/lib/formato';
import { coincide } from '@/store/reglas';
import { useDemoStore } from '@/store/useDemoStore';
import type { SectorId, Turno } from '@/types';
import { Button, EmptyState, Icono, ScreenHeader, Select } from '@/ui';
import { VacanteCard } from './VacanteCard';

type Pestana = 'recomendadas' | 'todas';

const SUELDOS_MINIMOS = [8000, 10000, 12000, 15000];
const TURNOS: Turno[] = ['matutino', 'vespertino', 'nocturno', 'mixto', 'rotativo'];

export default function P06Vacantes() {
  const hoy = useDemoStore((s) => s.hoy);
  const sectores = useDemoStore((s) => s.sectores);
  const vacantes = useDemoStore((s) => s.vacantes);
  const empresas = useDemoStore((s) => s.empresas);
  const postulaciones = useDemoStore((s) => s.postulaciones);
  const suspendidos = useDemoStore((s) => s.suspendidos);
  const candidato = useDemoStore((s) =>
    s.sesion?.rol === 'candidato' ? s.candidatos.find((c) => c.id === s.sesion?.id) : undefined,
  );

  const [sector, setSector] = useState<SectorId | ''>('');
  const [zona, setZona] = useState('');
  const [turno, setTurno] = useState('');
  const [sueldoMin, setSueldoMin] = useState('');

  // Solo vacantes activas (no pausadas, cerradas ni vencidas) y no suspendidas.
  const visibles = useMemo(
    () =>
      vacantes
        .filter(
          (v) =>
            v.estado === 'activa' &&
            !suspendidos.includes(v.id) &&
            !suspendidos.includes(v.empresaId),
        )
        .sort((a, b) => b.publicadaEl.localeCompare(a.publicadaEl)),
    [vacantes, suspendidos],
  );

  const recomendadas = useMemo(
    () => (candidato ? visibles.filter((v) => coincide(candidato, v)) : []),
    [visibles, candidato],
  );

  const [pestana, setPestana] = useState<Pestana>(
    recomendadas.length > 0 ? 'recomendadas' : 'todas',
  );

  const base = pestana === 'recomendadas' ? recomendadas : visibles;
  const lista = base.filter(
    (v) =>
      (!sector || v.sector === sector) &&
      (!zona || v.zona === zona) &&
      (!turno || v.turno === turno) &&
      (!sueldoMin || v.sueldo >= Number(sueldoMin)),
  );

  const hayFiltros = Boolean(sector || zona || turno || sueldoMin);
  const quitarFiltros = () => {
    setSector('');
    setZona('');
    setTurno('');
    setSueldoMin('');
  };

  const yaPostulado = (vacanteId: string) =>
    candidato !== undefined &&
    postulaciones.some((p) => p.vacanteId === vacanteId && p.candidatoId === candidato.id);

  const PESTANAS: { id: Pestana; texto: string; total: number }[] = [
    { id: 'recomendadas', texto: 'Recomendadas', total: recomendadas.length },
    { id: 'todas', texto: 'Todas', total: visibles.length },
  ];

  return (
    <div>
      <ScreenHeader titulo="Vacantes para ti" subtitulo="Filtra por sector y zona" />

      <div
        role="tablist"
        aria-label="Tipo de vacantes"
        className="mb-4 grid max-w-md grid-cols-2 gap-1 rounded-boton bg-borde p-1"
      >
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={pestana === p.id}
            onClick={() => setPestana(p.id)}
            className={cn(
              'min-h-11 rounded-boton text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
              pestana === p.id
                ? 'bg-superficie text-marca shadow-1'
                : 'text-texto-2 hover:text-texto',
            )}
          >
            {p.texto} ({p.total})
          </button>
        ))}
      </div>

      <section
        aria-label="Filtros"
        className="mb-5 flex flex-col gap-4 rounded-tarjeta bg-superficie p-4 shadow-1"
      >
        <div role="group" aria-label="Sector" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={sector === ''}
            onClick={() => setSector('')}
            className={cn(
              'min-h-10 rounded-chip border px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
              sector === ''
                ? 'border-marca bg-marca-suave text-marca'
                : 'border-borde text-texto-2 hover:bg-fondo',
            )}
          >
            Todos los sectores
          </button>
          {sectores.map((s) => {
            const activo = sector === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={activo}
                onClick={() => setSector(activo ? '' : s.id)}
                className={cn(
                  'inline-flex min-h-10 items-center gap-1.5 rounded-chip border-2 px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca',
                  activo ? 'border-current' : 'border-transparent',
                )}
                style={{ backgroundColor: s.colorSuave, color: s.color }}
              >
                <Icono nombre={s.icono} size={16} />
                {s.nombre}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            etiqueta="Alcaldía o municipio"
            name="zona"
            placeholder="Todas las zonas"
            opciones={ZONAS.map((z) => ({ valor: z, texto: z }))}
            value={zona}
            onChange={(e) => setZona(e.target.value)}
          />
          <Select
            etiqueta="Turno"
            name="turno"
            placeholder="Cualquier turno"
            opciones={TURNOS.map((t) => ({ valor: t, texto: ETIQUETA_TURNO[t] }))}
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
          />
          <Select
            etiqueta="Sueldo mínimo"
            name="sueldoMin"
            placeholder="Cualquiera"
            opciones={SUELDOS_MINIMOS.map((s) => ({
              valor: String(s),
              texto: `Desde ${moneda(s)}`,
            }))}
            value={sueldoMin}
            onChange={(e) => setSueldoMin(e.target.value)}
          />
        </div>

        {hayFiltros && (
          <div>
            <Button variante="fantasma" icono={FilterX} onClick={quitarFiltros}>
              Quitar filtros
            </Button>
          </div>
        )}
      </section>

      <p role="status" className="mb-3 text-sm font-medium text-texto-2">
        {lista.length === 1 ? '1 vacante' : `${lista.length} vacantes`}
      </p>

      {lista.length === 0 ? (
        pestana === 'recomendadas' && !hayFiltros ? (
          <EmptyState
            icono={Briefcase}
            titulo="Aún no hay vacantes que coincidan contigo"
            texto="Las recomendadas son del mismo sector y zona que tu CV. Mira todas las vacantes mientras tanto."
            accion={<Button onClick={() => setPestana('todas')}>Ver todas las vacantes</Button>}
          />
        ) : (
          <EmptyState
            icono={FilterX}
            titulo="No encontramos vacantes con esos filtros"
            texto="Prueba con otra zona, otro turno o un sueldo menor."
            accion={
              <Button icono={FilterX} onClick={quitarFiltros}>
                Quitar filtros
              </Button>
            }
          />
        )
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((v) => (
            <li key={v.id}>
              <VacanteCard
                vacante={v}
                empresa={empresas.find((e) => e.id === v.empresaId)?.nombre ?? ''}
                hoy={hoy}
                coincide={candidato !== undefined && coincide(candidato, v)}
                postulado={yaPostulado(v.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
