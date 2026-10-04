const fs = require('fs');

// 1. overrides.ts
let overrides = fs.readFileSync('src/app/overrides.ts', 'utf8');
overrides = overrides.replace(
  "export function applyOverrides(baseConfig: ConfigType, overrides: ConfigOverrides): ConfigType {", 
  "export function applyOverrides(baseConfig: any, overrides: ConfigOverrides): any {"
);
fs.writeFileSync('src/app/overrides.ts', overrides);

// 2. M13_1_SEO.tsx
let seo = fs.readFileSync('src/modules/c13/M13_1_SEO.tsx', 'utf8');
seo = seo.replace(
  "const insightData: any = {", 
  "const insightData: any = {"
); // Ensure it's there
seo = seo.replace("opportunities[0].keyword", "(opportunities[0] ? opportunities[0].keyword : '')");
seo = seo.replace("opportunities[0].volume", "(opportunities[0] ? opportunities[0].volume : 0)");
fs.writeFileSync('src/modules/c13/M13_1_SEO.tsx', seo);

// 3. M13_2_Campaigns.tsx
let camp = fs.readFileSync('src/modules/c13/M13_2_Campaigns.tsx', 'utf8');
camp = camp.replace("dataset.families[0]?.tutorName", "dataset.families?.[0]?.tutorName");
camp = camp.replace("dataset.students[0]?.name", "dataset.students?.[0]?.name");
camp = camp.replace("const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];\n                setSelectedTemplate(t!);", "const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];\n                setSelectedTemplate(t);");
camp = camp.replace("const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];\n                setSelectedTemplate(t);", "const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0];\n                setSelectedTemplate(t);");
fs.writeFileSync('src/modules/c13/M13_2_Campaigns.tsx', camp);

console.log('Fixes applied 5.');
