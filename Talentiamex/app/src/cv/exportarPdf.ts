import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { Candidato } from '@/types';
import { PLANTILLAS_CV } from './plantillas';
import { A4_ALTO, A4_ANCHO } from './utilCv';

/** CV-Mariana-Lopez.pdf */
export function nombreArchivoCv(nombre: string): string {
  const limpio = nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `CV-${limpio || 'candidato'}.pdf`;
}

async function esperarRecursos(raiz: HTMLElement): Promise<void> {
  await document.fonts.ready;
  const imagenes = Array.from(raiz.querySelectorAll('img'));
  await Promise.all(imagenes.map((img) => img.decode().catch(() => undefined)));
  // Un cuadro más para que el navegador termine de pintar.
  await new Promise<void>((resolver) => requestAnimationFrame(() => resolver()));
}

/**
 * Genera el PDF de la hoja A4 con la plantilla elegida y lo descarga.
 * La hoja se dibuja a tamaño real fuera de pantalla para que el PDF se vea igual que la vista previa.
 */
export async function exportarPdf(candidato: Candidato): Promise<string> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const contenedor = document.createElement('div');
  contenedor.setAttribute('data-export-cv', '');
  contenedor.style.cssText = `position:absolute;left:-10000px;top:0;width:${A4_ANCHO}px;height:${A4_ALTO}px;`;
  document.body.appendChild(contenedor);
  const raiz = createRoot(contenedor);

  try {
    flushSync(() => {
      raiz.render(createElement(PLANTILLAS_CV[candidato.plantilla], { candidato }));
    });
    await esperarRecursos(contenedor);
    const hoja = contenedor.querySelector<HTMLElement>('[data-cv-hoja]');
    if (!hoja) throw new Error('No se pudo preparar la hoja del CV');

    const lienzo = await html2canvas(hoja, {
      scale: 2,
      useCORS: true,
      backgroundColor: 'white',
      logging: false,
      onclone: (documento) => {
        const copia = documento.querySelector<HTMLElement>('[data-export-cv]');
        if (copia) copia.style.left = '0px';
      },
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    pdf.addImage(lienzo.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
    const archivo = nombreArchivoCv(candidato.nombre);
    pdf.save(archivo);
    return archivo;
  } finally {
    raiz.unmount();
    contenedor.remove();
  }
}
