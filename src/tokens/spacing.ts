/**
 * Sistema de espaciado consistente
 * Basado en escala de 4px (base unit)
 * 
 * Uso:
 * - spacing.sm para espacios pequeños
 * - spacing.md para espacios medianos
 * - spacing.lg para espacios grandes
 */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  giant: 64,
} as const;

export type SpacingKey = keyof typeof spacing;

/**
 * Utilidad para obtener valores de spacing
 * Acepta tanto keys como números directos
 */
export const getSpacing = (key: SpacingKey | number): number => {
  if (typeof key === 'number') return key;
  return spacing[key];
};
