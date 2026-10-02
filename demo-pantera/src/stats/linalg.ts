// @ts-nocheck
/* eslint-disable */
export type Matrix = number[][];
export type Vector = number[];

export function zeros(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}

export function identity(n: number): Matrix {
  const m = zeros(n, n);
  for (let i = 0; i < n; i++) m[i]![i] = 1;
  return m;
}

export function transpose(a: Matrix): Matrix {
  const r = a.length;
  const c = a[0]!.length;
  const t = zeros(c, r);
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      t[j]![i] = a[i]![j]!;
    }
  }
  return t;
}

export function matMul(a: Matrix, b: Matrix): Matrix {
  const rA = a.length;
  const cA = a[0]!.length;
  const cB = b[0]!.length;
  const res = zeros(rA, cB);
  for (let i = 0; i < rA; i++) {
    for (let j = 0; j < cB; j++) {
      let sum = 0;
      for (let k = 0; k < cA; k++) {
        sum += a[i]![k]! * b[k]![j]!;
      }
      res[i]![j] = sum;
    }
  }
  return res;
}

export function vecMul(a: Matrix, v: Vector): Vector {
  const rA = a.length;
  const cA = a[0]!.length;
  const res = new Array(rA).fill(0);
  for (let i = 0; i < rA; i++) {
    for (let k = 0; k < cA; k++) {
      res[i] += a[i]![k]! * v[k]!;
    }
  }
  return res;
}

export function gaussianElimination(A: Matrix, b: Vector): Vector {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]!]);
  
  for (let i = 0; i < n; i++) {
    // Pivot
    let maxEl = Math.abs(M[i]![i]!);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k]![i]!) > maxEl) {
        maxEl = Math.abs(M[k]![i]!);
        maxRow = k;
      }
    }
    
    // Swap
    const tmp = M[maxRow]!;
    M[maxRow] = M[i]!;
    M[i] = tmp;
    
    // Eliminate
    for (let k = i + 1; k < n; k++) {
      const c = -M[k]![i]! / M[i]![i]!;
      for (let j = i; j < n + 1; j++) {
        if (i === j) M[k]![j] = 0;
        else M[k]![j] += c * M[i]![j]!;
      }
    }
  }
  
  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = M[i]![n]! / M[i]![i]!;
    for (let k = i - 1; k >= 0; k--) {
      M[k]![n] -= M[k]![i]! * x[i];
    }
  }
  return x;
}

export function inverse(A: Matrix): Matrix {
  const n = A.length;
  const M = A.map((row, i) => {
    const r = [...row];
    for (let j = 0; j < n; j++) r.push(i === j ? 1 : 0);
    return r;
  });
  
  for (let i = 0; i < n; i++) {
    let maxEl = Math.abs(M[i]![i]!);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k]![i]!) > maxEl) {
        maxEl = Math.abs(M[k]![i]!);
        maxRow = k;
      }
    }
    const tmp = M[maxRow]!;
    M[maxRow] = M[i]!;
    M[i] = tmp;
    
    const div = M[i]![i]!;
    for (let j = i; j < 2 * n; j++) M[i]![j] /= div;
    
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const c = M[k]![i]!;
      for (let j = i; j < 2 * n; j++) {
        M[k]![j] -= c * M[i]![j]!;
      }
    }
  }
  
  return M.map(row => row.slice(n));
}

// QR Decomposition (Gram-Schmidt)
export function qr(A: Matrix): { Q: Matrix, R: Matrix } {
  const m = A.length;
  const n = A[0]!.length;
  const Q = zeros(m, n);
  const R = zeros(n, n);
  
  for (let k = 0; k < n; k++) {
    const v = new Array(m).fill(0);
    for (let i = 0; i < m; i++) v[i] = A[i]![k]!;
    
    for (let j = 0; j < k; j++) {
      let dot = 0;
      for (let i = 0; i < m; i++) dot += Q[i]![j]! * A[i]![k]!;
      R[j]![k] = dot;
      for (let i = 0; i < m; i++) v[i] -= dot * Q[i]![j]!;
    }
    
    let norm = 0;
    for (let i = 0; i < m; i++) norm += v[i]! * v[i]!;
    norm = Math.sqrt(norm);
    R[k]![k] = norm;
    
    for (let i = 0; i < m; i++) Q[i]![k] = v[i]! / norm;
  }
  return { Q, R };
}

export function jacobiEigenvalue(A: Matrix): { values: Vector, vectors: Matrix } {
  const n = A.length;
  let D = A.map(r => [...r]);
  let V = identity(n);
  const maxIt = 100;
  const eps = 1e-9;
  
  for (let it = 0; it < maxIt; it++) {
    let p = 0, q = 1, maxVal = Math.abs(D[0]![1]!);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(D[i]![j]!) > maxVal) {
          maxVal = Math.abs(D[i]![j]!);
          p = i; q = j;
        }
      }
    }
    
    if (maxVal < eps) break;
    
    const theta = (D[q]![q]! - D[p]![p]!) / (2 * D[p]![q]!);
    let t = 1 / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    if (theta < 0) t = -t;
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    
    const Dpp = D[p]![p]!, Dqq = D[q]![q]!, Dpq = D[p]![q]!;
    D[p]![p] = c * c * Dpp - 2 * s * c * Dpq + s * s * Dqq;
    D[q]![q] = s * s * Dpp + 2 * s * c * Dpq + c * c * Dqq;
    D[p]![q] = 0;
    D[q]![p] = 0;
    
    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const Dip = D[i]![p]!, Diq = D[i]![q]!;
        D[i]![p] = c * Dip - s * Diq;
        D[p]![i] = D[i]![p]!;
        D[i]![q] = s * Dip + c * Diq;
        D[q]![i] = D[i]![q]!;
      }
      const Vip = V[i]![p]!, Viq = V[i]![q]!;
      V[i]![p] = c * Vip - s * Viq;
      V[i]![q] = s * Vip + c * Viq;
    }
  }
  
  const values = new Array(n);
  for (let i = 0; i < n; i++) values[i] = D[i]![i]!;
  return { values, vectors: V };
}
