import { describe, it, expect } from 'vitest';
import { generateStructure } from '@/data/generator/structure';
import { DEMO_CONFIG } from '@/config/demoConfig';

describe('Data Generator II - Prospects and Students', () => {
  it('generates exact prospect totals by source', () => {
    const data = generateStructure(101);
    
    // Total prospects
    expect(data.prospects.length).toBe(3200);
    
    // Totals by source
    const sources = new Map<string, number>();
    data.prospects.forEach(p => sources.set(p.source, (sources.get(p.source) || 0) + 1));
    expect(sources.get('Referidos')).toBe(640);
    expect(sources.get('Visita directa')).toBe(480);
    expect(sources.get('Google')).toBe(800);
    expect(sources.get('Instagram')).toBe(960);
    expect(sources.get('Volante local')).toBe(320);
  });

  it('generates exact enrollment totals by source', () => {
    const data = generateStructure(101);
    const enrolled = data.prospects.filter(p => p.stage === 'inscrito');
    expect(enrolled.length).toBe(920);
    
    const enrollSources = new Map<string, number>();
    enrolled.forEach(p => enrollSources.set(p.source, (enrollSources.get(p.source) || 0) + 1));
    expect(enrollSources.get('Referidos')).toBe(307);
    expect(enrollSources.get('Visita directa')).toBe(274);
    expect(enrollSources.get('Google')).toBe(176);
    expect(enrollSources.get('Instagram')).toBe(134);
    expect(enrollSources.get('Volante local')).toBe(29);
  });

  it('generates correct loss reasons', () => {
    const data = generateStructure(101);
    const lost = data.prospects.filter(p => p.stage === 'perdido');
    expect(lost.length).toBe(2280);
    
    const reasons = new Map<string, number>();
    lost.forEach(p => {
      expect(p.lostReason).toBeDefined();
      reasons.set(p.lostReason as string, (reasons.get(p.lostReason as string) || 0) + 1);
    });
    
    expect(reasons.get('precio')).toBe(866);
    expect(reasons.get('horario')).toBe(502);
    expect(reasons.get('distancia')).toBe(342);
    expect(reasons.get('otra_escuela')).toBe(228);
    expect(reasons.get('sin_respuesta')).toBe(342);
  });

  it('respects date boundaries and chronology', () => {
    const data = generateStructure(101);
    
    // Student birthdate < enrollmentDate
    for (const stu of data.students) {
      expect(new Date(stu.birthDate).getTime()).toBeLessThan(new Date(stu.enrollmentDate).getTime());
      
      // Range check for enrollment
      expect(new Date(stu.enrollmentDate).getTime()).toBeLessThanOrEqual(new Date(DEMO_CONFIG.dates.cutoffDate + 'T00:00:00Z').getTime());
    }
  });

  it('matches student source with prospect', () => {
    const data = generateStructure(101);
    const stuMap = new Map(data.students.map(s => [s.id, s]));
    
    for (const p of data.prospects) {
      if (p.enrolledStudentId) {
        const stu = stuMap.get(p.enrolledStudentId);
        expect(stu).toBeDefined();
        expect(stu?.source).toBe(p.source);
      }
    }
  });

  it('is deterministic', () => {
    const d1 = generateStructure(42);
    const d2 = generateStructure(42);
    expect(d1.prospects[50]?.source).toBe(d2.prospects[50]?.source);
    expect(d1.students[50]?.name).toBe(d2.students[50]?.name);
    expect(d1.families[50]?.paymentMethod).toBe(d2.families[50]?.paymentMethod);
  });
});
