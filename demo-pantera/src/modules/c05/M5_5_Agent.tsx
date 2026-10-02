import { useState, useEffect } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Button } from '@/ui/components/Buttons';
import { PlotChart } from '@/charts/PlotChart';
import { tTestWelch } from '@/stats/inference';

// Simulated conversations
const CONVERSATIONS = [
  {
    id: 'conv-1',
    name: 'María Fernández',
    handledBy: 'agent',
    result: 'agendado',
    intent: 'Información de clases',
    extracted: { age: 6, schedule: 'Tardes, 4-6 PM' },
    actionTaken: 'Agendó clase muestra',
    messages: [
      { sender: 'user', text: 'Hola, me interesan las clases de natación para mi hijo.', time: '10:00 AM' },
      { sender: 'agent', text: '¡Hola! Qué gusto saludarte. Claro que sí, tenemos clases para todas las edades. ¿Qué edad tiene tu hijo?', time: '10:01 AM' },
      { sender: 'user', text: 'Tiene 6 años.', time: '10:03 AM' },
      { sender: 'agent', text: 'Excelente edad para aprender. Para 6 años manejamos el nivel Tortugas. ¿Qué horarios prefieres? Tenemos mañanas y tardes.', time: '10:03 AM' },
      { sender: 'user', text: 'Por las tardes, después de las 4.', time: '10:05 AM' },
      { sender: 'agent', text: 'Perfecto. Tenemos un grupo de Tortugas a las 4:30 PM los martes y jueves. ¿Te gustaría agendar una clase muestra gratis para que conozcan las instalaciones?', time: '10:05 AM' },
      { sender: 'user', text: 'Sí, me parece muy bien.', time: '10:08 AM' },
      { sender: 'agent', text: '¡Listo! Te he agendado para el próximo martes a las 4:30 PM. Recuerda traer traje de baño, toalla y goggles. ¡Nos vemos pronto!', time: '10:08 AM' }
    ]
  },
  {
    id: 'conv-2',
    name: 'Carlos Ruiz',
    handledBy: 'agent',
    result: 'escalado',
    intent: 'Queja / Reembolso',
    extracted: { age: null, schedule: null },
    actionTaken: 'Escalado a recepción humana',
    messages: [
      { sender: 'user', text: 'Hola, quiero pedir un reembolso de mi mensualidad porque mi hijo se enfermó y no pudo ir.', time: '11:15 AM' },
      { sender: 'agent', text: 'Hola Carlos. Lamento mucho escuchar que tu pequeño se enfermó. Espero que se recupere pronto.', time: '11:16 AM' },
      { sender: 'agent', text: 'Para temas de reembolsos o reposiciones por temas médicos, te comunicaré ahora mismo con una persona de nuestro equipo de recepción para que te apoye con el trámite. Un momento por favor.', time: '11:16 AM' }
    ]
  },
  {
    id: 'conv-3',
    name: 'Laura Gómez',
    handledBy: 'human',
    result: 'agendado',
    intent: 'Información de clases',
    extracted: { age: 3, schedule: 'Sábados' },
    actionTaken: 'Registro manual en CRM',
    messages: [
      { sender: 'user', text: 'Tienen clases los sábados para bebés?', time: '09:00 AM' },
      { sender: 'human', text: 'Hola Laura, buenos días. Sí, tenemos el programa de Matronatación los sábados por la mañana para bebés desde los 6 meses hasta los 3 años. ¿Qué edad tiene el bebé?', time: '09:45 AM' },
      { sender: 'user', text: 'Tiene casi 3 años', time: '10:10 AM' },
      { sender: 'human', text: 'Perfecto, sábados 10:00 AM le quedaría ideal. Puedes agendar clase muestra pasando por recepción o llamando al teléfono.', time: '10:12 AM' }
    ]
  }
];

