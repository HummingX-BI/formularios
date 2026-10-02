// @ts-nocheck
import type { Prospect, ProspectStage, LostReason } from '../types';
import type { RandomGenerator } from '../rng';
import { addDays } from '../dates';
import { DEMO_CONFIG } from '../../config/demoConfig';

export function generateProspects(rng: RandomGenerator): Prospect[] {
  // 1. Generate dates curve
  const startDate = new Date(DEMO_CONFIG.dates.startDate + 'T00:00:00Z');
  const cutoffDate = new Date(DEMO_CONFIG.dates.cutoffDate + 'T00:00:00Z');
  
  const totalDays = Math.floor((cutoffDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Base linear growth + seasonality
  const dailyWeights: number[] = [];
  let sumW = 0;
  for (let d = 0; d <= totalDays; d++) {
    const current = addDays(DEMO_CONFIG.dates.startDate, d);
    const dateObj = new Date(current + 'T00:00:00Z');
    const month = dateObj.getUTCMonth(); // 0-11
    
    let season = 1.0;
    if (month === 0 || month === 1) season = 1.3; // Jan-Feb
    else if (month === 5) season = 0.7; // Jun
    else if (month === 6) season = 1.1; // Jul
    else if (month === 7 || month === 8) season = 1.3; // Aug-Sep
    else if (month === 11) season = 0.7; // Dec
    
    // Linear growth from 70 to 190 -> ~ 1 to 2.7
    const growth = 1.0 + (1.7 * (d / totalDays)); 
    const w = season * growth;
    dailyWeights.push(w);
    sumW += w;
  }
  
  // Exact 3200 total
  const TARGET_TOTAL = DEMO_CONFIG.volumes.totalProspects;
  const rawCounts = dailyWeights.map(w => (w / sumW) * TARGET_TOTAL);
  const dailyCounts = new Array(totalDays + 1).fill(0);
  
  // Distribute by largest remainder
  let currentTotal = 0;
  const remainders = rawCounts.map((val, i) => {
    const intVal = Math.floor(val);
    dailyCounts[i] = intVal;
    currentTotal += intVal;
    return { idx: i, rem: val - intVal };
  });
  
  remainders.sort((a, b) => b.rem - a.rem);
  let remIdx = 0;
  while (currentTotal < TARGET_TOTAL) {
    dailyCounts[remainders[remIdx]?.idx as number]++;
    currentTotal++;
    remIdx++;
  }
  
  // 2. Prepare exact sources
  const sourcePool: string[] = [];
  const addSource = (name: string, count: number) => {
    for (let i = 0; i < count; i++) sourcePool.push(name);
  };
  addSource('Referidos', 640);
  addSource('Visita directa', 480);
  addSource('Google', 800);
  addSource('Instagram', 960);
  addSource('Volante local', 320);
  
  // Shuffle sources slightly biased by time (Instagram late, Volante early)
  // Simplified: just shuffle thoroughly, the strict prompt 6 requirement says "Las proporciones por mes pueden variar"
  // We will bias them: assign a random score and sort.
  // Volante prefers early, Instagram prefers late.
  const sourceItems = sourcePool.map((src) => {
    let timeBias = rng.float(0, 1);
    if (src === 'Instagram') timeBias += 0.3;
    if (src === 'Volante local') timeBias -= 0.3;
    return { src, bias: timeBias + rng.normal(0, 0.5) };
  });
  sourceItems.sort((a, b) => a.bias - b.bias);
  const shuffledSources = sourceItems.map(item => item.src);
  
  // 3. Create prospects
  const prospects: Prospect[] = [];
  let pId = 1;
  let sourceIndex = 0;
  
  for (let d = 0; d <= totalDays; d++) {
    const currentStr = addDays(DEMO_CONFIG.dates.startDate, d);
    const count = dailyCounts[d] as number;
    for (let i = 0; i < count; i++) {
      const src = shuffledSources[sourceIndex++] as string;
      
      let channel: Prospect['channel'] = 'mensajeria';
      if (src === 'Visita directa') channel = 'presencial';
      else if (src === 'Referidos') channel = rng.choice(['telefono', 'mensajeria']);
      else if (src === 'Google') channel = rng.choice(['formulario_web', 'telefono', 'mensajeria']);
      else if (src === 'Instagram') channel = 'mensajeria';
      else if (src === 'Volante local') channel = rng.choice(['telefono', 'presencial']);
      
      // Age distribution (mostly 4-10)
      let age = rng.int(4, 10);
      if (rng.bool(0.15)) age = rng.int(1, 3);
      if (rng.bool(0.1)) age = rng.int(11, 15);
      
      prospects.push({
        id: `prs_${pId.toString().padStart(4, '0')}`,
        date: currentStr,
        source: src,
        channel,
        childAge: age,
        stage: 'nuevo',
        lastInteractionDate: currentStr, // will update later
      });
      pId++;
    }
  }
  
  // 4. Enrollments (920 exact)
  // Conversions: Referidos 307, Visita 274, Google 176, Insta 134, Volante 29
  const enrollTargets: Record<string, number> = {
    'Referidos': 307,
    'Visita directa': 274,
    'Google': 176,
    'Instagram': 134,
    'Volante local': 29
  };
  
  const enrolledProspects = new Set<string>();
  
  for (const src of Object.keys(enrollTargets)) {
    const target = enrollTargets[src] as number;
    const available = prospects.filter(p => p.source === src);
    const selected = rng.sample(available, target);
    selected.forEach(p => enrolledProspects.add(p.id));
  }
  
  // 5. Loss reasons (2280 lost)
  // Precio 866 (38%), Horario 502 (22%), Distancia 342 (15%), Otra escuela 228 (10%), Sin respuesta 342 (15%)
  const lossPool: LostReason[] = [];
  const addLoss = (reason: LostReason, count: number) => {
    for (let i = 0; i < count; i++) lossPool.push(reason);
  };
  addLoss('precio', 866);
  addLoss('horario', 502);
  addLoss('distancia', 342);
  addLoss('otra_escuela', 228);
  addLoss('sin_respuesta', 342);
  
  const shuffledLosses = rng.shuffle(lossPool);
  let lossIndex = 0;
  
  // 6. Assign Stages and Loss Reasons
  const now = DEMO_CONFIG.dates.cutoffDate;
  
  for (const p of prospects) {
    if (enrolledProspects.has(p.id)) {
      p.stage = 'inscrito';
      // They interacted until they enrolled. Enrolls happen within 1-14 days.
      const daysToEnroll = rng.int(1, 14);
      p.lastInteractionDate = addDays(p.date, daysToEnroll);
      if (p.lastInteractionDate > now) p.lastInteractionDate = now;
      p.enrolledStudentId = `stu_${p.id.split('_')[1]}`;
    } else {
      p.stage = 'perdido';
      const reason = shuffledLosses[lossIndex++] as LostReason;
      p.lostReason = reason;
      p.lastInteractionDate = addDays(p.date, rng.int(2, 21));
      if (p.lastInteractionDate > now) p.lastInteractionDate = now;
      
      if (reason === 'horario') {
        // Mostly Saturday 10:00 to 12:00
        if (rng.bool(0.7)) {
          p.requestedSchedule = `6-${rng.choice([10, 11, 12])}:00`;
        } else {
          p.requestedSchedule = `${rng.int(1, 5)}-${rng.int(16, 18)}:00`;
        }
      }
    }
  }
  
  return prospects;
}
