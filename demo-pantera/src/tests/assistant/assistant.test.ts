import { describe, it, expect } from 'vitest';
import { ask } from '../../assistant/index';
import type { AssistantContext } from '../../assistant/index';
import { INTENTS } from '../../assistant/intents'; 

// Mock metrics store
const mockStore = { 
  compute: (name: string) => { 
    const vals: Record<string, number> = { 
      ingresos_totales: 150000, 
      meta_ingresos: 200000, 
      alumnos_activos: 100, 
      ocupacion_cupo: 80, 
      lista_espera_total: 15, 
      riesgo_alto_baja: 5, 
      retencion_6m: 85, 
      leads: 50, 
      conversion: 20, 
      cartera_vencida: 45000, 
    }; 
    return vals[name] || 0; 
  }
}; 

const TEST_BANK: { phrase: string; intent: string }[] = []; 

// Generar 160 frases de prueba usando 4 de los 6 samples de cada intención
for (const intent of INTENTS) { 
  // Tomar las primeras 4 frases 
  const samples = intent.samples.slice(0, 4); 
  for (let i = 0; i < samples.length; i++) { 
    let phrase = samples[i]!; 
    // Añadir ruido a algunas frases 
    if (i === 1) phrase = phrase.toUpperCase(); // Mayúsculas 
    if (i === 2) phrase = phrase.replace('ingreso', 'ingresio').replace('prospecto', 'prospto'); // Errores ortográficos 
    TEST_BANK.push({ phrase, intent: intent.id }); 
  }
} 

// Add a specific test for "dame una receta de hotcakes" to unknown
TEST_BANK.push({ phrase: "receta de hotcakes", intent: "desconocido" }); 

describe('Assistant NLP Engine', () => { 
  it('Should have at least 160 test phrases (4 per intent)', () => { 
    expect(TEST_BANK.length).toBeGreaterThanOrEqual(160); 
  }); 
  
  it('Should correctly classify intents with >= 92% accuracy', () => { 
    let correct = 0; 
    const initialContext: AssistantContext = { turnsSinceLastIntent: 0 }; 
    for (const test of TEST_BANK) { 
      const result = ask(test.phrase, initialContext, mockStore); 
      if (result.intent === test.intent) { 
        correct++; 
      } else { 
        console.warn(`Mismatch: "${test.phrase}" -> Expected: ${test.intent}, Got: ${result.intent}`); 
      }
    } 
    const accuracy = correct / TEST_BANK.length; 
    expect(accuracy).toBeGreaterThanOrEqual(0.92); 
  }); 
  
  it('Should have complete responses (6 parts)', () => { 
    const result = ask("como vamos de dinero vs meta", { turnsSinceLastIntent: 0 }, mockStore); 
    expect(result.answer).toHaveProperty('cifraPrincipal'); 
    expect(result.answer).toHaveProperty('miniGrafica'); 
    expect(result.answer.miniGrafica).toHaveProperty('tipo'); 
    expect(result.answer).toHaveProperty('interpretacion'); 
    expect(result.answer).toHaveProperty('recomendacion'); 
    expect(result.answer).toHaveProperty('enlace'); 
    expect(result.answer.enlace).toHaveProperty('texto'); 
    expect(result.answer.enlace).toHaveProperty('ruta'); 
    expect(result.answer).toHaveProperty('preguntasSeguimiento'); 
    expect(result.answer.preguntasSeguimiento.length).toBeGreaterThanOrEqual(2); 
  }); 
  
  it('Should track traceability (metricasUsadas)', () => { 
    const result = ask("como vamos de dinero vs meta", { turnsSinceLastIntent: 0 }, mockStore); 
    expect(result.answer.metricasUsadas.length).toBeGreaterThanOrEqual(1); 
    expect(result.answer.metricasUsadas).toContain('ingresos_totales'); 
  }); 
  
  it('Should handle context and follow-ups correctly', () => { 
    // Turn 1 
    const ctx1: AssistantContext = { turnsSinceLastIntent: 0 }; 
    const res1 = ask("como esta el desempeño de mariana", ctx1, mockStore); 
    expect(res1.intent).toBe('instructores_desempeno_especifico'); 
    expect(res1.entities.instructor).toBe('mariana'); 
    
    // Turn 2 (Follow up) 
    const res2 = ask("y carlos?", res1.context, mockStore); 
    // Should inherit the intent but change the entity 
    expect(res2.intent).toBe('instructores_desempeno_especifico'); 
    expect(res2.entities.instructor).toBe('carlos'); 
    
    // Turn 3 (Turn completely changes topic) 
    const res3 = ask("cuantos prospectos llegaron", res2.context, mockStore); 
    expect(res3.intent).toBe('prospectos_cantidad'); 
  }); 
  
  it('Should extract binomial entities correctly', () => { 
    const res = ask("calcula la probabilidad de 8 de 20", { turnsSinceLastIntent: 0 }, mockStore); 
    expect(res.entities.binomial?.k).toBe(8); 
    expect(res.entities.binomial?.n).toBe(20); 
  }); 
  
  it('Should handle unknown phrases gracefully (RF-13)', () => { 
    // "receta de hotcakes" will likely have 0 confidence. So it should be desconocido. 
    const res = ask("receta de hotcakes", { turnsSinceLastIntent: 0 }, mockStore); 
    expect(res.intent).toBe('desconocido'); 
    expect(res.answer.interpretacion).toContain('Lo siento, no logré entender'); 
    expect(res.answer.preguntasSeguimiento.length).toBe(3); 
  });
});
