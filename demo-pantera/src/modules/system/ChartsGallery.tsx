import {
  LineChart,
  BarChart,
  HistogramKde,
  BoxPlot,
  Heatmap,
  ScatterRegression,
  FunnelChart,
  SankeyChart,
  RadarChart,
  SurvivalCurve,
  RocCurve,
  DonutChart,
  ForecastChart,
  Sparkline,
} from '../../charts';

export default function ChartsGallery() {
  const commonTable = {
    columns: [
      { key: 'x', header: 'X' },
      { key: 'y', header: 'Y' },
    ],
    rows: [
      { x: 1, y: 10 },
      { x: 2, y: 15 },
    ],
  };

  return (
    <div className="p-8 space-y-8 bg-ice-50 min-h-screen">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">
        Galería de Gráficas (Tema Científico)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LineChart
          id="demo-line"
          title="Alumnos Activos en el Tiempo"
          subtitle="Evolución mensual (Semilla 2026)"
          x={['Ene', 'Feb', 'Mar', 'Abr', 'May']}
          series={[
            { name: 'Activos', y: [500, 520, 510, 540, 620], concept: 'retencion' },
            { name: 'Bajas', y: [20, 30, 25, 40, 15], concept: 'bajas' },
          ]}
          altText="Gráfico de líneas mostrando evolución de alumnos activos"
          tableData={commonTable}
        />

        <BarChart
          id="demo-bar"
          title="Ingresos por Plan"
          subtitle="Distribución actual"
          x={['1/sem', '2/sem', '3/sem']}
          series={[{ name: 'Ingresos', y: [40000, 120000, 60000], concept: 'ingresos' }]}
          altText="Gráfico de barras de ingresos por plan"
          tableData={commonTable}
        />

        <HistogramKde
          id="demo-hist"
          title="Distribución de Edad"
          values={[3, 4, 4, 5, 5, 5, 6, 6, 7, 8, 8, 9, 10, 12]}
          kdeX={[2, 4, 6, 8, 10, 12]}
          kdeY={[0.05, 0.15, 0.2, 0.15, 0.1, 0.05]}
          mean={6.5}
          median={6}
          concept="prospectos"
          altText="Histograma de edades con curva de densidad"
          tableData={commonTable}
        />

        <BoxPlot
          id="demo-box"
          title="Tiempo por Nivel"
          categories={[
            { name: 'Nivel 1', values: [1, 2, 2, 3, 4, 8], concept: 'retencion' },
            { name: 'Nivel 2', values: [2, 3, 3, 4, 5, 9], concept: 'retencion' },
          ]}
          altText="Gráfico de cajas de tiempo por nivel"
          tableData={commonTable}
        />

        <Heatmap
          id="demo-heat"
          title="Ocupación por Horario"
          x={['Lunes', 'Martes', 'Miércoles']}
          y={['16:00', '17:00', '18:00']}
          z={[
            [80, 90, 60],
            [85, 95, 70],
            [60, 75, 50],
          ]}
          altText="Mapa de calor de ocupación"
          tableData={commonTable}
        />

        <ScatterRegression
          id="demo-scatter"
          title="Asistencia vs Retención"
          x={[0.5, 0.6, 0.7, 0.8, 0.9]}
          y={[0.4, 0.5, 0.7, 0.85, 0.95]}
          lineX={[0.5, 0.9]}
          lineY={[0.4, 0.95]}
          upperY={[0.5, 1.0]}
          lowerY={[0.3, 0.9]}
          equation="y = 1.3x - 0.2 (R² = 0.92)"
          concept="retencion"
          altText="Dispersión y regresión de asistencia"
          tableData={commonTable}
        />

        <FunnelChart
          id="demo-funnel"
          title="Embudo de Ventas"
          stages={['Visitas', 'Prospectos', 'Clase Muestra', 'Inscritos']}
          values={[1000, 600, 300, 150]}
          concept="ingresos"
          altText="Embudo de conversión de ventas"
          tableData={commonTable}
        />

        <SankeyChart
          id="demo-sankey"
          title="Flujo de Niveles"
          labels={['Nivel 1', 'Nivel 2', 'Baja', 'Nivel 3']}
          source={[0, 0, 1, 1]}
          target={[1, 2, 3, 2]}
          value={[80, 20, 70, 10]}
          altText="Diagrama Sankey de flujo de niveles"
          tableData={commonTable}
        />

        <RadarChart
          id="demo-radar"
          title="Perfil de Instructor"
          labels={['Puntualidad', 'Retención', 'Técnica', 'Carisma', 'Ventas']}
          series={[{ name: 'Mariana', values: [0.9, 0.95, 0.8, 0.9, 0.7], concept: 'retencion' }]}
          altText="Gráfico de radar de instructor"
          tableData={commonTable}
        />

        <SurvivalCurve
          id="demo-survival"
          title="Curva de Supervivencia (Kaplan-Meier)"
          groups={[
            {
              name: 'Global',
              times: [0, 6, 12, 24],
              survival: [1, 0.8, 0.6, 0.4],
              upper: [1, 0.85, 0.65, 0.45],
              lower: [1, 0.75, 0.55, 0.35],
              concept: 'bajas',
            },
          ]}
          medianTimes={[18]}
          altText="Curva de supervivencia de clientes"
          tableData={commonTable}
        />

        <RocCurve
          id="demo-roc"
          title="Curva ROC - Modelo de Riesgo"
          fpr={[0, 0.1, 0.2, 0.5, 1]}
          tpr={[0, 0.6, 0.8, 0.9, 1]}
          auc={0.82}
          altText="Curva ROC de modelo predictivo"
          tableData={commonTable}
        />

        <DonutChart
          id="demo-donut"
          title="Medios de Captación"
          labels={['Instagram', 'Google', 'Referidos']}
          values={[45, 30, 25]}
          colors={['#F26B5B', '#F2A93B', '#2BAE84']}
          altText="Gráfico de dona de captación"
          tableData={commonTable}
        />

        <ForecastChart
          id="demo-forecast"
          title="Pronóstico de Ingresos"
          xHist={['Ene', 'Feb', 'Mar']}
          yHist={[100, 110, 120]}
          xFore={['Abr', 'May', 'Jun']}
          yFore={[130, 140, 150]}
          upper80={[135, 150, 165]}
          lower80={[125, 130, 135]}
          upper95={[140, 160, 180]}
          lower95={[120, 120, 120]}
          concept="ingresos"
          altText="Pronóstico de ingresos futuros"
          tableData={commonTable}
        />

        <div className="bg-white p-4 rounded-lg shadow-sm border border-ice-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-navy-900">Sparkline</h3>
            <p className="text-sm text-secundario">SVG Nativo Ultraligero</p>
          </div>
          <Sparkline data={[10, 15, 12, 18, 25, 20, 30]} concept="retencion" />
        </div>
      </div>
    </div>
  );
}
