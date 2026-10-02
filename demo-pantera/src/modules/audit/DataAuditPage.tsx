// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { generateDataset } from '@/data/generator/structure';
import { validateDataset, VerificationResult } from '@/data/validate';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const DataAuditPage: React.FC = () => {
  const [seed, setSeed] = useState<number>(2026);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Memoize dataset and verifications to avoid recalculating on every render
  const { dataset, verifications } = useMemo(() => {
    const ds = generateDataset(seed);
    const vr = validateDataset(ds, seed !== 2026); // relax tolerances if not 2026
    return { dataset: ds, verifications: vr };
  }, [seed]);

  const stats = {
    total: verifications.length,
    ok: verifications.filter(v => v.resultado === 'ok').length,
    warnings: verifications.filter(v => v.resultado === 'advertencia').length,
    fails: verifications.filter(v => v.resultado === 'falla').length
  };

  const globalStatus = stats.fails > 0 ? 'falla' : (stats.warnings > 0 ? 'advertencia' : 'ok');

  const handleRegenerate = (newSeed: number) => {
    setIsGenerating(true);
    // Add small timeout to allow UI to render loading state
    setTimeout(() => {
      setSeed(newSeed);
      setIsGenerating(false);
    }, 100);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-800">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-jakarta text-navy-900">Auditoría de Datos Generados</h1>
          <p className="text-slate-500 mt-1">Validación de reconciliación y coherencia estocástica</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium mr-2">Semilla actual: <span className="font-bold text-blue-600">{seed}</span></div>
          <button 
            onClick={() => handleRegenerate(2026)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${seed === 2026 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
          >
            2026 (Oficial)
          </button>
          <button 
            onClick={() => handleRegenerate(2027)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${seed === 2027 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
          >
            2027
          </button>
          <button 
            onClick={() => handleRegenerate(7)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${seed === 7 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
          >
            7
          </button>
          <button 
            onClick={() => handleRegenerate(99)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${seed === 99 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
          >
            99
          </button>
        </div>
      </header>

      {/* Semáforo Global */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-2xl shadow-sm border ${globalStatus === 'ok' ? 'bg-emerald-50 border-emerald-100' : globalStatus === 'advertencia' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}`}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-500">Estado Global</h3>
          <div className="flex items-center gap-3">
            {globalStatus === 'ok' && <CheckCircle2 className="w-8 h-8 text-emerald-500" />}
            {globalStatus === 'advertencia' && <AlertTriangle className="w-8 h-8 text-amber-500" />}
            {globalStatus === 'falla' && <XCircle className="w-8 h-8 text-rose-500" />}
            <span className={`text-2xl font-bold capitalize ${globalStatus === 'ok' ? 'text-emerald-700' : globalStatus === 'advertencia' ? 'text-amber-700' : 'text-rose-700'}`}>
              {globalStatus === 'ok' ? 'Óptimo' : globalStatus === 'advertencia' ? 'Con Advertencias' : 'Fallido'}
            </span>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl shadow-sm border bg-white border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-500">Verificaciones</h3>
          <div className="text-3xl font-jakarta font-bold text-navy-900">{stats.total}</div>
        </div>
        
        <div className="p-6 rounded-2xl shadow-sm border bg-white border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-500">Aprobadas</h3>
          <div className="text-3xl font-jakarta font-bold text-emerald-600">{stats.ok}</div>
        </div>
        
        <div className="p-6 rounded-2xl shadow-sm border bg-white border-slate-100 flex justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-500">Alertas</h3>
            <div className="text-3xl font-jakarta font-bold text-amber-500">{stats.warnings}</div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-500">Fallas</h3>
            <div className="text-3xl font-jakarta font-bold text-rose-500">{stats.fails}</div>
          </div>
        </div>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <RefreshCw className="w-10 h-10 animate-spin mb-4" />
          <p>Regenerando universo de datos...</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-sm font-medium text-slate-500">
                  <th className="p-4">ID</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Descripción</th>
                  <th className="p-4">Esperado</th>
                  <th className="p-4">Obtenido</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v) => (
                  <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-400">{v.id}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        {v.categoria}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-navy-900">{v.descripcion}</td>
                    <td className="p-4 text-slate-500">{v.esperado}</td>
                    <td className="p-4 font-semibold text-slate-700">{v.obtenido}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {v.resultado === 'ok' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {v.resultado === 'advertencia' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                        {v.resultado === 'falla' && <XCircle className="w-5 h-5 text-rose-500" />}
                        <span className={`text-sm font-medium capitalize ${
                          v.resultado === 'ok' ? 'text-emerald-700' : 
                          v.resultado === 'advertencia' ? 'text-amber-700' : 'text-rose-700'
                        }`}>
                          {v.resultado}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      
      <div className="mt-8 text-center text-sm text-slate-400">
        <p>Los datos mostrados en esta aplicación provienen de una simulación estocástica generada localmente en el navegador.</p>
      </div>
    </div>
  );
};
