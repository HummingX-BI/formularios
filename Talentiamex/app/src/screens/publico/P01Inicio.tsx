// P01 · sin historias
import {
  ArrowRight,
  Building2,
  FileText,
  MessageCircle,
  MousePointerClick,
  Search,
  Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDemoStore } from '@/store/useDemoStore';
import { Card, ScreenHeader, SectorChip } from '@/ui';

interface Camino {
  to: string;
  icono: LucideIcon;
  titulo: string;
  texto: string;
  accion: string;
}

const CAMINOS: Camino[] = [
  {
    to: '/registro/candidato',
    icono: Search,
    titulo: 'Busco trabajo',
    texto: 'Crea tu CV gratis y postúlate en un clic.',
    accion: 'Crear mi CV gratis',
  },
  {
    to: '/registro/empresa',
    icono: Building2,
    titulo: 'Busco talento',
    texto: 'Publica vacantes y encuentra candidatos filtrados.',
    accion: 'Publicar una vacante',
  },
];

const BENEFICIOS: { icono: LucideIcon; texto: string }[] = [
  { icono: FileText, texto: 'CV profesional en minutos' },
  { icono: MousePointerClick, texto: 'Postúlate en un clic' },
  { icono: MessageCircle, texto: 'Avisos por WhatsApp' },
];

export default function P01Inicio() {
  const sectores = useDemoStore((s) => s.sectores);

  return (
    <div>
      <ScreenHeader
        titulo="Encuentra trabajo o talento en Salud, Restaurantes y Escuelas"
        subtitulo="Elige cómo quieres empezar"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {CAMINOS.map(({ to, icono: Icono, titulo, texto, accion }) => (
          <Card key={to} to={to} className="flex flex-col gap-3 md:p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-chip bg-marca-suave text-marca">
                <Icono size={28} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-titulo text-xl font-semibold text-texto">{titulo}</h2>
                <p className="text-base text-texto-2">{texto}</p>
              </div>
            </div>
            <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-boton bg-accion px-5 text-base font-semibold text-white">
              {accion}
              <ArrowRight size={20} aria-hidden="true" />
            </span>
          </Card>
        ))}
      </div>

      <section aria-label="Sectores" className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-texto-2">Vacantes y talento en:</span>
        {sectores.map((s) => (
          <SectorChip key={s.id} sector={s.id} />
        ))}
      </section>

      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {BENEFICIOS.map(({ icono: Icono, texto }) => (
          <li key={texto} className="flex items-center gap-3 text-base font-medium text-texto">
            <Icono size={22} className="text-accion" aria-hidden="true" />
            {texto}
          </li>
        ))}
      </ul>

      <aside className="mt-5 flex flex-col gap-3 rounded-tarjeta bg-marca-suave p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
        <div className="flex items-center gap-3">
          <Target size={26} className="shrink-0 text-marca" aria-hidden="true" />
          <p className="text-base text-texto">
            <strong className="font-semibold">¿Puesto difícil de cubrir?</strong> Nuestros
            especialistas lo buscan por ti.
          </p>
        </div>
        <Link
          to="/registro/empresa"
          className="inline-flex min-h-11 items-center gap-1 rounded-boton px-3 text-base font-semibold text-marca hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-marca"
        >
          Conocer el servicio
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
