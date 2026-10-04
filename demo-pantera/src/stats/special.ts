/* eslint-disable */
/**
 * Funciones Especiales (Matemáticas)
 */

/**
 * Logaritmo de la función Gamma usando aproximación de Lanczos.
 * Fórmula: ln(Gamma(z)) ≈ (z-0.5)*ln(z+g+0.5) - (z+g+0.5) + 0.5*ln(2*pi) + ln(A(z))
 * @param z Argumento (debe ser > 0)
 * @returns ln(Gamma(z))
 */
export function logGamma(z: number): number {
  if (z <= 0) return NaN;
  const p = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406,
    12.50734327822346, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  let y = z;
  let tmp = z + 7.5;
  tmp = (z + 0.5) * Math.log(tmp) - tmp;
  let ser = 0.9999999999998099;
  for (let i = 0; i < p.length; i++) {
    y++;
    ser += p[i]! / y;
  }
  return tmp + Math.log((2.5066282746310005 * ser) / z);
}

/**
 * Función Gamma
 * Fórmula: Gamma(z) = exp(logGamma(z))
 */
export function gamma(z: number): number {
  return Math.exp(logGamma(z));
}

/**
 * Función Beta
 * Fórmula: Beta(a, b) = exp(logGamma(a) + logGamma(b) - logGamma(a + b))
 */
export function beta(a: number, b: number): number {
  return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
}

/**
 * Gamma Incompleta Regularizada P(a, x)
 * Usando expansión en serie para x < a+1 y fracción continua para x >= a+1.
 * Fórmula: P(a, x) = 1/Gamma(a) * integral_0^x t^{a-1} e^{-t} dt
 */
export function regularizedGammaP(a: number, x: number): number {
  if (x < 0 || a <= 0) return NaN;
  if (x === 0) return 0;

  if (x < a + 1) {
    // Expansión en serie
    let ap = a;
    let sum = 1 / a;
    let del = sum;
    for (let i = 1; i <= 100; i++) {
      ap++;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 3e-7) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  } else {
    // Fracción continua (complemento Q)
    let b = x + 1 - a;
    let c = 1 / 1.0e-30;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i <= 100; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1.0) < 3e-7) break;
    }
    const q = Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
    return 1 - q;
  }
}

/**
 * Beta Incompleta Regularizada I_x(a, b)
 * Usando fracción continua.
 * Fórmula: I_x(a,b) = integral_0^x t^{a-1}(1-t)^{b-1} dt / Beta(a,b)
 */
export function regularizedBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1 || a <= 0 || b <= 0) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;

  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x),
  );

  // Simetría para mejor convergencia
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betaContFraction(x, a, b)) / a;
  } else {
    return 1 - (bt * betaContFraction(1 - x, b, a)) / b;
  }
}

function betaContFraction(x: number, a: number, b: number): number {
  const maxIt = 200;
  const eps = 3e-7;
  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIt; m++) {
    let m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    let del = d * c;
    h *= del;
    if (Math.abs(del - 1.0) < eps) break;
  }
  return h;
}

/**
 * Función Error erf(x)
 * Fórmula usando Gamma incompleta.
 */
export function erf(x: number): number {
  if (x === 0) return 0;
  const t = regularizedGammaP(0.5, x * x);
  return x >= 0 ? t : -t;
}

/**
 * Función Error Inversa erfinv(x)
 * Aproximación analítica de Winitzki o expansión.
 */
export function erfinv(x: number): number {
  if (x <= -1 || x >= 1) return NaN;
  const a = 0.147;
  const ln1minusX2 = Math.log(1 - x * x);
  const term1 = 2 / (Math.PI * a) + ln1minusX2 / 2;
  const term2 = ln1minusX2 / a;

  const sign = x < 0 ? -1 : 1;
  return sign * Math.sqrt(Math.sqrt(term1 * term1 - term2) - term1);
}
