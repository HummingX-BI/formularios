import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { Button } from '@/ui/components/Buttons';
import { Badge } from '@/ui/components/DataDisplay';
import { PlotChart } from '@/charts/PlotChart';
import { binomial } from '@/stats/distributions';

export default function M6_4_Simulator() {
  const [day, setDay] = useState('Lunes');
  const [hour, setHour] = useState('16:00');
  const [level, setLevel] = useState('Tortugas');
  const [instructor, setInstructor] = useState('Carlos Ruiz');
  
  // Params
  const [waitlistDemand, setWaitlistDemand] = useState(6);
  const [expectedNewDemand, setExpectedNewDemand] = useState(4);
  const [conversionProb, setConversionProb] = useState(60); // 60%
  
  // Economics
  const capacity = 8;
  const breakEven = 4;
  const totalDemand = waitlistDemand + expectedNewDemand;
  const p = conversionProb / 100;

  // Calculate probabilities
  const pBreakEven = binomial.sf(breakEven - 1, totalDemand, p);
  const pFull = binomial.sf(capacity - 1, totalDemand, p);

  // Generate distribution graph data
  const xVals = [];
  const yVals = [];
  for (let k = 0; k <= totalDemand; k++) {
    xVals.push(k);
    yVals.push(binomial.pmf(k, totalDemand, p) * 100);
  }

  const chartData = [{
    type: 'bar',
    x: xVals,
    y: yVals,
    marker: {
      color: xVals.map(x => x >= breakEven ? '#2BAE84' : '#F26B5B')
    }
  }];

  let recommendation = { text: 'Abrir Grupo', color: 'bg-green-500 text-white' };
  if (pBreakEven < 0.5) recommendation = { text: 'No Abrir', color: 'bg-coral text-white' };
  else if (pBreakEven < 0.75) recommendation = { text: 'Esperar / Riesgo Medio', color: 'bg-amber-500 text-white' };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Simulador de Apertura</h1>
          <p className="text-lg text-secundario mt-1">¿Debo abrir un nuevo grupo en este horario?</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Left: Formulario */}
        <Card className="col-span-4 p-6 bg-white border border-ice-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-navy-900 mb-4 border-b border-ice-100 pb-2">Configuración del Grupo</h3>
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Día</label>
              <Select options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => ({label: d, value: d}))} value={day} onChange={e => setDay(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Hora</label>
              <Select options={['08:00','09:00','10:00','11:00','16:00','17:00','18:00','19:00'].map(h => ({label: h, value: h}))} value={hour} onChange={e => setHour(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Nivel</label>
              <Select options={['Tortugas', 'Delfines', 'Tiburones'].map(l => ({label: l, value: l}))} value={level} onChange={e => setLevel(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Instructor</label>
              <Select options={['Carlos Ruiz', 'Ana López', 'Mario Santos'].map(i => ({label: i, value: i}))} value={instructor} onChange={e => setInstructor(e.target.value)} />
            </div>
            
            <div className="pt-4 border-t border-ice-100">
              <h4 className="font-bold text-navy-900 text-sm mb-3">Parámetros de Demanda</h4>
              
              <div className="mb-3">
                <label className="block text-xs font-bold text-navy-900 mb-1">Familias en Espera Compatibles</label>
                <input type="number" className="w-full border border-ice-200 rounded p-2 text-sm" value={waitlistDemand} onChange={(e: any) => setWaitlistDemand(Number(e.target.value))} />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Llegada Esperada (Nuevos)</label>
                <input type="number" className="w-full border border-ice-200 rounded p-2 text-sm" value={expectedNewDemand} onChange={(e: any) => setExpectedNewDemand(Number(e.target.value))} />
              </div>
              
              <div className="mt-4">
                <label className="block text-xs font-bold text-navy-900 mb-1">Probabilidad de Conversión: {conversionProb}%</label>
                <input type="range" min="30" max="90" step="5" value={conversionProb} onChange={e => setConversionProb(Number(e.target.value))} className="w-full accent-aqua-500" />
              </div>
            </div>
          </div>
          
          <Button variant="primary" className="w-full mt-6">Guardar Configuración</Button>
        </Card>

        {/* Right: Resultados */}
        <div className="col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
              <div className="text-xs text-secundario mb-1">Demanda Potencial (n)</div>
              <div className="text-2xl font-bold text-navy-900">{totalDemand} familias</div>
            </Card>
            <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
              <div className="text-xs text-secundario mb-1">Punto de Equilibrio</div>
              <div className="text-2xl font-bold text-coral">{breakEven} alumnos</div>
            </Card>
            <Card className="p-4 bg-white border border-ice-100 shadow-sm flex flex-col items-center justify-center">
              <div className="text-xs text-secundario mb-1">Veredicto</div>
              <Badge color={recommendation.color}>{recommendation.text}</Badge>
            </Card>
          </div>

          <Card className="p-6 bg-white border border-ice-100 shadow-sm flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-navy-900 font-jakarta">Distribución Binomial de Inscripción</h3>
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-xs text-secundario">Prob. Equilibrio (≥{breakEven})</div>
                  <div className="font-bold text-green-500 text-lg">{(pBreakEven * 100).toFixed(1)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-secundario">Prob. Lleno (≥{capacity})</div>
                  <div className="font-bold text-aqua-500 text-lg">{(pFull * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <PlotChart 
                id="simulator_binomial"
                data={chartData as any}
                layout={{
                  xaxis: { title: 'Alumnos Inscritos', tickmode: 'linear' },
                  yaxis: { title: 'Probabilidad (%)' },
                  margin: { l: 40, r: 20, t: 10, b: 40 }
                }}
                tableData={{ columns: [], rows: [] }}
                altText="Gráfica de probabilidad binomial de alumnos inscritos"
                onExplain={() => {}}
              />
            </div>
            <div className="text-xs text-secundario text-center mt-2">
              El color verde indica los escenarios donde se supera el punto de equilibrio operativo (carriles + instructor).
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
