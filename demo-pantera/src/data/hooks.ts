import { useMemo } from 'react';
import { useAppStore } from '../app/store';
import { generateDataset } from './generator/structure';
import type { Dataset } from './types';

export function useDataset(): Dataset {
  const seed = useAppStore((s) => s.seed);
  return useMemo(() => generateDataset(seed), [seed]);
}
