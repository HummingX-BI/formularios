// src/assistant/entities.ts
import { removeAccents } from './nlp'; 

export interface Entities { 
  periodo?: string; // 'este_mes', 'mes_pasado', 'ultimos_3_meses', 'este_anio', '2025', 'septiembre' 
  alberca?: string; // 'principal', 'infantil', 'todas' 
  instructor?: string; // e.g. 'mariana', 'carlos' 
  nivel?: string; // e.g. 'nivel_3' 
  diaHora?: { dia?: string; hora?: string }; 
  fuente?: string; // 'recomendacion', 'instagram', 'facebook', 'busqueda' 
  metodoPago?: string; // 'tarjeta', 'efectivo', 'transferencia' 
  binomial?: { k: number; n: number }; // for "8 de 20"
} 

const INSTRUCTORES = ['mariana', 'carlos', 'sofia', 'diego', 'ana', 'jorge'];
const FUENTES = ['recomendacion', 'instagram', 'facebook', 'busqueda', 'google', 'volante'];
const METODOS = ['tarjeta', 'efectivo', 'transferencia'];
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']; 

export function extractEntities(text: string): Entities { 
  const normalized = removeAccents(text.toLowerCase()); 
  const entities: Entities = {}; 
  
  // 1. Periodo 
  if (normalized.includes('mes pasado') || normalized.includes('mes anterior')) { 
    entities.periodo = 'mes_pasado'; 
  } else if (normalized.includes('ultimos 3 meses') || normalized.includes('trimestre')) { 
    entities.periodo = 'ultimos_3_meses'; 
  } else if (normalized.includes('este año') || normalized.includes('este ano')) { 
    entities.periodo = 'este_anio'; 
  } else if (normalized.match(/\b2025\b/)) { 
    entities.periodo = '2025'; 
  } else if (normalized.match(/\b2026\b/)) { 
    entities.periodo = '2026'; 
  } else if (normalized.includes('septiembre')) { 
    entities.periodo = 'septiembre'; 
  } else if (normalized.includes('este mes')) { 
    entities.periodo = 'este_mes'; 
  }

  // 2. Alberca 
  if (normalized.includes('principal')) { 
    entities.alberca = 'principal'; 
  } else if (normalized.includes('infantil') || normalized.includes('chica') || normalized.includes('bebes')) { 
    entities.alberca = 'infantil'; 
  } else if (normalized.includes('todas las albercas') || normalized.includes('ambas')) { 
    entities.alberca = 'todas'; 
  }

  // 3. Instructor 
  for (const inst of INSTRUCTORES) { 
    if (normalized.includes(inst)) { 
      entities.instructor = inst; break; 
    }
  } 
  
  // 4. Nivel 
  const nivelMatch = normalized.match(/nivel\s*(\d)/); 
  if (nivelMatch) { 
    entities.nivel = `nivel_${nivelMatch[1]}`; 
  }

  // 5. Día y Hora 
  let diaHora: { dia?: string; hora?: string } = {}; 
  for (const dia of DIAS) { 
    if (normalized.includes(dia)) { 
      diaHora.dia = dia; break; 
    }
  } 
  const horaMatch = normalized.match(/(\d{1,2})\s*(am|pm)/); 
  if (horaMatch) { 
    diaHora.hora = `${horaMatch[1]} ${horaMatch[2]}`; 
  }
  if (diaHora.dia || diaHora.hora) { 
    entities.diaHora = diaHora; 
  }

  // 6. Fuente 
  for (const f of FUENTES) { 
    if (normalized.includes(f)) { 
      entities.fuente = f; break; 
    }
  } 
  
  // 7. Método de pago 
  for (const m of METODOS) { 
    if (normalized.includes(m)) { 
      entities.metodoPago = m; break; 
    }
  } 
  
  // 8. Binomial ("8 de 20") 
  const binMatch = normalized.match(/(\d+)\s+de\s+(\d+)/); 
  if (binMatch) { 
    entities.binomial = { k: parseInt(binMatch[1]!), n: parseInt(binMatch[2]!) }; 
  }

  return entities;
}
