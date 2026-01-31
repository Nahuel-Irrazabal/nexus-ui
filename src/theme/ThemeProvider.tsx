/**
 * Provider de tema con soporte para customización por app
 * Maneja tema claro/oscuro, auto-detección del sistema y persistencia
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme, ThemeConfig, Theme } from './createTheme';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  systemTheme: ColorSchemeName;
  followingSystem: boolean;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  followSystem: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@nexus-ui/theme-mode';

interface ThemeProviderProps {
  children: ReactNode;
  
  /** Configuración del tema para esta app */
  themeConfig?: ThemeConfig;
  
  /** Temas completamente personalizados (sobrescribe themeConfig) */
  lightTheme?: Theme;
  darkTheme?: Theme;
}

export function ThemeProvider({
  children,
  themeConfig,
  lightTheme: customLight,
  darkTheme: customDark,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('auto');

  // Determinar temas a usar
  let light: Theme;
  let dark: Theme;

  if (customLight && customDark) {
    // Temas completamente personalizados
    light = customLight;
    dark = customDark;
  } else {
    // Crear desde config o usar default
    ({ light, dark } = createTheme(themeConfig));
  }

  // Cargar preferencia guardada
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
        setModeState(saved as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setMode = async (newMode: ThemeMode) => {
    try {
      setModeState(newMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setMode(theme);
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  };

  const followSystem = () => {
    setMode('auto');
  };

  // Determinar si el tema actual es oscuro
  const isDark = mode === 'auto' 
    ? systemScheme === 'dark' 
    : mode === 'dark';

  // Seleccionar tema correspondiente
  const theme = isDark ? dark : light;

  const value: ThemeContextType = {
    theme,
    mode,
    isDark,
    systemTheme: systemScheme,
    followingSystem: mode === 'auto',
    setMode,
    setTheme,
    toggleTheme,
    followSystem,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Export context for use in hooks
export { ThemeContext };
