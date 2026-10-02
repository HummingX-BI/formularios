import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uiDir = path.join(__dirname, 'src', 'ui', 'components');
const testsDir = path.join(__dirname, 'src', 'tests', 'ui');

fs.mkdirSync(uiDir, { recursive: true });
fs.mkdirSync(testsDir, { recursive: true });

// Util cn
fs.writeFileSync(path.join(uiDir, 'utils.ts'), `
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
`);

const components = [
  'Button', 'Card', 'SectionHeader', 'KpiCard', 'InfoPopover', 'Badge',
  'SeverityPill', 'Tabs', 'Select', 'MultiSelect', 'Slider', 'Switch',
  'SegmentedControl', 'Tooltip', 'Modal', 'Drawer', 'Toast', 'Table',
  'ProgressBar', 'EmptyState', 'Skeleton', 'ErrorState', 'Avatar', 'Stat',
  'Divider', 'Kbd', 'CodeBlock', 'InsightBlock', 'AnimatedCounter'
];

for (const comp of components) {
  const tsx = `import type React from 'react';
import { cn } from './utils';

export interface ${comp}Props extends React.HTMLAttributes<HTMLDivElement> {
  // specific props
}

export function ${comp}({ className, children, ...props }: ${comp}Props): React.JSX.Element {
  return (
    <div className={cn('${comp.toLowerCase()}-base', className)} {...props}>
      {children || '${comp}'}
    </div>
  );
}
`;

  const test = `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ${comp} } from '@/ui/components/${comp}';
import React from 'react';

describe('${comp}', () => {
  it('renders without crashing', () => {
    const { container } = render(<${comp} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
`;

  fs.writeFileSync(path.join(uiDir, `${comp}.tsx`), tsx);
  fs.writeFileSync(path.join(testsDir, `${comp}.test.tsx`), test);
}

// Write index.ts for ui/components
fs.writeFileSync(path.join(uiDir, 'index.ts'), components.map(c => `export * from './${c}';`).join('\n') + `\nexport * from './utils';\n`);

console.log('Generated UI components stubs and tests.');
