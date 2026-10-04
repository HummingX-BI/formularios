import type { LevelObj, Instructor } from '../types';
import { STORIES } from '../../config/stories';
import { RandomGenerator } from '../rng';

export const POOLS = ['principal', 'infantil'] as const;
export const PLANS = ['1/semana', '2/semana', '3/semana'] as const;

export const LEVELS: LevelObj[] = [
  {
    id: 'L1_Adaptacion',
    name: '1 Adaptación al agua',
    description: 'Primer contacto con el agua, confianza.',
    typicalEntryAge: 3,
    medianMonths: 3.2,
  },
  {
    id: 'L2_Flotacion',
    name: '2 Flotación',
    description: 'Flotación boca arriba y boca abajo.',
    typicalEntryAge: 4,
    medianMonths: 3.2,
  },
  {
    id: 'L3_Respiracion',
    name: '3 Respiración rítmica',
    description: 'Sumergir cabeza y respiración lateral.',
    typicalEntryAge: 5,
    medianMonths: 5.8,
  },
  {
    id: 'L4_Libre',
    name: '4 Estilo libre',
    description: 'Coordinación brazada y patada de crol.',
    typicalEntryAge: 6,
    medianMonths: 3.2,
  },
  {
    id: 'L5_Dorso',
    name: '5 Dorso',
    description: 'Estilo dorso completo.',
    typicalEntryAge: 7,
    medianMonths: 3.2,
  },
  {
    id: 'L6_PechoMariposa',
    name: '6 Pecho y mariposa',
    description: 'Brazada y patada de pecho, inicio de mariposa.',
    typicalEntryAge: 8,
    medianMonths: 3.2,
  },
  {
    id: 'L7_Perfeccionamiento',
    name: '7 Perfeccionamiento',
    description: 'Resistencia, vueltas y nado continuo.',
    typicalEntryAge: 10,
    medianMonths: 3.2,
  },
];

export function generateInstructors(rng: RandomGenerator): Instructor[] {
  const names = rng.sample(
    [
      'Carlos',
      'Ana',
      'José',
      'Laura',
      'Luis',
      'Sofia',
      'Jorge',
      'Elena',
      'Diego',
      'Lucia',
      'Fernando',
      'Carmen',
    ],
    6,
  );
  names.unshift('Ricardo', 'Mariana');

  return names.map((name, i) => {
    let retEff = 0;
    let pedGood = rng.float(0.75, 0.8);

    const h2Params = STORIES.H2.params.instructorEffects;
    const h5Params = STORIES.H5.params;

    if (name === 'Mariana') {
      retEff = h2Params.mariana;
      pedGood = h5Params.marianaPedagogy;
    } else if (name === 'Ricardo') {
      retEff = h2Params.ricardo;
      pedGood = h5Params.ricardoPedagogy;
    } else {
      retEff = rng.float(-0.02, 0.02);
    }

    return {
      id: `ins_${(i + 1).toString().padStart(2, '0')}`,
      name,
      hireDate: '2023-01-15',
      active: true,
      score: pedGood,
      costPerHour: rng.int(16, 21) * 10, // 160 to 210
      shifts: [
        { day: 1, start: 7, end: 19 },
        { day: 2, start: 7, end: 19 },
        { day: 3, start: 7, end: 19 },
        { day: 4, start: 7, end: 19 },
        { day: 5, start: 7, end: 19 },
        { day: 6, start: 8, end: 13 },
      ], // Simplified shifts, the scheduler will load balance
      retentionEffect: retEff,
      pedagogicalGoodness: pedGood,
    };
  });
}
