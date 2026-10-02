export type Pool = 'principal' | 'infantil';
export type Level = 'L1_Adaptacion' | 'L2_Flotacion' | 'L3_Respiracion' | 'L4_Libre' | 'L5_Dorso' | 'L6_PechoMariposa' | 'L7_Perfeccionamiento';
export type Plan = '1/semana' | '2/semana' | '3/semana';
export interface LevelObj {
  id: Level;
  name: string;
  description: string;
  typicalEntryAge: number;
  medianMonths: number;
}
export type ProspectStage = 'nuevo' | 'contactado' | 'visita_agendada' | 'clase_muestra' | 'inscrito' | 'perdido';
export type LostReason = 'precio' | 'horario' | 'distancia' | 'otra_escuela' | 'sin_respuesta';
export type ChurnReason = 'precio' | 'horario' | 'mudanza' | 'cambio_interes' | 'no_avanza' | 'otra_escuela' | 'salud' | 'sin_motivo';

export interface Instructor {
  id: string;
  name: string;
  hireDate: string;
  active: boolean;
  score: number;
  costPerHour: number;
  shifts: { day: number, start: number, end: number }[]; // 1=Mon, 7=Sun. start/end in hours
  retentionEffect: number; // Hidden param
  pedagogicalGoodness: number; // Hidden param
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
  tutorName: string;
  phone: string;
  email: string;
  registrationDate: string;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta' | 'en_linea';
}

export interface Student {
  id: string;
  familyId: string;
  name: string;
  birthDate: string;
  enrollmentDate: string;
  plan: Plan;
  level: Level;
  source: string;
  status: 'pendiente_de_ciclo_de_vida' | 'active' | 'churned';
  assignedGroups: string[]; // Group IDs
  churnDate?: string;
  churnReason?: ChurnReason;
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
  channel: 'mensajeria' | 'telefono' | 'presencial' | 'formulario_web';
  childAge: number;
  stage: ProspectStage;
  lostReason?: LostReason;
  lastInteractionDate: string;
  enrolledStudentId?: string;
  requestedSchedule?: string; // e.g. "6-10:00" for Sat 10am
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  requestedSchedule: string;
  priority: number;
  dateAdded: string;
  status: 'waiting' | 'enrolled' | 'abandoned';
}

export interface WebMonthly {
  month: string;
  visits: number;
  bounceRate: number;
  conversionRate: number;
  sources: { organic: number; direct: number; social: number; referral: number; paid: number };
}

export interface KeywordSeries {
  keyword: string;
  monthlyStats: { month: string; position: number; impressions: number; clicks: number }[];
}

export interface PagePerformance {
  path: string;
  views: number;
  avgTimeSeconds: number;
}

export interface MessageThread {
  id: string;
  prospectId: string;
  date: string;
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  handledByBot: boolean;
  firstResponseMin: number;
  result: 'clase_muestra' | 'visita' | 'pierde_precio' | 'pierde_horario' | 'abierto';
  messages: { sender: 'user' | 'agent' | 'human', text: string, timestamp: string }[];
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
