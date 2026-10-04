import { describe, it, expect } from 'vitest';
import { getAllRegisteredChartIds } from '../../insights/explain';
import fs from 'fs';
import path from 'path'; 

describe('Explicaciones de gráficas (M12.2)', () => { 
  it('Todas las gráficas con onExplain tienen una explicación registrada', () => { 
    const registeredIds = getAllRegisteredChartIds(); 
    const modulesDir = path.join(__dirname, '../../modules'); 
    const missing: string[] = []; 
    
    // Helper para escanear archivos TSX 
    const scanDir = (dir: string) => { 
      const files = fs.readdirSync(dir); 
      for (const file of files) { 
        const fullPath = path.join(dir, file); 
        if (fs.statSync(fullPath).isDirectory()) { 
          scanDir(fullPath); 
        } else if (file.endsWith('.tsx')) { 
          const content = fs.readFileSync(fullPath, 'utf-8'); 
          // Buscar usos de <PlotChart, <BarChart, etc. que tengan onExplain 
          const lines = content.split('\n'); 
          let currentId: string = ''; 
          for (let i = 0; i < lines.length; i++) { 
            const line = lines[i]; 
            const idMatch = line?.match(/id=["']([^"']+)["']/); 
            if (idMatch) { 
              currentId = idMatch[1] as string; 
            }
            if (line?.includes('onExplain={') || line?.includes('onExplain={() =>')) { 
              if (currentId && !registeredIds.includes(currentId)) { 
                missing.push(`${currentId} (en ${file})`); 
              }
            } 
          }
        } 
      }
    }; 
    scanDir(modulesDir); 
    expect(missing).toEqual([]); // Falla si alguna gráfica no está registrada 
  });
});
