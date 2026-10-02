export interface ScenarioConfig {
  months: number;
  baseProspects: number[];
  baseConversion: number;
  baseChurn: number;
  baseActive: number;
  totalCapacity: number;
  basePrice: number;
  instructorCostPerHour: number;
  laneCostPerHour: number;
  avgSessionsPerStudent: number;
  hoursPerMonth: number;
  lanes: number;
}

export interface ScenarioParams {
  priceVariationPct: number; // -1 to 1 (e.g. 0.1 for +10%)
  siblingDiscountPct: number; // 0 to 0.20
  groupsAddedOrRemoved: number; // e.g. +5 or -2 (in terms of capacity, say each group adds 15 capacity, but prompt says "grupos a agregar o quitar (franja)". Let's say each group adds 5 capacity)
  retentionImprovementPct: number; // 0 to 0.30
  seasonalityEnabled: boolean;
  convElasticityMin: number;
  convElasticityExpected: number;
  convElasticityMax: number;
  churnElasticityMin: number;
  churnElasticityExpected: number;
  churnElasticityMax: number;
}

export interface MonthResult {
  month: number;
  prospects: number;
  conversion: number;
  enrollments: number;
  churnRate: number;
  churned: number;
  active: number;
  revenue: number;
  profit: number;
  occupancy: number;
  capacity: number;
  limitedByCapacity: boolean;
}

export interface ScenarioResult {
  expected: MonthResult[];
  optimistic: MonthResult[]; // uses min elasticities (less churn, less conv drop)
  conservative: MonthResult[]; // uses max elasticities (more churn, more conv drop)
}

/**
 * Calculates a single trajectory for the scenario model.
 */
function calculateTrajectory(
  config: ScenarioConfig,
  params: ScenarioParams,
  convElasticity: number,
  churnElasticity: number
): MonthResult[] {
  const results: MonthResult[] = [];
  let currentActive = config.baseActive;

  // For this model, sibling discount affects 20% of families.
  // The effect on conversion: +0.2 * discountPct
  // The effect on churn: -0.2 * discountPct
  const siblingEffectConv = 0.2 * params.siblingDiscountPct;
  const siblingEffectChurn = 0.2 * params.siblingDiscountPct;

  const newPrice = config.basePrice * (1 + params.priceVariationPct);
  // Each group is assumed to be 5 spots. So capacity changes by groups * 5.
  const capacity = config.totalCapacity + (params.groupsAddedOrRemoved * 5);
  
  // Cost: base cost + extra cost for added groups.
  // Each group adds 4 hours a month of instructor time.
  const baseCost = config.hoursPerMonth * config.lanes * config.laneCostPerHour + config.hoursPerMonth * config.lanes * config.instructorCostPerHour;
  const extraCost = params.groupsAddedOrRemoved * 4 * config.instructorCostPerHour; 
  const totalCost = baseCost + extraCost;

  for (let t = 0; t < config.months; t++) {
    // 1. Prospects
    let prospects = config.baseProspects[t] || config.baseProspects[0]!;
    if (!params.seasonalityEnabled) {
      prospects = config.baseProspects.reduce((a, b) => a + b, 0) / config.baseProspects.length;
    }

    // 2. Conversion
    // Conversion(t) = base_conversion * (1 + conv_elasticity * price_variation + sibling_discount_effect)
    let conversion = config.baseConversion * (1 + convElasticity * params.priceVariationPct + siblingEffectConv);
    conversion = Math.max(0, Math.min(1, conversion));

    // 3. Enrollments
    let intendedEnrollments = prospects * conversion;
    const freeSpots = Math.max(0, capacity - currentActive);
    
    let enrollments = intendedEnrollments;
    let limitedByCapacity = false;
    
    // Ocupación limit = capacity
    if (enrollments > freeSpots) {
      enrollments = freeSpots;
      limitedByCapacity = true;
    }

    // 4. Churn
    // Churn(t) = base_churn * (1 + churn_elasticity * price_variation) * (1 - retention_improvement) * (1 - sibling_effect)
    let churnRate = config.baseChurn * (1 + churnElasticity * params.priceVariationPct) * (1 - params.retentionImprovementPct) * (1 - siblingEffectChurn);
    churnRate = Math.max(0, Math.min(1, churnRate));

    const churned = currentActive * churnRate;

    // 5. Active
    currentActive = currentActive + enrollments - churned;

    // 6. Revenue
    // Revenue = Active * newPrice - (Active * 0.2 * newPrice * discountPct)
    const revenue = currentActive * newPrice * (1 - 0.2 * params.siblingDiscountPct);

    // 7. Profit
    const profit = revenue - totalCost;

    // 8. Occupancy
    const occupancy = Math.min(1, currentActive / capacity);

    results.push({
      month: t + 1,
      prospects,
      conversion,
      enrollments,
      churnRate,
      churned,
      active: currentActive,
      revenue,
      profit,
      occupancy,
      capacity,
      limitedByCapacity
    });
  }

  return results;
}

/**
 * Runs the scenario model returning Expected, Optimistic and Conservative bounds.
 */
export function runScenarioModel(config: ScenarioConfig, params: ScenarioParams): ScenarioResult {
  // Expected
  const expected = calculateTrajectory(config, params, params.convElasticityExpected, params.churnElasticityExpected);
  
  // Optimistic
  // Min elasticity means price increases drop conversion LESS and increase churn LESS.
  // Wait, elasticity is negative for conversion. -0.5 is MIN magnitude (less effect), -1.3 is MAX magnitude (more effect).
  // For optimistic when price goes up, we want least magnitude: -0.5 (conv), 0.15 (churn).
  // But if price goes down, we want highest magnitude for optimistic: -1.3 (conv), 0.60 (churn).
  const priceUp = params.priceVariationPct >= 0;
  
  const optConvE = priceUp ? params.convElasticityMin : params.convElasticityMax;
  const optChurnE = priceUp ? params.churnElasticityMin : params.churnElasticityMax;
  const optimistic = calculateTrajectory(config, params, optConvE, optChurnE);

  const consConvE = priceUp ? params.convElasticityMax : params.convElasticityMin;
  const consChurnE = priceUp ? params.churnElasticityMax : params.churnElasticityMin;
  const conservative = calculateTrajectory(config, params, consConvE, consChurnE);

  return { expected, optimistic, conservative };
}
