import React from 'react';
import { PlotChart } from '../PlotChart';
import { getConceptColor } from '../theme';
import { conceptColors } from '../../ui/conceptColors';

// 6. ScatterRegression
export interface ScatterRegressionProps {
  id: string;
  title?: string;
  x: number[];
  y: number[];
  lineX?: number[];
  lineY?: number[];
  upperY?: number[];
  lowerY?: number[];
  equation?: string;
  concept?: keyof typeof conceptColors;
  altText: string;
  tableData: any;
}

export const ScatterRegression: React.FC<ScatterRegressionProps> = (props) => {
  const color = getConceptColor(props.concept || 'default');
  const data: any[] = [
    {
      type: 'scatter',
      mode: 'markers',
      x: props.x,
      y: props.y,
      name: 'Datos',
      marker: { color, size: 6, opacity: 0.7 },
    },
  ];

  if (props.lineX && props.lineY) {
    if (props.upperY && props.lowerY) {
      // Confidence band
      data.push({
        type: 'scatter',
        mode: 'lines',
        x: [...props.lineX, ...props.lineX.slice().reverse()],
        y: [...props.upperY, ...props.lowerY.slice().reverse()],
        fill: 'toself',
        fillcolor: color.replace(')', ', 0.2)').replace('rgb', 'rgba'),
        line: { color: 'transparent' },
        name: 'IC 95%',
        showlegend: true,
      });
    }

    // Regression line
    data.push({
      type: 'scatter',
      mode: 'lines',
      x: props.lineX,
      y: props.lineY,
      name: 'Ajuste',
      line: { color: '#0B2A47', width: 2 },
    });
  }

  const annotations = props.equation
    ? [
        {
          x: 0.05,
          y: 0.95,
          xref: 'paper',
          yref: 'paper',
          text: props.equation,
          showarrow: false,
          font: { size: 12, color: '#0B2A47' },
          bgcolor: 'rgba(255,255,255,0.8)',
          bordercolor: '#CFE8F5',
          borderpad: 4,
        },
      ]
    : [];

  return <PlotChart {...props} data={data} layout={{ annotations }} />;
};

// 7. FunnelChart
export interface FunnelChartProps {
  id: string;
  title?: string;
  stages: string[];
  values: number[];
  concept?: keyof typeof conceptColors;
  altText: string;
  tableData: any;
}

export const FunnelChart: React.FC<FunnelChartProps> = (props) => {
  const data = [
    {
      type: 'funnel',
      y: props.stages,
      x: props.values,
      textinfo: 'value+percent initial',
      marker: { color: getConceptColor(props.concept || 'default') },
    },
  ];
  return <PlotChart {...props} data={data} />;
};

// 8. SankeyChart
export interface SankeyChartProps {
  id: string;
  title?: string;
  labels: string[];
  source: number[];
  target: number[];
  value: number[];
  colors?: string[]; // Node colors
  altText: string;
  tableData: any;
}

export const SankeyChart: React.FC<SankeyChartProps> = (props) => {
  const data = [
    {
      type: 'sankey',
      orientation: 'h',
      node: {
        pad: 15,
        thickness: 20,
        line: { color: 'black', width: 0.5 },
        label: props.labels,
        color: props.colors || Array(props.labels.length).fill('#7CC4E8'),
      },
      link: {
        source: props.source,
        target: props.target,
        value: props.value,
        color: 'rgba(207, 232, 245, 0.6)', // sky-200 with opacity
      },
    },
  ];
  return <PlotChart {...props} data={data} />;
};
