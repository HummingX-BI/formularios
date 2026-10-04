import { useState } from 'react';
import { useAppStore } from '@/app/store';
import { BUSINESS_CONFIG } from '@/config';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Badge } from '@/ui/components/DataDisplay';
import { Settings, Save, RotateCcw, AlertTriangle, Layers, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/insights/templates';

const AFFECTED_MODULES: Record<string, string[]> = {
  price: ['M11.2 (Simulador)', 'M4.5 (LTV) Proyecciones'],
  revenueTarget: ['M4.4 (Ingresos vs Facturable)'],
  costD19: ['M4.6 (Rentabilidad)'],
  saturationThreshold: ['M6.2 (Saturación)'],
  riskThreshold: ['M7.1 (Riesgo de Baja)', 'M13.2 (Campañas)'],
  elasticity: ['M11.2 (Simulador)', 'M6.4 (Simulador Mkt)'],
};

export default function M13_3_Config() {
  const { configOverrides, updateOverrides } = useAppStore(); 
  
  const [localPrices, setLocalPrices] = useState<Record<string, number>>(configOverrides.prices || {}); 
  const [localTarget, setLocalTarget] = useState(configOverrides.revenueTarget || BUSINESS_CONFIG.targets.monthlyRevenue); 
  const [localCostD19, setLocalCostD19] = useState(configOverrides.costD19 || BUSINESS_CONFIG.costs.d19_per_kg); 
  const [localSat, setLocalSat] = useState(configOverrides.saturationThreshold || BUSINESS_CONFIG.thresholds.occupancySaturation); 
  const [localRisk, setLocalRisk] = useState(configOverrides.riskThreshold || BUSINESS_CONFIG.thresholds.churnRisk); 
  
  const [activeTab, setActiveTab] = useState<'params' | 'plans' | 'pools'>('params'); 
  const [saved, setSaved] = useState(false); 
  
  const getPrice = (planId: string) => { 
    if (localPrices[planId] !== undefined) return localPrices[planId]; 
    return BUSINESS_CONFIG.plans.find(p => p.id === planId)?.monthlyPrice || 0; 
  }; 
  
  const handlePriceChange = (planId: string, val: number) => { 
    setLocalPrices(prev => ({ ...prev, [planId]: val })); 
    setSaved(false); 
  }; 
  
  const handleApply = () => { 
    updateOverrides({ prices: localPrices, revenueTarget: localTarget, costD19: localCostD19, saturationThreshold: localSat, riskThreshold: localRisk }); 
    setSaved(true); 
    setTimeout(() => setSaved(false), 3000); 
  }; 
  
  const handleRestore = () => { 
    setLocalPrices({}); 
    setLocalTarget(BUSINESS_CONFIG.targets.monthlyRevenue); 
    setLocalCostD19(BUSINESS_CONFIG.costs.d19_per_kg); 
    setLocalSat(BUSINESS_CONFIG.thresholds.occupancySaturation); 
    setLocalRisk(BUSINESS_CONFIG.thresholds.churnRisk); 
    updateOverrides({ prices: {}, revenueTarget: BUSINESS_CONFIG.targets.monthlyRevenue, costD19: BUSINESS_CONFIG.costs.d19_per_kg, saturationThreshold: BUSINESS_CONFIG.thresholds.occupancySaturation, riskThreshold: BUSINESS_CONFIG.thresholds.churnRisk }); 
    setSaved(true); 
    setTimeout(() => setSaved(false), 3000); 
  }; 
  
  return ( 
    <div className="space-y-6"> 
      <div className="flex justify-between items-end"> 
        <div> 
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Catálogos y Configuración</h1> 
          <p className="text-lg text-secundario mt-1">Ajuste de parámetros para proyecciones y simuladores</p> 
        </div> 
        <div className="flex items-center gap-4"> 
          {saved && <span className="text-green-600 font-bold flex items-center gap-1"><Save className="w-4 h-4"/> Guardado</span>} 
          <Button variant="ghost" className="flex items-center gap-2" onClick={handleRestore}> <RotateCcw className="w-4 h-4" /> Restaurar por Defecto </Button> 
          <Button variant="primary" className="flex items-center gap-2" onClick={handleApply}> <Save className="w-4 h-4" /> Aplicar Cambios </Button> 
        </div> 
      </div> 
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3"> 
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" /> 
        <div> 
          <p className="font-bold">Regla de Oro de la Sesión</p> 
          <p className="text-sm">Cualquier cambio aquí <b>no afecta el historial del dataset</b> (ej. los ingresos pasados). Las modificaciones solo aplican a proyecciones futuras, umbrales de alerta y motores de simulación.</p> 
        </div> 
      </div> 
      
      <div className="flex border-b border-ice-200 gap-6"> 
        <button className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'params' ? 'border-sky-500 text-sky-600' : 'border-transparent text-secundario hover:text-navy-900'}`} onClick={() => setActiveTab('params')}> Parámetros de Negocio </button> 
        <button className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'plans' ? 'border-sky-500 text-sky-600' : 'border-transparent text-secundario hover:text-navy-900'}`} onClick={() => setActiveTab('plans')}> Planes y Precios </button> 
        <button className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pools' ? 'border-sky-500 text-sky-600' : 'border-transparent text-secundario hover:text-navy-900'}`} onClick={() => setActiveTab('pools')}> Catálogos Solo Lectura </button> 
      </div> 
      
      {activeTab === 'params' && ( 
        <div className="grid grid-cols-2 gap-6"> 
          <Card className="p-6 bg-white border border-ice-100 shadow-sm space-y-6"> 
            <h3 className="font-bold text-navy-900 font-jakarta flex items-center gap-2 border-b border-ice-100 pb-2"> <DollarSign className="w-5 h-5 text-sky-500" /> Metas y Costos </h3> 
            <div> 
              <label className="block text-sm font-semibold text-navy-900 mb-1">Meta de Ingresos Mensual ($)</label> 
              <input type="number" className="w-full p-2 border border-ice-200 rounded-lg" value={localTarget} onChange={e => setLocalTarget(Number(e.target.value))} /> 
              <div className="text-xs text-secundario mt-1">Afecta: {(AFFECTED_MODULES.revenueTarget || []).join(', ')}</div> 
            </div> 
            <div> 
              <label className="block text-sm font-semibold text-navy-900 mb-1">Costo Químico D-19 (por Kg)</label> 
              <input type="number" className="w-full p-2 border border-ice-200 rounded-lg" value={localCostD19} onChange={e => setLocalCostD19(Number(e.target.value))} /> 
              <div className="text-xs text-secundario mt-1">Afecta: {(AFFECTED_MODULES.costD19 || []).join(', ')}</div> 
            </div> 
          </Card> 
          
          <Card className="p-6 bg-white border border-ice-100 shadow-sm space-y-6"> 
            <h3 className="font-bold text-navy-900 font-jakarta flex items-center gap-2 border-b border-ice-100 pb-2"> <Settings className="w-5 h-5 text-sky-500" /> Umbrales de Sistema </h3> 
            <div> 
              <label className="block text-sm font-semibold text-navy-900 mb-1">Saturación de Ocupación (%)</label> 
              <div className="flex items-center gap-3"> 
                <input type="range" className="w-full" min="50" max="100" value={localSat * 100} onChange={e => setLocalSat(Number(e.target.value)/100)} /> 
                <span className="font-bold w-12">{Math.round(localSat * 100)}%</span> 
              </div> 
              <div className="text-xs text-secundario mt-1">Afecta: {(AFFECTED_MODULES.saturationThreshold || []).join(', ')}</div> 
            </div> 
            <div> 
              <label className="block text-sm font-semibold text-navy-900 mb-1">Umbral de Riesgo Alto (Probabilidad %)</label> 
              <div className="flex items-center gap-3"> 
                <input type="range" className="w-full" min="10" max="90" value={localRisk * 100} onChange={e => setLocalRisk(Number(e.target.value)/100)} /> 
                <span className="font-bold w-12">{Math.round(localRisk * 100)}%</span> 
              </div> 
              <div className="text-xs text-secundario mt-1">Afecta: {(AFFECTED_MODULES.riskThreshold || []).join(', ')}</div> 
            </div> 
          </Card> 
        </div> 
      )} 
      
      {activeTab === 'plans' && ( 
        <Card className="p-6 bg-white border border-ice-100 shadow-sm"> 
          <div className="mb-4"> 
            <h3 className="font-bold text-navy-900 font-jakarta">Precios por Plan</h3> 
            <div className="text-xs text-secundario mt-1">Afecta: {(AFFECTED_MODULES.price || []).join(', ')}</div> 
          </div> 
          <table className="w-full text-left"> 
            <thead className="bg-ice-50 border-b border-ice-100"> 
              <tr> 
                <th className="p-4 font-bold text-navy-900 text-sm">Plan ID</th> 
                <th className="p-4 font-bold text-navy-900 text-sm">Nombre</th> 
                <th className="p-4 font-bold text-navy-900 text-sm">Frecuencia</th> 
                <th className="p-4 font-bold text-navy-900 text-sm text-right">Precio Actual</th> 
                <th className="p-4 font-bold text-navy-900 text-sm text-right">Sobrescrito ($)</th> 
              </tr> 
            </thead> 
            <tbody className="divide-y divide-ice-100"> 
              {BUSINESS_CONFIG.plans.map(p => { 
                const current = getPrice(p.id); 
                const isOverridden = current !== p.monthlyPrice; 
                return ( 
                  <tr key={p.id} className="hover:bg-ice-50"> 
                    <td className="p-4 text-sm font-mono text-secundario">{p.id}</td> 
                    <td className="p-4 font-bold text-navy-900">{p.name}</td> 
                    <td className="p-4 text-sm">{p.sessionsPerWeek}x sem</td> 
                    <td className="p-4 text-right line-through text-secundario text-sm">{formatCurrency(p.monthlyPrice)}</td> 
                    <td className="p-4 text-right"> 
                      <input type="number" className={`w-28 p-2 border rounded-lg text-right font-bold ${isOverridden ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-ice-200'}`} value={current} onChange={e => handlePriceChange(p.id, Number(e.target.value))} /> 
                    </td> 
                  </tr> 
                ); 
              })} 
            </tbody> 
          </table> 
        </Card> 
      )} 
      
      {activeTab === 'pools' && ( 
        <div className="grid grid-cols-2 gap-6"> 
          <Card className="p-6 bg-white border border-ice-100 shadow-sm space-y-4 opacity-75"> 
            <h3 className="font-bold text-navy-900 font-jakarta flex items-center gap-2 border-b border-ice-100 pb-2"> <Layers className="w-5 h-5" /> Albercas </h3> 
            {BUSINESS_CONFIG.pools.map(pool => ( 
              <div key={pool.id} className="flex justify-between border-b border-ice-50 pb-2"> 
                <span className="font-semibold">{pool.name}</span> 
                <span className="text-sm">Cap. Máx: {pool.maxCapacity}</span> 
              </div> 
            ))} 
          </Card> 
          
          <Card className="p-6 bg-white border border-ice-100 shadow-sm space-y-4 opacity-75"> 
            <h3 className="font-bold text-navy-900 font-jakarta flex items-center gap-2 border-b border-ice-100 pb-2"> <Users className="w-5 h-5" /> Niveles </h3> 
            <div className="flex flex-wrap gap-2"> 
              {BUSINESS_CONFIG.levels.map(l => ( 
                <Badge key={l.id} color="bg-ice-100 text-secundario">{l.name}</Badge> 
              ))} 
            </div> 
          </Card> 
        </div> 
      )} 
    </div> 
  );
}
