import { describe, it, expect } from 'vitest';
import { generateDataset } from '@/data/generator/structure';
import { validateDataset } from '@/data/validate';

describe('Data Generator Validation and Audit', () => {
  it('passes all verifications perfectly for seed 2026', () => {
    const data = generateDataset(2026);
    const results = validateDataset(data, false);
    
    // There should be zero failures and zero warnings for seed 2026
    const failures = results.filter(r => r.resultado === 'falla');
    const warnings = results.filter(r => r.resultado === 'advertencia');
    
    expect(failures).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('maintains integrity and limits warnings for other seeds', () => {
    const seeds = [2027, 7, 99];
    
    for (const seed of seeds) {
      const data = generateDataset(seed);
      const results = validateDataset(data, true); // relaxTolerance = true
      
      const failures = results.filter(r => r.resultado === 'falla');
      const warnings = results.filter(r => r.resultado === 'advertencia');
      
      // Zero integrity failures
      const integrityFailures = failures.filter(f => f.categoria === 'Integridad');
      expect(integrityFailures).toEqual([]);
      
      // Total failures should ideally be 0, maybe 1 if highly stochastic
      expect(failures.length).toBeLessThanOrEqual(1);
      
      // Total warnings <= 3
      expect(warnings.length).toBeLessThanOrEqual(3);
    }
  });

  it('takes a snapshot of key metrics for seed 2026', () => {
    const data = generateDataset(2026);
    
    const activeStudents = data.students.filter(s => s.status === 'active').length;
    const churnedStudents = data.students.filter(s => s.status === 'churned').length;
    
    let sumPagos = 0;
    for (const p of data.payments) sumPagos += p.amount;
    
    let sumCargos = 0;
    for (const c of data.charges) sumCargos += c.amount;
    
    expect({
      activeStudents,
      churnedStudents,
      totalPayments: Math.round(sumPagos),
      totalCharges: Math.round(sumCargos)
    }).toMatchSnapshot();
  });
});
