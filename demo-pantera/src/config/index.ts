/**
 * Business configuration for Club Azulejo Escuela de Natación.
 *
 * Every business constant, threshold, price, goal, and weighting lives here.
 * Nothing is hardcoded in the UI. All values are editable and drive
 * every calculation in the demo.
 */

// ─── Branding ────────────────────────────────────────────────
export const BRAND = {
  name: 'Club Azulejo',
  tagline: 'Escuela de Natación',
  consultantName: 'HummingX BI',
  folio: 'HXBI-2026-025',
} as const;

// ─── Data Generation ─────────────────────────────────────────
export const SEED = {
  /** Master seed for the PRNG — deterministic data for every session */
  master: 42,
  /** Number of months of historical data to generate */
  historyMonths: 24,
  /** Reference start date for generated data (ISO) */
  startDate: '2024-10-01',
} as const;

// ─── Facility ────────────────────────────────────────────────
export const FACILITY = {
  pools: 2,
  lanesPerPool: 6,
  maxStudentsPerLane: 8,
  operatingHoursStart: 6, // 6:00 AM
  operatingHoursEnd: 21, // 9:00 PM
  classDurationMinutes: 45,
  classesPerDay: 18, // slots per pool per day
} as const;

// ─── Pricing & Packages ─────────────────────────────────────
export interface PackageConfig {
  id: string;
  name: string;
  sessionsPerWeek: number;
  monthlyPrice: number;
  classDurationMin: number;
  enrollmentFee: number;
}

export const PACKAGES: readonly PackageConfig[] = [
  {
    id: 'acuabebes',
    name: 'Acuabebés',
    sessionsPerWeek: 2,
    monthlyPrice: 950,
    classDurationMin: 30,
    enrollmentFee: 500,
  },
  {
    id: 'iniciacion',
    name: 'Iniciación',
    sessionsPerWeek: 2,
    monthlyPrice: 1100,
    classDurationMin: 45,
    enrollmentFee: 500,
  },
  {
    id: 'intermedio',
    name: 'Intermedio',
    sessionsPerWeek: 3,
    monthlyPrice: 1350,
    classDurationMin: 45,
    enrollmentFee: 500,
  },
  {
    id: 'avanzado',
    name: 'Avanzado',
    sessionsPerWeek: 3,
    monthlyPrice: 1500,
    classDurationMin: 60,
    enrollmentFee: 500,
  },
  {
    id: 'equipo',
    name: 'Equipo Competitivo',
    sessionsPerWeek: 5,
    monthlyPrice: 2200,
    classDurationMin: 90,
    enrollmentFee: 800,
  },
  {
    id: 'adultos',
    name: 'Adultos',
    sessionsPerWeek: 3,
    monthlyPrice: 1400,
    classDurationMin: 50,
    enrollmentFee: 400,
  },
] as const;

// ─── Swim Levels ─────────────────────────────────────────────
export interface LevelConfig {
  id: string;
  name: string;
  ageRange: string;
  order: number;
}

export const LEVELS: readonly LevelConfig[] = [
  { id: 'acuabebes', name: 'Acuabebés', ageRange: '6 meses – 2 años', order: 1 },
  { id: 'nivel1', name: 'Iniciación', ageRange: '3 – 5 años', order: 2 },
  { id: 'nivel2', name: 'Básico', ageRange: '4 – 7 años', order: 3 },
  { id: 'nivel3', name: 'Intermedio', ageRange: '6 – 10 años', order: 4 },
  { id: 'nivel4', name: 'Avanzado', ageRange: '8 – 14 años', order: 5 },
  { id: 'nivel5', name: 'Competitivo', ageRange: '10+ años', order: 6 },
  { id: 'adultos', name: 'Adultos', ageRange: '16+ años', order: 7 },
] as const;

