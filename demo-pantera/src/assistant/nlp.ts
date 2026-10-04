// src/assistant/nlp.ts
const STOP_WORDS = new Set([ 'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'porque', 'a', 'ante', 'bajo', 'con', 'de', 'desde', 'en', 'hacia', 'hasta', 'para', 'por', 'segun', 'sin', 'sobre', 'tras', 'que', 'cual', 'quien', 'quienes', 'cuales', 'lo', 'al', 'del', 'mi', 'tu', 'su', 'mis', 'tus', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'me', 'te', 'se', 'nos', 'os', 'le', 'les', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas', 'es', 'son', 'soy', 'eres', 'somos', 'sois', 'fui', 'fue', 'fuimos', 'fueron', 'ser', 'estoy', 'estas', 'esta', 'estamos', 'estan', 'estaba', 'estaban', 'como', 'cuando', 'donde', 'cuanto', 'cuantos', 'cuanta', 'cuantas', 'muy', 'mucho', 'muchos', 'mucha', 'muchas', 'poco', 'pocos', 'poca', 'pocas', 'si', 'no', 'ya', 'mas', 'menos', 'tan', 'tanto' ]);

const COMMON_MISSPELLINGS: Record<string, string> = { 
  'ingresios': 'ingresos', 'ingreos': 'ingresos', 'dinero': 'ingresos', 'lana': 'ingresos', 'prospto': 'prospectos', 'prospecto': 'prospectos', 'propectos': 'prospectos', 'prspectos': 'prospectos', 'chur': 'churn', 'churm': 'churn', 'chorm': 'churn', 'baja': 'bajas', 'renuncias': 'bajas', 'salidas': 'bajas', 'ocupasion': 'ocupacion', 'llenos': 'ocupacion', 'lleno': 'ocupacion', 'vacio': 'ocupacion', 'vistos': 'vencida', 'morosos': 'vencida', 'morosidad': 'vencida', 'deuda': 'vencida', 'deben': 'vencida', 'pagos': 'cobranza', 'rentable': 'rentabilidad', 'rentablidad': 'rentabilidad', 'albercas': 'alberca', 'picina': 'alberca', 'piscina': 'alberca', 'profesores': 'instructores', 'profesor': 'instructor', 'maestros': 'instructores', 'maestro': 'instructor', 'coach': 'instructor', 'coaches': 'instructores', 'ticket': 'ticket', 'tiket': 'ticket', 'tiquet': 'ticket', 'conversion': 'conversion', 'convierten': 'conversion', 'cierres': 'conversion', 'cerrados': 'conversion',
}; 

export function removeAccents(str: string): string { 
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
} 

export function tokenize(text: string): string[] { 
  // Replace punctuation with space, except maybe keep numbers? 
  const cleanText = text.replace(/[.,/#!$%^&*;:{}=\-_`~()¿?¡!]/g, " "); 
  return cleanText.split(/\s+/).filter(w => w.length > 0);
} 

export function stem(word: string): string { 
  // A very simple stemming for Spanish metrics context 
  let w = word; 
  // Plural to singular (simplified) 
  if (w.length > 3) { 
    if (w.endsWith('es') && !['mes', 'tres', 'jueves', 'viernes', 'lunes', 'martes', 'miercoles'].includes(w)) { 
      w = w.slice(0, -2); 
    } else if (w.endsWith('s') && !['mes', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'dos', 'tres', 'seis'].includes(w)) { 
      w = w.slice(0, -1); 
    }
  } 
  
  // Verbs 
  if (w.endsWith('ando') || w.endsWith('iendo')) { 
    w = w.slice(0, -4); 
  } else if (w.endsWith('ar') || w.endsWith('er') || w.endsWith('ir')) { 
    w = w.slice(0, -2); 
  }
  return w;
} 

export function normalize(text: string): string[] { 
  const lower = removeAccents(text.toLowerCase()); 
  const tokens = tokenize(lower); 
  const normalizedTokens: string[] = []; 
  for (const token of tokens) { 
    // Correct spelling first 
    let w = COMMON_MISSPELLINGS[token] || token; 
    // Check stop words 
    if (!STOP_WORDS.has(w)) { 
      // Stem 
      w = stem(w); 
      normalizedTokens.push(w); 
    }
  } 
  return normalizedTokens;
} 

export function nGrams(tokens: string[], n: number = 2): string[] { 
  const ngrams = []; 
  for (let i = 0; i <= tokens.length - n; i++) { 
    ngrams.push(tokens.slice(i, i + n).join(' ')); 
  }
  return ngrams;
}
