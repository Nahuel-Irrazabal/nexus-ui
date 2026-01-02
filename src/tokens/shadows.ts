/**
 * Shadow Tokens
 * Sistema de sombras para elevation y profundidad
 */

import { ViewStyle } from 'react-native';

/**
 * Niveles de elevación (0-5)
 * Basado en Material Design elevation system
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 8,
  },
  
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 5.46,
    elevation: 12,
  },
} as const;

/**
 * Sombras específicas para dark mode
 * Ajustadas para mejor visibilidad en fondos oscuros
 */
export const darkShadows = {
  none: shadows.none,
  
  sm: {
    ...shadows.sm,
    shadowOpacity: 0.4,
  },
  
  md: {
    ...shadows.md,
    shadowOpacity: 0.45,
  },
  
  lg: {
    ...shadows.lg,
    shadowOpacity: 0.5,
  },
  
  xl: {
    ...shadows.xl,
    shadowOpacity: 0.55,
  },
  
  '2xl': {
    ...shadows['2xl'],
    shadowOpacity: 0.6,
  },
} as const;

export type ShadowSize = keyof typeof shadows;

/**
 * Utility function para aplicar sombras
 * Detecta automáticamente el tema y aplica la sombra apropiada
 * 
 * @example
 * ```typescript
 * const cardStyle = {
 *   ...getShadow('md', isDark),
 *   backgroundColor: theme.surface,
 * };
 * ```
 */
export function getShadow(
  size: ShadowSize = 'md',
  isDark: boolean = false
): ViewStyle {
  return isDark ? darkShadows[size] : shadows[size];
}

