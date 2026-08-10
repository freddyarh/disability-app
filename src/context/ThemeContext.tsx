import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
  ThemePalette,
  defaultTheme,
  highContrastTheme,
} from '../styles/theme';

const STORAGE_KEY = '@respond_ability_high_contrast';

type ThemeContextValue = {
  highContrast: boolean;
  theme: ThemePalette;
  isReady: boolean;
  setHighContrast: (enabled: boolean) => Promise<void>;
  toggleHighContrast: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [highContrast, setHighContrastState] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        setHighContrastState(saved === 'true');
      } catch {
        // Keep default theme if storage fails
      } finally {
        setIsReady(true);
      }
    };

    loadPreference();
  }, []);

  const setHighContrast = useCallback(async (enabled: boolean) => {
    setHighContrastState(enabled);
    AccessibilityInfo.announceForAccessibility(
      enabled ? 'High contrast mode enabled' : 'High contrast mode disabled'
    );

    try {
      await AsyncStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    } catch {
      // Preference still applies for this session
    }
  }, []);

  const toggleHighContrast = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics unavailable on some simulators/web
    }

    await setHighContrast(!highContrast);
  }, [highContrast, setHighContrast]);

  const value = useMemo(
    () => ({
      highContrast,
      theme: highContrast ? highContrastTheme : defaultTheme,
      isReady,
      setHighContrast,
      toggleHighContrast,
    }),
    [highContrast, isReady, setHighContrast, toggleHighContrast]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
