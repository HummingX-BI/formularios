const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'src', 'modules');

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      if (!content.includes('onExplain={() => {}}')) {
        continue;
      }
      
      // Need to make sure useAppStore is imported
      if (!content.includes('useAppStore')) {
        // Add import at the top
        content = content.replace(/(import [^\n]+;\n)/, '$1import { useAppStore } from \'@/app/store\';\n');
      }

      // Need to make sure setExplanationContext is destructured
      // Let's find the component declaration. Usually: export function ...() { or export const ... = () => {
      // and we just inject `const { setExplanationContext } = useAppStore();`
      content = content.replace(/(export (?:default )?(?:function|const) \w+\s*(?:\([^)]*\))?\s*(?:=\s*(?:\([^)]*\)\s*=>)?)?\s*[{])/, '$1\n  const { setExplanationContext } = useAppStore();');

      // Now replace all onExplain={() => {}} with onExplain={() => setExplanationContext('actual_id')}
      // This is tricky because we need the 'id' of that specific chart.
      const lines = content.split('\n');
      let currentId = '';
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const idMatch = line.match(/id=["']([^"']+)["']/);
        if (idMatch) {
          currentId = idMatch[1];
        }
        if (line.includes('onExplain={() => {}}')) {
          if (currentId) {
            lines[i] = line.replace('onExplain={() => {}}', `onExplain={() => setExplanationContext('${currentId}')}`);
          }
        }
      }

      fs.writeFileSync(fullPath, lines.join('\n'));
      console.log(`Updated ${file}`);
    }
  }
}

scanDir(modulesDir);
