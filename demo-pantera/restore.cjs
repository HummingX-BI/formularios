const fs = require('fs');
const path = require('path');

const files = [
  'c04/M4_3_PastDue.tsx',
  'c04/M4_4_RevenueVsBillable.tsx',
  'c04/M4_5_LTV.tsx',
  'c04/M4_6_Profitability.tsx',
  'c05/M5_2_Funnel.tsx',
  'c05/M5_3_LossReasons.tsx',
  'c05/M5_4_Sources.tsx',
  'c05/M5_5_Agent.tsx',
  'c06/M6_1_Occupancy.tsx',
  'c06/M6_2_Saturation.tsx',
  'c06/M6_4_Simulator.tsx',
  'c07/M7_1_Risk.tsx',
  'c07/M7_2_Survival.tsx',
  'c07/M7_3_Cohorts.tsx'
];

files.forEach(f => {
  const p = path.join('src/modules', f);
  let c = fs.readFileSync(p, 'utf8');
  const componentName = path.basename(f, '.tsx');
  c = c.replace('  const { setExplanationContext } = useAppStore();', `export default function ${componentName}() {\n  const { setExplanationContext } = useAppStore();`);
  fs.writeFileSync(p, c);
  console.log('Restored', componentName);
});
