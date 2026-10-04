import type { Student, Family, Prospect, Group, WaitlistEntry, Level, Plan } from '../types';
import type { RandomGenerator } from '../rng';
import { addDays } from '../dates';
import { DEMO_CONFIG } from '../../config/demoConfig';

export function generateStudents(
  rng: RandomGenerator,
  prospects: Prospect[],
): { families: Family[]; students: Student[]; waitlist: WaitlistEntry[] } {
  const enrolledProspects = prospects.filter((p) => p.enrolledStudentId);
  const NEW_STUDENTS = 920;
  const BASE_STUDENTS = 180;
  const TOTAL_STUDENTS = NEW_STUDENTS + BASE_STUDENTS;

  // 1. Determine family sizes
  // Target F ~ 733. 58% 1, 34% 2, 8% 3
  const familySizes: number[] = [];
  let kidsCount = 0;
  while (kidsCount < TOTAL_STUDENTS) {
    const r = rng.next();
    let size = 1;
    if (r < 0.08) size = 3;
    else if (r < 0.42) size = 2; // 0.08 + 0.34 = 0.42

    if (kidsCount + size > TOTAL_STUDENTS) {
      size = TOTAL_STUDENTS - kidsCount;
    }
    familySizes.push(size);
    kidsCount += size;
  }

  // 2. Generate Families
  const families: Family[] = [];
  const paymentMethods = ['efectivo', 'transferencia', 'tarjeta', 'en_linea'] as const;
  const paymentWeights = [20, 30, 38, 12];

  for (let i = 0; i < familySizes.length; i++) {
    families.push({
      id: `fam_${(i + 1).toString().padStart(4, '0')}`,
      name: `Familia ${rng.choice(['Pérez', 'Gómez', 'López', 'Hernández', 'Martínez', 'García', 'Rodríguez', 'Ruiz'])}`,
      tutorName: rng.choice(['Carlos', 'María', 'José', 'Ana', 'Jorge', 'Laura', 'Luis', 'Carmen']),
      phone: `55${rng.int(10000000, 99999999)}`,
      email: `tutor${i + 1}@example.com`,
      registrationDate: '', // will be set based on oldest child
      paymentMethod: rng.weightedChoice([...paymentMethods], paymentWeights),
    });
  }

  // 3. Create Students
  const students: Student[] = [];

  // Sort them randomly before grouping into families so siblings can be a mix,
  // but usually they enroll together. We will just process them sequentially.
  // Actually, wait, base students enrolled before Oct 2024. New students enrolled after.
  // It's easier to just create all student objects first, then assign them to families.

  let sId = 1;
  const allStudentInputs: {
    id: string;
    source: string;
    enrollDate: string;
    birthDate: string;
    age: number;
  }[] = [];

  // Base
  for (let i = 0; i < BASE_STUDENTS; i++) {
    const enrollDaysAgo = rng.int(1, 18 * 30); // up to 18 months before start
    const enrollDate = addDays(DEMO_CONFIG.dates.startDate, -enrollDaysAgo);
    let age = rng.int(4, 10);
    if (rng.bool(0.15)) age = rng.int(1, 3);
    if (rng.bool(0.1)) age = rng.int(11, 15);

    const birthDate = addDays(enrollDate, -Math.floor(age * 365.25 + rng.int(0, 364)));

    allStudentInputs.push({
      id: `stu_base_${sId++}`,
      source: rng.choice(['Referidos', 'Visita directa', 'Google', 'Instagram', 'Volante local']),
      enrollDate,
      birthDate,
      age,
    });
  }

  // New
  for (const p of enrolledProspects) {
    const birthDate = addDays(p.date, -Math.floor(p.childAge * 365.25 + rng.int(0, 364)));
    allStudentInputs.push({
      id: p.enrolledStudentId as string,
      source: p.source,
      enrollDate: p.lastInteractionDate,
      birthDate,
      age: p.childAge,
    });
  }

  // Sort by enroll date so siblings are somewhat naturally grouped chronologically if we just pop them
  allStudentInputs.sort(
    (a, b) => new Date(a.enrollDate).getTime() - new Date(b.enrollDate).getTime(),
  );

  let studentInputIndex = 0;

  for (const fam of families) {
    const size = familySizes[parseInt(fam.id.split('_')[1] as string) - 1] as number;
    const children = allStudentInputs.slice(studentInputIndex, studentInputIndex + size);
    studentInputIndex += size;

    // Family registration date = earliest child's enrollment date
    fam.registrationDate = children.reduce(
      (min, c) => (c.enrollDate < min ? c.enrollDate : min),
      children[0]?.enrollDate || '',
    );

    for (const child of children) {
      // Determine level based on age roughly
      let level: Level = 'L1_Adaptacion';
      if (child.age >= 6) level = rng.choice(['L3_Respiracion', 'L4_Libre']);
      if (child.age >= 9)
        level = rng.choice(['L5_Dorso', 'L6_PechoMariposa', 'L7_Perfeccionamiento']);
      if (child.age < 4) level = rng.choice(['L1_Adaptacion', 'L2_Flotacion']);

      const plan = rng.weightedChoice(['1/semana', '2/semana', '3/semana'] as Plan[], [20, 60, 20]);

      students.push({
        id: child.id,
        familyId: fam.id,
        name: `Alumno ${child.id.split('_').pop()}`,
        birthDate: child.birthDate,
        enrollmentDate: child.enrollDate,
        plan,
        level,
        source: child.source,
        status: 'pendiente_de_ciclo_de_vida',
        assignedGroups: [], // To be filled by simulation
      });
    }
  }

  // Waitlist (25 to 45) concentrated on Saturday 10:00 to 12:00
  const waitlist: WaitlistEntry[] = [];
  const waitlistCount = rng.int(25, 45);
  // Pick some active students randomly to be on the waitlist for a better schedule
  const wlStudents = rng.sample(students, waitlistCount);

  let wId = 1;
  for (const stu of wlStudents) {
    let req = '';
    if (rng.bool(0.7)) {
      req = `6-${rng.choice([10, 11, 12])}:00`; // Sat 10-12
    } else {
      req = `${rng.int(1, 5)}-${rng.int(16, 18)}:00`; // Weekday 4-6pm
    }

    waitlist.push({
      id: `wl_${wId.toString().padStart(3, '0')}`,
      studentId: stu.id,
      requestedSchedule: req,
      priority: rng.int(1, 3),
      dateAdded: addDays(DEMO_CONFIG.dates.cutoffDate, -rng.int(1, 60)), // added recently
      status: 'waiting',
    });
    wId++;
  }

  return { families, students, waitlist };
}

// Function to assign groups (to be used historically in Prompt 7)
export function assignGroupsToStudent(
  student: Student,
  groups: Group[],
  rng: RandomGenerator,
  currentOccupancy: Record<string, number>,
): string[] {
  // Finds available groups that match student level and respect current occupancy
  const sessions = parseInt(student.plan.split('/')[0] as string);
  const assigned: string[] = [];

  // Match level and capacity
  const validGroups = groups.filter(
    (g) => g.level === student.level && (currentOccupancy[g.id] || 0) < g.capacity,
  );

  // Pick distinct days
  const daysUsed = new Set<number>();
  for (let i = 0; i < sessions; i++) {
    const candidates = validGroups.filter(
      (g) => !daysUsed.has(g.dayOfWeek) && !assigned.includes(g.id),
    );
    if (candidates.length > 0) {
      const g = rng.choice(candidates);
      assigned.push(g.id);
      daysUsed.add(g.dayOfWeek);
      currentOccupancy[g.id] = (currentOccupancy[g.id] || 0) + 1;
    }
  }

  return assigned;
}
