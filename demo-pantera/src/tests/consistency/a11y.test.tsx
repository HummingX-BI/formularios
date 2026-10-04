import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { MODULE_REGISTRY } from '@/modules/registry';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { Suspense } from 'react';

expect.extend(matchers);

vi.mock('@/ml/workers/mlClient', () => ({
  runMLTask: async (taskType: string) => {
    if (taskType === 'kaplanMeier') return { timeline: [], survival: [], times: [] };
    if (taskType === 'logRankTest') return { stat: 0, pValue: 1, df: 1 };
    return { logLoss: 0.5, weights: [0.1] };
  }
}));

// Mock canvas for axe-core color contrast checks in JSDOM
HTMLCanvasElement.prototype.getContext = () => {
  return {
    measureText: () => ({ width: 0 }),
  } as any;
};

describe('A11y Audit (Prompt 32)', () => {
  it('navigates to all 58 modules and checks for critical axe violations', async () => {
    for (const mod of MODULE_REGISTRY) {
      if (mod.route === '') continue; // Skip placeholders or external routes

      const Component = mod.component as any;

      const { container } = render(
        <MemoryRouter initialEntries={[mod.route]}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path={mod.route} element={<Component />} />
            </Routes>
          </Suspense>
        </MemoryRouter>
      );

      const results = await axe(container);
      
      // We only strictly fail on serious and critical for this demo constraint
      const severeViolations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      if (severeViolations.length > 0) {
        console.error(`A11y Violations in ${mod.id}:`, severeViolations);
      }

      expect(severeViolations).toHaveLength(0);
    }
  }, 30000); // Allow longer timeout
});
