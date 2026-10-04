import { useState, useMemo } from 'react';
import { useDataset } from '@/data/hooks';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Button } from '@/ui/components/Buttons';
import { Send, Users } from 'lucide-react';
import { formatNum } from '@/insights/templates'; 

const TEMPLATES = [ 
  { id: 't1', name: 'Recordatorio de pago', text: 'Hola {nombre_tutor}, te recordamos que el pago de {nombre_alumno} por {monto} está próximo a vencer.' }, 
  { id: 't2', name: 'Felicitación de nivel', text: '¡Felicidades {nombre_alumno}! Has avanzado de nivel. Tu nuevo horario es {horario}.' }, 
  { id: 't3', name: 'Reactivación dormidos', text: 'Hola {nombre_tutor}, extrañamos a {nombre_alumno} en el agua. Vuelve y obtén 10% de descuento.' }
]; 

export default function M13_2_Campaigns() { 
  const dataset = useDataset(); 
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]!); 
  const [editorText, setEditorText] = useState(TEMPLATES[0]!.text); 
  const [segmentation, setSegmentation] = useState('riesgo_alto'); 
  const [openRate, setOpenRate] = useState(45); 
  const [responseRate, setResponseRate] = useState(12); 
  const [sessionLogs, setSessionLogs] = useState<any[]>([]); 
  
  // Simple preview mock 
  const previewData = { 
    nombre_tutor: (dataset.families?.[0]?.tutorName || 'Juan Pérez') || 'Juan Pérez', 
    nombre_alumno: (dataset.students?.[0]?.name || 'Mateo') || 'Mateo', 
    monto: '$1,200', 
    horario: 'Sábados 10:00 AM' 
  }; 
  
  const previewText = editorText
    .replace('{nombre_tutor}', previewData.nombre_tutor) 
    .replace('{nombre_alumno}', previewData.nombre_alumno) 
    .replace('{monto}', previewData.monto) 
    .replace('{horario}', previewData.horario); 
    
  // Reach estimation mock based on segmentation 
  const reach = useMemo(() => { 
    if (segmentation === 'riesgo_alto') return Math.floor(dataset.students.length * 0.15); 
    if (segmentation === 'vencidos') return dataset.charges.filter(c => c.status === 'vencido').length; 
    return dataset.families.length; 
  }, [segmentation, dataset]); 
  
  const handleSend = () => { 
    const newLog = { 
      id: `session_${Date.now()}`, 
      date: new Date().toISOString().split('T')[0], 
      channel: 'WhatsApp', 
      type: 'Campaña Manual', 
      status: 'Enviado', 
      reach, 
      template: (selectedTemplate?.name || 'Plantilla') 
    }; 
    setSessionLogs(prev => [newLog, ...prev]); 
  }; 
  
  const allLogs = useMemo(() => { 
    const dLogs = dataset.notifications.map(n => ({ 
      id: n.id, 
      date: n.date, 
      type: n.type, 
      status: n.status, 
      reach: 1, 
      template: 'Automática' 
    })); 
    return [...sessionLogs, ...dLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 
  }, [dataset.notifications, sessionLogs]); 
  
  return ( 
    <div className="space-y-6"> 
      <div className="flex justify-between items-end"> 
        <div> 
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Notificaciones y Campañas</h1> 
          <p className="text-lg text-secundario mt-1">Automatización, segmentación y envío de mensajes</p> 
        </div> 
      </div> 
      <div className="grid grid-cols-2 gap-6"> 
        <Card className="p-6 bg-white border border-ice-100 shadow-sm space-y-6"> 
          <h3 className="font-bold text-navy-900 font-jakarta border-b border-ice-100 pb-2">Composición del Mensaje</h3> 
          <div> 
            <label className="block text-sm font-semibold text-navy-900 mb-2">Plantilla</label> 
            <select className="w-full p-2 border border-ice-200 rounded-lg" value={(selectedTemplate?.id || 't1')} onChange={e => { const t = TEMPLATES.find(x => x.id === e.target.value) || TEMPLATES[0]!; setSelectedTemplate(t); setEditorText(t.text); }} >
              {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)} 
            </select> 
          </div> 
          <div> 
            <label className="block text-sm font-semibold text-navy-900 mb-2">Editor (Variables: {'{nombre_tutor}, {nombre_alumno}, {monto}'})</label> 
            <textarea className="w-full p-3 border border-ice-200 rounded-lg h-32 focus:ring-2 focus:ring-sky-400 focus:outline-none" value={editorText} onChange={e => setEditorText(e.target.value)} /> 
          </div> 
          <div className="bg-sky-50 p-4 rounded-lg border border-sky-100"> 
            <h4 className="text-sm font-bold text-sky-800 mb-2">Vista Previa</h4> 
            <p className="text-navy-900">{previewText}</p> 
          </div> 
        </Card> 
        <div className="space-y-6"> 
          <Card className="p-6 bg-white border border-ice-100 shadow-sm space-y-6"> 
            <h3 className="font-bold text-navy-900 font-jakarta border-b border-ice-100 pb-2">Segmentación y Alcance</h3> 
            <div> 
              <label className="block text-sm font-semibold text-navy-900 mb-2">Destinatarios</label> 
              <select className="w-full p-2 border border-ice-200 rounded-lg" value={segmentation} onChange={e => setSegmentation(e.target.value)} >
                <option value="riesgo_alto">Riesgo de baja (Alto)</option> 
                <option value="vencidos">Con saldo vencido</option> 
                <option value="todos">Todos los activos</option> 
              </select> 
            </div> 
            <div className="flex items-center gap-4 p-4 bg-ice-50 rounded-lg border border-ice-100"> 
              <Users className="w-8 h-8 text-sky-500" /> 
              <div> 
                <div className="text-sm text-secundario">Alcance estimado (en vivo)</div> 
                <div className="text-2xl font-bold text-navy-900">{formatNum(reach)} familias</div> 
              </div> 
            </div> 
            <div className="grid grid-cols-2 gap-4"> 
              <div> 
                <label className="block text-sm text-secundario mb-1">Tasa Apertura Esperada</label> 
                <div className="flex items-center gap-2"> 
                  <input type="range" min="10" max="100" value={openRate} onChange={e => setOpenRate(Number(e.target.value))} className="w-full" /> 
                  <span className="font-bold text-sm w-12">{openRate}%</span> 
                </div> 
              </div> 
              <div> 
                <label className="block text-sm text-secundario mb-1">Tasa Respuesta Esperada</label> 
                <div className="flex items-center gap-2"> 
                  <input type="range" min="1" max="50" value={responseRate} onChange={e => setResponseRate(Number(e.target.value))} className="w-full" /> 
                  <span className="font-bold text-sm w-12">{responseRate}%</span> 
                </div> 
              </div> 
            </div> 
            <Button variant="primary" className="w-full py-3 text-lg flex items-center justify-center gap-2" onClick={handleSend}> 
              <Send className="w-5 h-5" /> Lanzar Campaña Simulada 
            </Button> 
          </Card> 
        </div> 
      </div> 
      <Card className="bg-white border border-ice-100 shadow-sm overflow-hidden"> 
        <div className="p-6 border-b border-ice-100 bg-ice-50"> 
          <h3 className="font-bold text-navy-900 font-jakarta">Historial de Notificaciones</h3> 
        </div> 
        <table className="w-full text-left"> 
          <thead className="bg-ice-50 border-b border-ice-100"> 
            <tr> 
              <th className="p-4 font-bold text-navy-900 text-sm">Fecha</th> 
              <th className="p-4 font-bold text-navy-900 text-sm">Plantilla / Tipo</th> 
              <th className="p-4 font-bold text-navy-900 text-sm">Canal</th> 
              <th className="p-4 font-bold text-navy-900 text-sm text-right">Alcance</th> 
              <th className="p-4 font-bold text-navy-900 text-sm text-center">Estado</th> 
            </tr> 
          </thead> 
          <tbody className="divide-y divide-ice-100"> 
            {allLogs.slice(0, 15).map((log, i) => ( 
              <tr key={i} className="hover:bg-ice-50 transition-colors"> 
                <td className="p-4 text-secundario tabular-figures">{log.date}</td> 
                <td className="p-4 font-semibold text-navy-900">{log.type || log.type}</td> 
                <td className="p-4 text-sm font-medium">{'WhatsApp'}</td> 
                <td className="p-4 tabular-figures text-right">{formatNum(log.reach)}</td> 
                <td className="p-4 text-center"> 
                  <Badge color={log.status === 'Enviado' ? 'bg-green-100 text-green-800' : 'bg-ice-100 text-secundario'}> 
                    {log.status} 
                  </Badge> 
                </td> 
              </tr> 
            ))} 
          </tbody> 
        </table> 
      </Card> 
    </div> 
  );
}
