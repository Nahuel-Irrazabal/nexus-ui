/**
 * Breakpoints Tokens
 * Sistema de breakpoints para responsive design
 */

import { Dimensions } from 'react-native';

/**
 * Breakpoints basados en tamaños comunes de dispositivos
 */
export const breakpoints = {
  /** Móviles pequeños (< 375px) */
  xs: 375,
  
  /** Móviles estándar (< 480px) */
  sm: 480,
  
  /** Tablets pequeñas / móviles grandes (< 768px) */
  md: 768,
  
  /** Tablets (< 1024px) */
  lg: 1024,
  
  /** Desktop pequeño (< 1280px) */
  xl: 1280,
  
  /** Desktop grande (>= 1280px) */
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Utility para detectar el breakpoint actual
 * 
 * @example
 * ```typescript
 * const currentBreakpoint = getCurrentBreakpoint();
 * // 'sm', 'md', 'lg', etc.
 * ```
 */
export function getCurrentBreakpoint(): Breakpoint {
  const { width } = Dimensions.get('window');
  
  if (width < breakpoints.xs) return 'xs';
  if (width < breakpoints.sm) return 'sm';
  if (width < breakpoints.md) return 'md';
  if (width < breakpoints.lg) return 'lg';
  if (width < breakpoints.xl) return 'xl';
  return '2xl';
}

/**
 * Utility para verificar si el ancho es mayor o igual a un breakpoint
 * 
 * @example
 * ```typescript
 * const isTablet = isBreakpointUp('md');
 * // true si width >= 768
 * ```
 */
export function isBreakpointUp(breakpoint: Breakpoint): boolean {
  const { width } = Dimensions.get('window');
  return width >= breakpoints[breakpoint];
}

/**
 * Utility para verificar si el ancho es menor a un breakpoint
 * 
 * @example
 * ```typescript
 * const isMobile = isBreakpointDown('md');
 * // true si width < 768
 * ```
 */
export function isBreakpointDown(breakpoint: Breakpoint): boolean {
  const { width } = Dimensions.get('window');
  return width < breakpoints[breakpoint];
}

/**
 * Utility para verificar si el ancho está entre dos breakpoints
 * 
 * @example
 * ```typescript
 * const isTablet = isBreakpointBetween('md', 'lg');
 * // true si 768 <= width < 1024
 * ```
 */
export function isBreakpointBetween(
  min: Breakpoint,
  max: Breakpoint
): boolean {
  const { width } = Dimensions.get('window');
  return width >= breakpoints[min] && width < breakpoints[max];
}

