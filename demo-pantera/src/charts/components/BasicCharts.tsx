import React from 'react';
import { PlotChart } from '../PlotChart';
import { getConceptColor } from '../theme';
import { conceptColors } from '../../ui/conceptColors';

// 1. LineChart
export interface LineChartProps {
  id: string;
  title?: string;
  subtitle?: string;
  x: any[];
  series: { name: string; y: number[]; concept?: keyof typeof conceptColors | 'default' }[];
  altText: string;
  tableData: any;
  height?: number;
  loading?: boolean;
}

export const LineChart: React.FC<LineChartProps> = (props) => {
  const data = props.series.map(s => ({
    type: 'scatter',
    mode: 'lines+markers',
    name: s.name,
    x: props.x,
    y: s.y,
    line: { width: 2, color: getConceptColor(s.concept || 'default') },
    marker: { size: 6 }
  }));

  return <PlotChart {...props} data={data} />;
};

// 2. BarChart
export interface BarChartProps {
  id: string;
  title?: string;
  subtitle?: string;
  x: any[];
  series: { name: string; y: number[]; concept?: keyof typeof conceptColors | 'default' }[];
  altText: string;
  tableData: any;
  barmode?: 'group' | 'stack';
  orientation?: 'v' | 'h';
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = (props) => {
  const isHoriz = props.orientation === 'h';
  const data = props.series.map(s => ({
    type: 'bar',
    name: s.name,
    [isHoriz ? 'y' : 'x']: props.x,
    [isHoriz ? 'x' : 'y']: s.y,
    orientation: props.orientation || 'v',
    marker: { color: getConceptColor(s.concept || 'default') }
  }));

  return <PlotChart {...props} data={data} layout={{ barmode: props.barmode || 'group' }} />;
};

// 3. HistogramKde
export interface HistogramKdeProps {
  id: string;
  title?: string;
  values: number[];
  kdeX?: number[];
  kdeY?: number[];
  concept?: keyof typeof conceptColors;
  altText: string;
  tableData: any;
  mean?: number;
  median?: number;
}

export const HistogramKde: React.FC<HistogramKdeProps> = (props) => {
  const color = getConceptColor(props.concept || 'default');
  const data: any[] = [
    {
      type: 'histogram',
      x: props.values,
      name: 'Frecuencia',
      marker: { color, opacity: 0.6 },
      histnorm: props.kdeX ? 'probability density' : ''
    }
  ];

  if (props.kdeX && props.kdeY) {
    data.push({
      type: 'scatter',
      mode: 'lines',
      x: props.kdeX,
      y: props.kdeY,
      name: 'Densidad KDE',
      line: { color: '#0B2A47', width: 2 }
    });
  }

  const shapes = [];
  if (props.mean !== undefined) {
    shapes.push({
      type: 'line',
      x0: props.mean, x1: props.mean,
      y0: 0, y1: 1, yref: 'paper',
      line: { color: '#F26B5B', width: 2, dash: 'dot' } // coral
    });
  }
  if (props.median !== undefined) {
    shapes.push({
      type: 'line',
      x0: props.median, x1: props.median,
      y0: 0, y1: 1, yref: 'paper',
      line: { color: '#2BAE84', width: 2, dash: 'dot' } // verde-agua
    });
  }

  return <PlotChart {...props} data={data} layout={{ shapes, barmode: 'overlay' }} />;
};

// 4. BoxPlot
export interface BoxPlotProps {
  id: string;
  title?: string;
  categories: { name: string; values: number[]; concept?: keyof typeof conceptColors }[];
  altText: string;
  tableData: any;
}

export const BoxPlot: React.FC<BoxPlotProps> = (props) => {
  const data = props.categories.map(c => ({
    type: 'box',
    y: c.values,
    name: c.name,
    boxpoints: 'outliers',
    marker: { color: getConceptColor(c.concept || 'default') }
  }));
  return <PlotChart {...props} data={data} />;
};

// 5. Heatmap
export interface HeatmapProps {
  id: string;
  title?: string;
  x: string[];
  y: string[];
  z: number[][]; // 2D array
  diverging?: boolean;
  altText: string;
  tableData: any;
}

export const Heatmap: React.FC<HeatmapProps> = (props) => {
  const colorscale = props.diverging ? 
    [[0, conceptColors.bajas], [0.5, '#F5FAFD'], [1, conceptColors.ingresos]] : 
    [[0, '#EAF4FA'], [1, '#14507F']];

  const data = [{
    type: 'heatmap',
    x: props.x,
    y: props.y,
    z: props.z,
    colorscale,
    showscale: true
  }];
  return <PlotChart {...props} data={data} />;
};
