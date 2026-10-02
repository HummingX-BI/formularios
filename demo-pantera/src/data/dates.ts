export function toDays(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00Z');
  return Math.floor(d.getTime() / 86400000);
}

export function toDateStr(days: number): string {
  const d = new Date(days * 86400000);
  return d.toISOString().split('T')[0] as string;
}

export function daysBetween(startStr: string, endStr: string): number {
  return toDays(endStr) - toDays(startStr);
}

export function addDays(dateStr: string, days: number): string {
  return toDateStr(toDays(dateStr) + days);
}

export function startOfMonth(dateStr: string): string {
  return dateStr.substring(0, 8) + '01';
}

export function endOfMonth(dateStr: string): string {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(5, 7), 10);
  const d = new Date(Date.UTC(year, month, 0));
  return d.toISOString().split('T')[0] as string;
}

export function addMonths(dateStr: string, months: number): string {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(5, 7), 10) - 1;
  const d = new Date(Date.UTC(year, month + months, 1));
  
  const endMonth = new Date(Date.UTC(year, month + months + 1, 0)).getUTCDate();
  const originalDay = parseInt(dateStr.substring(8, 10), 10);
  d.setUTCDate(Math.min(originalDay, endMonth));
  
  return d.toISOString().split('T')[0] as string;
}

export function monthsBetween(startStr: string, endStr: string): number {
  const startY = parseInt(startStr.substring(0, 4), 10);
  const startM = parseInt(startStr.substring(5, 7), 10);
  const endY = parseInt(endStr.substring(0, 4), 10);
  const endM = parseInt(endStr.substring(5, 7), 10);
  return (endY - startY) * 12 + (endM - startM);
}

export function dayOfWeek(dateStr: string): number {
  // 1=Mon, 7=Sun
  const d = new Date(dateStr + 'T00:00:00Z');
  const day = d.getUTCDay();
  return day === 0 ? 7 : day;
}

export function isoWeek(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getMonthList(startStr: string, endStr: string): string[] {
  const list = [];
  let curr = startOfMonth(startStr);
  const end = startOfMonth(endStr);
  while (curr <= end) {
    list.push(curr.substring(0, 7));
    curr = addMonths(curr, 1);
  }
  return list;
}

export function isHoliday(dateStr: string): boolean {
  // Dec 24 to Jan 1
  const md = dateStr.substring(5, 10);
  if (md >= '12-24' || md === '01-01') return true;
  
  // Semana Santa approx (simplified)
  if (dateStr >= '2025-04-14' && dateStr <= '2025-04-20') return true;
  if (dateStr >= '2026-03-30' && dateStr <= '2026-04-05') return true;
  
  if (md === '05-01') return true;
  if (md === '09-16') return true;
  if (md === '11-02') return true;
  
  if (dateStr === '2024-11-20') return true;
  if (dateStr === '2025-11-20') return true;
  
  return false;
}
