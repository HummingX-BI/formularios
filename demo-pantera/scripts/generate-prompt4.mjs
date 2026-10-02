import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

fs.mkdirSync(path.join(srcDir, 'config'), { recursive: true });
fs.mkdirSync(path.join(srcDir, 'data'), { recursive: true });
fs.mkdirSync(path.join(srcDir, 'tests', 'data'), { recursive: true });

// -----------------------------------------
// 1. src/config/demoConfig.ts
// -----------------------------------------
const demoConfigContent = `export const DEMO_CONFIG = {
  dates: {
    startDate: '2024-10-01',
    cutoffDate: '2026-09-30',
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
`;
fs.writeFileSync(path.join(srcDir, 'config', 'demoConfig.ts'), demoConfigContent);

// -----------------------------------------
// 2. src/config/stories.ts
// -----------------------------------------
const storiesContent = `export const STORIES = {
  H1: { id: 'H1', description: 'Distribución de edades y niveles', params: {  }, tolerances: {} },
  H2: { id: 'H2', description: 'Cohortes y retención', params: { ret1m: 0.91, ret3m: 0.64, ret6m: 0.755 }, tolerances: {} },
  H3: { id: 'H3', description: 'Demografía (3+ niños)', params: { share: 0.08 }, tolerances: {} },
  H4: { id: 'H4', description: 'Embudo de ventas', params: {}, tolerances: {} },
  H5: { id: 'H5', description: 'Evaluación de instructores', params: { topScore: 0.82, bottomScore: 0.71 }, tolerances: {} },
  H6: { id: 'H6', description: 'Caídas de asistencia', params: {}, tolerances: {} },
  H7: { id: 'H7', description: 'Modelo de riesgo de baja', params: { baseRisk: 0.06, threeAbsencesRisk: 0.30, prevalence: 0.12, sensitivity: 0.60 }, tolerances: {} },
  H8: { id: 'H8', description: 'Sobrevivencia', params: {}, tolerances: {} },
  H9: { id: 'H9', description: 'Rentabilidad de horarios', params: {}, tolerances: {} },
  H10: { id: 'H10', description: 'Estacionalidad de inscripciones', params: {}, tolerances: {} },
  H11: { id: 'H11', description: 'Correlaciones', params: {}, tolerances: {} },
  H12: { id: 'H12', description: 'Simulación Monte Carlo', params: {}, tolerances: {} },
  H13: { id: 'H13', description: 'Recomendaciones y Prescriptivo', params: {}, tolerances: {} },
  H14: { id: 'H14', description: 'Asistente IA Analítico', params: {}, tolerances: {} },
};
`;
fs.writeFileSync(path.join(srcDir, 'config', 'stories.ts'), storiesContent);

