export interface ChurnObservation {
  studentId: string;
  monthStart: string; // ISO yyyy-mm-01
  consecutiveAbsences: number;
  attendance30d: number;
  attendance60d: number;
  firstMonthClasses: number;
  isLevel3: number; // 0 or 1
  age: number;
  ageSquared: number;
  avgPaymentDelay: number;
  tenureMonths: number;
  sessionsPerWeek: number;
  siblings: number;
  // Label
  churnedIn60d: number; // 0 or 1
}

export function buildChurnDataset(dataset: any): ChurnObservation[] {
  // Deterministic deterministic mock partitioning
  const observations: ChurnObservation[] = [];

  // We mock the generation for the UI since creating a real timeline for each student
  // requires a fully populated historical event log which might be sparse in the demo dataset.

  dataset.students.forEach((s: any) => {
    // Generate 1 to 3 observations per student depending on their status
    const obsCount = s.status === 'activo' ? 3 : 1;

    for (let i = 0; i < obsCount; i++) {
      const isLevel3 = s.level.includes('Tiburón') || s.level.includes('3') ? 1 : 0;
      const age = s.age || 6;
      const ageSquared = age * age;

      const prob =
        (s.status === 'baja' ? 0.8 : 0.1) + (isLevel3 ? 0.2 : 0) + (i === 0 ? 0.1 : -0.1);

      observations.push({
        studentId: s.id,
        monthStart:
          new Date(Date.now() - (i * 30 + 60) * 24 * 3600 * 1000).toISOString().slice(0, 7) + '-01',
        consecutiveAbsences: Math.floor(Math.random() * 4),
        attendance30d: 80 - Math.random() * 40,
        attendance60d: 85 - Math.random() * 30,
        firstMonthClasses: Math.floor(Math.random() * 8) + 4,
        isLevel3,
        age,
        ageSquared,
        avgPaymentDelay: Math.floor(Math.random() * 10),
        tenureMonths: Math.floor(Math.random() * 24) + 3,
        sessionsPerWeek: s.plan === 'intensivo' ? 2 : 1,
        siblings: s.siblingIds?.length || 0,
        churnedIn60d: Math.random() < prob ? 1 : 0,
      });
    }
  });

  return observations;
}
