import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/app/store';
import { Bot, X, Send, AlertTriangle, Copy, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { ask } from '@/assistant';
import type { AssistantContext } from '@/assistant';
import { useDataset } from '@/data/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/ui/components/utils'; 

export function ChatPanel({ isFullscreen = false }: { isFullscreen?: boolean }) { 
  const { chatIsOpen, toggleChat, chatMessages, addChatMessage, setChatTyping, chatIsTyping, clearChat, period, poolFilter } = useAppStore(); 
  const [input, setInput] = useState(''); 
  const [context, setContext] = useState<AssistantContext>({ turnsSinceLastIntent: 0 }); 
  const scrollRef = useRef<HTMLDivElement>(null); 
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const dataset = useDataset(); 
  
  // Scroll to bottom on new message 
  useEffect(() => { 
    if (scrollRef.current) { 
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight; 
    }
  }, [chatMessages, chatIsTyping]); 
  
  // Initial welcome message 
  useEffect(() => { 
    if (chatIsOpen && chatMessages.length === 0) { 
      const summaryMsg: any = { 
        id: 'welcome', 
        role: 'assistant', 
        isWelcome: true, 
        text: '¡Hola! Soy tu asistente analítico.', 
        summary: { 
          metrics: [ { label: 'Ocupación', value: '82%' }, { label: 'Ingresos', value: '$245k' }, { label: 'Bajas', value: '12' } ], 
          alert: 'Riesgo alto de retención en Nivel 3' 
        }, 
        suggestions: ['¿Cuántos se dieron de baja?', '¿Qué nivel tiene más bajas?', 'Proyección de ingresos'] 
      }; 
      addChatMessage(summaryMsg); 
    }
  }, [chatIsOpen, chatMessages.length, addChatMessage]); 
  
  if (!chatIsOpen && !isFullscreen) return null; 
  
  const handleSend = (text: string) => { 
    if (!text.trim()) return; 
    const userMsg = { id: Date.now().toString(), role: 'user', text }; 
    addChatMessage(userMsg as any); 
    setInput(''); 
    setChatTyping(true); 
    // Simulate typing delay (max 2s) 
    setTimeout(() => { 
      try { 
        const res = ask(text, context, dataset); 
        setContext(res.context); 
        const botMsg: any = { id: (Date.now() + 1).toString(), role: 'assistant', ...res.answer, intent: res.intent }; 
        addChatMessage(botMsg); 
      } catch (err) { 
        addChatMessage({ id: (Date.now() + 1).toString(), role: 'assistant', text: 'Ocurrió un error al procesar tu solicitud.', isError: true } as any); 
      } finally { 
        setChatTyping(false); 
      }
    }, 1000 + Math.random() * 1000); 
  }; 
  
  const handleKeyDown = (e: React.KeyboardEvent) => { 
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(input); 
    }
    if (e.key === 'Escape' && !isFullscreen) { 
      toggleChat(); 
    }
  }; 
  
  return ( 
    <div className={cn("flex flex-col bg-white shadow-xl font-sans", isFullscreen ? "w-full h-full" : "w-[400px] h-full border-l border-ice-100" )}> 
      {/* Header */} 
      <div className="p-4 border-b border-ice-100 flex items-center justify-between bg-ice-50"> 
        <div> 
          <h3 className="font-bold flex items-center gap-2 text-blue-900"> <Bot className="w-5 h-5 text-sky-500" /> Asistente Analítico </h3> 
          <p className="text-xs text-text-secondary mt-1 truncate"> {location.pathname} • {period} • {poolFilter} </p> 
        </div> 
        <div className="flex items-center gap-2"> 
          <button onClick={clearChat} className="text-xs text-blue-600 hover:underline px-2 py-1"> Nueva conv. </button> 
          {!isFullscreen && ( 
            <button onClick={toggleChat} className="text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-ice-100 transition-colors"> 
              <X className="w-5 h-5" /> 
            </button> 
          )} 
        </div> 
      </div> 
      {/* Messages area */} 
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-white" aria-live="polite" >
        {chatMessages.map(msg => ( 
          <div key={msg.id} className={cn("flex flex-col max-w-[90%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}> 
            {msg.role === 'user' ? ( 
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm shadow-sm"> {msg.text} </div> 
            ) : ( 
              <div className="flex flex-col gap-2 w-full"> 
                <div className={cn( "border rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm", msg.isError ? "border-state-coral bg-red-50 text-red-900" : "border-ice-100 bg-ice-50 text-text-primary" )}> 
                  {msg.isWelcome && ( 
                    <div className="space-y-3"> 
                      <p className="font-semibold text-blue-900">{msg.text}</p> 
                      <div className="grid grid-cols-3 gap-2"> 
                        {msg.summary?.metrics.map((m: any) => ( 
                          <div key={m.label} className="bg-white p-2 rounded border border-ice-100 text-center"> 
                            <div className="text-xs text-text-tenue">{m.label}</div> 
                            <div className="font-bold text-blue-700">{m.value}</div> 
                          </div> 
                        ))} 
                      </div> 
                      <div className="flex items-center gap-2 text-state-coral text-xs bg-red-50 p-2 rounded"> 
                        <AlertTriangle className="w-4 h-4" /> {msg.summary?.alert} 
                      </div> 
                      <div className="pt-2 border-t border-ice-100 flex flex-wrap gap-2"> 
                        {msg.suggestions?.map((s: string) => ( 
                          <button key={s} onClick={() => handleSend(s)} className="text-xs bg-white border border-ice-200 rounded-full px-3 py-1 hover:border-sky-400 hover:text-blue-600 transition-colors"> {s} </button> 
                        ))} 
                      </div> 
                    </div> 
                  )} 
                  {!msg.isWelcome && !msg.isError && ( 
                    <div className="space-y-3"> 
                      {msg.cifraPrincipal && msg.cifraPrincipal !== '-' && ( 
                        <div className="text-2xl font-bold text-blue-800 font-display"> {msg.cifraPrincipal} </div> 
                      )} 
                      {/* Mini Grafica placeholder */} 
                      {msg.miniGrafica?.tipo !== 'ninguna' && ( 
                        <div className="h-12 w-full bg-blue-50 rounded border border-blue-100 flex items-center justify-center text-xs text-blue-400"> 
                          [Gráfica: {msg.miniGrafica?.tipo}] 
                        </div> 
                      )} 
                      <p className="text-text-secondary leading-relaxed">{msg.interpretacion}</p> 
                      {msg.recomendacion && ( 
                        <div className="bg-sky-50 p-3 rounded-lg border border-sky-100"> 
                          <p className="text-sm font-medium text-blue-900 mb-2">{msg.recomendacion}</p> 
                          <button className="text-xs bg-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"> Enviar al plan de acción </button> 
                        </div> 
                      )} 
                      {msg.enlace && msg.enlace.ruta && ( 
                        <button onClick={() => navigate(msg.enlace.ruta)} className="text-xs flex items-center gap-1 text-blue-600 hover:underline"> 
                          <ExternalLink className="w-3 h-3" /> {msg.enlace.texto} 
                        </button> 
                      )} 
                    </div> 
                  )} 
                  {msg.isError && <p>{msg.text}</p>} 
                </div> 
                {/* Actions & Follow up */} 
                {msg.role === 'assistant' && !msg.isWelcome && !msg.isError && ( 
                  <div className="flex flex-col gap-2 pl-2"> 
                    <div className="flex flex-wrap gap-2"> 
                      {msg.preguntasSeguimiento?.map((s: string) => ( 
                        <button key={s} onClick={() => handleSend(s)} className="text-xs bg-ice-50 border border-ice-200 rounded-full px-3 py-1 text-text-secondary hover:border-sky-400 hover:text-blue-600 transition-colors truncate max-w-[250px]"> {s} </button> 
                      ))} 
                    </div> 
                    <div className="flex items-center gap-3 text-text-tenue"> 
                      <button className="hover:text-blue-600" title="Copiar"><Copy className="w-3.5 h-3.5" /></button> 
                      <button className="hover:text-green-600" title="Útil"><ThumbsUp className="w-3.5 h-3.5" /></button> 
                      <button className="hover:text-red-600" title="No útil"><ThumbsDown className="w-3.5 h-3.5" /></button> 
                    </div> 
                  </div> 
                )} 
              </div> 
            )} 
          </div> 
        ))} 
        {chatIsTyping && ( 
          <div className="mr-auto items-start flex"> 
            <div className="bg-ice-50 border border-ice-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-10"> 
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /> 
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /> 
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /> 
            </div> 
          </div> 
        )} 
      </div> 
      {/* Input area */} 
      <div className="p-4 border-t border-ice-100 bg-white"> 
        <div className="relative flex items-end"> 
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Pregúntale a tus datos..." className="w-full bg-ice-50 border border-ice-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all resize-none min-h-[44px] max-h-32 scrollbar-thin" rows={1} style={{ height: input.split('\n').length > 1 ? `${Math.min(input.split('\n').length * 20 + 24, 128)}px` : '44px' }} /> 
          <button onClick={() => handleSend(input)} disabled={!input.trim() || chatIsTyping} className="absolute right-2 bottom-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors" >
            <Send className="w-4 h-4" /> 
          </button> 
        </div> 
        <div className="text-[10px] text-text-tenue text-center mt-2"> Enter para enviar, Mayús+Enter para nueva línea. Esc para cerrar. </div> 
      </div> 
    </div> 
  );
}