// -----------------------------------------
// 3. src/data/rng.ts
// -----------------------------------------
const rngContent = `/**
 * Implementación de PRNG SFC32 para aleatoriedad reproducible.
 */

// Helper to hash string to 4 32-bit seeds (cyrb128)
function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

export class RandomGenerator {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  constructor(a: number, b: number, c: number, d: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    // warm up
    for(let i = 0; i < 15; i++) this.next();
  }

  // Returns float [0, 1)
  next(): number {
    this.a >>>= 0; this.b >>>= 0; this.c >>>= 0; this.d >>>= 0; 
    let t = (this.a + this.b) | 0;
    this.a = this.b ^ (this.b >>> 9);
    this.b = (this.c + (this.c << 3)) | 0;
    this.c = (this.c << 21) | (this.c >>> 11);
    this.d = (this.d + 1) | 0;
    t = (t + this.d) | 0;
    this.c = (this.c + t) | 0;
    return (t >>> 0) / 4294967296;
  }

  fork(label: string): RandomGenerator {
    const s = this.next().toString() + label;
    const [a, b, c, d] = cyrb128(s);
    return new RandomGenerator(a, b, c, d);
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  float(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  bool(p: number = 0.5): boolean {
    return this.next() < p;
  }

  normal(mu: number = 0, sigma: number = 1): number {
    // Box-Muller
    let u = 0, v = 0;
    while(u === 0) u = this.next();
    while(v === 0) v = this.next();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * sigma + mu;
  }

  logNormal(mu: number, sigma: number): number {
    return Math.exp(this.normal(mu, sigma));
  }

  exponential(rate: number): number {
    let u = 0;
    while(u === 0) u = this.next();
    return -Math.log(u) / rate;
  }

  gamma(k: number, theta: number): number {
    let sum = 0;
    for (let i = 0; i < k; i++) {
      let u = 0;
      while(u === 0) u = this.next();
      sum += -Math.log(u);
    }
    return sum * theta;
  }

  beta(a: number, b: number): number {
    const x = this.gamma(a, 1);
    const y = this.gamma(b, 1);
    return x / (x + y);
  }

  poisson(lambda: number): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= this.next();
    } while (p > L);
    return k - 1;
  }

  binomial(n: number, p: number): number {
    let k = 0;
    for (let i = 0; i < n; i++) {
      if (this.next() < p) k++;
    }
    return k;
  }

  choice<T>(items: T[]): T {
    return items[this.int(0, items.length - 1)] as T;
  }

  weightedChoice<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((acc, w) => acc + w, 0);
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= (weights[i] as number);
      if (r <= 0) return items[i] as T;
    }
    return items[items.length - 1] as T;
  }

  shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
    }
    return arr;
  }

  sample<T>(items: T[], k: number): T[] {
    return this.shuffle(items).slice(0, k);
  }
}

export function createRng(seed: number | string): RandomGenerator {
  const [a, b, c, d] = cyrb128(seed.toString());
  return new RandomGenerator(a, b, c, d);
}
`;
fs.writeFileSync(path.join(srcDir, 'data', 'rng.ts'), rngContent);

// -----------------------------------------
// 4. src/data/types.ts
// -----------------------------------------
const typesContent = `export type Pool = 'principal' | 'infantil';
export type Level = 'A' | 'B' | 'C' | 'D'; // placeholder, expand as needed
export type Plan = '1/semana' | '2/semana' | '3/semana';
export type ProspectStage = 'nuevo' | 'contactado' | 'visita_agendada' | 'clase_muestra' | 'inscrito' | 'perdido';
export type LostReason = 'precio' | 'horario' | 'distancia' | 'otra_escuela' | 'sin_respuesta';
export type ChurnReason = 'economico' | 'mudanza' | 'insatisfaccion' | 'salud' | 'competencia' | 'otro';

export interface Instructor {
  id: string;
  name: string;
  hireDate: string;
  active: boolean;
  score: number;
}

export interface Group {
  id: string;
  pool: Pool;
  level: Level;
  instructorId: string;
  dayOfWeek: number;
  timeSlot: string; // "HH:MM"
  capacity: number;
}

export interface Family {
  id: string;
  name: string;
  registrationDate: string;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta' | 'en_linea';
}

export interface Student {
  id: string;
  familyId: string;
  name: string;
  birthDate: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  groupId: string;
  plan: Plan;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'churned';
}

export interface LevelStint {
  studentId: string;
  level: Level;
  startDate: string;
  endDate: string | null;
  result: 'promovido' | 'baja' | 'en_curso';
}

export interface AttendanceRecord {
  studentId: string;
  groupId: string;
  date: string;
  status: 'asistio' | 'falta' | 'justificada' | 'reposicion' | 'cancelada_escuela';
}

export interface Charge {
  id: string;
  familyId: string;
  date: string;
  amount: number;
  concept: string;
  status: 'pagado' | 'pendiente' | 'vencido';
}

export interface Payment {
  id: string;
  chargeId: string;
  familyId: string;
  date: string;
  amount: number;
}

export interface Prospect {
  id: string;
  date: string;
  source: string;
  stage: ProspectStage;
  lostReason?: LostReason;
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  level: Level;
  dateAdded: string;
  status: 'waiting' | 'enrolled' | 'abandoned';
}

export interface WebMonthly {
  month: string;
  visits: number;
  bounceRate: number;
  conversionRate: number;
}

export interface KeywordSeries {
  keyword: string;
  monthlyVolume: number[];
}

export interface PagePerformance {
  path: string;
  views: number;
  avgTimeSeconds: number;
}

export interface MessageThread {
  id: string;
  date: string;
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface NotificationLog {
  id: string;
  date: string;
  type: string;
  familyId: string;
  status: 'sent' | 'opened' | 'clicked';
}

export interface Dataset {
  metadata: {
    seed: number;
    generatedAt: string;
  };
  instructors: Instructor[];
  groups: Group[];
  families: Family[];
  students: Student[];
  enrollments: Enrollment[];
  levelStints: LevelStint[];
  attendance: AttendanceRecord[];
  charges: Charge[];
  payments: Payment[];
  prospects: Prospect[];
  waitlist: WaitlistEntry[];
  web: WebMonthly[];
  keywords: KeywordSeries[];
  pages: PagePerformance[];
  messages: MessageThread[];
  notifications: NotificationLog[];
}
`;
fs.writeFileSync(path.join(srcDir, 'data', 'types.ts'), typesContent);

