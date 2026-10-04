export function getDemandWeight(
  dayOfWeek: number,
  hour: number,
  pool: 'principal' | 'infantil',
): number {
  let w = 1.0;

  // Sat 10-12 Principal: max demand (95%+)
  if (pool === 'principal' && dayOfWeek === 6 && hour >= 10 && hour <= 12) {
    w = 10.0;
  }
  // Tue/Thu 16-17 Principal: ~48%
  else if (pool === 'principal' && (dayOfWeek === 2 || dayOfWeek === 4) && hour === 16) {
    w = 0.8;
  }
  // Weekday 17-19: high demand (90%)
  else if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 17 && hour <= 19) {
    w = 4.0;
    if (pool === 'infantil') w = 5.0; // peak for infantil
  }
  // Weekday 13-15: low demand (60-68%)
  else if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 13 && hour <= 15) {
    w = 0.5;
  }
  // Weekday 7-9: medium demand (65-72%)
  else if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 7 && hour <= 9) {
    w = 2.0;
    if (pool === 'infantil') w = 1.0; // less kids early
  }
  // Saturday 8 & 13: medium low
  else if (dayOfWeek === 6 && (hour === 8 || hour === 13)) {
    w = 1.2;
    if (pool === 'infantil' && hour === 8) w = 3.0; // Infantil sat morning peak
  }
  // Infantil peak 16-18
  else if (pool === 'infantil' && dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 16 && hour <= 18) {
    w = 4.5;
  }

  return w;
}
