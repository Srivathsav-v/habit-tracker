// ─── Palette ───────────────────────────────────────────────────────────────
export const C = {
  bg:          '#0D0B08',          // very dark warm black
  card:        '#1C1A14',          // dark charcoal with warmth
  gold:        '#C9A84C',          // rich warm gold
  goldBorder:  'rgba(201,168,76,0.28)',  // gold at ~28% opacity for borders
  goldDim:     'rgba(201,168,76,0.15)',  // very faint gold for subtle glows
  green:       '#27AE60',          // muted emerald
  red:         '#C0392B',          // deep crimson
  text:        '#F5F0E8',          // warm cream
  sub:         '#8A8070',          // muted warm grey
};

// ─── Habits (placeholder data) ─────────────────────────────────────────────
export const HABITS = [
  { id: '1', name: 'Leetcode', color: C.green, today: 3,  month: 12, year: 87 },
  { id: '2', name: 'Gym',      color: C.green, today: 1,  month: 8,  year: 52 },
  { id: '3', name: 'Smoking',  color: C.red,   today: 2,  month: 3,  year: 21 },
  { id: '4', name: 'Habit 4',  color: C.red,   today: 0,  month: 5,  year: 31 },
];

// ─── Affirmations ──────────────────────────────────────────────────────────
export const AFFIRMATIONS = {
  '1': "You showed up. That's everything.",
  '2': "Every rep counts. Every time.",
  '3': "One less. One step forward.",
  '4': "Progress, not perfection.",
};

// ─── Shared typography helpers ─────────────────────────────────────────────
export const T = {
  heading: {
    color: C.text,
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  gold: {
    color: C.gold,
    letterSpacing: 1.4,
    fontWeight: '600',
  },
  sub: {
    color: C.sub,
    fontSize: 12,
    letterSpacing: 0.4,
  },
};
