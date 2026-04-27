/**
 * Given an array of ISO timestamp strings, return counts for
 * today / this week (Mon–Sun) / this calendar month / this calendar year.
 */
export function getCounts(timestamps = []) {
  const now    = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  // Start of current week (Monday 00:00:00 local time)
  const dow       = now.getDay();                   // 0 = Sun
  const diffToMon = dow === 0 ? 6 : dow - 1;
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(now.getDate() - diffToMon);

  let today = 0, week = 0, month = 0, year = 0;

  for (const ts of timestamps) {
    const d  = new Date(ts);
    const y  = d.getFullYear();
    const mo = d.getMonth();
    const dy = d.getDate();

    if (y === todayY) {
      year++;
      if (mo === todayM) {
        month++;
        if (dy === todayD) today++;
      }
    }
    if (d >= weekStart) week++;
  }

  return { today, week, month, year };
}
