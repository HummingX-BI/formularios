export const DEMO_CONFIG = {
  dates: {
    startDate: '2024-10-01',
    cutoffDate: '2026-09-30',
    holidays: ['2024-12-25', '2025-01-01', '2025-05-01', '2025-09-16', '2025-11-20', '2025-12-25', '2026-01-01', '2026-02-02', '2026-03-16', '2026-05-01', '2026-09-16'],
  },
  volumes: {
    baseStudents: 180,
    newEnrollments: 920,
    totalChurn: 480,
    activeAtCutoff: 620,
    totalProspects: 3200,
    activeFamiliesApprox: 410,
    familyShareThreePlusKids: 0.08,
    instructors: 8,
    scheduledGroups: 170,
  },
  plans: {
    freq1: { price: 1350, share: 0.20 },
    freq2: { price: 2100, share: 0.60 },
    freq3: { price: 2750, share: 0.20 },
    annualEnrollmentFee: 1200,
    quarterlyDiscount: 0.08,
    dueDay: 5,
    lateFee: 150, // placeholder
  },
  pools: {
    principal: { lanes: 6, groupLanes: 2, capacity: 10 },
    infantil: { lanes: 3, groupLanes: 1, capacity: 8 },
  },
  schedule: {
    weekdaySlots: 13, // 7:00 to 19:00
    saturdaySlots: 6, // 8:00 to 13:00
    durationMinutes: 45,
  },
  costs: {
    instructorPerHour: 180,
    operationalPerLaneHour: 220,
    monthlyRevenueGoal: 1350000,
  },
  healthIndex: {
    weights: {
      financial: 25,
      commercial: 20,
      operational: 25,
      retention: 15,
      pedagogical: 15
    },
    goals: {
      financial: 100,
      commercial: 100,
      operational: 100,
      retention: 100,
      pedagogical: 100
    }
  },
  thresholds: {
    riskLow: 0.15,
    riskHigh: 0.35,
    saturation: 0.90,
    underutilization: 0.60,
  },
  prospects: {
    sources: {
      meta: { share: 0.45, conversion: 0.12 },
      google: { share: 0.20, conversion: 0.25 },
      referral: { share: 0.15, conversion: 0.45 },
      organic: { share: 0.20, conversion: 0.18 },
    },
    lostReasons: ['precio', 'horario', 'distancia', 'otra_escuela', 'sin_respuesta'] as const,
  },
  goals: {
    averageAttendance: 0.87,
  },
  paymentMethods: {
    cash: 0.38,
    transfer: 0.30,
    card: 0.20,
    online: 0.12,
  }
};
