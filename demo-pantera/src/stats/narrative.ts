/* eslint-disable */
export function interpretSkewness(skew: number, contextLabel = 'los datos'): string {
  if (Number.isNaN(skew)) return '';
  if (skew > 1)
    return `Tienen un sesgo positivo fuerte: hay algunos valores atípicamente altos que jalan el promedio de ${contextLabel} hacia arriba.`;
  if (skew < -1)
    return `Tienen un sesgo negativo fuerte: hay algunos valores atípicamente bajos que jalan el promedio de ${contextLabel} hacia abajo.`;
  if (skew > 0.5) return `Tienen un sesgo positivo moderado.`;
  if (skew < -0.5) return `Tienen un sesgo negativo moderado.`;
  return `Tienen una distribución bastante simétrica y balanceada.`;
}

export function interpretPValue(p: number, alpha = 0.05, context = 'una diferencia'): string {
  if (Number.isNaN(p)) return '';
  if (p < alpha) {
    if (p < 0.001)
      return `Existe evidencia estadística abrumadora (p < 0.001) para afirmar que hay ${context}.`;
    return `Sí hay evidencia estadística suficiente (p = ${p.toFixed(4)}) para afirmar que hay ${context}.`;
  } else {
    return `No hay evidencia estadística suficiente (p = ${p.toFixed(4)}) para afirmar que exista ${context}. El resultado podría deberse al azar.`;
  }
}

export function interpretRSquared(r2: number): string {
  if (Number.isNaN(r2)) return '';
  const pct = (r2 * 100).toFixed(1);
  if (r2 > 0.8)
    return `El modelo explica excepcionalmente bien los datos (${pct}% de la variabilidad).`;
  if (r2 > 0.5) return `El modelo explica moderadamente los datos (${pct}% de la variabilidad).`;
  return `El modelo explica muy débilmente los datos (solo ${pct}% de la variabilidad).`;
}

export function interpretSlope(slope: number, unitX: string, unitY: string): string {
  if (Number.isNaN(slope)) return '';
  const s = slope.toFixed(2);
  const dir = slope > 0 ? 'aumenta' : 'disminuye';
  return `Por cada unidad adicional de ${unitX}, el valor de ${unitY} ${dir} en promedio ${Math.abs(Number(s))}.`;
}
