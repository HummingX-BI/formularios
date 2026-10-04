// @ts-nocheck
import { RandomGenerator } from '../rng';
import { generateInstructors, LEVELS, PLANS, POOLS } from './catalogs';
import { generateSchedule } from './schedule';
import { generateProspects } from './prospects';
import { generateStudents } from './students';
import { simulateLifecycle } from './lifecycle';
import { generateFinance } from './finance';
import { generateWeb } from './web';
import { generateMessages } from './messages';
import type { Dataset } from '../types';

const cache = new Map<string, Dataset>();

export function generateDataset(seed: number | string): Dataset {
  const cacheKey = seed.toString();
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const startTime = performance.now();

  const forkRng = (s: string) => {
    let h = 0xdeadbeef;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h ^= h >>> 13;
    return new RandomGenerator(h, h + 1, h + 2, h + 3);
  };

  const myRng = forkRng(cacheKey);

  const instructors = generateInstructors(myRng.fork('instructors'));
  const groups = generateSchedule(myRng.fork('schedule'), instructors);
  const prospects = generateProspects(myRng.fork('prospects'));
  const { families, students, waitlist } = generateStudents(myRng.fork('students'), prospects);
  const lcResult = simulateLifecycle(myRng.fork('lifecycle'), students, groups, instructors);

  const updatedStudents = students.map((s) => {
    const simS = lcResult.simStudents.find((sim: any) => sim.id === s.id);
    return {
      ...s,
      status: simS && simS.active ? 'active' : 'churned',
      churnDate: simS?.churnDate,
      churnReason: simS?.churnReason,
      assignedGroups: simS?.active ? simS.assignedGroups : [],
    };
  });

  const { charges, payments } = generateFinance(
    myRng.fork('finance'),
    families,
    updatedStudents as any,
  );
  const { web, keywords, pages } = generateWeb(myRng.fork('web'), prospects);
  const { threads, notifications } = generateMessages(myRng.fork('messages'), prospects);

  const endTime = performance.now();
  console.log(`[generateDataset] Completed in ${(endTime - startTime).toFixed(2)} ms`);

  const dataset: Dataset = {
    metadata: {
      seed: typeof seed === 'number' ? seed : 0,
      generatedAt: new Date().toISOString(),
    },
    instructors,
    groups,
    families,
    students: updatedStudents as any,
    enrollments: [], // Can be populated if needed
    levelStints: lcResult.levelStints,
    attendance: lcResult.attendanceRecords,
    charges,
    payments,
    prospects,
    waitlist,
    web,
    keywords,
    pages,
    messages: threads,
    notifications,
  };

  cache.set(cacheKey, dataset);
  return dataset;
}

export const generateStructure = generateDataset;
