import React, { useEffect, useRef, useState, useMemo } from 'react';
import { chartTheme } from './theme';
import { Download, Table as TableIcon, Maximize, MessageCircle } from 'lucide-react';

// Lazy load plotly to ensure it is in a separate chunk
const loadPlotly = () => import('plotly.js-dist-min').then((m) => m.default || m);

export interface TableColumn {
  key: string;
  header: string;
}

export interface PlotChartProps {
  id: string;
  title?: string;
  subtitle?: string;
  data: any[];
  layout?: any;
  altText: string;
  tableData: {
    columns: TableColumn[];
    rows: any[];
  };
  onExplain?: () => void;
  height?: number | string;
  loading?: boolean;
  emptyMessage?: string;
}

export const PlotChart: React.FC<PlotChartProps> = ({
  id,
  title,
  subtitle,
  data,
  layout,
  altText,
  tableData,
  onExplain,
  height = 400,
  loading,
  emptyMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [plotlyInstance, setPlotlyInstance] = useState<any>(null);
  const [viewTable, setViewTable] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadPlotly()
      .then((Plotly) => {
        if (active) {
          setPlotlyInstance(Plotly);
          setIsLoaded(true);
        }
      })
      .catch((e) => {
        if (active) setError('Error al cargar la biblioteca de gráficas: ' + e.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const mergedLayout = useMemo(() => {
    return {
      ...chartTheme,
      ...layout,
      title: undefined, // Handle title in our wrapper instead of Plotly native
      autosize: true,
      margin: { ...chartTheme.margin, ...layout?.margin },
    };
  }, [layout]);

  useEffect(() => {
    if (!isLoaded || !plotlyInstance || !plotRef.current || viewTable || loading) return;

    if (data.length === 0) return;

    const config = {
      displayModeBar: false,
      responsive: true,
    };

    plotlyInstance
      .newPlot(plotRef.current, data, mergedLayout, config)
      .catch((e: any) => setError(e.message));

    // Cleanup
    return () => {
      if (plotRef.current && plotlyInstance) {
        plotlyInstance.purge(plotRef.current);
      }
    };
  }, [isLoaded, plotlyInstance, data, mergedLayout, viewTable, loading]);

  useEffect(() => {
    if (!plotRef.current || !plotlyInstance) return;
    const resizeObserver = new ResizeObserver(() => {
      if (plotRef.current && plotlyInstance) {
        plotlyInstance.Plots.resize(plotRef.current);
      }
    });
    resizeObserver.observe(plotRef.current);
    return () => resizeObserver.disconnect();
  }, [plotlyInstance, viewTable]);

  const handleExportPNG = async () => {
    if (!plotRef.current || !plotlyInstance) return;
    try {
      const url = await plotlyInstance.toImage(plotRef.current, {
        format: 'png',
        width: 1200,
        height: 800,
        scale: 2,
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}_grafica.png`;
      a.click();
    } catch (e) {
      console.error('Error exporting PNG', e);
    }
  };

  const handleExportCSV = () => {
    if (!tableData || tableData.rows.length === 0) return;
    const header = tableData.columns.map((c) => c.header).join(',');
    const rows = tableData.rows
      .map((r) => tableData.columns.map((c) => `"${r[c.key]}"`).join(','))
      .join('\n');
    const csv = `${header}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}_datos.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      setFullScreen(true);
    } else {
      document.exitFullscreen();
      setFullScreen(false);
    }
  };

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 bg-coral bg-opacity-10 rounded border border-coral text-coral"
        style={{ height }}
      >
        <p className="font-bold">Error renderizando gráfica</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-white rounded-lg shadow-sm border border-ice-100 transition-all duration-400 ${fullScreen ? 'p-8 overflow-auto' : 'p-4'}`}
      style={{ height: fullScreen ? '100vh' : height }}
      aria-label={altText}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          {title && <h3 className="text-lg font-semibold text-navy-900">{title}</h3>}
          {subtitle && <p className="text-sm text-secundario">{subtitle}</p>}
        </div>

        <div
          className="flex gap-2"
          role="toolbar"
          aria-label={`Herramientas para la gráfica ${title || id}`}
        >
          {onExplain && (
            <button
              onClick={onExplain}
              className="p-1.5 text-secundario hover:text-blue-600 hover:bg-ice-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Explícame esta gráfica"
              aria-label="Explicar"
            >
              <MessageCircle size={18} />
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="p-1.5 text-secundario hover:text-blue-600 hover:bg-ice-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Descargar datos en CSV"
            aria-label="Descargar CSV"
          >
            <span className="text-xs font-bold mr-1">CSV</span>
          </button>
          {!viewTable && (
            <button
              onClick={handleExportPNG}
              className="p-1.5 text-secundario hover:text-blue-600 hover:bg-ice-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Descargar imagen PNG"
              aria-label="Descargar PNG"
            >
              <Download size={18} />
            </button>
          )}
          <button
            onClick={() => setViewTable(!viewTable)}
            className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${viewTable ? 'text-blue-600 bg-ice-50' : 'text-secundario hover:text-blue-600 hover:bg-ice-50'}`}
            title={viewTable ? 'Ver gráfica' : 'Ver tabla de datos'}
            aria-label="Alternar vista de tabla"
          >
            <TableIcon size={18} />
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-1.5 text-secundario hover:text-blue-600 hover:bg-ice-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Pantalla completa"
            aria-label="Pantalla completa"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 animate-pulse">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-sm text-secundario">Cargando visualización...</span>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-secundario">
              {emptyMessage || 'No hay datos disponibles para este periodo.'}
            </p>
          </div>
        ) : viewTable ? (
          <div className="absolute inset-0 overflow-auto border border-ice-100 rounded">
            <table className="min-w-full divide-y divide-ice-100 text-sm">
              <thead className="bg-ice-50 sticky top-0">
                <tr>
                  {tableData.columns.map((c) => (
                    <th key={c.key} className="px-4 py-2 text-left font-semibold text-navy-900">
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ice-100 bg-white">
                {tableData.rows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-ice-50 transition-colors">
                    {tableData.columns.map((c) => (
                      <td key={c.key} className="px-4 py-2 text-secundario">
                        {String(r[c.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <div
              ref={plotRef}
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: isLoaded ? 1 : 0 }}
              aria-hidden="true"
            />
            {/* Screen reader only table for accessibility */}
            <div className="sr-only">
              <table aria-label={`Datos de ${title || altText}`}>
                <thead>
                  <tr>
                    {tableData.columns.map((c) => (
                      <th key={c.key}>{c.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((r, idx) => (
                    <tr key={idx}>
                      {tableData.columns.map((c) => (
                        <td key={c.key}>{String(r[c.key])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
