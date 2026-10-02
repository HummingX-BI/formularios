import { useState, useMemo } from 'react';
import { LabLayout } from './LabLayout';
import { Select, Slider } from '@/ui/components/Inputs';
import { bayesTheorem } from '@/stats/probability';
import { Card } from '@/ui/components/Cards';

const PRESETS = [
  {
    id: 'h7',
    label: '1. 3 faltas consecutivas → Baja (H7)',
    aLabel: 'Baja',
    bLabel: '3 Faltas',
    prior: 0.06,
    sensitivity: 0.60,
    probB: 0.12
  },
  {
    id: 'n3',
    label: '2. Estar en Nivel 3 → Baja',
    aLabel: 'Baja',
    bLabel: 'Nivel 3',
    prior: 0.06,
    sensitivity: 0.35,
    probB: 0.20
  },
  {
    id: 'pago',
    label: '3. Atraso 10+ días → Baja',
    aLabel: 'Baja',
    bLabel: 'Atraso',
    prior: 0.06,
    sensitivity: 0.80,
    probB: 0.15
  },
  {
    id: 'ref',
    label: '4. Referido → Inscripción',
    aLabel: 'Inscrito',
    bLabel: 'Referido',
    prior: 0.25,
    sensitivity: 0.40,
    probB: 0.15
  },
  {
    id: 'muestra',
    label: '5. Clase Muestra → Inscripción',
    aLabel: 'Inscrito',
    bLabel: 'Muestra',
    prior: 0.25,
    sensitivity: 0.70,
    probB: 0.45
  },
  {
    id: 'manual',
    label: '6. Modo Manual',
    aLabel: 'Evento A',
    bLabel: 'Evento B',
    prior: 0.10,
    sensitivity: 0.80,
    probB: 0.20
  }
];

