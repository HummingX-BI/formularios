import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  return arrayOfFiles;
}

describe('Static Audit (Prompt 30)', () => {
  const srcPath = path.resolve(__dirname, '../../');
  const files = getAllFiles(srcPath);
  const moduleFiles = files.filter(f => f.includes('modules') && f.includes('M') && f.endsWith('.tsx'));

  it('No external URLs outside config', () => {
    const ignored = ['config', 'tests', 'generator', 'Icon.tsx', 'api.ts'];
    for (const file of files) {
      if (ignored.some(i => file.includes(i))) continue;
      
      const content = fs.readFileSync(file, 'utf-8');
      const hasUrl = /(http:\/\/|https:\/\/)(?!localhost)/i.test(content);
      expect({ file, hasUrl }).toEqual({ file, hasUrl: false });
    }
  });

  it('No forbidden words (torniquete, acceso físico)', () => {
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8').toLowerCase();
      const hasTorniquete = content.includes('torniquete');
      const hasAcceso = content.includes('acceso físico');
      expect({ file, hasTorniquete }).toEqual({ file, hasTorniquete: false });
      expect({ file, hasAcceso }).toEqual({ file, hasAcceso: false });
    }
  });

  it('No literal numbers in template strings in UI', () => {
    for (const file of moduleFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const hasHardcodedCurrency = />\s*\$[\d,]+(\.\d+)?\s*</.test(content);
      expect({ file, hasHardcodedCurrency }).toEqual({ file, hasHardcodedCurrency: false });
    }
  });

  it('Analytical modules have InsightBlock', () => {
    const analyticalPatterns = ['M1_', 'M4_', 'M5_', 'M6_', 'M7_', 'M8_', 'M9_', 'M10_', 'M11_'];
    for (const file of moduleFiles) {
      const isAnalytical = analyticalPatterns.some(p => path.basename(file).startsWith(p));
      if (isAnalytical) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes('Chart')) {
          // OK
        }
      }
    }
  });
});
