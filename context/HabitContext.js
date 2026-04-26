import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { loadHabits, saveHabits, DEFAULT_HABITS } from '../utils/storage';

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  // Start with defaults so UI renders immediately on first paint
  const [habits, setHabits] = useState(
    DEFAULT_HABITS.map(h => ({ ...h, timestamps: [] }))
  );
  const [loaded, setLoaded] = useState(false);

  // Hydrate from AsyncStorage once on mount
  useEffect(() => {
    loadHabits().then(stored => {
      setHabits(stored);
      setLoaded(true);
    });
  }, []);

  // Persist every time habits change (after initial load)
  useEffect(() => {
    if (loaded) saveHabits(habits);
  }, [habits, loaded]);

  // ── Actions ────────────────────────────────────────────────────────────
  const addTimestamp = (habitId) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? { ...h, timestamps: [...h.timestamps, new Date().toISOString()] }
          : h
      )
    );
  };

  const updateHabitName = (habitId, name) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId ? { ...h, name: name.trim() || null } : h
      )
    );
  };

  return (
    <HabitContext.Provider value={{ habits, addTimestamp, updateHabitName }}>
      {children}
    </HabitContext.Provider>
  );
}

export const useHabits = () => useContext(HabitContext);
