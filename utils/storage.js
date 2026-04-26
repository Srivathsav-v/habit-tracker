import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'vault_habits_v1';

// The four fixed slots — colorType is permanent, name starts null
export const DEFAULT_HABITS = [
  { id: '1', name: null, colorType: 'green', timestamps: [] },
  { id: '2', name: null, colorType: 'green', timestamps: [] },
  { id: '3', name: null, colorType: 'red',   timestamps: [] },
  { id: '4', name: null, colorType: 'red',   timestamps: [] },
];

export async function loadHabits() {
  try {
    const json = await AsyncStorage.getItem(KEY);
    if (!json) return DEFAULT_HABITS.map(h => ({ ...h, timestamps: [] }));
    const stored = JSON.parse(json);
    // Merge stored data onto defaults so new schema fields always exist
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
    await AsyncStorage.setItem(KEY, JSON.stringify(habits));
  } catch (e) {
    console.warn('Vault: AsyncStorage save failed', e);
  }
}
