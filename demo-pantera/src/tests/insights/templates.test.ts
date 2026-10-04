import { describe, it, expect } from 'vitest';
import * as templates from '../../insights/templates';
import fs from 'fs';
import path from 'path';

describe('Insight Templates Engine', () => {
  it('should pluralize correctly', () => {
    expect(templates.pluralize(1, 'alumno', 'alumnos')).toBe('alumno');
    expect(templates.pluralize(2, 'alumno', 'alumnos')).toBe('alumnos');
    expect(templates.pluralize(0, 'vez', 'veces')).toBe('veces');
  });

  it('should format lists with y', () => {
    expect(templates.joinList(['A'])).toBe('A');
    expect(templates.joinList(['A', 'B'])).toBe('A y B');
    expect(templates.joinList(['A', 'B', 'C'])).toBe('A, B y C');
  });

  it('should assign correct intensity', () => {
    expect(templates.intensityLevel(10, [20, 40])).toBe('leve');
    expect(templates.intensityLevel(30, [20, 40])).toBe('moderado');
    expect(templates.intensityLevel(50, [20, 40])).toBe('severo');
  });

  it('must not contain hardcoded digits in string literals', () => {
    const filePath = path.join(__dirname, '../../insights/templates.ts');
    const content = fs.readFileSync(filePath, 'utf8');

    // Look for string literals containing digits (excluding formats, imports, etc.)
    // A simple regex for '...' or "..." or `...` containing digits:
    const stringLiterals =
      content.match(/"[^"\n]*\d[^"\n]*"|'[^'\n]*\d[^'\n]*'|`[^`\n]*\d[^`\n]*`/g) || [];

    // We filter out expected ones like config or locale strings ('es-MX')
    const violations = stringLiterals.filter((lit) => {
      if (lit.includes('es-MX')) return false;
      if (lit.includes('items[0]') || lit.includes('items[1]')) return false;
      if (lit.includes('thresholds[0]') || lit.includes('thresholds[1]')) return false;
      return true;
    });
    expect(violations).toEqual([]);
  });
});
