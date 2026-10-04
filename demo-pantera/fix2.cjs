const fs = require('fs');

let composer = fs.readFileSync('src/assistant/composer.ts', 'utf8');
composer = composer.replace("import { INTENTS } from './intents';\nimport type { AssistantAnswer } from './intents';", "import { INTENTS } from './intents';");
composer = composer.replace("import { AssistantAnswer, INTENTS } from './intents';", "import { INTENTS } from './intents';\nimport type { AssistantAnswer } from './intents';");
composer = composer.replace("import type { AssistantAnswer } from './intents';\nimport type { AssistantAnswer } from './intents';", "import type { AssistantAnswer } from './intents';");
fs.writeFileSync('src/assistant/composer.ts', composer);

let chartExpl = fs.readFileSync('src/components/chat/ChartExplainer.tsx', 'utf8');
chartExpl = chartExpl.replace("import { cn } from '../utils';\n", "");
chartExpl = chartExpl.replace("import { cn } from '@/ui/components/utils';\n", "");
fs.writeFileSync('src/components/chat/ChartExplainer.tsx', chartExpl);

let asstTest = fs.readFileSync('src/tests/assistant/assistant.test.ts', 'utf8');
asstTest = asstTest.replace("import { ask, AssistantContext } from '../../assistant';", "import { ask } from '../../assistant';\nimport type { AssistantContext } from '../../assistant';");
fs.writeFileSync('src/tests/assistant/assistant.test.ts', asstTest);

let explTest = fs.readFileSync('src/tests/insights/explain.test.ts', 'utf8');
explTest = explTest.replace("let currentId = '';", "let currentId: string = '';");
explTest = explTest.replace("currentId = idMatch[1];", "currentId = idMatch[1] as string;");
fs.writeFileSync('src/tests/insights/explain.test.ts', explTest);
