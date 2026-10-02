import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

// 1. Fix src/modules/registry.tsx
const regPath = path.join(srcDir, 'modules', 'registry.tsx');
let regContent = fs.readFileSync(regPath, 'utf8');
regContent = regContent.replace("import type { ElementType } from 'react';", "import type { ComponentType } from 'react';");
regContent = regContent.replace("React.LazyExoticComponent<ElementType>", "React.LazyExoticComponent<ComponentType<any>>");
fs.writeFileSync(regPath, regContent);

// 2. Fix src/app/router.tsx
const routerPath = path.join(srcDir, 'app', 'router.tsx');
let routerContent = fs.readFileSync(routerPath, 'utf8');
routerContent = routerContent.replace("import { ModulePlaceholder } from '@/ui/ModulePlaceholder';\n", "");
fs.writeFileSync(routerPath, routerContent);

// 3. Fix src/modules/design/DesignGallery.tsx
const galleryPath = path.join(srcDir, 'modules', 'design', 'DesignGallery.tsx');
let galleryContent = fs.readFileSync(galleryPath, 'utf8');
galleryContent = galleryContent.replace(/import { Button.*? } from '@\/ui\/components';/, "import { Button, KpiCard, InsightBlock, Table } from '@/ui/components';");
fs.writeFileSync(galleryPath, galleryContent);

// 4. Fix src/tests/contrast.test.ts
const contrastPath = path.join(srcDir, 'tests', 'contrast.test.ts');
let contrastContent = fs.readFileSync(contrastPath, 'utf8');
contrastContent = contrastContent.replace("const [R, G, B] = rgb.map((val) => {", "const [R=0, G=0, B=0] = rgb.map((val) => {");
fs.writeFileSync(contrastPath, contrastContent);

// 5. Fix tests/ui/*.test.tsx props
const testsUiDir = path.join(srcDir, 'tests', 'ui');
const testFiles = fs.readdirSync(testsUiDir);
for (const file of testFiles) {
  if (file.endsWith('.test.tsx')) {
    let content = fs.readFileSync(path.join(testsUiDir, file), 'utf8');
    // Remove unused React import if present
    content = content.replace(/import React from 'react';\n/g, "");
    
    // Fix specific required props
    if (file === 'AnimatedCounter.test.tsx') content = content.replace("<AnimatedCounter />", "<AnimatedCounter value={100} />");
    if (file === 'InsightBlock.test.tsx') content = content.replace("<InsightBlock />", "<InsightBlock conclusion='test' />");
    if (file === 'KpiCard.test.tsx') content = content.replace("<KpiCard />", "<KpiCard title='Test' value={10} />");
    
    fs.writeFileSync(path.join(testsUiDir, file), content);
  }
}

// 6. Fix src/ui/components/KpiCard.tsx
const kpiCardPath = path.join(srcDir, 'ui', 'components', 'KpiCard.tsx');
let kpiCardContent = fs.readFileSync(kpiCardPath, 'utf8');
kpiCardContent = kpiCardContent.replace("{infoText && <Info className=\"h-4 w-4 text-text-tenue cursor-help\" title={infoText} />}", "{infoText && <span title={infoText}><Info className=\"h-4 w-4 text-text-tenue cursor-help\" /></span>}");
fs.writeFileSync(kpiCardPath, kpiCardContent);

// 7. Fix src/ui/components/Table.tsx
const tablePath = path.join(srcDir, 'ui', 'components', 'Table.tsx');
let tableContent = fs.readFileSync(tablePath, 'utf8');
tableContent = tableContent.replace("export function Table({ className, ...props }: any)", "export function Table({ className }: any)");
fs.writeFileSync(tablePath, tableContent);

// 8. Fix Unused React in other files
const filesToStripReact = [
  path.join(srcDir, 'modules', 'login', 'LoginPage.tsx'),
  path.join(srcDir, 'modules', 'login', 'NotFoundPage.tsx'), // might not exist
  path.join(srcDir, 'ui', 'NotFoundPage.tsx'),
  path.join(srcDir, 'ui', 'ModulePlaceholder.tsx')
];

for (const file of filesToStripReact) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import React from 'react';\n/g, "");
    fs.writeFileSync(file, content);
  }
}

console.log('Fixed TS errors.');
