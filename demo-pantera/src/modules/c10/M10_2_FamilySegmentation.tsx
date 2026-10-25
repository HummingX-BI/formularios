import { useState, useEffect, useMemo } from 'react';
import { PlotChart } from '@/charts/PlotChart';
import { runMLTask } from '@/ml/workers/mlClient';
import type { KMeansResult } from '@/ml/kmeans';
import type { PCAResult } from '@/ml/pca';
import { Card } from '@/ui/components/Cards';
import { Settings, BrainCircuit, BarChart3, Users, Zap, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export default function M10_2_FamilySegmentation() {
  const [loading, setLoading] = useState(true);
  const [kmeansRes, setKmeansRes] = useState<KMeansResult | null>(null);
  const [pcaRes, setPcaRes] = useState<PCAResult | null>(null);
  const [error, setError] = useState('');

  // Extract variables
  const dataExtract = useMemo(() => {
    // Families: ≈410. We'll group students by family id, or just mock families for the demo.
    const families = [];
    for (let i = 0; i < 410; i++) {
      const isHighValue = i % 10 === 0;
      const isSleeping = i % 8 === 0;
      const isNew = i % 12 === 0;

      let ticket = 800 + Math.random() * 400;
      let antiguedad = 6 + Math.random() * 18;
      let asistencia = 85 + Math.random() * 15;
      let atraso = Math.random() * 5;
      let hijos = 1 + Math.floor(Math.random() * 2);
      let riesgo = Math.random() * 0.2;
      let sesiones = 2;

      if (isHighValue) {
        ticket += 800;
        hijos = 2;
        asistencia = 95;
        riesgo = 0.05;
      }
      if (isSleeping) {
        asistencia = 40 + Math.random() * 20;
        riesgo = 0.8;
        atraso = 15;
      }
      if (isNew) {
        antiguedad = Math.random() * 2;
        riesgo = 0.4;
      }

      families.push({
        id: `FAM-${1000 + i}`,
        ticket,
        antiguedad,
        asistencia,
        atraso,
        hijos,
        riesgo,
        sesiones,
      });
    }

    const X = families.map((f) => [
      f.ticket,
      f.antiguedad,
      f.asistencia,
      f.atraso,
      f.hijos,
      f.riesgo,
      f.sesiones,
    ]);
    return { families, X };
  }, []);

  useEffect(() => {
    async function runModels() {
      try {
        setLoading(true);
        // Run KMeans
        const km = await runMLTask<KMeansResult>('kmeans', {
          X: dataExtract.X,
          maxK: 8,
          targetK: 5,
          seed: 123,
        });
        setKmeansRes(km);

        // Run PCA
        const pc = await runMLTask<PCAResult>('pca', { X: dataExtract.X });
        setPcaRes(pc);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    runModels();
  }, [dataExtract]);

  const { clusterData, elbowData } = useMemo(() => {
    if (!kmeansRes || !pcaRes) return { clusterData: null, elbowData: null };

    // Deterministic cluster naming based on centroid properties
    const segmentNames: string[] = [];
    kmeansRes.centroids.forEach((centroid) => {
      const ticket = centroid[0]!;
      const asistencia = centroid[2]!;
      const riesgo = centroid[5]!;

      let name = '';
      if (riesgo > 0.6) name = 'Familias dormidas';
      else if (ticket > 1200 && riesgo > 0.3) name = 'Alto valor con riesgo';
      else if (ticket > 1200) name = 'Familias constantes';
      else if (asistencia > 85) name = 'Nuevas en exploración';
      else name = 'Sensibles al precio';

      // Ensure uniqueness
      let finalName = name;
      let counter = 1;
      while (segmentNames.includes(finalName)) {
        finalName = `${name} (${counter++})`;
      }
      segmentNames.push(finalName);
    });

    const traces = segmentNames.map((name, cIdx) => {
      const x: number[] = [];
      const y: number[] = [];
      const sizes: number[] = [];
      const texts: string[] = [];

      kmeansRes.assignments.forEach((assign, i) => {
        if (assign === cIdx) {
          x.push(pcaRes.projection2D[i]![0]!);
          y.push(pcaRes.projection2D[i]![1]!);
          sizes.push(dataExtract.families[i]!.ticket / 100);
          texts.push(
            `${dataExtract.families[i]!.id} ($${dataExtract.families[i]!.ticket.toFixed(0)})`,
          );
        }
      });

      return {
        type: 'scatter',
        mode: 'markers',
        name,
        x,
        y,
        text: texts,
        marker: { size: sizes, sizemode: 'area', sizeref: 0.1, opacity: 0.7 },
      };
    });

    const elbowTrace = [
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: kmeansRes.elbow.map((e) => e.k),
        y: kmeansRes.elbow.map((e) => e.inertia),
        line: { color: '#6366f1', width: 2 },
        marker: { color: '#6366f1' },
        name: 'Inercia',
      },
    ];

    return { clusterData: traces, elbowData: elbowTrace, segmentNames };
  }, [kmeansRes, pcaRes, dataExtract]);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <BrainCircuit size={12} /> Clusterización K-Means
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Segmentación de Familias
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Clasificación automática de clientes para campañas hiper-personalizadas.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-indigo-800 bg-indigo-50/50 rounded-3xl border border-indigo-100">
          <Settings className="animate-spin text-indigo-500 mb-4" size={40} />
          <p className="font-bold text-lg">Procesando 410 expedientes...</p>
          <p className="text-sm text-indigo-600/80 mt-1">
            Ejecutando K-Means y Análisis de Componentes Principales en el Motor ML...
          </p>
        </div>
      )}

      {error && (
        <div className="text-rose-700 font-bold bg-rose-50 p-4 rounded-3xl border border-rose-200">
          Error ML: {error}
        </div>
      )}

      {!loading && kmeansRes && pcaRes && clusterData && (
        <>
          <div className="grid grid-cols-12 gap-6">
            
            {/* PCA SCATTER */}
            <Card className="col-span-12 lg:col-span-8 p-0 border border-slate-200 bg-white rounded-3xl flex flex-col h-[550px] shadow-sm">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-500" /> Mapa de Agrupamiento (PCA 2D)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Dimensiones originales comprimidas de 7 a 2 usando PCA. Explica el {((pcaRes.explainedVarianceRatio[0]! + pcaRes.explainedVarianceRatio[1]!) * 100).toFixed(1)}% de la varianza total.</p>
                </div>
              </div>
              <div className="flex-1 p-6 relative w-full">
                <PlotChart
                  id="pca_scatter"
                  data={clusterData as any}
                  layout={{
                    margin: { l: 40, r: 20, t: 20, b: 40 },
                    xaxis: { title: 'Componente 1', gridcolor: 'transparent', tickfont: { family: 'Inter', color: '#94a3b8' } },
                    yaxis: { title: 'Componente 2', gridcolor: '#f1f5f9', tickfont: { family: 'Inter', color: '#94a3b8' } },
                    legend: { orientation: 'h', y: -0.15, font: { family: 'Inter', color: '#64748b' } },
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                  }}
                  altText="Dispersión de clusters PCA"
                  tableData={{ columns: [], rows: [] }}
                />
              </div>
            </Card>

            {/* AI DIAGNOSTICS & RULES */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              
              <Card className="p-0 border border-slate-200 shadow-sm rounded-3xl flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h4 className="font-bold text-slate-900 text-sm">Validación del Modelo (Codo)</h4>
                </div>
                <div className="p-5 relative w-full h-[220px]">
                  <PlotChart
                    id="elbow_chart"
                    data={elbowData as any}
                    layout={{
                      margin: { l: 40, r: 10, t: 10, b: 30 },
                      xaxis: { title: 'Clusters (k)', gridcolor: 'transparent', tickfont: { family: 'Inter', color: '#94a3b8' } },
                      yaxis: { title: 'Inercia', gridcolor: '#f1f5f9', tickfont: { family: 'Inter', color: '#94a3b8' } },
                      paper_bgcolor: 'transparent',
                      plot_bgcolor: 'transparent',
                    }}
                    altText="Gráfico del codo"
                    tableData={{ columns: [], rows: [] }}
                  />
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 rounded-b-3xl">
                  <strong>Silueta:</strong> {kmeansRes.silhouette.toFixed(2)}. Un valor mayor a 0.5 indica que los clústeres están bien separados.
                </div>
              </Card>

              <Card className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden flex-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
                <h4 className="font-bold text-indigo-400 text-sm mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <Activity size={16} /> Reglas de Asignación
                </h4>
                <ul className="text-sm text-slate-300 space-y-3">
                  <li className="flex gap-2 items-start"><span className="text-emerald-400 mt-0.5">•</span> <div><strong className="text-white">Constantes:</strong> Alta asistencia, bajo riesgo.</div></li>
                  <li className="flex gap-2 items-start"><span className="text-blue-400 mt-0.5">•</span> <div><strong className="text-white">Sensibles:</strong> Ticket menor a $1200, regulares.</div></li>
                  <li className="flex gap-2 items-start"><span className="text-amber-400 mt-0.5">•</span> <div><strong className="text-white">Alto Valor / Riesgo:</strong> Ticket alto, ausencias en aumento.</div></li>
                  <li className="flex gap-2 items-start"><span className="text-cyan-400 mt-0.5">•</span> <div><strong className="text-white">Nuevas:</strong> Antigüedad menor a 2 meses.</div></li>
                  <li className="flex gap-2 items-start"><span className="text-rose-400 mt-0.5">•</span> <div><strong className="text-white">Dormidas:</strong> Riesgo matemático mayor a 60%.</div></li>
                </ul>
              </Card>

            </div>
          </div>

          {/* PERFILES DE SEGMENTOS */}
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Users size={24} className="text-indigo-500" /> Perfiles y Acciones Sugeridas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clusterData.map((cluster, i) => {
                const size = kmeansRes.assignments.filter((a) => a === i).length;
                const c = kmeansRes.centroids[i]!;
                
                let accentColor = 'bg-slate-100 text-slate-600 border-slate-200';
                let icon = <Users size={16} />;
                if (cluster.name.includes('dormidas')) { accentColor = 'bg-rose-50 text-rose-700 border-rose-200'; icon = <ShieldAlert size={16} />; }
                if (cluster.name.includes('constantes')) { accentColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'; icon = <Sparkles size={16} />; }
                if (cluster.name.includes('Nuevas')) { accentColor = 'bg-cyan-50 text-cyan-700 border-cyan-200'; icon = <Activity size={16} />; }
                if (cluster.name.includes('riesgo')) { accentColor = 'bg-amber-50 text-amber-700 border-amber-200'; icon = <Zap size={16} />; }
                if (cluster.name.includes('Sensibles')) { accentColor = 'bg-blue-50 text-blue-700 border-blue-200'; }

                return (
                  <Card
                    key={i}
                    className="p-0 border border-slate-200 bg-white shadow-sm rounded-3xl flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="font-bold text-slate-900 text-base">{cluster.name}</h4>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${accentColor}`}>
                          {icon} {size} fams
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span className="text-slate-500">Ticket Promedio</span>
                          <span className="font-bold text-slate-900">${c[0]!.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span className="text-slate-500">Asistencia</span>
                          <span className="font-bold text-slate-900">{c[2]!.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Riesgo Promedio</span>
                          <span className={`font-bold ${c[5]! > 0.4 ? 'text-rose-500' : 'text-slate-900'}`}>
                            {(c[5]! * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Acción Estratégica Sugerida</p>
                      <p className="text-sm font-medium text-slate-700 leading-snug">
                        {cluster.name.includes('dormidas') && 'Lanzar campaña de rescate con 50% en reingreso inmediato.'}
                        {cluster.name.includes('constantes') && 'Ofrecer upgrade VIP, pase anual o incentivos por referidos.'}
                        {cluster.name.includes('Nuevas') && 'Llamada de calidad de coordinación para asegurar adaptación.'}
                        {cluster.name.includes('riesgo') && 'Intervención inmediata del gerente para retener la cuenta.'}
                        {cluster.name.includes('Sensibles') && 'Mantener cuotas fijas, evitar empujar ventas cruzadas.'}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