export default function M9_4_Bayes() {
  const [presetId, setPresetId] = useState('h7');
  
  // Manual state
  const [mPrior, setMPrior] = useState(0.10);
  const [mSens, setMSens] = useState(0.80);
  const [mProbB, setMProbB] = useState(0.20);
  
  const [showMath, setShowMath] = useState(false);

  const current = useMemo(() => {
    const p = PRESETS.find(x => x.id === presetId)!;
    if (presetId === 'manual') {
      return { ...p, prior: mPrior, sensitivity: mSens, probB: mProbB };
    }
    return p;
  }, [presetId, mPrior, mSens, mProbB]);

  const result = useMemo(() => {
    return bayesTheorem(current.prior, current.sensitivity, current.probB);
  }, [current]);

  const nf = result.naturalFrequencies;

  return (
    <LabLayout
      title="Probabilidad Condicional y Teorema de Bayes"
      businessQuestion="Si ocurre X, ¿qué tan probable es que ocurra Y?"
      description="Bayes nos permite actualizar nuestras creencias cuando vemos nueva evidencia. Es la diferencia matemática entre 'el 60% de los que se dan de baja faltaron 3 veces' y 'si faltó 3 veces, la probabilidad de baja es 30%'."
      formulas={`Teorema de Bayes:\nP(A|B) = [ P(B|A) × P(A) ] / P(B)`}
      assumptions="Los casos precargados utilizan aproximaciones basadas en la historia agregada de Pantera."
      findings={
        <div className="space-y-6">
          <div className="flex gap-4 items-end bg-ice-50 p-4 rounded border border-ice-200">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-navy-900 mb-1">Escenario</label>
              <Select 
                options={PRESETS.map(p => ({ label: p.label, value: p.id }))}
                value={presetId}
                onChange={e => setPresetId(e.target.value)}
              />
            </div>
          </div>

          {presetId === 'manual' && (
            <div className="grid grid-cols-3 gap-6 bg-white p-4 rounded border border-ice-100 shadow-sm">
              <div>
                <label className="block text-xs text-secundario mb-1">Probabilidad Base P(A)</label>
                <Slider value={Math.round(mPrior*100)} onChangeValue={v => setMPrior(v/100)} />
              </div>
              <div>
                <label className="block text-xs text-secundario mb-1">Sensibilidad P(B|A)</label>
                <Slider value={Math.round(mSens*100)} onChangeValue={v => setMSens(v/100)} />
              </div>
              <div>
                <label className="block text-xs text-secundario mb-1">Evidencia P(B)</label>
                <Slider value={Math.round(mProbB*100)} onChangeValue={v => setMProbB(v/100)} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Arbol */}
            <Card className="p-4 bg-white border border-ice-100 shadow-sm">
              <h4 className="font-bold text-navy-900 mb-4">Árbol de Frecuencias Naturales</h4>
              <p className="text-sm text-secundario mb-4">Imagina {nf.total} alumnos:</p>
              
              <svg viewBox="0 0 400 300" className="w-full h-auto font-sans text-xs">
                {/* Lines */}
                <path d="M 50 150 L 150 75" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                <path d="M 50 150 L 150 225" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                
                <path d="M 150 75 L 280 40" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                <path d="M 150 75 L 280 110" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                
                <path d="M 150 225 L 280 190" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                <path d="M 150 225 L 280 260" stroke="#CBD5E1" strokeWidth="2" fill="none" />

                {/* Nodes */}
                <rect x="10" y="130" width="60" height="40" rx="4" fill="#F1F5F9" stroke="#94A3B8" />
                <text x="40" y="150" textAnchor="middle" alignmentBaseline="middle" className="font-bold">{nf.total}</text>
                
                {/* A */}
                <rect x="120" y="55" width="80" height="40" rx="4" fill="#DBEAFE" stroke="#60A5FA" />
                <text x="160" y="68" textAnchor="middle" className="font-bold fill-blue-900">{nf.a}</text>
                <text x="160" y="82" textAnchor="middle" className="text-[10px] fill-blue-700">{current.aLabel}</text>
                
                <rect x="120" y="205" width="80" height="40" rx="4" fill="#FEE2E2" stroke="#F87171" />
                <text x="160" y="218" textAnchor="middle" className="font-bold fill-red-900">{nf.notA}</text>
                <text x="160" y="232" textAnchor="middle" className="text-[10px] fill-red-700">No {current.aLabel}</text>

                {/* B */}
                <rect x="280" y="25" width="90" height="30" rx="4" fill="#D1FAE5" stroke="#34D399" />
                <text x="325" y="44" textAnchor="middle" className="font-bold fill-green-900">{nf.aAndB} {current.bLabel}</text>
                
                <rect x="280" y="95" width="90" height="30" rx="4" fill="#F3F4F6" stroke="#D1D5DB" />
                <text x="325" y="114" textAnchor="middle" className="font-bold fill-gray-600">{nf.aAndNotB} No</text>

                <rect x="280" y="175" width="90" height="30" rx="4" fill="#FEF3C7" stroke="#FBBF24" />
                <text x="325" y="194" textAnchor="middle" className="font-bold fill-yellow-900">{nf.notAAndB} {current.bLabel}</text>
                
                <rect x="280" y="245" width="90" height="30" rx="4" fill="#F3F4F6" stroke="#D1D5DB" />
                <text x="325" y="264" textAnchor="middle" className="font-bold fill-gray-600">{nf.notAAndNotB} No</text>
              </svg>
            </Card>

            <div className="space-y-6 flex flex-col">
              <Card className="p-4 bg-navy-900 text-white shadow-sm flex-1 flex flex-col justify-center items-center text-center">
                <div className="text-sm text-sky-200 mb-2">Probabilidad Actualizada P({current.aLabel} | {current.bLabel})</div>
                <div className="text-6xl font-bold text-white mb-2">{(result.posterior * 100).toFixed(1)}%</div>
                <p className="text-xs text-sky-100 max-w-xs mt-2 opacity-80">
                  De los {nf.aAndB + nf.notAAndB} que cumplen "{current.bLabel}", solo {nf.aAndB} terminan en "{current.aLabel}".
                </p>
              </Card>

              <button 
                onClick={() => setShowMath(!showMath)}
                className="text-xs text-blue-600 hover:underline self-start"
              >
                {showMath ? 'Ocultar derivación' : 'Ver derivación paso a paso'}
              </button>

              {showMath && (
                <div className="p-3 bg-ice-50 border border-ice-200 rounded font-mono text-xs text-navy-900">
                  P(A|B) = [ P(B|A) × P(A) ] / P(B) <br/><br/>
                  P(A) = {(current.prior * 100).toFixed(1)}% <br/>
                  P(B|A) = {(current.sensitivity * 100).toFixed(1)}% <br/>
                  P(B) = {(current.probB * 100).toFixed(1)}% <br/><br/>
                  P(A|B) = [ {(current.sensitivity).toFixed(3)} × {(current.prior).toFixed(3)} ] / {(current.probB).toFixed(3)} <br/>
                  P(A|B) = {(current.sensitivity * current.prior).toFixed(4)} / {(current.probB).toFixed(3)} <br/>
                  P(A|B) = {(result.posterior * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </div>
      }
      action={
        <p className="text-sm text-navy-900">
          Cuidado con la <strong>falacia de la tasa base</strong>. Si la inmensa mayoría de tus alumnos NO se da de baja (la base es baja), 
          incluso un indicador muy sensible (como las 3 faltas) producirá muchos <em>falsos positivos</em>. No llames al cliente acusándolo; usa un toque suave.
        </p>
      }
    />
  );
}
