/**
 * Border Radius Tokens
 * Sistema de border radius consistente
 */

/**
 * Border radius values
 * De más sharp a más rounded
 */
export const borderRadius = {
  /** Sin redondeo */
  none: 0,
  
  /** Muy sutil (2px) */
  xs: 2,
  
  /** Sutil (4px) */
  sm: 4,
  
  /** Normal (8px) - default para la mayoría de componentes */
  md: 8,
  
  /** Redondeado (12px) - cards, modales */
  lg: 12,
  
  /** Muy redondeado (16px) */
  xl: 16,
  
  /** Extra redondeado (20px) */
  '2xl': 20,
  
  /** Completamente redondeado (24px) */
  '3xl': 24,
  
  /** Circular (999px) - avatares, pills */
  full: 999,
} as const;

export type BorderRadiusSize = keyof typeof borderRadius;

/**
 * Utility para obtener border radius
 * 
 * @example
 * ```typescript
 * const buttonStyle = {
 *   borderRadius: getBorderRadius('lg'),
 * };
 * ```
 */
export function getBorderRadius(size: BorderRadiusSize = 'md'): number {
  return borderRadius[size];
}

