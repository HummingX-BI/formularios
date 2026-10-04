const fs = require('fs');
let composer = fs.readFileSync('src/assistant/composer.ts', 'utf8');
composer = composer.replace(/import\s+\{\s*AssistantAnswer,\s*INTENTS\s*\}\s*from\s*'(\.\/intents)';/, 'import { INTENTS } from \'$1\';\nimport type { AssistantAnswer } from \'$1\';');
fs.writeFileSync('src/assistant/composer.ts', composer);

let chartExpl = fs.readFileSync('src/components/chat/ChartExplainer.tsx', 'utf8');
chartExpl = chartExpl.replace(/import React from 'react';\n?/, '');
chartExpl = chartExpl.replace(/import \{ cn \} from '\.\.\/utils';\n?/, '');
fs.writeFileSync('src/components/chat/ChartExplainer.tsx', chartExpl);

let chatPanel = fs.readFileSync('src/components/chat/ChatPanel.tsx', 'utf8');
chatPanel = chatPanel.replace(', ChevronRight', '');
fs.writeFileSync('src/components/chat/ChatPanel.tsx', chatPanel);

let expl = fs.readFileSync('src/insights/explain.ts', 'utf8');
expl = expl.replace(/\(metrics\)\s*=>/g, '(_metrics) =>');
fs.writeFileSync('src/insights/explain.ts', expl);

let m12_1 = fs.readFileSync('src/modules/c12/M12_1_Chat.tsx', 'utf8');
m12_1 = m12_1.replace(/import React from 'react';\n?/, '');
fs.writeFileSync('src/modules/c12/M12_1_Chat.tsx', m12_1);

let m12_2 = fs.readFileSync('src/modules/c12/M12_2_Glossary.tsx', 'utf8');
m12_2 = m12_2.replace(/import React, \{ useState \} from 'react';/, "import { useState } from 'react';");
m12_2 = m12_2.replace(/term\.relatedModule\.substring/g, "term.relatedModule?.substring");
fs.writeFileSync('src/modules/c12/M12_2_Glossary.tsx', m12_2);

let asstTest = fs.readFileSync('src/tests/assistant/assistant.test.ts', 'utf8');
asstTest = asstTest.replace(/import \{ ask, AssistantContext \} from '\.\.\/\.\.\/assistant';/, "import { ask } from '../../assistant';\nimport type { AssistantContext } from '../../assistant';");
fs.writeFileSync('src/tests/assistant/assistant.test.ts', asstTest);

let explTest = fs.readFileSync('src/tests/insights/explain.test.ts', 'utf8');
explTest = explTest.replace(/const idMatch = line\.match/g, 'const idMatch = line?.match');
explTest = explTest.replace(/if \(line\.includes/g, 'if (line?.includes');
fs.writeFileSync('src/tests/insights/explain.test.ts', explTest);
console.log('Fixed!');
