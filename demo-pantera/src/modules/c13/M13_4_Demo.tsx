import { useState } from 'react';
import { useAppStore } from '@/app/store';
import { useDataset } from '@/data/hooks';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { Badge } from '@/ui/components/DataDisplay';
import { Smartphone, RefreshCw, Monitor, Database, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

export default function M13_4_Demo() { 
  const { seed, setSeed, resetDemo, togglePresentation, presentationMode } = useAppStore(); 
  const dataset = useDataset(); 
  const navigate = useNavigate(); 
  const [customSeed, setCustomSeed] = useState(seed); 
  const [isGenerating, setIsGenerating] = useState(false); 
  const [genTime, setGenTime] = useState<number | null>(null); 
  
  const handleRegenerate = (s: number) => { 
    setIsGenerating(true); 
    const start = performance.now(); 
    // Simulate UI block to show loading state if needed, though state update is synchronous for the dataset 
    setTimeout(() => { 
      setSeed(s); 
      const end = performance.now(); 
      setGenTime(Math.round(end - start)); 
      setIsGenerating(false); 
    }, 100); 
  }; 
  
  // Previews data 
  const instructor = dataset.instructors[0]; 
  const group = dataset.groups.find(g => g.instructorId === instructor?.id); 
  const parent = dataset.families[0]; 
  const children = dataset.students.filter(s => s.familyId === parent?.id); 
  
  return ( 
    <div className="space-y-6"> 
      <div className="flex justify-between items-end"> 
        <div> 
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Vistas Previas y Control Demo</h1> 
          <p className="text-lg text-secundario mt-1">Simulación de interfaces satélite y parámetros globales</p> 
        </div> 
        <div className="flex gap-3"> 
          <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate('/c03/m3-4')}> 
            <Database className="w-4 h-4" /> Auditoría de Datos 
          </Button> 
          <Button variant="primary" className="flex items-center gap-2" onClick={togglePresentation}> 
            <Monitor className="w-4 h-4" /> {presentationMode ? 'Salir Presentación' : 'Modo Presentación'} 
          </Button> 
        </div> 
      </div> 
      <div className="grid grid-cols-3 gap-6"> 
        <Card className="p-6 bg-white border border-ice-100 shadow-sm space-y-6 col-span-1"> 
          <h3 className="font-bold text-navy-900 font-jakarta border-b border-ice-100 pb-2 flex items-center gap-2"> 
            <RefreshCw className="w-5 h-5 text-sky-500" /> Motor de Generación 
          </h3> 
          <p className="text-sm text-secundario mb-4"> Cambiar la semilla regenera los 15,000+ registros del dataset determinista y reinicia la sesión. </p> 
          <div className="flex flex-wrap gap-2"> 
            {[2026, 2027, 7, 99].map(s => ( 
              <Button key={s} variant={seed === s ? 'primary' : 'ghost'} size="sm" className="border border-ice-200" onClick={() => handleRegenerate(s)} disabled={isGenerating} >
                Semilla {s} 
              </Button> 
            ))} 
          </div> 
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ice-100"> 
            <input type="number" className="w-full p-2 border border-ice-200 rounded-lg text-sm" placeholder="Semilla custom..." value={customSeed} onChange={e => setCustomSeed(Number(e.target.value))} /> 
            <Button variant="ghost" className="border border-ice-200" onClick={() => handleRegenerate(customSeed)} disabled={isGenerating}> Generar </Button> 
          </div> 
          {genTime !== null && ( 
            <div className="text-xs text-green-600 font-bold bg-green-50 p-2 rounded text-center"> Dataset regenerado en {genTime}ms </div> 
          )} 
          <Button variant="secondary" className="w-full mt-4 text-coral border-coral hover:bg-coral hover:text-white transition-colors" onClick={resetDemo}> Reiniciar Demo Completa </Button> 
        </Card> 
        <Card className="bg-white border border-ice-100 shadow-sm p-0 overflow-hidden relative col-span-1 flex flex-col"> 
          <div className="bg-navy-900 text-white p-4 flex justify-between items-center"> 
            <span className="font-bold flex items-center gap-2"><Smartphone className="w-4 h-4"/> App Instructor</span> 
            <Badge color="bg-sky-500 text-white border-none">Vista Previa</Badge> 
          </div> 
          <div className="p-4 bg-ice-50 flex-1 space-y-4"> 
            <div className="bg-white p-4 rounded-xl shadow-sm border border-ice-100"> 
              <div className="text-sm text-secundario">Bienvenido,</div> 
              <div className="font-bold text-navy-900 text-lg">{instructor?.name || 'Instructor'}</div> 
            </div> 
            <h4 className="font-bold text-sm text-navy-900">Siguiente Clase</h4> 
            <div className="bg-white p-4 rounded-xl shadow-sm border border-sky-200 border-l-4 border-l-sky-500"> 
              <div className="flex justify-between items-start mb-2"> 
                <div> 
                  <div className="font-bold text-navy-900">{group?.level || 'Nivel 1'}</div> 
                  <div className="text-xs text-secundario">{group?.pool || 'Principal'}</div> 
                </div> 
                <div className="text-right"> 
                  <div className="font-bold text-sky-600">10:00 AM</div> 
                  <div className="text-xs text-secundario">{group?.timeSlot || 'Sábados'}</div> 
                </div> 
              </div> 
              <Button variant="primary" size="sm" className="w-full mt-2">Tomar Asistencia (8/8)</Button> 
            </div> 
            <div className="flex justify-center mt-4 opacity-50"> 
              <div className="w-12 h-1 bg-ice-200 rounded-full"></div> 
            </div> 
          </div> 
        </Card> 
        <Card className="bg-white border border-ice-100 shadow-sm p-0 overflow-hidden relative col-span-1 flex flex-col"> 
          <div className="bg-sky-500 text-white p-4 flex justify-between items-center"> 
            <span className="font-bold flex items-center gap-2"><Smartphone className="w-4 h-4"/> App Familia</span> 
            <Badge color="bg-white text-sky-600 border-none">Vista Previa</Badge> 
          </div> 
          <div className="p-4 bg-ice-50 flex-1 space-y-4"> 
            <div className="flex justify-between items-center mb-4"> 
              <div className="font-bold text-navy-900">Hola, {parent?.tutorName.split(' ')[0] || 'Familia'}</div> 
              <User className="w-6 h-6 text-secundario" /> 
            </div> 
            <div className="space-y-3"> 
              {children.slice(0, 2).map(child => ( 
                <div key={child.id} className="bg-white p-4 rounded-xl shadow-sm border border-ice-100"> 
                  <div className="flex justify-between items-center mb-2"> 
                    <span className="font-bold text-navy-900">{child.name}</span> 
                    <Badge color="bg-sky-100 text-sky-700">{child.level}</Badge> 
                  </div> 
                  <div className="w-full bg-ice-100 h-2 rounded-full overflow-hidden mb-1"> 
                    <div className="bg-green-500 h-full" style={{width: '60%'}}></div> 
                  </div> 
                  <div className="text-xs text-secundario text-right">60% para siguiente nivel</div> 
                </div> 
              ))} 
            </div> 
            <div className="bg-white p-4 rounded-xl shadow-sm border border-ice-100 mt-4 flex items-center gap-3"> 
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"> 
                <CheckCircle className="w-5 h-5" /> 
              </div> 
              <div> 
                <div className="font-bold text-sm text-navy-900">Mensualidad al día</div> 
                <div className="text-xs text-secundario">Próximo pago: 01 Nov</div> 
              </div> 
            </div> 
          </div> 
        </Card> 
      </div> 
    </div> 
  );
}
