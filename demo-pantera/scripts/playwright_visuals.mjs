// playwright_visuals.mjs
// Requiere: npm install -D playwright
// Uso: node scripts/playwright_visuals.mjs

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const viewports = [
    { name: '1366x768', width: 1366, height: 768 },
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: 'tablet_horiz', width: 1024, height: 768 }
  ];

  const outDir = path.resolve('./docs/screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Iniciando capturas visuales (se requiere el servidor corriendo en port 5173)...');

  try {
    await page.goto('http://localhost:5173/');
    
    // Login if needed
    // const loginBtn = await page.$('text=Entrar');
    // if (loginBtn) { await loginBtn.click(); await page.waitForTimeout(1000); }

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.screenshot({ path: path.join(outDir, `dashboard_${vp.name}.png`), fullPage: true });
    }
    
    // Generar hoja de contacto HTML
    let html = '<html><body><h1>Hoja de Contacto - Auditoría Visual</h1>';
    for (const vp of viewports) {
      html += `<h2>${vp.name}</h2><img src="screenshots/dashboard_${vp.name}.png" width="800" /><hr/>`;
    }
    html += '</body></html>';
    fs.writeFileSync(path.resolve('./docs/visual_audit.html'), html);
    
    console.log('Capturas generadas en docs/screenshots/');
  } catch (err) {
    console.error('Error durante capturas (asegúrate de que Vite esté corriendo):', err.message);
  } finally {
    await browser.close();
  }
})();
