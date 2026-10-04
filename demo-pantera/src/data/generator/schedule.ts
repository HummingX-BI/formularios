import type { Group, Instructor, Pool, Level } from '../types';
import { RandomGenerator } from '../rng';
import { getDemandWeight } from './demand';

export function generateSchedule(rng: RandomGenerator, instructors: Instructor[]): Group[] {
  const groups: Group[] = [];
  const TOTAL_GROUPS = 170;
  const PRIN_TARGET = 110;
  const INF_TARGET = 60;

  const slots: { pool: Pool; day: number; hour: number; weight: number }[] = [];

  // Generate all possible slots
  for (const pool of ['principal', 'infantil'] as const) {
    for (let day = 1; day <= 6; day++) {
      const startH = day === 6 ? 8 : 7;
      const endH = day === 6 ? 13 : 19;
      for (let hour = startH; hour <= endH; hour++) {
        slots.push({
          pool,
          day,
          hour,
          weight: getDemandWeight(day, hour, pool),
        });
      }
    }
  }

  let principalAssigned = 0;
  let infantilAssigned = 0;

  // We assign slots using a greedy approach weighted by demand
  const selectedSlots: { pool: Pool; day: number; hour: number }[] = [];
  const capacityPerSlot = new Map<string, number>();

  while (principalAssigned + infantilAssigned < TOTAL_GROUPS) {
    // Pick a random slot weighted by demand
    const poolTarget =
      principalAssigned < PRIN_TARGET
        ? 'principal'
        : infantilAssigned < INF_TARGET
          ? 'infantil'
          : null;
    if (!poolTarget) break; // Should not happen if totals align

    let validSlots = slots;
    if (principalAssigned >= PRIN_TARGET) validSlots = slots.filter((s) => s.pool === 'infantil');
    else if (infantilAssigned >= INF_TARGET)
      validSlots = slots.filter((s) => s.pool === 'principal');

    const slot = rng.weightedChoice(
      validSlots,
      validSlots.map((s) => s.weight),
    );
    const key = `${slot.pool}-${slot.day}-${slot.hour}`;
    const count = capacityPerSlot.get(key) || 0;

    // Check constraints: Principal max 3, Infantil max 3
    if (slot.pool === 'principal' && count >= 3) {
      // Reduce weight to avoid picking it forever
      slot.weight *= 0.1;
      continue;
    }
    if (slot.pool === 'infantil' && count >= 3) {
      slot.weight *= 0.1;
      continue;
    }

    // Accept slot
    capacityPerSlot.set(key, count + 1);
    selectedSlots.push(slot);
    if (slot.pool === 'principal') principalAssigned++;
    else infantilAssigned++;
  }

  // Now assign instructors
  // We want to ensure Mariana and Ricardo get medium-high load (approx 24-28), others 18-30.
  const instructorLoad = new Map<string, number>();
  instructors.forEach((i) => instructorLoad.set(i.id, 0));

  // Pre-sort slots to assign systematically (e.g. by hour)
  selectedSlots.sort((a, b) => a.day - b.day || a.hour - b.hour);

  let gId = 1;
  for (const slot of selectedSlots) {
    // Determine level
    let level: Level;
    if (slot.pool === 'infantil') {
      level = rng.choice(['L1_Adaptacion', 'L2_Flotacion', 'L3_Respiracion'] as Level[]);
    } else {
      level = rng.choice([
        'L4_Libre',
        'L5_Dorso',
        'L6_PechoMariposa',
        'L7_Perfeccionamiento',
      ] as Level[]);
    }

    // Find available instructors
    const available = instructors.filter((ins) => {
      // Check shift (simple check for now, all are mostly available)
      const shift = ins.shifts.find((s) => s.day === slot.day);
      if (!shift || slot.hour < shift.start || slot.hour > shift.end) return false;

      // Check double booking
      const timeStr = `${slot.hour.toString().padStart(2, '0')}:00`;
      const doubleBooked = groups.some(
        (g) => g.dayOfWeek === slot.day && g.timeSlot === timeStr && g.instructorId === ins.id,
      );
      if (doubleBooked) return false;

      return true;
    });

    if (available.length === 0) {
      // Fallback: pick any instructor not double booked, ignoring shift just to fill
      const timeStr = `${slot.hour.toString().padStart(2, '0')}:00`;
      const available2 = instructors.filter(
        (ins) =>
          !groups.some(
            (g) => g.dayOfWeek === slot.day && g.timeSlot === timeStr && g.instructorId === ins.id,
          ),
      );
      if (available2.length === 0) throw new Error('Impossible schedule');
      available.push(rng.choice(available2));
    }

    // Weight selection by inverted load to balance, but favor Mariana/Ricardo slightly to reach 24+
    const weights = available.map((ins) => {
      const load = instructorLoad.get(ins.id) || 0;
      let w = Math.max(1, 30 - load);
      if ((ins.name === 'Mariana' || ins.name === 'Ricardo') && load < 25) w *= 2;
      return w;
    });

    const chosen = rng.weightedChoice(available, weights);
    instructorLoad.set(chosen.id, (instructorLoad.get(chosen.id) || 0) + 1);

    groups.push({
      id: `grp_${gId.toString().padStart(3, '0')}`,
      pool: slot.pool,
      level,
      instructorId: chosen.id,
      dayOfWeek: slot.day,
      timeSlot: `${slot.hour.toString().padStart(2, '0')}:00`,
      capacity: slot.pool === 'principal' ? 10 : 8,
    });
    gId++;
  }

  return groups;
}
