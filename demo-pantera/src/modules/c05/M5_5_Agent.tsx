import { useState, useEffect } from 'react';
import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  User, 
  Play, 
  RotateCcw, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

const CONVERSATIONS = [
  {
    id: 'conv-1',
    name: 'María Fernández',
    source: 'Sitio Web',
    handledBy: 'agent',
    result: 'agendado',
    intent: 'Información y Clase Muestra',
    extracted: { age: '6 años', schedule: 'Martes y Jueves, 4:30 PM', level: 'Tortugas' },
    actionTaken: 'Clase Muestra Confirmada',
    messages: [
      {
        sender: 'user',
        text: 'Hola, me interesan las clases de natación para mi hijo.',
        time: '10:00 AM',
      },
      {
        sender: 'agent',
        text: '¡Hola María! Con gusto te paso informes. Manejamos alberca climatizada a 30°C. ¿Qué edad tiene tu hijo?',
        time: '10:00 AM',
      },
      { sender: 'user', text: 'Tiene 6 años recién cumplidos.', time: '10:02 AM' },
      {
        sender: 'agent',
        text: 'Para 6 años manejamos el nivel Tortugas. ¿Prefieres mañanas o tardes?',
        time: '10:02 AM',
      },
      { sender: 'user', text: 'Por las tardes, después de las 4.', time: '10:04 AM' },
      {
        sender: 'agent',
        text: 'Tenemos lugar a las 4:30 PM los martes y jueves. ¿Te gustaría que agendemos una Clase Muestra gratis este martes para que pruebe?',
        time: '10:04 AM',
      },
      { sender: 'user', text: 'Sí, me parece excelente.', time: '10:06 AM' },
      {
        sender: 'agent',
        text: '¡Listo! Quedó confirmada para el martes a las 4:30 PM con el Prof. Carlos. Recuerda traer gorra y goggles. ¡Los esperamos!',
        time: '10:06 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    name: 'Carlos Ruiz',
    source: 'WhatsApp',
    handledBy: 'agent',
    result: 'escalado',
    intent: 'Reposición por justificante médico',
    extracted: { age: '-', schedule: '-', level: 'Atención especial' },
    actionTaken: 'Escalado a Recepción',
    messages: [
      {
        sender: 'user',
        text: 'Hola, quiero pedir una reposición de clase porque mi hijo se enfermó y tengo justificante médico.',
        time: '11:15 AM',
      },
      {
        sender: 'agent',
        text: 'Hola Carlos. Lamentamos que se haya enfermado. Para validar el justificante te comunico de inmediato con recepción para programar su clase de reposición.',
        time: '11:15 AM',
      },
    ],
  },
  {
    id: 'conv-3',
    name: 'Laura Gómez',
    source: 'Sitio Web',
    handledBy: 'human',
    result: 'agendado',
    intent: 'Matronatación (Bebés)',
    extracted: { age: '2 años', schedule: 'Sábados 10:00 AM', level: 'Matronatación' },
    actionTaken: 'Agendado Manual',
    messages: [
      { sender: 'user', text: '¿Tienen clases los sábados para bebés?', time: '09:00 AM' },
      {
        sender: 'human',
        text: 'Hola Laura, sí tenemos Matronatación los sábados 10:00 AM para bebés de 6 meses a 3 años. Te esperamos para tu clase muestra.',
        time: '09:35 AM',
      },
    ],
  },
];

export default function M5_5_Agent() {
  const navigate = useNavigate();
  const [selectedConvId, setSelectedConvId] = useState(CONVERSATIONS[0]!.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [msgIndex, setMsgIndex] = useState(CONVERSATIONS[0]!.messages.length);

  const selectedConv = CONVERSATIONS.find((c) => c.id === selectedConvId) || CONVERSATIONS[0]!;

  const handlePlay = () => {
    setIsPlaying(true);
    setMsgIndex(1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setMsgIndex(selectedConv.messages.length);
  };

  useEffect(() => {
    if (isPlaying && msgIndex < selectedConv.messages.length) {
      const timer = setTimeout(() => {
        setMsgIndex(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (msgIndex >= selectedConv.messages.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, msgIndex, selectedConv]);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER LIMPIO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Bot className="text-indigo-600 w-7 h-7" />
            Agente de Ventas Autónomo
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Atención instantánea de prospectos web, calificación de nivel y agendamiento de clases muestra.
          </p>
        </div>

        <Button 
          variant="ghost"
          onClick={() => navigate('/ventas/crm')}
          className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5"
        >
          Ver en Pipeline CRM
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* 3 METRIC CARDS LIMPIAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-400 mb-1">Prospectos Atendidos</div>
          <div className="text-2xl font-bold text-slate-900">450 <span className="text-xs font-normal text-slate-400">en 90 días</span></div>
          <div className="text-xs text-indigo-600 font-medium mt-1">75% resueltos por el Bot</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-400 mb-1">Tasa de Agendamiento</div>
          <div className="text-2xl font-bold text-emerald-600">42%</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Clases muestra confirmadas</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-400 mb-1">Tiempo de Respuesta</div>
          <div className="text-2xl font-bold text-slate-900">&lt; 45 seg</div>
          <div className="text-xs text-slate-500 font-medium mt-1">vs 2.4 hrs de recepción manual</div>
        </div>
      </div>

      {/* WORKBENCH LIMPIO EN 2 COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: CHAT CON SELECTOR INTEGRADO */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
          {/* Barra superior con selector de prospectos */}
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {CONVERSATIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedConvId(c.id);
                    setMsgIndex(c.messages.length);
                    setIsPlaying(false);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedConvId === c.id
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className="text-xs font-medium text-indigo-700 hover:bg-indigo-50 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3 fill-indigo-700" />
                {isPlaying ? 'Reproduciendo...' : 'Reproducir'}
              </button>
              {msgIndex < selectedConv.messages.length && !isPlaying && (
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-700 p-1 rounded-md"
                  title="Ver todo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Ventana de mensajes limpia */}
          <div className="p-5 space-y-3 bg-slate-50/50 min-h-[360px] max-h-[420px] overflow-y-auto">
            {selectedConv.messages.slice(0, msgIndex).map((msg, i) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {isPlaying && msgIndex < selectedConv.messages.length && selectedConv.messages[msgIndex]!.sender !== 'user' && (
              <div className="flex items-start">
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-400 flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Pie informativo sutil */}
          <div className="px-4 py-2.5 border-t border-slate-100 bg-white text-[11px] text-slate-400 flex justify-between">
            <span>Canal: {selectedConv.source}</span>
            <span>Atendido por: {selectedConv.handledBy === 'agent' ? 'Bot Autónomo' : 'Recepción Humana'}</span>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN OPERATIVO CONCISO */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Diagnóstico del Prospecto
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-400 font-medium mb-0.5">Intención:</div>
                <div className="font-bold text-slate-800">{selectedConv.intent}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Edad del alumno:</span>
                  <span className="font-bold text-slate-800">{selectedConv.extracted.age}</span>
                </div>
                <div className="flex justify-between">
                  <span>Horario preferido:</span>
                  <span className="font-bold text-slate-800">{selectedConv.extracted.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nivel asignado:</span>
                  <span className="font-bold text-indigo-600">{selectedConv.extracted.level}</span>
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-medium mb-1">Acción del Agente:</div>
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                  {selectedConv.result === 'agendado' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{selectedConv.actionTaken}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-2 text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Regla de Operación
            </div>
            <p className="leading-relaxed">
              El agente responde costos y agenda clases muestra en automático solo en horarios con cupo disponible. Cualquier queja o solicitud médica se transfiere directo al mostrador.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
