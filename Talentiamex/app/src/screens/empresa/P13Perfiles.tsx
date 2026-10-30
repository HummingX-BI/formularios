// P13 · HU-5.2
import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Clock, FileText, FilterX, MapPin, MessageCircle, UserSearch } from 'lucide-react';
import { ZONAS } from '@/data/zonas';
import { cn } from '@/lib/cn';
import { DISPONIBILIDADES, ETIQUETA_DISPONIBILIDAD } from '@/lib/etiquetas';
import { aniosExperiencia } from '@/store/reglas';
import { useDemoStore } from '@/store/useDemoStore';
import type { Candidato, Disponibilidad, SectorId } from '@/types';
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Icono,
  Input,
  ScreenHeader,
  SectorChip,
  Select,
} from '@/ui';
import { ModalContactar } from './compartido/ModalContactar';
import { PanelCv } from './compartido/PanelCv';

const POR_PAGINA = 12;

/** Cuanto menor, antes puede empezar. */
const RANGO_DISPONIBILIDAD: Record<Disponibilidad, number> = {
  inmediata: 0,
  quince_dias: 1,
  un_mes: 2,
};

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function P13Perfiles() {
  const hoy = useDemoStore((s) => s.hoy);
  const sectores = useDemoStore((s) => s.sectores);
  const candidatos = useDemoStore((s) => s.candidatos);
  const suspendidos = useDemoStore((s) => s.suspendidos);
  const esEmpresa = useDemoStore((s) => s.sesion?.rol === 'empresa');

  const [sector, setSector] = useState<SectorId | ''>('');
  const [puesto, setPuesto] = useState('');
  const [zona, setZona] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [habilidades, setHabilidades] = useState<string[]>([]);
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [verCv, setVerCv] = useState<Candidato | undefined>();
  const [contactar, setContactar] = useState<Candidato | undefined>();

  // Solo perfiles visibles para las empresas (RN-04) y no suspendidos.
  const base = useMemo(
    () =>
      candidatos
        .filter((c) => c.perfilVisible && !suspendidos.includes(c.id))
        .sort((a, b) => b.creadoEl.localeCompare(a.creadoEl)),
    [candidatos, suspendidos],
  );

  const etiquetas = useMemo(() => {
    const fuente = sector ? sectores.filter((s) => s.id === sector) : sectores;
    return [...new Set(fuente.flatMap((s) => s.habilidades))];
  }, [sectores, sector]);

  if (!esEmpresa) return <Navigate to="/entrar" replace />;

  const filtrados = base.filter(
    (c) =>
      (!sector || c.sector === sector) &&
      (!puesto.trim() || normalizar(c.puestoDeseado).includes(normalizar(puesto.trim()))) &&
      (!zona || c.zona === zona) &&
      (!disponibilidad ||
        RANGO_DISPONIBILIDAD[c.disponibilidad] <=
          RANGO_DISPONIBILIDAD[disponibilidad as Disponibilidad]) &&
      habilidades.every((h) => c.habilidades.includes(h)),
  );
  const lista = filtrados.slice(0, visibles);
  const hayFiltros = Boolean(
    sector || puesto.trim() || zona || disponibilidad || habilidades.length,
  );

  const quitarFiltros = () => {
    setSector('');
    setPuesto('');
    setZona('');
    setDisponibilidad('');
    setHabilidades([]);
  };

  const alternarHabilidad = (h: string) =>
    setHabilidades((lista) => (lista.includes(h) ? lista.filter((x) => x !== h) : [...lista, h]));

  return (
    <div>
      <ScreenHeader
        titulo="Busca talento"
        subtitulo="Encuentra perfiles aunque no se hayan postulado"
      />

      <section
        aria-label="Filtros"
        className="mb-5 flex flex-col gap-4 rounded-tarjeta bg-superficie p-4 shadow-1"
      >
        <div role="group" aria-label="Sector" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={sector === ''}
            onClick={() => {
              setSector('');
              setHabilidades([]);
            }}
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
                onClick={() => {
                  setSector(activo ? '' : s.id);
                  setHabilidades([]);
                }}
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
          <Input
            etiqueta="Puesto"
            name="puesto"
            placeholder="Ej. enfermera"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
          />
          <Select
            etiqueta="Alcaldía o municipio"
            name="zona"
            placeholder="Todas las zonas"
            opciones={ZONAS.map((z) => ({ valor: z, texto: z }))}
            value={zona}
            onChange={(e) => setZona(e.target.value)}
          />
          <Select
            etiqueta="Disponibilidad"
            name="disponibilidad"
            placeholder="Cualquiera"
            opciones={DISPONIBILIDADES.map((d) => ({
              valor: d,
              texto:
                d === 'inmediata'
                  ? 'Inmediata'
                  : `Hasta ${ETIQUETA_DISPONIBILIDAD[d].toLowerCase()}`,
            }))}
            value={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-texto">Habilidades</p>
          <div className="flex flex-wrap gap-2">
            {etiquetas.map((h) => {
              const activo = habilidades.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => alternarHabilidad(h)}
                  className={cn(
                    'min-h-10 rounded-chip border px-3.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca',
                    activo
                      ? 'border-marca bg-marca-suave text-marca'
                      : 'border-borde bg-superficie text-texto-2 hover:bg-fondo',
                  )}
                >
                  {h}
                </button>
              );
            })}
          </div>
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
        {filtrados.length === 1 ? '1 perfil' : `${filtrados.length} perfiles`}
      </p>

      {filtrados.length === 0 ? (
        <EmptyState
          icono={UserSearch}
          titulo="No encontramos perfiles con esos filtros"
          texto="Prueba con otra zona, otro puesto o menos habilidades."
          accion={
            hayFiltros ? (
              <Button icono={FilterX} onClick={quitarFiltros}>
                Quitar filtros
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {lista.map((c) => {
              const anios = aniosExperiencia(c, hoy);
              return (
                <li key={c.id}>
                  <Card className="flex h-full flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar
                        nombre={c.nombre}
                        sector={c.sector}
                        {...(c.fotoUrl ? { fotoUrl: c.fotoUrl } : {})}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-titulo text-lg font-semibold text-texto">{c.nombre}</h3>
                        <p className="text-base text-texto-2">{c.puestoDeseado}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <SectorChip sector={c.sector} />
                    </div>
                    <ul className="flex flex-col gap-1 text-base text-texto">
                      <li className="flex items-center gap-2">
                        <MapPin size={16} className="text-texto-3" aria-hidden="true" />
                        {c.zona}
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock size={16} className="text-texto-3" aria-hidden="true" />
                        {c.sinExperiencia
                          ? 'Sin experiencia'
                          : anios === 1
                            ? '1 año de experiencia'
                            : `${anios} años de experiencia`}{' '}
                        · Disponibilidad {ETIQUETA_DISPONIBILIDAD[c.disponibilidad].toLowerCase()}
                      </li>
                    </ul>
                    {c.habilidades.length > 0 && (
                      <p className="text-sm text-texto-2">
                        {c.habilidades.slice(0, 3).join(' · ')}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-2 pt-1">
                      <Button icono={MessageCircle} onClick={() => setContactar(c)}>
                        Contactar
                      </Button>
                      <Button variante="secundario" icono={FileText} onClick={() => setVerCv(c)}>
                        Ver CV
                      </Button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
          {filtrados.length > lista.length && (
            <div className="mt-5 text-center">
              <Button variante="secundario" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
                Ver más perfiles
              </Button>
            </div>
          )}
        </>
      )}

      <PanelCv
        candidato={verCv}
        onCerrar={() => setVerCv(undefined)}
        acciones={
          verCv ? (
            <Button icono={MessageCircle} onClick={() => setContactar(verCv)}>
              Contactar
            </Button>
          ) : undefined
        }
      />
      <ModalContactar candidato={contactar} onCerrar={() => setContactar(undefined)} />
    </div>
  );
}
