// ─── Dark palette (default / original) ────────────────────────────────────
export const DARK = {
  bg:         '#0D0B08',
  card:       '#1C1A14',
  gold:       '#C9A84C',
  goldBorder: 'rgba(201,168,76,0.28)',
  goldDim:    'rgba(201,168,76,0.15)',
  green:      '#27AE60',
  red:        '#C0392B',
  text:       '#F5F0E8',
  sub:        '#8A8070',
};

// ─── Light palette ─────────────────────────────────────────────────────────
export const LIGHT = {
  bg:         '#FAF7F2',
  card:       '#F0EBE0',
  gold:       '#C9A84C',
  goldBorder: 'rgba(201,168,76,0.28)',
  goldDim:    'rgba(201,168,76,0.15)',
  green:      '#27AE60',
  red:        '#C0392B',
  text:       '#1A1A1A',
  sub:        '#8A8070',
};

// Legacy static export — any file that hasn't switched to useApp() gets DARK
export const C = DARK;

// ─── Placeholder data (legacy) ─────────────────────────────────────────────
export const HABITS = [
  { id: '1', name: 'Leetcode', color: DARK.green, today: 3,  month: 12, year: 87 },
  { id: '2', name: 'Gym',      color: DARK.green, today: 1,  month: 8,  year: 52 },
  { id: '3', name: 'Smoking',  color: DARK.red,   today: 2,  month: 3,  year: 21 },
  { id: '4', name: 'Habit 4',  color: DARK.red,   today: 0,  month: 5,  year: 31 },
];

export const AFFIRMATIONS = {
  '1': "You showed up. That's everything.",
  '2': "Every rep counts. Every time.",
  '3': "One less. One step forward.",
  '4': "Progress, not perfection.",
};

export const T = {
  heading: { color: DARK.text,  fontSize: 26, fontWeight: '600', letterSpacing: 0.6 },
  gold:    { color: DARK.gold,  letterSpacing: 1.4, fontWeight: '600' },
  sub:     { color: DARK.sub,   fontSize: 12, letterSpacing: 0.4 },
};
