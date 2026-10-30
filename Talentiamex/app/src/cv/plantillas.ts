import type { ComponentType } from 'react';
import type { Candidato, PlantillaCv } from '@/types';
import { Clasica } from './Clasica';
import { Compacta } from './Compacta';
import { Moderna } from './Moderna';

export interface PropsPlantilla {
  candidato: Candidato;
}

export const PLANTILLAS_CV: Record<PlantillaCv, ComponentType<PropsPlantilla>> = {
  clasica: Clasica,
  moderna: Moderna,
  compacta: Compacta,
};

export const INFO_PLANTILLAS: { id: PlantillaCv; nombre: string; descripcion: string }[] = [
  { id: 'clasica', nombre: 'Clásica', descripcion: 'Una columna, sobria' },
  { id: 'moderna', nombre: 'Moderna', descripcion: 'Columna lateral con tu color' },
  { id: 'compacta', nombre: 'Compacta', descripcion: 'Todo en una hoja, ideal para operativos' },
];
