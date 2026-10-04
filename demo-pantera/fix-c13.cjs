const fs = require('fs');

// 1. overrides.ts
let overrides = fs.readFileSync('src/app/overrides.ts', 'utf8');
overrides = overrides.replace(
  "import { GOALS, COSTS, SCORING, PACKAGES } from '../config';", 
  "import { GOALS, COSTS, SCORING, PACKAGES } from '../config';"
);
overrides = overrides.replace(
  "const BUSINESS_CONFIG = { targets: { monthlyRevenue: GOALS.revenueTarget }, costs: { d19_per_kg: COSTS.d19PerKg }, thresholds: { occupancySaturation: SCORING.saturationThreshold, churnRisk: SCORING.highRiskThreshold }, plans: PACKAGES };",
  "const BUSINESS_CONFIG = { targets: { monthlyRevenue: GOALS.monthlyRevenueTarget }, costs: { d19_per_kg: COSTS.poolMaintenanceCost }, thresholds: { occupancySaturation: GOALS.utilizationTarget, churnRisk: GOALS.churnCeiling }, plans: PACKAGES };"
);
fs.writeFileSync('src/app/overrides.ts', overrides);

// 2. M13_1_SEO.tsx
let seo = fs.readFileSync('src/modules/c13/M13_1_SEO.tsx', 'utf8');
seo = seo.replace("const dataset = useDataset(); // Real dataset just for consistency or conversions if needed", "");
seo = seo.replace("import { useDataset } from '@/data/hooks';", "");
seo = seo.replace(/action:\s*\{\s*text:[^}]+},\s*/, "");
fs.writeFileSync('src/modules/c13/M13_1_SEO.tsx', seo);

// 3. M13_2_Campaigns.tsx
// All good except selectedTemplate might be undefined if not found?
let camp = fs.readFileSync('src/modules/c13/M13_2_Campaigns.tsx', 'utf8');
camp = camp.replace("const t = TEMPLATES.find(x => x.id === e.target.value)!;", "const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];");
fs.writeFileSync('src/modules/c13/M13_2_Campaigns.tsx', camp);

// 4. M13_3_Config.tsx
let conf = fs.readFileSync('src/modules/c13/M13_3_Config.tsx', 'utf8');
conf = conf.replace(
  "import { GOALS, COSTS, SCORING, PACKAGES, FACILITY, LEVELS } from '@/config';\nconst BUSINESS_CONFIG = { targets: { monthlyRevenue: GOALS.revenueTarget }, costs: { d19_per_kg: COSTS.d19PerKg }, thresholds: { occupancySaturation: SCORING.saturationThreshold, churnRisk: SCORING.highRiskThreshold }, plans: PACKAGES, pools: [{id:'p1', name:'Principal', maxCapacity: FACILITY.poolCapacity}], levels: LEVELS };",
  "import { GOALS, COSTS, SCORING, PACKAGES, FACILITY, LEVELS } from '@/config';\nconst BUSINESS_CONFIG = { targets: { monthlyRevenue: GOALS.monthlyRevenueTarget }, costs: { d19_per_kg: COSTS.poolMaintenanceCost }, thresholds: { occupancySaturation: GOALS.utilizationTarget, churnRisk: GOALS.churnCeiling }, plans: PACKAGES, pools: [{id:'p1', name:'Principal', maxCapacity: FACILITY.maxStudentsPerLane * FACILITY.lanesPerPool}], levels: LEVELS };"
);
conf = conf.replace(/p\.price/g, "p.monthlyPrice");
conf = conf.replace(/p\.classesPerWeek/g, "p.sessionsPerWeek");
conf = conf.replace(/<Badge key=\{l\} color="bg-ice-100 text-secundario">\{l\}<\/Badge>/g, '<Badge key={l.id} color="bg-ice-100 text-secundario">{l.name}</Badge>');
fs.writeFileSync('src/modules/c13/M13_3_Config.tsx', conf);

console.log('Fixes applied 2.');
