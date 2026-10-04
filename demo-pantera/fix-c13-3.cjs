const fs = require('fs');

// 1. overrides.ts
let overrides = fs.readFileSync('src/app/overrides.ts', 'utf8');
overrides = overrides.replace(
  "import { GOALS, COSTS, SCORING, PACKAGES } from '../config';", 
  "import { BUSINESS_CONFIG } from '../config';"
);
overrides = overrides.replace(
  "const BUSINESS_CONFIG = { targets: { monthlyRevenue: GOALS.monthlyRevenueTarget }, costs: { d19_per_kg: COSTS.poolMaintenanceCost }, thresholds: { occupancySaturation: GOALS.utilizationTarget, churnRisk: GOALS.churnCeiling }, plans: PACKAGES };",
  ""
);
fs.writeFileSync('src/app/overrides.ts', overrides);

// 2. M13_3_Config.tsx
let conf = fs.readFileSync('src/modules/c13/M13_3_Config.tsx', 'utf8');
conf = conf.replace(
  "import { GOALS, COSTS, SCORING, PACKAGES, FACILITY, LEVELS } from '@/config';\nconst BUSINESS_CONFIG = { targets: { monthlyRevenue: GOALS.monthlyRevenueTarget }, costs: { d19_per_kg: COSTS.poolMaintenanceCost }, thresholds: { occupancySaturation: GOALS.utilizationTarget, churnRisk: GOALS.churnCeiling }, plans: PACKAGES, pools: [{id:'p1', name:'Principal', maxCapacity: FACILITY.maxStudentsPerLane * FACILITY.lanesPerPool}], levels: LEVELS };",
  "import { BUSINESS_CONFIG } from '@/config';"
);
fs.writeFileSync('src/modules/c13/M13_3_Config.tsx', conf);

// 3. M13_2_Campaigns.tsx - Fix selectedTemplate undefined and missing action in M13_1
let camp = fs.readFileSync('src/modules/c13/M13_2_Campaigns.tsx', 'utf8');
camp = camp.replace(
  "const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];\n                setSelectedTemplate(t);",
  "const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];\n                setSelectedTemplate(t!);"
);
fs.writeFileSync('src/modules/c13/M13_2_Campaigns.tsx', camp);

console.log('Reverted local configs.');
