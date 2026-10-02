export interface OptimizerMove {
  id: string;
  groupId: string;
  groupName: string;
  level: string;
  instructor: string;
  sourceSlot: { day: string, hour: string, occ: number, waitlist: number };
  destSlot: { day: string, hour: string, occ: number, waitlist: number };
  type: 'consolidate' | 'move_to_demand';
  familiesBenefited: number;
  frictionCost: number; // number of students forced to change
  impactLow: number;
  impactExpected: number;
  impactHigh: number;
  explanation: string;
}

export function runScheduleOptimizer(): OptimizerMove[] {
  // Deterministic mock heuristic
  return [
    {
      id: 'opt-1',
      groupId: 'grp-101',
      groupName: 'Delfines G1',
      level: 'Delfines',
      instructor: 'Ana López',
      sourceSlot: { day: 'Miércoles', hour: '11:00', occ: 40, waitlist: 0 },
      destSlot: { day: 'Sábado', hour: '10:00', occ: 100, waitlist: 8 },
      type: 'move_to_demand',
      familiesBenefited: 4,
      frictionCost: 3,
      impactLow: 2400,
      impactExpected: 3300,
      impactHigh: 4200,
      explanation: 'Mover un grupo subutilizado de Miércoles 11:00 (40% occ) a Sábado 10:00 absorbería 4 familias en lista de espera.'
    },
    {
      id: 'opt-2',
      groupId: 'grp-102',
      groupName: 'Tortugas G2',
      level: 'Tortugas',
      instructor: 'Carlos Ruiz',
      sourceSlot: { day: 'Viernes', hour: '08:00', occ: 50, waitlist: 0 },
      destSlot: { day: 'Viernes', hour: '09:00', occ: 45, waitlist: 0 },
      type: 'consolidate',
      familiesBenefited: 0,
      frictionCost: 4,
      impactLow: 1200,
      impactExpected: 1500,
      impactHigh: 1800,
      explanation: 'Consolidar Tortugas de 08:00 y 09:00 libera un carril y un bloque de instructor, ahorrando costos operativos directos.'
    }
  ];
}
