// A mock metrics engine hook until the real one is fully integrated with a dataset provider.
export function useMetrics() {
  return {
    compute: (metricName: string): any => {
      // Return sensible mock values for the UI
      const mocks: Record<string, any> = {
        alumnos_activos: 1250,
        ingresos_totales: 1150000,
        meta_ingresos: 1200000,
        ocupacion_cupo: 82.5,
        prospectos_nuevos: 45,
        retencion_6m: 85.2,
        riesgo_alto_baja: 12,
        leads: 120,
        contactados: 100,
        citas: 60,
        inscritos: 30,
        lista_espera_total: 15,
        cartera_vencida: 45000,
        conversion: 25,
      };

      return mocks[metricName] ?? 0;
    },
  };
}
