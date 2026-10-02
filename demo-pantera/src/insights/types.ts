export interface InsightEvidence {
  metricId: string;
  label: string;
  value: number;
  formatted: string;
}

export interface InsightAction {
  text: string;
  actionType: 'task' | 'navigate';
  targetModule?: string;
}

export interface Insight {
  id: string;
  moduleId: string;
  severity: 'info' | 'positivo' | 'atencion' | 'alerta';
  headline: string;
  summary: string;
  bullets: string[];
  action?: InsightAction;
  evidence: InsightEvidence[];
}

export interface ChartExplanation {
  chartId: string;
  whatItShows: string;
  whatItMeans: string;
  whatToDo: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'info' | 'atencion' | 'alerta' | 'critico';
  title: string;
  message: string;
  moduleId: string;
  createdAt: string;
  evidence: Record<string, any>;
  dismissible: boolean;
}

export interface RecommendationImpact {
  metric: string;
  estimate: number;
  low: number;
  high: number;
  unit: string;
}

export interface Recommendation {
  id: string;
  title: string;
  rationale: string;
  evidence: string[];
  impact: RecommendationImpact;
  effort: 'bajo' | 'medio' | 'alto';
  sourceModule: string;
  category: string;
  status: 'pending' | 'accepted' | 'postponed' | 'dismissed';
}
