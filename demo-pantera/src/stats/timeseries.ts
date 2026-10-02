/* eslint-disable */
import { mean, variance } from './descriptive';

export function movingAverage(data: number[], windowSize: number): number[] {
  if (windowSize <= 0 || data.length === 0) return [];
  const result = [];
  for (let i = 0; i <= data.length - windowSize; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) sum += data[i + j]!;
    result.push(sum / windowSize);
  }
  return result;
}

export function differencing(data: number[], lag = 1): number[] {
  if (lag <= 0 || data.length <= lag) return [];
  const result = [];
  for (let i = lag; i < data.length; i++) {
    result.push(data[i]! - data[i - lag]!);
  }
  return result;
}

export function autocorrelation(data: number[], maxLag = 10): number[] {
  const n = data.length;
  if (n < 2) return [];
  const m = mean(data);
  const varPop = variance(data, false);
  if (varPop === 0) return Array.from({ length: maxLag + 1 }, () => 0);
  
  const result = [];
  for (let k = 0; k <= Math.min(maxLag, n - 1); k++) {
    let cov = 0;
    for (let i = 0; i < n - k; i++) {
      cov += (data[i]! - m) * (data[i + k]! - m);
    }
    result.push((cov / n) / varPop);
  }
  return result;
}
