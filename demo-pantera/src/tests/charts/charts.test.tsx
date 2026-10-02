import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { 
  LineChart, BarChart, HistogramKde, Heatmap, 
  ScatterRegression, ForecastChart, SurvivalCurve, DonutChart
} from '../../charts';

// Mock PlotChart to just capture and expose the props
vi.mock('../../charts/PlotChart', () => ({
  PlotChart: (props: any) => {
    // Render a hidden div with JSON data for testing
    return <div data-testid="plot-mock" data-props={JSON.stringify(props.data)} data-layout={JSON.stringify(props.layout)}></div>;
  }
}));

const commonTable = {
  columns: [{ key: 'x', header: 'X' }, { key: 'y', header: 'Y' }],
  rows: [{ x: 1, y: 10 }]
};

describe('Chart Components - Trace Construction', () => {
  
  it('LineChart builds correct scatter traces', () => {
    const { getByTestId } = render(
      <LineChart 
        id="test" altText="alt" tableData={commonTable}
        x={[1, 2]} series={[{ name: 'A', y: [10, 20] }]}
      />
    );
    const props = JSON.parse(getByTestId('plot-mock').getAttribute('data-props') || '[]');
    expect(props).toHaveLength(1);
    expect(props[0].type).toBe('scatter');
    expect(props[0].mode).toBe('lines+markers');
    expect(props[0].x).toEqual([1, 2]);
    expect(props[0].y).toEqual([10, 20]);
  });

  it('BarChart builds correct bar traces', () => {
    const { getByTestId } = render(
      <BarChart 
        id="test" altText="alt" tableData={commonTable}
        x={['A']} series={[{ name: 'S1', y: [10] }]} barmode="stack"
      />
    );
    const props = JSON.parse(getByTestId('plot-mock').getAttribute('data-props') || '[]');
    const layout = JSON.parse(getByTestId('plot-mock').getAttribute('data-layout') || '{}');
    expect(props[0].type).toBe('bar');
    expect(layout.barmode).toBe('stack');
  });

  it('HistogramKde adds density line when provided', () => {
    const { getByTestId } = render(
      <HistogramKde 
        id="test" altText="alt" tableData={commonTable}
        values={[1,2,3]} kdeX={[1,2,3]} kdeY={[0.1, 0.2, 0.1]} mean={2}
      />
    );
    const props = JSON.parse(getByTestId('plot-mock').getAttribute('data-props') || '[]');
    const layout = JSON.parse(getByTestId('plot-mock').getAttribute('data-layout') || '{}');
    expect(props).toHaveLength(2); // Hist + KDE
    expect(props[1].type).toBe('scatter');
    expect(layout.shapes).toHaveLength(1); // Mean line
  });

  it('Heatmap uses sequential scale by default', () => {
    const { getByTestId } = render(
      <Heatmap 
        id="test" altText="alt" tableData={commonTable}
        x={['A']} y={['B']} z={[[1]]}
      />
    );
    const props = JSON.parse(getByTestId('plot-mock').getAttribute('data-props') || '[]');
    expect(props[0].type).toBe('heatmap');
    expect(props[0].colorscale).toHaveLength(2); // Sequential
  });

  it('ScatterRegression builds regression line and bands', () => {
    const { getByTestId } = render(
      <ScatterRegression 
        id="test" altText="alt" tableData={commonTable}
        x={[1, 2]} y={[2, 3]} lineX={[1, 2]} lineY={[2, 3]}
        upperY={[3, 4]} lowerY={[1, 2]} equation="y=x"
      />
    );
    const props = JSON.parse(getByTestId('plot-mock').getAttribute('data-props') || '[]');
    expect(props).toHaveLength(3); // Points, IC band, Regression line
  });

  it('ForecastChart builds fan bands and historical + forecast lines', () => {
    const { getByTestId } = render(
      <ForecastChart 
        id="test" altText="alt" tableData={commonTable}
        xHist={['Ene']} yHist={[10]} xFore={['Feb']} yFore={[20]}
        upper80={[25]} lower80={[15]} upper95={[30]} lower95={[10]}
      />
    );
    const props = JSON.parse(getByTestId('plot-mock').getAttribute('data-props') || '[]');
    expect(props).toHaveLength(4); // IC95, IC80, Hist, Fore
    expect(props[0].fill).toBe('toself'); // IC95 band
  });
  
  it('SurvivalCurve plots Kaplan-Meier correctly', () => {
    const { getByTestId } = render(
      <SurvivalCurve 
        id="test" altText="alt" tableData={commonTable}
        groups={[{ name: 'G1', times: [0, 1], survival: [1, 0.5], upper: [1, 0.8], lower: [1, 0.2] }]}
      />
    );
    const props = JSON.parse(getByTestId('plot-mock').getAttribute('data-props') || '[]');
    // 2 traces per group (IC + line)
    expect(props).toHaveLength(2);
    expect(props[1].line.shape).toBe('hv'); // Steps!
  });

  it('DonutChart applies hole ratio', () => {
    const { getByTestId } = render(
      <DonutChart 
        id="test" altText="alt" tableData={commonTable}
        labels={['A']} values={[10]} hole={0.7}
      />
    );
    const props = JSON.parse(getByTestId('plot-mock').getAttribute('data-props') || '[]');
    expect(props[0].hole).toBe(0.7);
  });
});
