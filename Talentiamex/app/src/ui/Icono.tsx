import { Briefcase } from 'lucide-react';
import { ICONOS_SECTOR } from './iconos';

interface IconoProps {
  nombre: string;
  className?: string;
  size?: number;
}

/** Dibuja un ícono lucide por su nombre; usa un maletín si no lo conoce. */
export function Icono({ nombre, className, size = 18 }: IconoProps) {
  const Componente = ICONOS_SECTOR[nombre] ?? Briefcase;
  return <Componente className={className} size={size} aria-hidden="true" />;
}
