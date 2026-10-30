export function esperar(ms: number): Promise<void> {
  return new Promise((resolver) => {
    setTimeout(resolver, ms);
  });
}

/** Pausa de 300 a 600 ms para que las acciones se sientan reales. */
export function cargaSimulada(): Promise<void> {
  return esperar(300 + Math.floor(Math.random() * 301));
}
