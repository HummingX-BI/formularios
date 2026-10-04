import { conceptColors } from '../ui/conceptColors';

export const chartTheme = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: {
    family: "'Inter Variable', 'Inter', sans-serif",
    size: 12,
    color: '#0B2A47', // navy-900
  },
  margin: { t: 40, r: 20, b: 40, l: 50, pad: 4 },
  xaxis: {
    showgrid: false,
    zeroline: false,
    showline: true,
    linecolor: '#8AA3B8', // gris-azulado
    tickcolor: '#8AA3B8',
    tickfont: { color: '#4A6A85', size: 11 }, // secundario
    title: { font: { size: 12, color: '#4A6A85' } },
  },
  yaxis: {
    showgrid: true,
    gridcolor: '#EAF4FA', // ice-100
    zeroline: false,
    showline: true,
    linecolor: '#8AA3B8',
    tickcolor: '#8AA3B8',
    tickfont: { color: '#4A6A85', size: 11 },
    title: { font: { size: 12, color: '#4A6A85' } },
  },
  colorway: [
    conceptColors.ingresos, // blue-600
    conceptColors.prospectos, // periwinkle
    conceptColors.bajas, // coral
    conceptColors.retencion, // verde-agua
    conceptColors.ocupacion, // aqua-500
    conceptColors.cobranza, // ámbar
    '#7CC4E8', // sky-400
    '#4A6A85', // secundario
  ],
  hoverlabel: {
    bgcolor: '#FFFFFF',
    bordercolor: '#CFE8F5',
    font: { family: "'Inter Variable', 'Inter', sans-serif", size: 12, color: '#0B2A47' },
  },
  legend: {
    orientation: 'h' as const,
    yanchor: 'bottom' as const,
    y: 1.02,
    xanchor: 'right' as const,
    x: 1,
    font: { size: 11, color: '#4A6A85' },
    bgcolor: 'transparent',
  },
};

export const getConceptColor = (concept: keyof typeof conceptColors | 'default'): string => {
  if (concept === 'default') return chartTheme.colorway[0]!;
  return (conceptColors[concept] as string) || chartTheme.colorway[0]!;
};

// Generic diverging scale: coral to white to blue
export const divergingColorScale = [
  [0, conceptColors.bajas],
  [0.5, '#F5FAFD'], // ice-50
  [1, conceptColors.ingresos],
];

// Sequential blue scale
export const sequentialColorScale = [
  [0, '#EAF4FA'], // ice-100
  [0.5, '#7CC4E8'], // sky-400
  [1, '#14507F'], // blue-800
];
