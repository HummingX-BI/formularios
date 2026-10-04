import { describe, it, expect } from 'vitest';
import { generateAlerts } from '../../insights/alerts';

describe('Alert Engine', () => {
  const dummyDate = new Date('2026-09-01T12:00:00Z');
  const baseConfig = { occupancyThreshold: 95, arrearsThreshold: 30000 };

  it('generates occupancy alert only if waitlist > 0 and occ > threshold', () => {
    const alertsNone = generateAlerts({ ocupacion: 96, listaEspera: 0 }, baseConfig, dummyDate);
    expect(alertsNone.find((a) => a.type === 'occupancy')).toBeUndefined();

    const alerts = generateAlerts({ ocupacion: 96, listaEspera: 5 }, baseConfig, dummyDate);
    const occAlert = alerts.find((a) => a.type === 'occupancy');
    expect(occAlert).toBeDefined();
    expect(occAlert?.severity).toBe('alerta');
  });

  it('sorts alerts by severity (critico first)', () => {
    const alerts = generateAlerts(
      {
        ocupacion: 98,
        listaEspera: 10,
        carteraVencida: 50000, // Critico
      },
      baseConfig,
      dummyDate,
    );

    expect(alerts.length).toBe(2);
    expect(alerts[0]!.severity).toBe('critico');
    expect(alerts[1]!.severity).toBe('alerta');
  });
});
