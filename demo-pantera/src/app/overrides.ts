// src/app/overrides.ts
import { BUSINESS_CONFIG } from '../config';
type ConfigType = typeof BUSINESS_CONFIG;

export interface ConfigOverrides {
  prices?: Record<string, number>;
  revenueTarget?: number;
  costD19?: number;
  saturationThreshold?: number;
  riskThreshold?: number;
  priceElasticity?: number;
  waitlistConversion?: number;
  agentManagementMinutes?: number;
}

export function applyOverrides(baseConfig: any, overrides: ConfigOverrides): any {
  const config = { ...baseConfig };
  
  if (overrides.revenueTarget !== undefined) {
    config.targets = { ...config.targets, monthlyRevenue: overrides.revenueTarget };
  }
  if (overrides.costD19 !== undefined) {
    config.costs = { ...config.costs, d19_per_kg: overrides.costD19 };
  }
  if (overrides.saturationThreshold !== undefined) {
    config.thresholds = { ...config.thresholds, occupancySaturation: overrides.saturationThreshold };
  }
  if (overrides.riskThreshold !== undefined) {
    config.thresholds = { ...config.thresholds, churnRisk: overrides.riskThreshold };
  }
  return config;
}

export function getEffectivePrice(
  planId: string,
  overrides: ConfigOverrides,
  baseConfig: ConfigType,
): number {
  if (overrides.prices && overrides.prices[planId] !== undefined) {
    return overrides.prices[planId];
  }
  const plan = baseConfig.plans.find((p: any) => p.id === planId);
  return plan ? plan.monthlyPrice : 0;
}
