// src/assistant/index.ts
import { Classifier } from './classifier';
import { extractEntities } from './entities';
import type { Entities } from './entities';
import { composer } from './composer';
import type { AssistantAnswer, IntentDef } from './intents';
import { INTENTS } from './intents';

export interface AssistantContext {
  lastIntent?: string;
  turnsSinceLastIntent: number;
}

export interface AssistantResponse {
  intent: string;
  entities: Entities;
  answer: AssistantAnswer;
  context: AssistantContext;
}

const classifier = new Classifier();

export function ask(
  text: string,
  context: AssistantContext,
  metricsStore: any
): AssistantResponse {
  // 1. NLP & Entity Extraction
  const entities = extractEntities(text);

  // 2. Intent Classification
  let intentId = 'desconocido';
  const matches = classifier.classify(text);

  if (matches.length > 0 && matches[0]!.confidence > 0.1) {
    intentId = matches[0]!.intentId;
  } else if (context.turnsSinceLastIntent < 2 && context.lastIntent) {
    // Context carry-over: if they just asked "y sofia?" right after an instructor intent
    const last = INTENTS.find(i => i.id === context.lastIntent);
    if (last && Object.keys(entities).length > 0) {
      // It has entities but no clear intent, assume follow-up
      intentId = context.lastIntent;
    }
  }

  // 3. Compose Answer
  const answer = composer(intentId, entities, metricsStore);

  // 4. Update Context
  let newContext = { ...context };
  if (intentId !== 'desconocido') {
    newContext.lastIntent = intentId;
    newContext.turnsSinceLastIntent = 0;
  } else {
    newContext.turnsSinceLastIntent++;
  }

  return { intent: intentId, entities, answer, context: newContext };
}

export type { AssistantAnswer, AssistantContext as AssistantContextType, IntentDef };
