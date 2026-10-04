import { test, expect } from '@playwright/test';

test.describe('Offline Verification (RNF-22)', () => {
  test('La aplicación carga y recorre el flujo principal sin realizar peticiones de red externas', async ({ page }) => {
    // Bloquear todas las peticiones que no sean a localhost o blob/data URIs
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (!url.startsWith('http://localhost') && !url.startsWith('blob:') && !url.startsWith('data:')) {
        console.error(`PETICION EXTERNA DETECTADA Y BLOQUEADA: ${url}`);
        // Reject the route to simulate offline network
        route.abort('internetdisconnected');
      } else {
        route.continue();
      }
    });

    const externalRequests: string[] = [];
    page.on('request', req => {
      const url = req.url();
      if (!url.startsWith('http://localhost') && !url.startsWith('blob:') && !url.startsWith('data:')) {
        externalRequests.push(url);
      }
    });

    // 1. Ir a la página
    await page.goto('http://localhost:4173');
    await expect(page).toHaveTitle(/Club Azulejo/);

    // Esperar a que se generen los datos y la pantalla de carga se vaya
    await page.waitForSelector('text=Centro de Mando', { timeout: 5000 });

    // 2. Navegar a Operación
    await page.click('text=Operación académica');
    await page.click('text=M2.1');
    await expect(page.locator('h1')).toContainText('Directorio de Estudiantes');

    // 3. Navegar a Machine Learning
    await page.click('text=Machine Learning');
    await page.click('text=M10.1');
    await expect(page.locator('h1')).toContainText('Probabilidad de Baja');

    // 4. Modo Presentador
    await page.keyboard.press('P');
    
    // Verificamos que no hubo peticiones a pesar de interactuar con gráficas y UI pesada
    expect(externalRequests.length).toBe(0);
  });
});
