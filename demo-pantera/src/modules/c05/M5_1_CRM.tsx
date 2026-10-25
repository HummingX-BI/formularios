import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { 
  Users, MessageSquare, Bot, Phone, 
  Calendar, CheckCircle2, MoreHorizontal, Settings2, Power,
  Clock, ArrowRight, UserPlus, Sparkles, SlidersHorizontal
} from 'lucide-react';

export default function M5_1_CRM() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('kanban'); // kanban | ai

  const lanes = [
    {
      id: 'l1',
      title: 'Nuevos Leads',
      subtitle: 'Sin contactar',
      accent: 'border-blue-500',
      bgHeader: 'bg-blue-50',
      textAccent: 'text-blue-700',
      leads: [
        { id: 'p1', name: 'Martha Gómez', source: 'Sitio Web', time: 'Hace 10 min', avatar: 'MG' },
        { id: 'p2', name: 'Carlos Ruíz', source: 'WhatsApp', time: 'Hace 1 hora', avatar: 'CR' },
      ]
    },
    {
      id: 'l2',
      title: 'En Seguimiento',
      subtitle: 'Contactados',
      accent: 'border-amber-500',
      bgHeader: 'bg-amber-50',
      textAccent: 'text-amber-700',
      leads: [
        { id: 'p3', name: 'Ana Torres', source: 'Llamada', time: 'Llamar hoy', avatar: 'AT' },
      ]
    },
    {
      id: 'l3',
      title: 'Visita Agendada',
      subtitle: 'Clase Muestra',
      accent: 'border-indigo-500',
      bgHeader: 'bg-indigo-50',
      textAccent: 'text-indigo-700',
      leads: [
        { id: 'p4', name: 'Luis Fernando', source: 'Recomendado', time: 'Mañana 16:00', avatar: 'LF' },
        { id: 'p5', name: 'Familia Silva', source: 'Google', time: 'Sábado 10:00', avatar: 'FS' },
      ]
    },
    {
      id: 'l4',
      title: 'Inscritos',
      subtitle: 'Cierre ganado',
      accent: 'border-emerald-500',
      bgHeader: 'bg-emerald-50',
      textAccent: 'text-emerald-700',
      leads: [
        { id: 'p6', name: 'Diego Soto', source: 'Sitio Web', time: 'Pagado', avatar: 'DS' },
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <Users className="text-indigo-600 w-8 h-8" />
            CRM y Pipeline Comercial
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Gestiona prospectos o delega la atención al Piloto Automático con IA.
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'kanban' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Users size={16} /> Tablero Comercial
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Bot size={16} className={activeTab === 'ai' ? 'text-indigo-200' : ''} /> Piloto IA
          </button>
        </div>
      </div>

      {activeTab === 'kanban' ? (
        /* KANBAN GRID (NO HORIZONTAL SCROLL) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {lanes.map((lane) => (
            <div key={lane.id} className={`flex flex-col rounded-2xl bg-slate-50/80 border border-slate-200 shadow-sm overflow-hidden`}>
              {/* Lane Header */}
              <div className={`p-4 border-t-4 ${lane.accent} ${lane.bgHeader} border-b border-slate-200/50 flex justify-between items-center`}>
                <div>
                  <h3 className={`font-bold text-sm uppercase tracking-wider ${lane.textAccent}`}>{lane.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{lane.subtitle}</p>
                </div>
                <span className="bg-white text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-slate-100">
                  {lane.leads.length}
                </span>
              </div>
              
              {/* Leads Container */}
              <div className="p-3 space-y-3 min-h-[500px]">
                {lane.leads.map((lead) => (
                  <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                    {/* Left color accent matching lane */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${lane.bgHeader.replace('bg-', 'bg-').replace('-50', '-400')}`}></div>
                    
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${lane.bgHeader} ${lane.textAccent}`}>
                          {lead.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm leading-tight">{lead.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {lead.source}
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    
                    <div className="pl-2 flex justify-between items-center mt-4">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <Clock size={12} className="text-slate-400"/> {lead.time}
                      </span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"><MessageSquare size={12}/></button>
                        <button className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><Phone size={12}/></button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 border-2 border-dashed border-slate-200 rounded-xl hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                  <UserPlus size={16} /> Nuevo Prospecto
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* PILOTO AUTOMÁTICO (AI CONFIG) */
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* AI HERO CARD */}
          <Card className="p-8 bg-slate-900 border-slate-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="relative z-10 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-500/30">
                <Sparkles size={14} /> Recepcionista Virtual 24/7
              </div>
              <h2 className="text-3xl font-display font-extrabold mb-2 tracking-tight">
                Piloto Automático con IA
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-medium">
                Delega la atención de prospectos en redes sociales. El agente responderá dudas, dará precios y agendará clases muestra directamente en tu calendario mientras tú te enfocas en operar.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0">
              <button 
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  aiEnabled 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Power size={20} />
                {aiEnabled ? 'Piloto Activado' : 'Piloto Apagado'}
              </button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* CONFIGURATION PANEL */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                  <SlidersHorizontal size={20} className="text-indigo-600" /> Configuración de Agente
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Tono de Comunicación</label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option>Amigable y Emocionante (Recomendado)</option>
                        <option>Formal y Corporativo</option>
                        <option>Directo y Breve</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Horario de Guardia</label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option>Responder 24/7 inmediatamente</option>
                        <option>Solo fuera de horario de oficina</option>
                        <option>Fines de semana solamente</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="mt-0.5 relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded checked:bg-indigo-600 checked:border-indigo-600 transition-colors" defaultChecked />
                        <CheckCircle2 size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">Permitir Agendar Clases</span>
                        <span className="text-xs text-slate-500 font-medium leading-relaxed block mt-1">
                          La IA podrá revisar tu calendario y asignar citas o clases muestra automáticamente.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </Card>
            </div>

            {/* LIVE PREVIEW / DEMO CHAT */}
            <div className="lg:col-span-7">
              <Card className="h-full bg-slate-50 border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Simulador de Conversación</h3>
                    <p className="text-xs text-slate-500 font-medium">Así responde tu IA en tiempo real</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50">
                  
                  {/* Chat 1 */}
                  <div>
                    <div className="flex justify-center mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200/50 px-2 py-1 rounded-full">Prospecto de Facebook</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {/* User Bubble */}
                      <div className="self-end bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                        <p className="text-sm">Hola, ¿tienen natación para un niño de 4 años en la tarde?</p>
                      </div>
                      
                      {/* AI Bubble */}
                      <div className="self-start flex items-end gap-2 max-w-[80%]">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                          <Bot size={12} />
                        </div>
                        <div className="bg-white border border-slate-200 text-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm">
                          <p className="text-sm leading-relaxed">
                            ¡Hola! Claro que sí. Tenemos el programa "Tiburones Blancos" ideal para 4 añitos. Nos quedan lugares los Martes y Jueves a las 4:00 PM y 5:00 PM. 
                            <br/><br/>
                            ¿Te gustaría que le agendemos una clase de prueba sin compromiso para esta misma semana?
                          </p>
                        </div>
                      </div>
                      
                      {/* System Action */}
                      <div className="self-center mt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-sm">
                          <Calendar size={12} /> IA actualizó status a "Visita Agendada"
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
                
                {/* Fake Input */}
                <div className="bg-white p-4 border-t border-slate-200">
                  <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-between text-slate-400">
                    <span className="text-sm font-medium">Escribe un mensaje de prueba...</span>
                    <button className="text-indigo-600"><ArrowRight size={18}/></button>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
