// Genera public/icon-192.png e icon-512.png: monograma "T" del logo con el punto verde.
// Uso: node scripts/generar-iconos.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MARCA = [0x1e, 0x3a, 0x8a];
const BLANCO = [0xff, 0xff, 0xff];
const ACCION = [0x15, 0x80, 0x3d];

/** Color del punto (x, y) en coordenadas de 0 a 1. */
function colorEn(x, y) {
  const barra = x >= 0.25 && x <= 0.75 && y >= 0.25 && y <= 0.38;
  const tallo = x >= 0.435 && x <= 0.565 && y >= 0.25 && y <= 0.75;
  if (barra || tallo) return BLANCO;
  const dx = x - 0.7;
  const dy = y - 0.7;
  if (dx * dx + dy * dy <= 0.07 * 0.07) return ACCION;
  return MARCA;
}

const TABLA_CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = TABLA_CRC[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function bloque(tipo, datos) {
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, crc]);
}

function png(tamano) {
  const SUBMUESTRAS = 3;
  const filas = [];
  for (let py = 0; py < tamano; py++) {
    const fila = Buffer.alloc(1 + tamano * 3);
    for (let px = 0; px < tamano; px++) {
      const suma = [0, 0, 0];
      for (let sy = 0; sy < SUBMUESTRAS; sy++) {
        for (let sx = 0; sx < SUBMUESTRAS; sx++) {
          const c = colorEn((px + (sx + 0.5) / SUBMUESTRAS) / tamano, (py + (sy + 0.5) / SUBMUESTRAS) / tamano);
          suma[0] += c[0];
          suma[1] += c[1];
          suma[2] += c[2];
        }
      }
      const n = SUBMUESTRAS * SUBMUESTRAS;
      fila[1 + px * 3] = Math.round(suma[0] / n);
      fila[2 + px * 3] = Math.round(suma[1] / n);
      fila[3 + px * 3] = Math.round(suma[2] / n);
    }
    filas.push(fila);
  }
  const cabecera = Buffer.alloc(13);
  cabecera.writeUInt32BE(tamano, 0);
  cabecera.writeUInt32BE(tamano, 4);
  cabecera[8] = 8; // bits por canal
  cabecera[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloque('IHDR', cabecera),
    bloque('IDAT', deflateSync(Buffer.concat(filas))),
    bloque('IEND', Buffer.alloc(0)),
  ]);
}

const publico = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(publico, { recursive: true });
for (const tamano of [192, 512]) {
  writeFileSync(join(publico, `icon-${tamano}.png`), png(tamano));
  console.log(`public/icon-${tamano}.png`);
}