// ─── Financial Goals & Thresholds ────────────────────────────
export const GOALS = {
  /** Monthly revenue target in MXN */
  monthlyRevenueTarget: 280_000,
  /** Target gross margin (as fraction) */
  grossMarginTarget: 0.65,
  /** Monthly new enrollments target */
  monthlyEnrollmentTarget: 35,
  /** Target retention rate (fraction) */
  retentionRateTarget: 0.88,
  /** Target NPS (0–100 scale) */
  npsTarget: 72,
  /** Acceptable churn rate ceiling (monthly, fraction) */
  churnCeiling: 0.08,
  /** Target pool utilization (fraction of capacity) */
  utilizationTarget: 0.75,
  /** Target prospect-to-enrollment conversion rate */
  conversionRateTarget: 0.35,
  /** Late payment threshold (days after due date) */
  latePaymentDays: 10,
  /** Late fee surcharge fraction */
  lateFeeRate: 0.10,
  /** Payment due day of month */
  paymentDueDay: 5,
} as const;

// ─── Cost Structure ──────────────────────────────────────────
export const COSTS = {
  /** Average monthly instructor salary */
  instructorSalary: 12_000,
  /** Monthly facility fixed costs (rent, utilities, maintenance) */
  facilityCosts: 45_000,
  /** Marketing budget per month */
  marketingBudget: 15_000,
  /** Cost of chemicals/water per month */
  poolMaintenanceCost: 8_000,
  /** Insurance per month */
  insuranceCost: 4_500,
  /** Admin & misc per month */
  adminCosts: 10_000,
  /** Number of instructors on payroll */
  instructorCount: 8,
} as const;

// ─── Scoring Weights (Historias H1–H14) ─────────────────────
export const SCORING = {
  /** Health score component weights (must sum to 1.0) */
  healthScore: {
    retention: 0.25,
    revenue: 0.20,
    utilization: 0.15,
    nps: 0.15,
    enrollment: 0.10,
    churn: 0.10,
    conversion: 0.05,
  },
  /** Churn risk model weights */
  churnRisk: {
    attendanceWeight: 0.30,
    paymentWeight: 0.25,
    tenureWeight: 0.15,
    levelProgressWeight: 0.15,
    ageGroupWeight: 0.10,
    seasonalityWeight: 0.05,
  },
  /** Instructor performance weights */
  instructorScore: {
    retentionRate: 0.30,
    studentProgress: 0.25,
    attendance: 0.20,
    parentSatisfaction: 0.15,
    punctuality: 0.10,
  },
} as const;

// ─── Seasonal Patterns ──────────────────────────────────────
/** Monthly enrollment multiplier (Jan=0, Dec=11). Models swim school seasonality. */
export const SEASONAL_MULTIPLIERS: readonly number[] = [
  0.85, // Enero — post-holidays dip
  0.90, // Febrero
  1.00, // Marzo
  1.10, // Abril — spring break bump
  1.05, // Mayo
  1.20, // Junio — summer start, peak
  1.30, // Julio — peak
  1.25, // Agosto — still high
  1.15, // Septiembre — back to school
  1.00, // Octubre
  0.90, // Noviembre
  0.80, // Diciembre — holiday dip
] as const;

// ─── Prospect / Funnel ──────────────────────────────────────
export const FUNNEL = {
  /** Average monthly inbound prospects */
  monthlyProspects: 95,
  /** Channels and their share of prospects */
  channels: {
    whatsapp: 0.40,
    walkIn: 0.25,
    website: 0.20,
    referral: 0.10,
    socialMedia: 0.05,
  },
  /** Days before a prospect is considered "lost" */
  prospectLostDays: 15,
  /** Follow-up attempts before giving up */
  maxFollowUps: 3,
} as const;

// ─── Alert Thresholds ────────────────────────────────────────
export const ALERTS = {
  /** Revenue drop that triggers a warning (fraction below target) */
  revenueDrop: 0.10,
  /** Enrollment drop that triggers a warning */
  enrollmentDrop: 0.15,
  /** Churn spike that triggers an alert */
  churnSpike: 0.12,
  /** Utilization below this fraction triggers low-usage alert */
  lowUtilization: 0.50,
  /** Number of consecutive late payments before escalation */
  consecutiveLatePayments: 2,
} as const;
