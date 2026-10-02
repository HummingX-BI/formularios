import type { WebMonthly, KeywordSeries, PagePerformance, Prospect } from '../types';
import type { RandomGenerator } from '../rng';
import { DEMO_CONFIG } from '../../config/demoConfig';

export function generateWeb(
  rng: RandomGenerator,
  prospects: Prospect[]
) {
  const web: WebMonthly[] = [];
  
  const MONTHS: string[] = [];
  const tmpM = new Date(DEMO_CONFIG.dates.startDate + 'T12:00:00Z');
  for (let i = 0; i < 24; i++) {
    MONTHS.push(tmpM.toISOString().slice(0, 7));
    tmpM.setUTCMonth(tmpM.getUTCMonth() + 1);
  }
  
  // Base conversion
  const TARGET_CONVERSION = 0.021; // 2.1%
  
  for (let i = 0; i < MONTHS.length; i++) {
    const month = MONTHS[i]!;
    
    // Group prospects from this month by source
    const mProspects = prospects.filter(p => p.date.slice(0, 7) === month);
    let googleProspects = 0;
    let socialProspects = 0;
    
    for (const p of mProspects) {
      if (p.source === 'Google') googleProspects++;
      else if (p.source === 'Instagram') socialProspects++;
    }
    
    const organicProspects = googleProspects; // Simplification
    
    // Reverse engineer sessions to match 2.1% conversion
    const organicSessions = Math.round(organicProspects / TARGET_CONVERSION);
    const socialSessions = Math.round(socialProspects / TARGET_CONVERSION);
    
    // Other sessions
    const baseVisits = 2500 + i * ((6500 - 2500) / 24);
    const directSessions = Math.round(baseVisits * 0.15);
    const referralSessions = Math.round(baseVisits * 0.05);
    const paidSessions = Math.round(baseVisits * 0.10);
    
    const visits = organicSessions + socialSessions + directSessions + referralSessions + paidSessions;
    
    web.push({
      month,
      visits,
      bounceRate: rng.float(0.40, 0.55),
      conversionRate: TARGET_CONVERSION + rng.float(-0.002, 0.002),
      sources: {
        organic: organicSessions,
        social: socialSessions,
        direct: directSessions,
        referral: referralSessions,
        paid: paidSessions
      }
    });
  }
  
  const keywordNames = [
    { k: 'clases de natación para niños Lindavista', pos: 3.8 },
    { k: 'natación para bebés CDMX', pos: 17.4 },
    { k: 'escuela de natación Lindavista', pos: 2.1 },
    { k: 'clases de natación Gustavo A. Madero', pos: 5.4 },
    { k: 'natación infantil precios', pos: 8.2 },
    { k: 'clase muestra de natación', pos: 11.5 },
    { k: 'alberca temperada para niños', pos: 6.9 },
    { k: 'escuela de natacion cerca de mi', pos: 12.3 },
    { k: 'clases de natacion adultos Lindavista', pos: 25.1 },
    { k: 'natacion terapeutica CDMX', pos: 32.4 },
    { k: 'cursos de verano natacion', pos: 4.5 },
    { k: 'natacion bebes 6 meses', pos: 9.8 },
    { k: 'miedo al agua niños', pos: 14.2 },
    { k: 'aprender a nadar rapido', pos: 19.5 },
    { k: 'ejercicios respiracion natacion', pos: 22.1 }
  ];
  
  const keywords: KeywordSeries[] = keywordNames.map(kw => {
    const monthlyStats: any[] = [];
    let currentPos = kw.pos + (rng.float(-5, 5)); // starts slightly worse and improves
    
    for (let i = 0; i < 24; i++) {
      currentPos = currentPos - (currentPos - kw.pos) * 0.1 + rng.float(-0.5, 0.5);
      if (currentPos < 1) currentPos = 1;
      
      const impressions = Math.round(rng.int(500, 5000) * (24 + i) / 24);
      const clickRate = 0.3 / Math.sqrt(currentPos); // CTR decays with position
      const clicks = Math.round(impressions * clickRate);
      
      monthlyStats.push({
        month: MONTHS[i]!,
        position: parseFloat(currentPos.toFixed(1)),
        impressions,
        clicks
      });
    }
    return { keyword: kw.k, monthlyStats };
  });
  
  const pages: PagePerformance[] = [
    { path: '/', views: 42500, avgTimeSeconds: 45 },
    { path: '/precios', views: 21200, avgTimeSeconds: 110 },
    { path: '/horarios', views: 18400, avgTimeSeconds: 85 },
    { path: '/contacto', views: 9500, avgTimeSeconds: 30 },
    { path: '/metodologia', views: 6200, avgTimeSeconds: 145 },
    { path: '/galeria', views: 5100, avgTimeSeconds: 55 },
    { path: '/equipo', views: 3200, avgTimeSeconds: 40 },
    { path: '/preguntas-frecuentes', views: 8900, avgTimeSeconds: 160 },
  ];
  
  return { web, keywords, pages };
}
