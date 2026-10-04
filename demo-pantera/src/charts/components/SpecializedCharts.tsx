import React from 'react';
import { PlotChart } from '../PlotChart';
import { getConceptColor } from '../theme';
import { conceptColors } from '../../ui/conceptColors';

// 9. RadarChart
export interface RadarChartProps {
  id: string;
  title?: string;
  labels: string[];
  series: { name: string; values: number[]; concept?: keyof typeof conceptColors }[];
  altText: string;
  tableData: any;
}

export const RadarChart: React.FC<RadarChartProps> = (props) => {
  const data = props.series.map((s) => ({
    type: 'scatterpolar',
    r: s.values,
    theta: props.labels,
    fill: 'toself',
    name: s.name,
    line: { color: getConceptColor(s.concept || 'default') },
  }));
  return (
    <PlotChart
      {...props}
      data={data}
      layout={{ polar: { radialaxis: { visible: true, range: [0, 1] } } }}
    />
  );
};

// 10. SurvivalCurve
export interface SurvivalCurveProps {
  id: string;
  title?: string;
  groups: {
    name: string;
    times: number[];
    survival: number[];
    upper?: number[];
    lower?: number[];
    concept?: keyof typeof conceptColors;
  }[];
  medianTimes?: number[];
  altText: string;
  tableData: any;
}

export const SurvivalCurve: React.FC<SurvivalCurveProps> = (props) => {
  const data: any[] = [];
  const shapes: any[] = [];

  props.groups.forEach((g, i) => {
    const color = getConceptColor(g.concept || 'default');

    if (g.upper && g.lower) {
      data.push({
        type: 'scatter',
        mode: 'lines',
        x: [...g.times, ...g.times.slice().reverse()],
        y: [...g.upper, ...g.lower.slice().reverse()],
        fill: 'toself',
        fillcolor: color.replace('rgb', 'rgba').replace(')', ', 0.2)'),
        line: { color: 'transparent' },
        name: `${g.name} (IC 95%)`,
        showlegend: false,
      });
    }

    data.push({
      type: 'scatter',
      mode: 'lines',
      x: g.times,
      y: g.survival,
      line: { shape: 'hv', color, width: 2 },
      name: g.name,
    });

    if (props.medianTimes && props.medianTimes[i]) {
      shapes.push({
        type: 'line',
        x0: props.medianTimes[i],
        x1: props.medianTimes[i],
        y0: 0,
        y1: 0.5,
        line: { color, width: 1, dash: 'dash' },
      });
    }
  });

  return <PlotChart {...props} data={data} layout={{ shapes, yaxis: { range: [0, 1.05] } }} />;
};

// 11. RocCurve
export interface RocCurveProps {
  id: string;
  title?: string;
  fpr: number[];
  tpr: number[];
  auc: number;
  altText: string;
  tableData: any;
}

export const RocCurve: React.FC<RocCurveProps> = (props) => {
  const data = [
    {
      type: 'scatter',
      mode: 'lines',
      x: props.fpr,
      y: props.tpr,
      name: `ROC (AUC = ${props.auc.toFixed(3)})`,
      line: { color: conceptColors.ingresos, width: 2 },
    },
    {
      type: 'scatter',
      mode: 'lines',
      x: [0, 1],
      y: [0, 1],
      name: 'Azar',
      line: { color: '#8AA3B8', dash: 'dash' },
    },
  ];
  return (
    <PlotChart
      {...props}
      data={data}
      layout={{ xaxis: { range: [0, 1] }, yaxis: { range: [0, 1.05] } }}
    />
  );
};

// 12. DonutChart & Gauge
export interface DonutChartProps {
  id: string;
  title?: string;
  labels: string[];
  values: number[];
  colors?: string[];
  hole?: number;
  altText: string;
  tableData: any;
}

export const DonutChart: React.FC<DonutChartProps> = (props) => {
  const data = [
    {
      type: 'pie',
      labels: props.labels,
      values: props.values,
      hole: props.hole ?? 0.6,
      marker: { colors: props.colors },
      textinfo: 'percent',
    },
  ];
  return <PlotChart {...props} data={data} />;
};

// 13. ForecastChart
export interface ForecastChartProps {
  id: string;
  title?: string;
  xHist: string[];
  yHist: number[];
  xFore: string[];
  yFore: number[];
  lower80: number[];
  upper80: number[];
  lower95: number[];
  upper95: number[];
  concept?: keyof typeof conceptColors;
  altText: string;
  tableData: any;
}

export const ForecastChart: React.FC<ForecastChartProps> = (props) => {
  const color = getConceptColor(props.concept || 'default');

  const data = [
    {
      type: 'scatter',
      mode: 'lines',
      x: [...props.xFore, ...props.xFore.slice().reverse()],
      y: [...props.upper95, ...props.lower95.slice().reverse()],
      fill: 'toself',
      fillcolor: 'rgba(207, 232, 245, 0.3)', // sky-200 with opacity
      line: { color: 'transparent' },
      name: 'IC 95%',
      showlegend: true,
    },
    {
      type: 'scatter',
      mode: 'lines',
      x: [...props.xFore, ...props.xFore.slice().reverse()],
      y: [...props.upper80, ...props.lower80.slice().reverse()],
      fill: 'toself',
      fillcolor: 'rgba(124, 196, 232, 0.3)', // sky-400 with opacity
      line: { color: 'transparent' },
      name: 'IC 80%',
      showlegend: true,
    },
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: props.xHist,
      y: props.yHist,
      name: 'Histórico',
      line: { color: '#0B2A47', width: 2 }, // navy-900
    },
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: props.xFore,
      y: props.yFore,
      name: 'Pronóstico',
      line: { color, width: 2, dash: 'dash' },
    },
  ];
  return <PlotChart {...props} data={data} />;
};
