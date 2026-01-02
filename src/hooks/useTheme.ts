/**
 * useTheme Hook
 * Hook para acceder al tema y sus utilidades
 */

import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}

