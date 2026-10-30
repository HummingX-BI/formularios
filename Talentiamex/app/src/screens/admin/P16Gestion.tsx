// P16 · HU-8.2
import { useState } from 'react';
import { Ban, CheckCircle2, Search as IconoBuscar } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fechaCorta } from '@/lib/formato';
import { cvCompleto, diasRestantes } from '@/store/reglas';
import { useDemoStore, type TipoSuspension } from '@/store/useDemoStore';
import { Badge, Button, EmptyState, Input, ScreenHeader, SectorChip, useToast } from '@/ui';
import { TablaGestion, type ColumnaGestion } from './TablaGestion';

type Pestana = 'empresas' | 'candidatos' | 'vacantes';

const POR_PAGINA = 15;

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const ESTADO_PLAN = {
  sin_plan: { tono: 'gris', texto: 'Sin plan' },
  prueba: { tono: 'ambar', texto: 'Prueba' },
  activo: { tono: 'verde', texto: 'Activo' },
  vencido: { tono: 'rojo', texto: 'Vencido' },
} as const;

function Estado({ suspendido }: { suspendido: boolean }) {
  return suspendido ? <Badge tono="rojo">Suspendido</Badge> : <Badge tono="verde">Activo</Badge>;
}

export default function P16Gestion() {
  const toast = useToast();
  const hoy = useDemoStore((s) => s.hoy);
  const empresas = useDemoStore((s) => s.empresas);
  const candidatos = useDemoStore((s) => s.candidatos);
  const vacantes = useDemoStore((s) => s.vacantes);
  const postulaciones = useDemoStore((s) => s.postulaciones);
  const planes = useDemoStore((s) => s.planes);
  const suspendidos = useDemoStore((s) => s.suspendidos);
  const alternarSuspension = useDemoStore((s) => s.alternarSuspension);

  const [pestana, setPestana] = useState<Pestana>('empresas');
  const [busqueda, setBusqueda] = useState('');
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const q = normalizar(busqueda.trim());
  const coincide = (...textos: string[]) => !q || textos.some((t) => normalizar(t).includes(q));
  const estaSuspendido = (id: string) => suspendidos.includes(id);
  const nombreEmpresa = (id: string) => empresas.find((e) => e.id === id)?.nombre ?? '';
  const nombrePlan = (id: string) => planes.find((p) => p.id === id)?.nombre ?? '';

  const alternar = (tipo: TipoSuspension, id: string, nombre: string) => {
    const estaba = estaSuspendido(id);
    alternarSuspension(tipo, id);
    if (estaba) toast.exito(`${nombre} volvió a estar activo`);
    else toast.info(`${nombre} quedó suspendido`);
  };

  const boton = (tipo: TipoSuspension, id: string, nombre: string) =>
    estaSuspendido(id) ? (
      <Button variante="secundario" icono={CheckCircle2} onClick={() => alternar(tipo, id, nombre)}>
        Activar
      </Button>
    ) : (
      <Button variante="fantasma" icono={Ban} onClick={() => alternar(tipo, id, nombre)}>
        Suspender
      </Button>
    );

  const filasEmpresas = empresas.filter((e) => coincide(e.nombre, e.contacto, e.correo));
  const filasCandidatos = candidatos.filter((c) =>
    coincide(c.nombre, c.zona, c.puestoDeseado, c.correo),
  );
  const filasVacantes = vacantes.filter((v) =>
    coincide(v.puesto, nombreEmpresa(v.empresaId), v.zona),
  );

  const colEmpresas: ColumnaGestion<(typeof empresas)[number]>[] = [
    { id: 'nombre', titulo: 'Empresa', render: (e) => e.nombre },
    { id: 'sector', titulo: 'Sector', render: (e) => <SectorChip sector={e.sector} /> },
    {
      id: 'plan',
      titulo: 'Plan',
      render: (e) => (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          {e.plan.estado === 'sin_plan' ? '—' : nombrePlan(e.plan.id)}
          <Badge tono={ESTADO_PLAN[e.plan.estado].tono}>{ESTADO_PLAN[e.plan.estado].texto}</Badge>
        </span>
      ),
    },
    {
      id: 'vence',
      titulo: 'Vence',
      render: (e) => (e.plan.venceEl ? fechaCorta(e.plan.venceEl) : '—'),
    },
    {
      id: 'vacantes',
      titulo: 'Vacantes activas',
      render: (e) => vacantes.filter((v) => v.empresaId === e.id && v.estado === 'activa').length,
    },
    { id: 'estado', titulo: 'Estado', render: (e) => <Estado suspendido={estaSuspendido(e.id)} /> },
  ];

  const colCandidatos: ColumnaGestion<(typeof candidatos)[number]>[] = [
    { id: 'nombre', titulo: 'Candidato', render: (c) => c.nombre },
    { id: 'sector', titulo: 'Sector', render: (c) => <SectorChip sector={c.sector} /> },
    { id: 'zona', titulo: 'Zona', render: (c) => c.zona },
    {
      id: 'cv',
      titulo: 'CV completo',
      render: (c) =>
        cvCompleto(c) ? <Badge tono="verde">Sí</Badge> : <Badge tono="ambar">Falta</Badge>,
    },
    {
      id: 'visible',
      titulo: 'Perfil visible',
      render: (c) => (c.perfilVisible ? 'Sí' : 'No'),
    },
    { id: 'estado', titulo: 'Estado', render: (c) => <Estado suspendido={estaSuspendido(c.id)} /> },
  ];

  const colVacantes: ColumnaGestion<(typeof vacantes)[number]>[] = [
    { id: 'puesto', titulo: 'Vacante', render: (v) => v.puesto },
    { id: 'empresa', titulo: 'Empresa', render: (v) => nombreEmpresa(v.empresaId) },
    {
      id: 'vigencia',
      titulo: 'Vigencia',
      render: (v) => {
        if (v.estado !== 'activa') return v.estado.charAt(0).toUpperCase() + v.estado.slice(1);
        const d = diasRestantes(v, hoy);
        return d < 0 ? 'Vencida' : d === 0 ? 'Vence hoy' : `${d} días`;
      },
    },
    {
      id: 'postulantes',
      titulo: 'Postulantes',
      render: (v) => postulaciones.filter((p) => p.vacanteId === v.id).length,
    },
    { id: 'estado', titulo: 'Estado', render: (v) => <Estado suspendido={estaSuspendido(v.id)} /> },
  ];

  const PESTANAS: { id: Pestana; texto: string; total: number }[] = [
    { id: 'empresas', texto: 'Empresas', total: empresas.length },
    { id: 'candidatos', texto: 'Candidatos', total: candidatos.length },
    { id: 'vacantes', texto: 'Vacantes', total: vacantes.length },
  ];

  const cambiarPestana = (p: Pestana) => {
    setPestana(p);
    setBusqueda('');
    setVisibles(POR_PAGINA);
  };

  const hayResultados =
    (pestana === 'empresas' && filasEmpresas.length > 0) ||
    (pestana === 'candidatos' && filasCandidatos.length > 0) ||
    (pestana === 'vacantes' && filasVacantes.length > 0);

  return (
    <div>
      <ScreenHeader titulo="Gestión" subtitulo="Empresas, candidatos y vacantes de la plataforma" />

      <div
        role="tablist"
        aria-label="Qué quieres gestionar"
        className="mb-4 grid max-w-xl grid-cols-3 gap-1 rounded-boton bg-borde p-1"
      >
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={pestana === p.id}
            onClick={() => cambiarPestana(p.id)}
            className={cn(
              'min-h-11 rounded-boton px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca md:text-base',
              pestana === p.id
                ? 'bg-superficie text-marca shadow-1'
                : 'text-texto-2 hover:text-texto',
            )}
          >
            {p.texto} ({p.total})
          </button>
        ))}
      </div>

      <div className="mb-4 max-w-md">
        <Input
          etiqueta="Buscar"
          name="busqueda"
          type="search"
          placeholder={
            pestana === 'empresas'
              ? 'Nombre de la empresa o contacto'
              : pestana === 'candidatos'
                ? 'Nombre, zona o puesto'
                : 'Puesto o empresa'
          }
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setVisibles(POR_PAGINA);
          }}
        />
      </div>

      {!hayResultados ? (
        <EmptyState
          icono={IconoBuscar}
          titulo="No encontramos resultados"
          texto="Prueba con otro nombre o borra la búsqueda."
        />
      ) : pestana === 'empresas' ? (
        <TablaGestion
          etiqueta="Empresas"
          filas={filasEmpresas.slice(0, visibles)}
          clave={(e) => e.id}
          columnas={colEmpresas}
          acciones={(e) => boton('empresa', e.id, e.nombre)}
        />
      ) : pestana === 'candidatos' ? (
        <TablaGestion
          etiqueta="Candidatos"
          filas={filasCandidatos.slice(0, visibles)}
          clave={(c) => c.id}
          columnas={colCandidatos}
          acciones={(c) => boton('candidato', c.id, c.nombre)}
        />
      ) : (
        <TablaGestion
          etiqueta="Vacantes"
          filas={filasVacantes.slice(0, visibles)}
          clave={(v) => v.id}
          columnas={colVacantes}
          acciones={(v) => boton('vacante', v.id, v.puesto)}
        />
      )}

      {((pestana === 'empresas' && filasEmpresas.length > visibles) ||
        (pestana === 'candidatos' && filasCandidatos.length > visibles) ||
        (pestana === 'vacantes' && filasVacantes.length > visibles)) && (
        <div className="mt-4 text-center">
          <Button variante="secundario" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
            Ver más
          </Button>
        </div>
      )}
    </div>
  );
}
