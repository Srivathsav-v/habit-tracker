import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import { DARK, LIGHT } from '../constants/theme';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const systemScheme = useColorScheme();            // 'dark' | 'light' | null
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [loaded, setLoaded]     = useState(false);

  // Hydrate from storage once on mount
  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  // Persist whenever settings change (after initial load)
  useEffect(() => {
    if (loaded) saveSettings(settings);
  }, [settings, loaded]);

  const updateSettings = (patch) =>
    setSettings(prev => ({ ...prev, ...patch }));

  // Derive the active colour palette
  const C = useMemo(() => {
    if (settings.themePref === 'light') return LIGHT;
    if (settings.themePref === 'dark')  return DARK;
    // 'system' — fall back to DARK when system preference is unavailable
    return systemScheme === 'light' ? LIGHT : DARK;
  }, [settings.themePref, systemScheme]);

  const isDark = C === DARK;

  return (
    <AppContext.Provider value={{ C, isDark, settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
