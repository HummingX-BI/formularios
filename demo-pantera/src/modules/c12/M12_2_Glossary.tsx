import { useState } from 'react';
import { glossary, searchGlossary } from '@/insights/glossary';
import { Search, Book, Calculator, ExternalLink } from 'lucide-react';
import { useDataset } from '@/data/hooks';
import { useNavigate } from 'react-router-dom'; 

export default function M12_2_Glossary() { 
  const [query, setQuery] = useState(''); 
  const dataset = useDataset(); 
  const navigate = useNavigate(); 
  const filteredTerms = query ? searchGlossary(query) : glossary.sort((a, b) => a.term.localeCompare(b.term)); 
  
  // Group alphabetically 
  const grouped = filteredTerms.reduce((acc, term) => { 
    const letter = term.term.charAt(0).toUpperCase(); 
    if (!acc[letter]) acc[letter] = []; 
    acc[letter].push(term); 
    return acc; 
  }, {} as Record<string, typeof glossary>); 
  
  const letters = Object.keys(grouped).sort(); 
  
  return ( 
    <div className="p-8 max-w-6xl mx-auto font-sans"> 
      <div className="mb-8"> 
        <h1 className="text-3xl font-bold text-navy-900 font-display flex items-center gap-3"> 
          <Book className="w-8 h-8 text-sky-500" /> Glosario Analítico 
        </h1> 
        <p className="text-text-secondary mt-2"> Definiciones y fórmulas de todas las métricas y conceptos utilizados en la escuela. </p> 
      </div> 
      <div className="mb-8 relative max-w-xl"> 
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tenue" /> 
        <input type="text" placeholder="Buscar un término (ej. Churn, CAC, Bayes)..." value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-ice-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm transition-all" /> 
      </div> 
      {!query && ( 
        <div className="flex flex-wrap gap-2 mb-8"> 
          {letters.map(l => ( 
            <a key={l} href={`#letter-${l}`} className="w-8 h-8 flex items-center justify-center bg-white border border-ice-200 rounded hover:bg-sky-50 hover:text-blue-600 transition-colors text-sm font-semibold"> {l} </a> 
          ))} 
        </div> 
      )} 
      <div className="space-y-12"> 
        {letters.length === 0 && ( 
          <div className="text-center py-12 text-text-tenue bg-white rounded-xl border border-ice-100"> No se encontraron términos para "{query}". </div> 
        )} 
        {letters.map(letter => ( 
          <div key={letter} id={`letter-${letter}`} className="scroll-mt-6"> 
            <h2 className="text-2xl font-bold text-navy-900 border-b-2 border-ice-200 pb-2 mb-6 font-display">{letter}</h2> 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
              {(grouped[letter] || []).map(term => ( 
                <div key={term.id} id={`term-${term.id}`} className="bg-white rounded-xl p-6 border border-ice-100 shadow-sm hover:shadow-md transition-shadow"> 
                  <h3 className="text-lg font-bold text-blue-900 mb-2">{term.term}</h3> 
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed"> {term.definition} </p> 
                  {term.exampleGenerator && dataset && dataset.charges && ( 
                    <div className="bg-ice-50 p-3 rounded-lg border border-ice-100 mb-4 flex items-start gap-2"> 
                      <Calculator className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> 
                      <span className="text-sm text-text-primary"> {term.exampleGenerator(dataset as any)} </span> 
                    </div> 
                  )} 
                  {term.relatedModule && ( 
                    <button onClick={() => navigate(`/c${term.relatedModule?.substring(1,3)}/${term.relatedModule}`)} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold" >
                      <ExternalLink className="w-3.5 h-3.5" /> Ver en módulo 
                    </button> 
                  )} 
                </div> 
              ))} 
            </div> 
          </div> 
        ))} 
      </div> 
    </div> 
  );
}