export default function M5_5_Agent() {
  const [filterResult, setFilterResult] = useState('todos');
  const [filterHandler, setFilterHandler] = useState('todos');
  const [selectedConvId, setSelectedConvId] = useState(CONVERSATIONS[0]!.id);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [msgIndex, setMsgIndex] = useState(CONVERSATIONS[0]!.messages.length);

  const selectedConv = CONVERSATIONS.find(c => c.id === selectedConvId)!;

  const filteredConvs = CONVERSATIONS.filter(c => {
    if (filterResult !== 'todos' && c.result !== filterResult) return false;
    if (filterHandler !== 'todos' && c.handledBy !== filterHandler) return false;
    return true;
  });

  const handlePlay = () => {
    setIsPlaying(true);
    setMsgIndex(0);
  };

  useEffect(() => {
    if (isPlaying && msgIndex < selectedConv.messages.length) {
      const timer = setTimeout(() => {
        setMsgIndex(msgIndex + 1);
      }, 1500); // 1.5s per message for demo
      return () => clearTimeout(timer);
    } else if (msgIndex >= selectedConv.messages.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, msgIndex, selectedConv]);

  const [minsPerConv, setMinsPerConv] = useState(5);
  const totalConvs = 450; // Mock for 90 days
  const savedHours = (totalConvs * 0.7 * minsPerConv) / 60; // 70% handled by agent

  const agentTimes = [1, 2, 1, 1, 3, 1, 2, 1, 1, 2]; // mins
  const humanTimes = [45, 60, 120, 30, 45, 90, 15, 60, 180, 45]; // mins
  const tTest = tTestWelch(agentTimes, humanTimes);

  const responseTimeData = [
    { name: 'Agente', type: 'box', y: agentTimes, marker: { color: '#2FB6D4' } },
    { name: 'Humano', type: 'box', y: humanTimes, marker: { color: '#F2A93B' } }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Agente de Ventas Autónomo</h1>
          <p className="text-lg text-secundario mt-1">¿Cuánta fricción le quita a recepción un agente que atiende solo?</p>
        </div>
        <Badge color="bg-ice-100 text-secundario">Conversaciones de demostración</Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-xs text-secundario mb-1">Conversaciones (90d)</div>
          <div className="text-2xl font-bold text-navy-900">{totalConvs}</div>
        </Card>
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-xs text-secundario mb-1">Tasa de Agendamiento</div>
          <div className="text-2xl font-bold text-green-500">42%</div>
        </Card>
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center">
          <div className="text-xs text-secundario mb-1">Tasa de Escalamiento</div>
          <div className="text-2xl font-bold text-coral">15%</div>
        </Card>
        <Card className="p-4 bg-white border border-ice-100 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="text-xs text-secundario mb-1">Horas Ahorradas</div>
          <div className="text-2xl font-bold text-aqua-500">{savedHours.toFixed(0)} hrs</div>
          <div className="text-[10px] text-tenue mt-1">
            Asumiendo <input type="number" value={minsPerConv} onChange={e => setMinsPerConv(Number(e.target.value))} className="w-8 text-center border rounded mx-1" /> min/conv.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-[500px]">
        {/* Left: List */}
        <Card className="col-span-3 bg-white border border-ice-100 shadow-sm flex flex-col">
          <div className="p-3 border-b border-ice-100 space-y-2">
            <select value={filterHandler} onChange={e => setFilterHandler(e.target.value)} className="w-full p-1 text-sm border border-ice-200 rounded">
              <option value="todos">Cualquier atención</option>
              <option value="agent">Bot Autónomo</option>
              <option value="human">Humano</option>
            </select>
            <select value={filterResult} onChange={e => setFilterResult(e.target.value)} className="w-full p-1 text-sm border border-ice-200 rounded">
              <option value="todos">Cualquier resultado</option>
              <option value="agendado">Agendado</option>
              <option value="escalado">Escalado a Humano</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredConvs.map(c => (
              <div 
                key={c.id} 
                onClick={() => { setSelectedConvId(c.id); setMsgIndex(c.messages.length); setIsPlaying(false); }}
                className={`p-3 rounded cursor-pointer border ${selectedConvId === c.id ? 'border-aqua-500 bg-ice-50' : 'border-transparent hover:bg-ice-50'}`}
              >
                <div className="font-bold text-navy-900 text-sm">{c.name}</div>
                <div className="flex gap-2 mt-1">
                  <Badge color={c.handledBy === 'agent' ? 'bg-aqua-500 text-white' : 'bg-ice-200 text-secundario'}>
                    {c.handledBy === 'agent' ? 'Bot' : 'Humano'}
                  </Badge>
                  <Badge color={c.result === 'agendado' ? 'bg-green-100 text-green-800' : 'bg-coral text-white'}>
                    {c.result}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Center: Chat Window */}
        <Card className="col-span-6 bg-white border border-ice-100 shadow-sm flex flex-col">
          <div className="p-3 border-b border-ice-100 bg-ice-50 flex justify-between items-center">
            <div className="font-bold text-navy-900">{selectedConv.name}</div>
            <Button variant="ghost" onClick={handlePlay} disabled={isPlaying}>
              {isPlaying ? 'Reproduciendo...' : 'Reproducir Conversación'}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {selectedConv.messages.slice(0, msgIndex).map((msg, i) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-ice-200 text-navy-900 rounded-tl-sm shadow-sm'}`}>
                    {msg.text}
                  </div>
                  <div className="text-[10px] text-tenue mt-1 px-1">{msg.time}</div>
                </div>
              );
            })}
            {isPlaying && msgIndex < selectedConv.messages.length && selectedConv.messages[msgIndex]!.sender !== 'user' && (
              <div className="flex items-start">
                <div className="px-4 py-3 bg-white border border-ice-200 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-ice-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-ice-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-ice-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Right: Decision Panel & Stats */}
        <div className="col-span-3 space-y-4 flex flex-col">
          <Card className="p-4 bg-white border border-ice-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-3 border-b border-ice-100 pb-2">Decisión del Agente</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-secundario">Intención Detectada</div>
                <div className="font-bold text-navy-900">{selectedConv.intent}</div>
              </div>
              <div>
                <div className="text-xs text-secundario">Datos Extraídos</div>
                <ul className="list-disc pl-4 text-navy-900 mt-1">
                  <li>Edad: {selectedConv.extracted.age ? `${selectedConv.extracted.age} años` : 'No detectada'}</li>
                  <li>Horario: {selectedConv.extracted.schedule || 'No detectado'}</li>
                </ul>
              </div>
              <div>
                <div className="text-xs text-secundario">Acción Tomada</div>
                <div className="font-bold text-aqua-500">{selectedConv.actionTaken}</div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs">Ver prospecto en CRM (M5.1)</Button>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-ice-100 shadow-sm flex-1">
            <h3 className="font-bold text-navy-900 mb-2">Tiempos de Respuesta</h3>
            <div className="text-xs text-secundario mb-4">{tTest.phrase}</div>
            <div className="h-40">
              <PlotChart 
                id="response_times"
                data={responseTimeData as any}
                layout={{ margin: { l: 30, r: 10, t: 10, b: 20 }, showlegend: false }}
                altText="Gráfica de caja y bigotes comparando tiempos de respuesta"
                tableData={{ columns: [], rows: [] }}
                onExplain={() => {}}
              />
            </div>
          </Card>

          <Card className="p-4 bg-ice-50 border border-ice-200 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-2 text-sm">Reglas del Agente (Activas)</h3>
            <ul className="text-xs text-secundario space-y-1 list-disc pl-4">
              <li>Responde cotizaciones y horarios de inmediato.</li>
              <li>Agenda clases muestra automáticamente en slots vacíos.</li>
              <li>Escala a humano quejas, problemas médicos o reembolsos.</li>
              <li>Escala a humano fuera de horario de atención si no sabe la respuesta.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
