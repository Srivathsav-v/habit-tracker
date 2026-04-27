import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY   = 'vault_habits_v1';
const SETTINGS_KEY = 'vault_settings_v1';

// ─── Habits ────────────────────────────────────────────────────────────────

export const DEFAULT_HABITS = [
  { id: '1', name: null, colorType: 'green', timestamps: [] },
  { id: '2', name: null, colorType: 'green', timestamps: [] },
  { id: '3', name: null, colorType: 'red',   timestamps: [] },
  { id: '4', name: null, colorType: 'red',   timestamps: [] },
];

export async function loadHabits() {
  try {
    const json = await AsyncStorage.getItem(HABITS_KEY);
    if (!json) return DEFAULT_HABITS.map(h => ({ ...h, timestamps: [] }));
    const stored = JSON.parse(json);
    return DEFAULT_HABITS.map(def => ({
      ...def,
      ...stored.find(h => h.id === def.id),
    }));
  } catch {
    return DEFAULT_HABITS.map(h => ({ ...h, timestamps: [] }));
  }
}

export async function saveHabits(habits) {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (e) {
    console.warn('Vault: habit save failed', e);
  }
}

// ─── Settings ──────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS = {
  themePref:   'system',           // 'system' | 'dark' | 'light'
  showCount:   true,               // show monthly count on home cards
  buttonShape: 'rounded',          // 'rounded' | 'pill' | 'square'
  habitOrder:  ['1', '2', '3', '4'],
};

export async function loadSettings() {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!json) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Vault: settings save failed', e);
  }
}
