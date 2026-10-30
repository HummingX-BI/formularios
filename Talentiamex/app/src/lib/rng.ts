export interface Rng {
  /** Decimal en [0, 1). */
  siguiente: () => number;
  /** Entero en [min, max], ambos incluidos. */
  entero: (min: number, max: number) => number;
  elegir: <T>(lista: readonly T[]) => T;
  probabilidad: (p: number) => boolean;
  /** Copia mezclada de la lista. */
  mezclar: <T>(lista: readonly T[]) => T[];
}

/** PRNG determinista (mulberry32). */
export function crearRng(semilla: number): Rng {
  let estado = semilla >>> 0;
  const siguiente = (): number => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const entero = (min: number, max: number): number =>
    min + Math.floor(siguiente() * (max - min + 1));
  const elegir = <T>(lista: readonly T[]): T => {
    const valor = lista[entero(0, lista.length - 1)];
    if (valor === undefined) throw new Error('Lista vacía');
    return valor;
  };
  const mezclar = <T>(lista: readonly T[]): T[] => {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = entero(0, i);
      const a = copia[i];
      const b = copia[j];
      if (a === undefined || b === undefined) continue;
      copia[i] = b;
      copia[j] = a;
    }
    return copia;
  };
  return { siguiente, entero, elegir, probabilidad: (p) => siguiente() < p, mezclar };
}
