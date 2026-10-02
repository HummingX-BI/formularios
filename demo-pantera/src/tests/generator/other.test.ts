import { describe, it, expect } from 'vitest';
import { generateDataset } from '@/data/generator/structure';

describe('Data Generator IV - Web, Messages and Performance', () => {
  it('hits web session and conversion targets', () => {
    const data = generateDataset(2026);
    
    // Total sessions
    expect(data.web.length).toBe(24);
    
    // Check conversion logic
    for (const m of data.web) {
      // Find google and instagram prospects for this month
      const orgSocialProspects = data.prospects.filter(p => p.date.startsWith(m.month) && (p.source === 'Google' || p.source === 'Instagram')).length;
      
      const expectedSessions = orgSocialProspects / 0.021;
      const actualOrgSocialSessions = m.sources.organic + m.sources.social;
      
      // Should match roughly ± 15%
      const diff = Math.abs(actualOrgSocialSessions - expectedSessions) / expectedSessions;
      expect(diff).toBeLessThan(0.15);
      
      // Keywords
      expect(data.keywords.length).toBeGreaterThanOrEqual(15);
      expect(data.keywords.some(k => k.keyword === 'clases de natación para niños Lindavista')).toBe(true);
      expect(data.keywords[0]!.monthlyStats.length).toBe(24);
    }
  });

  it('generates message threads following rules', () => {
    const data = generateDataset(2026);
    
    expect(data.messages.length).toBeGreaterThanOrEqual(40);
    
    let botHandled = 0;
    let recentThreads = 0;
    
    for (const th of data.messages) {
      expect(th.messages.length).toBeGreaterThanOrEqual(6);
      expect(th.messages.length).toBeLessThanOrEqual(14);
      
      if (th.date >= '2026-07-02') {
        recentThreads++;
        if (th.handledByBot) {
          botHandled++;
          expect(th.firstResponseMin).toBeLessThanOrEqual(1);
        }
      }
    }
    
    const botRate = botHandled / recentThreads;
    // ~60%
    expect(botRate).toBeGreaterThanOrEqual(0.40);
    expect(botRate).toBeLessThanOrEqual(0.80);
  });

  it('completes the entire generation in less than 3 seconds', () => {
    const start = performance.now();
    generateDataset('perf_test_seed');
    const end = performance.now();
    const duration = end - start;
    
    expect(duration).toBeLessThan(3000);
  });
});
