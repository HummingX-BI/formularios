import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles(path.resolve('./src'));

let issuesFound = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Dobles espacios literales (solo espacios ' ', no tabs ni newlines)
  // Usamos \b para no destruir indentaciones, aunque es difícil en JSX
  // Solo cambiamos cosas seguras.
  content = content.replace(/([A-Za-z0-9,.:;]) {2,}([A-Za-z0-9])/g, '$1 $2');
  
  // Signos duplicados (,, .. ??)
  content = content.replace(/,,+/g, ',');
  content = content.replace(/!!+/g, '!');
  // Se ignora '??' porque en TypeScript es nullish coalescing

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Corregido en: ${file}`);
    issuesFound++;
  }
}

console.log(`Revisión de textos completada. ${issuesFound} archivos modificados.`);
