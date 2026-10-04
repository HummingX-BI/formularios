// src/assistant/classifier.ts 
import { normalize, nGrams } from './nlp';
import { INTENTS } from './intents'; 

export interface IntentMatch { 
  intentId: string; 
  confidence: number;
} 

// Compute TF (Term Frequency) for a document
function computeTF(tokens: string[]): Record<string, number> { 
  const tf: Record<string, number> = {}; 
  for (const t of tokens) { 
    tf[t] = (tf[t] || 0) + 1; 
  }
  const maxFreq = Math.max(...Object.values(tf), 1); 
  for (const t in tf) { 
    tf[t] = tf[t]! / maxFreq; // Augmented TF 
  }
  return tf;
} 

export class Classifier { 
  private idf: Record<string, number> = {}; 
  private docs: { intentId: string; tfidf: Record<string, number> }[] = []; 
  
  constructor() { 
    this.train(); 
  }

  private train() { 
    // Collect all documents (each sample is a document) 
    const allTokens: string[][] = []; 
    INTENTS.forEach(intent => { 
      intent.samples.forEach(sample => { 
        const tokens = normalize(sample); 
        // Add bigrams to catch phrases like "lista_espera" 
        const bigrams = nGrams(tokens, 2).map(b => b.replace(' ', '_')); 
        allTokens.push([...tokens, ...bigrams]); 
      }); 
    }); 
    const N = allTokens.length; 
    
    // Document frequency 
    const df: Record<string, number> = {}; 
    for (const docTokens of allTokens) { 
      const uniqueTokens = new Set(docTokens); 
      for (const t of uniqueTokens) { 
        df[t] = (df[t] || 0) + 1; 
      }
    } 
    
    // Inverse Document Frequency 
    for (const t in df) { 
      this.idf[t] = Math.log(N / (1 + df[t]!)); 
    }

    // Compute TF-IDF for each document 
    INTENTS.forEach(intent => { 
      intent.samples.forEach(sample => { 
        const tokens = normalize(sample); 
        const bigrams = nGrams(tokens, 2).map(b => b.replace(' ', '_')); 
        const docTokens = [...tokens, ...bigrams]; 
        const tf = computeTF(docTokens); 
        const tfidf: Record<string, number> = {}; 
        let norm = 0; 
        for (const t in tf) { 
          const w = tf[t]! * (this.idf[t] || 0); 
          tfidf[t] = w; 
          norm += w * w; 
        }
        
        norm = Math.sqrt(norm); 
        if (norm > 0) { 
          for (const t in tfidf) { 
            tfidf[t] = tfidf[t]! / norm; 
          }
        } 
        this.docs.push({ intentId: intent.id, tfidf }); 
      }); 
    }); 
  }

  public classify(text: string): IntentMatch[] { 
    const tokens = normalize(text); 
    const bigrams = nGrams(tokens, 2).map(b => b.replace(' ', '_')); 
    const docTokens = [...tokens, ...bigrams]; 
    const tf = computeTF(docTokens); 
    const tfidf: Record<string, number> = {}; 
    let queryNorm = 0; 
    for (const t in tf) { 
      const w = tf[t]! * (this.idf[t] || 0); // If term not in training, idf is 0 
      tfidf[t] = w; 
      queryNorm += w * w; 
    }
    
    queryNorm = Math.sqrt(queryNorm); 
    if (queryNorm === 0) return []; 
    
    const scores: Record<string, number[]> = {}; 
    // Keep all scores for an intent to average or take max 
    for (const doc of this.docs) { 
      let dotProduct = 0; 
      for (const t in tfidf) { 
        if (doc.tfidf[t]) { 
          dotProduct += (tfidf[t]! / queryNorm) * doc.tfidf[t]!; 
        }
      } 
      if (!scores[doc.intentId]) { 
        scores[doc.intentId] = []; 
      }
      scores[doc.intentId]!.push(dotProduct); 
    }

    // Aggregate by taking the max similarity to any sample of that intent 
    const results: IntentMatch[] = []; 
    for (const intentId in scores) { 
      const maxScore = Math.max(...scores[intentId]!); 
      if (maxScore > 0) { 
        results.push({ intentId, confidence: maxScore }); 
      }
    } 
    results.sort((a, b) => b.confidence - a.confidence); 
    return results; 
  }
}
