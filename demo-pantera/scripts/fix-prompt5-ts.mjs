import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

// 1. Fix catalogs.ts
const catPath = path.join(srcDir, 'data', 'generator', 'catalogs.ts');
let catC = fs.readFileSync(catPath, 'utf8');
catC = catC.replace("import { LevelObj, Pool, Instructor } from '../types';", "import type { LevelObj, Pool, Instructor } from '../types';");
catC = catC.replace(/\/\/ @ts-expect-error type safety\n/g, "");
fs.writeFileSync(catPath, catC);

// 2. Fix schedule.ts
const schPath = path.join(srcDir, 'data', 'generator', 'schedule.ts');
let schC = fs.readFileSync(schPath, 'utf8');
schC = schC.replace("import { Group, Instructor, Pool, Level } from '../types';", "import type { Group, Instructor, Pool, Level } from '../types';");
schC = schC.replace("import { LEVELS } from './catalogs';\n", "");
fs.writeFileSync(schPath, schC);

// 3. Fix structure.ts
const strPath = path.join(srcDir, 'data', 'generator', 'structure.ts');
let strC = fs.readFileSync(strPath, 'utf8');
strC = strC.replace("const rng = new RandomGenerator(0,0,0,0); // Dummy, will be replaced by fork\n", "");
fs.writeFileSync(strPath, strC);

// 4. Fix DataAuditPage.tsx
const audPath = path.join(srcDir, 'modules', 'system', 'DataAuditPage.tsx');
let audC = fs.readFileSync(audPath, 'utf8');
audC = audC.replace("import { useStore } from '@/app/store';", "import { useAppStore } from '@/app/store';\nimport React from 'react';\nimport type { AppModule } from '@/modules/registry';");
audC = audC.replace("useStore(s => s.seed)", "useAppStore((s: any) => s.seed)");
audC = audC.replace("<ModulePage title=\"Auditoría de Datos Generados\" icon=\"database\">", "<ModulePage module={{id: 'AUDIT', categoryId: 'SYS', level: 'P', title: 'Auditoría', route: '', component: () => <div/>} as AppModule}>");
fs.writeFileSync(audPath, audC);

// 5. Fix Table.tsx
const tabPath = path.join(srcDir, 'ui', 'components', 'Table.tsx');
let tabC = fs.readFileSync(tabPath, 'utf8');
tabC = tabC.replace("export function Table({ className }: { className?: string })", "export function Table({ className, children }: { className?: string, children?: React.ReactNode })");
tabC = tabC.replace("</div>\n    </div>\n  );\n}", "</div>\n      {children}\n    </div>\n  );\n}"); // Just inject children in the empty table block, actually wait, children is usually the table tag itself or inside a wrapper. Let me just replace the whole Table.tsx
fs.writeFileSync(tabPath, `import React from 'react';
import { cn } from './utils';

export function Table({ className, children }: { className?: string, children?: React.ReactNode }): React.JSX.Element {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}
`);

// 6. Fix structure.test.ts
const testStrPath = path.join(srcDir, 'tests', 'generator', 'structure.test.ts');
let testStrC = fs.readFileSync(testStrPath, 'utf8');
testStrC = testStrC.replace(/const key = `\${g\.instructorId}-\${g\.dayOfWeek}-\${g\.timeSlot}`;/g, "");
testStrC = testStrC.replace(/expect\(grid\.has\(key\)\)\.toBe\(false\);\n      grid\.add\(key\);/g, "const key = `${g.instructorId}-${g.dayOfWeek}-${g.timeSlot}`;\n      expect(grid.has(key)).toBe(false);\n      grid.add(key);");
testStrC = testStrC.replace(/expect\(d1\.groups\[0\]\.id\)\.toBe\(d2\.groups\[0\]\.id\);/g, "expect(d1.groups[0]?.id).toBe(d2.groups[0]?.id);");
testStrC = testStrC.replace(/expect\(d1\.instructors\[0\]\.name\)\.toBe\(d2\.instructors\[0\]\.name\);/g, "expect(d1.instructors[0]?.name).toBe(d2.instructors[0]?.name);");
fs.writeFileSync(testStrPath, testStrC);

console.log('Fixed prompt 5 ts errors.');
