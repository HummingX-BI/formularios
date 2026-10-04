const fs = require('fs');

// 1. overrides.ts
let overrides = fs.readFileSync('src/app/overrides.ts', 'utf8');
overrides = overrides.replace("import { BUSINESS_CONFIG } from '../config';", "import { BUSINESS_CONFIG } from '../config';\ntype ConfigType = typeof BUSINESS_CONFIG;");
overrides = overrides.replace("type ConfigType = ConfigType;", ""); // Remove circular reference
fs.writeFileSync('src/app/overrides.ts', overrides);

// 2. M13_1_SEO.tsx
let seo = fs.readFileSync('src/modules/c13/M13_1_SEO.tsx', 'utf8');
seo = seo.replace("const insightData = {", "const insightData: any = {");
seo = seo.replace("opportunities[0]?.volume", "(opportunities[0]?.volume || 0)");
seo = seo.replace("opportunities[0]?.difficulty", "(opportunities[0]?.difficulty || 0)");
fs.writeFileSync('src/modules/c13/M13_1_SEO.tsx', seo);

// 3. M13_2_Campaigns.tsx
let camp = fs.readFileSync('src/modules/c13/M13_2_Campaigns.tsx', 'utf8');
camp = camp.replace("dataset.families[0]?.tutorName", "(dataset.families[0]?.tutorName || 'Juan Pérez')");
camp = camp.replace("dataset.students[0]?.name", "(dataset.students[0]?.name || 'Mateo')");
camp = camp.replace("selectedTemplate.name", "(selectedTemplate?.name || 'Plantilla')");
camp = camp.replace("selectedTemplate.id", "(selectedTemplate?.id || 't1')");
camp = camp.replace("const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];\n                setSelectedTemplate(t!);", "const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];\n                setSelectedTemplate(t);");
fs.writeFileSync('src/modules/c13/M13_2_Campaigns.tsx', camp);

// 4. M13_3_Config.tsx
let conf = fs.readFileSync('src/modules/c13/M13_3_Config.tsx', 'utf8');
conf = conf.replace("GOALS.monthlyRevenueTarget", "BUSINESS_CONFIG.targets.monthlyRevenue");
conf = conf.replace("COSTS.poolMaintenanceCost", "BUSINESS_CONFIG.costs.d19_per_kg");
conf = conf.replace("SCORING.saturationThreshold", "BUSINESS_CONFIG.thresholds.occupancySaturation");
conf = conf.replace("SCORING.highRiskThreshold", "BUSINESS_CONFIG.thresholds.churnRisk");
conf = conf.replace(/p\.price/g, "p.monthlyPrice");
fs.writeFileSync('src/modules/c13/M13_3_Config.tsx', conf);

console.log('Fixes applied 4.');
