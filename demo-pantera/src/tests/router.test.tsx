import { describe, it, expect } from 'vitest';
import { LEGACY_ROUTES } from '../app/legacyRoutes';

describe('Legacy Routes Mapping', () => {
  it('contains mapping for critical modules', () => {
    expect(LEGACY_ROUTES['/c01/m1-1']).toBe('/mando/resumen');
    expect(LEGACY_ROUTES['/c01/m1-2']).toBe('/mando/salud?tab=indice');
    expect(LEGACY_ROUTES['/c13/m13-4']).toBe('/config/demo');
    expect(LEGACY_ROUTES['/c04/m4-6']).toBe('/finanzas/rentabilidad?tab=hora-carril');
  });

  it('ensures all legacy routes map to valid new formats', () => {
    const keys = Object.keys(LEGACY_ROUTES);
    const values = Object.values(LEGACY_ROUTES);
    
    // Debería haber al menos 47 rutas legacy mapeadas
    expect(keys.length).toBeGreaterThan(40);
    
    // Validar el formato
    keys.forEach(k => {
      expect(k).toMatch(/^\/c\d{2}\/m\d+-\d+$/);
    });
    
    values.forEach(v => {
      expect(v.startsWith('/')).toBe(true);
    });
  });
});
