import { useAppStore } from '@/app/store';
import { getChartExplanation } from '@/insights/explain';
import { useDataset } from '@/data/hooks';
import { X, Bot, BookOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

export function ChartExplainer() { 
  const { activeExplanationContext, setExplanationContext, toggleChat, addChatMessage } = useAppStore(); 
  const dataset = useDataset(); 
  const navigate = useNavigate(); 
  
  if (!activeExplanationContext) return null; 
  const explanation = getChartExplanation(activeExplanationContext, dataset); 
  
  const handleAskAssistant = () => { 
    setExplanationContext(null); 
    if (!useAppStore.getState().chatIsOpen) { 
      toggleChat(); 
    }
    // Simulate user asking about this chart 
    addChatMessage({ id: Date.now().toString(), role: 'user', text: `Explícame más sobre la gráfica de ${activeExplanationContext}` }); 
    // In a real flow, this would trigger the assistant logic, but for UI test we just open it. 
  }; 
  
  const handleGlossary = (termId: string) => { 
    setExplanationContext(null); 
    navigate(`/c12/m12-2?term=${termId}`); 
  }; 
  
  return ( 
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-ice-200 z-50 flex flex-col font-sans transform transition-transform duration-300"> 
      <div className="p-4 border-b border-ice-100 flex items-center justify-between bg-ice-50"> 
        <h3 className="font-bold flex items-center gap-2 text-blue-900"> 
          <BookOpen className="w-5 h-5 text-sky-500" /> Explicación 
        </h3> 
        <button onClick={() => setExplanationContext(null)} className="text-text-tenue hover:text-text-primary p-1 rounded hover:bg-ice-100 transition-colors"> 
          <X className="w-5 h-5" /> 
        </button> 
      </div> 
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white"> 
        {explanation ? ( 
          <> 
            <div> 
              <h4 className="font-semibold text-sm text-text-secondary uppercase tracking-wider mb-2">¿Qué muestra?</h4> 
              <p className="text-sm text-text-primary leading-relaxed">{explanation.queMuestra}</p> 
            </div> 
            <div> 
              <h4 className="font-semibold text-sm text-text-secondary uppercase tracking-wider mb-2">¿Qué significa?</h4> 
              <p className="text-sm text-text-primary leading-relaxed">{explanation.queSignifica}</p> 
            </div> 
            <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg"> 
              <h4 className="font-semibold text-sm text-blue-900 flex items-center gap-1.5 mb-2"> 
                <AlertCircle className="w-4 h-4 text-state-ambar" /> Acción recomendada 
              </h4> 
              <p className="text-sm text-blue-800">{explanation.queHacer}</p> 
            </div> 
            {explanation.terminosRelacionados && explanation.terminosRelacionados.length > 0 && ( 
              <div> 
                <h4 className="font-semibold text-sm text-text-secondary mb-2">Términos en esta gráfica</h4> 
                <div className="flex flex-wrap gap-2"> 
                  {explanation.terminosRelacionados.map(t => ( 
                    <button key={t} onClick={() => handleGlossary(t)} className="text-xs bg-ice-50 border border-ice-200 text-blue-600 px-2 py-1 rounded hover:bg-ice-100 transition-colors" >
                      {t} 
                    </button> 
                  ))} 
                </div> 
              </div> 
            )} 
          </> 
        ) : ( 
          <div className="text-center text-text-tenue mt-10"> No hay explicación disponible para esta gráfica. </div> 
        )} 
      </div> 
      <div className="p-4 border-t border-ice-100 bg-ice-50"> 
        <button onClick={handleAskAssistant} className="w-full bg-white border border-blue-200 text-blue-700 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-sm" >
          <Bot className="w-4 h-4" /> Preguntar más al asistente 
        </button> 
      </div> 
    </div> 
  );
}
