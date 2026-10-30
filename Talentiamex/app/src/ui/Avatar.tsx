import type { SectorId } from '@/types';
import { useDemoStore } from '@/store/useDemoStore';
import { cn } from '@/lib/cn';

type Tamano = 'sm' | 'md' | 'lg';

const TAMANOS: Record<Tamano, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-20 w-20 text-2xl',
};

interface AvatarProps {
  nombre: string;
  fotoUrl?: string;
  /** El fondo de las iniciales toma el color del sector. */
  sector?: SectorId;
  tamano?: Tamano;
  className?: string;
}

function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

export function Avatar({ nombre, fotoUrl, sector, tamano = 'md', className }: AvatarProps) {
  const datos = useDemoStore((s) => (sector ? s.sectores.find((x) => x.id === sector) : undefined));
  const base = cn(
    'inline-flex shrink-0 items-center justify-center rounded-chip font-semibold',
    TAMANOS[tamano],
    className,
  );
  if (fotoUrl) {
    return <img src={fotoUrl} alt={`Foto de ${nombre}`} className={cn(base, 'object-cover')} />;
  }
  return (
    <span
      role="img"
      aria-label={nombre}
      className={cn(base, !datos && 'bg-marca-suave text-marca')}
      style={datos ? { backgroundColor: datos.colorSuave, color: datos.color } : undefined}
    >
      {iniciales(nombre)}
    </span>
  );
}