// -----------------------------------------
// 5. src/data/dates.ts
// -----------------------------------------
const datesContent = `export function toDays(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00Z');
  return Math.floor(d.getTime() / 86400000);
}

export function toDateStr(days: number): string {
  const d = new Date(days * 86400000);
  return d.toISOString().split('T')[0] as string;
}

export function daysBetween(startStr: string, endStr: string): number {
  return toDays(endStr) - toDays(startStr);
}

export function addDays(dateStr: string, days: number): string {
  return toDateStr(toDays(dateStr) + days);
}

export function startOfMonth(dateStr: string): string {
  return dateStr.substring(0, 8) + '01';
}

export function endOfMonth(dateStr: string): string {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(5, 7), 10);
  const d = new Date(Date.UTC(year, month, 0));
  return d.toISOString().split('T')[0] as string;
}

export function addMonths(dateStr: string, months: number): string {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(5, 7), 10) - 1;
  const d = new Date(Date.UTC(year, month + months, 1));
  
  const endMonth = new Date(Date.UTC(year, month + months + 1, 0)).getUTCDate();
  const originalDay = parseInt(dateStr.substring(8, 10), 10);
  d.setUTCDate(Math.min(originalDay, endMonth));
  
  return d.toISOString().split('T')[0] as string;
}

export function monthsBetween(startStr: string, endStr: string): number {
  const startY = parseInt(startStr.substring(0, 4), 10);
  const startM = parseInt(startStr.substring(5, 7), 10);
  const endY = parseInt(endStr.substring(0, 4), 10);
  const endM = parseInt(endStr.substring(5, 7), 10);
  return (endY - startY) * 12 + (endM - startM);
}

export function dayOfWeek(dateStr: string): number {
  // 1=Mon, 7=Sun
  const d = new Date(dateStr + 'T00:00:00Z');
  const day = d.getUTCDay();
  return day === 0 ? 7 : day;
}

export function isoWeek(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getMonthList(startStr: string, endStr: string): string[] {
  const list = [];
  let curr = startOfMonth(startStr);
  const end = startOfMonth(endStr);
  while (curr <= end) {
    list.push(curr.substring(0, 7));
    curr = addMonths(curr, 1);
  }
  return list;
}

export function isHoliday(dateStr: string): boolean {
  // Dec 24 to Jan 1
  const md = dateStr.substring(5, 10);
  if (md >= '12-24' || md === '01-01') return true;
  
  // Semana Santa approx (simplified)
  if (dateStr >= '2025-04-14' && dateStr <= '2025-04-20') return true;
  if (dateStr >= '2026-03-30' && dateStr <= '2026-04-05') return true;
  
  if (md === '05-01') return true;
  if (md === '09-16') return true;
  if (md === '11-02') return true;
  
  if (dateStr === '2024-11-20') return true;
  if (dateStr === '2025-11-20') return true;
  
  return false;
}
`;
fs.writeFileSync(path.join(srcDir, 'data', 'dates.ts'), datesContent);

