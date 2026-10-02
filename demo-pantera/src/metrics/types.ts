import type { Dataset } from '../data/types';

export interface DateRange {
  start: string;
  end: string;
}

export type PoolFilter = 'todas' | 'principal' | 'infantil';

export interface MetricsContext {
  dataset: Dataset;
  period: DateRange;
  pool: PoolFilter;
}

export interface MetricMetadata {
  id: string;
  name: string;
  shortDefinition: string;
  formula: string;
  unit: 'count' | 'currency' | 'percentage' | 'months' | 'index' | 'ratio';
  directionGood: 'up' | 'down' | 'neutral';
  code: string;
}

export interface MetricResult<T> {
  value: T;
  usesFullHistory?: boolean;
}

export interface PreviousVariation<T> {
  current: T;
  previous: T;
  absolute: number;
  relative: number;
}
