/**
 * Given an array of ISO timestamp strings, return counts for
 * today / this calendar month / this calendar year (local time).
 */
export function getCounts(timestamps = []) {
  const now   = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  let today = 0, month = 0, year = 0;

  for (const ts of timestamps) {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = d.getMonth();
    const dy = d.getDate();

    if (y === todayY) {
      year++;
      if (m === todayM) {
        month++;
        if (dy === todayD) today++;
      }
    }
  }

  return { today, month, year };
}