// -----------------------------------------
// 6. src/data/format.ts
// -----------------------------------------
const formatContent = `export function formatCurrency(value: number, includeCents: boolean = false): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(d);
}

export function formatMonth(dateStr: string): string {
  const d = new Date(dateStr + '-01T00:00:00Z');
  return new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(d);
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function joinList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0] as string;
  const last = items.pop();
  return items.join(', ') + ' y ' + last;
}
`;
fs.writeFileSync(path.join(srcDir, 'data', 'format.ts'), formatContent);

// -----------------------------------------
// 7. Tests
// -----------------------------------------
const testRngContent = `import { describe, it, expect } from 'vitest';
import { createRng } from '@/data/rng';

describe('RNG', () => {
  it('same seed produces same sequence', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    expect(rng1.next()).toBeCloseTo(rng2.next(), 6);
    expect(rng1.next()).toBeCloseTo(rng2.next(), 6);
  });

  it('fork produces independent sequences', () => {
    const rng = createRng(42);
    const sub1 = rng.fork('A');
    const sub2 = rng.fork('B');
    expect(sub1.next()).not.toBe(sub2.next());
  });

  it('normal distribution has expected mean and variance', () => {
    const rng = createRng('test');
    let sum = 0;
    let sumSq = 0;
    const n = 100000;
    for (let i = 0; i < n; i++) {
      const v = rng.normal(10, 2);
      sum += v;
      sumSq += v * v;
    }
    const mean = sum / n;
    const varEst = (sumSq / n) - (mean * mean);
    expect(mean).toBeCloseTo(10, 1);
    expect(varEst).toBeCloseTo(4, 1);
  });
});
`;
fs.writeFileSync(path.join(srcDir, 'tests', 'data', 'rng.test.ts'), testRngContent);

const testDatesContent = `import { describe, it, expect } from 'vitest';
import { addDays, daysBetween, startOfMonth, endOfMonth, dayOfWeek, isHoliday } from '@/data/dates';

describe('Dates', () => {
  it('calculates days between', () => {
    expect(daysBetween('2026-09-01', '2026-09-30')).toBe(29);
  });

  it('adds days', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01');
  });

  it('leap year end of month', () => {
    expect(endOfMonth('2024-02-15')).toBe('2024-02-29');
    expect(endOfMonth('2025-02-15')).toBe('2025-02-28');
  });

  it('day of week (1=Mon, 7=Sun)', () => {
    // 2026-09-30 is Wednesday (3)
    expect(dayOfWeek('2026-09-30')).toBe(3);
  });

  it('identifies holidays', () => {
    expect(isHoliday('2024-12-25')).toBe(true);
    expect(isHoliday('2026-09-30')).toBe(false);
  });
});
`;
fs.writeFileSync(path.join(srcDir, 'tests', 'data', 'dates.test.ts'), testDatesContent);

const testFormatContent = `import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatDate, formatMonth, joinList } from '@/data/format';

describe('Format', () => {
  it('formats currency without cents', () => {
    const res = formatCurrency(1234.56).replace(/\\u00A0/g, ' '); // normalize non-breaking spaces
    expect(res).toContain('1,235'); // rounding
  });

  it('formats percentage', () => {
    const res = formatPercentage(0.1234).replace(/\\u00A0/g, ' ');
    expect(res).toContain('12.3');
  });

  it('formats date', () => {
    expect(formatDate('2026-09-30')).toContain('30 sep 2026');
  });

  it('formats month', () => {
    expect(formatMonth('2026-09')).toContain('sep 2026');
  });

  it('joins lists correctly', () => {
    expect(joinList(['A', 'B', 'C'])).toBe('A, B y C');
    expect(joinList(['A', 'B'])).toBe('A y B');
    expect(joinList(['A'])).toBe('A');
  });
});
`;
fs.writeFileSync(path.join(srcDir, 'tests', 'data', 'format.test.ts'), testFormatContent);

console.log('Prompt 4 generated successfully.');
