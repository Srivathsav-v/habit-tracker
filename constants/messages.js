export const GREEN_MESSAGES = [
  "You showed up. That's everything.",
  "Keep that momentum.",
  "One more rep. Literally or figuratively.",
  "Consistency is the whole game.",
  "Stack it up.",
  "That one counts.",
];

export const RED_MESSAGES = [
  "Noted. No judgment, just data.",
  "Awareness is the first step.",
  "Logged. You're paying attention.",
  "Every entry matters.",
  "Tracking is understanding.",
  "One day at a time.",
];

/**
 * Pick a random message that is NOT the same as lastIdx.
 * Returns { message, idx } so caller can store the new idx.
 */
export function getNextMessage(messages, lastIdx = -1) {
  if (messages.length === 1) return { message: messages[0], idx: 0 };
  let idx;
  do {
    idx = Math.floor(Math.random() * messages.length);
  } while (idx === lastIdx);
  return { message: messages[idx], idx };
}
