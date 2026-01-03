/**
 * Sistema de tamaños
 * Define tamaños consistentes para iconos, avatars, y elementos UI
 */

/**
 * Tamaños de iconos
 */
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
} as const;

/**
 * Tamaños de avatares
 */
export const avatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  xxl: 80,
  xxxl: 120,
} as const;

/**
 * Tamaños de botones (altura)
 */
export const buttonSizes = {
  sm: 32,
  md: 44,
  lg: 52,
  xl: 60,
} as const;

/**
 * Tamaños de inputs (altura)
 */
export const inputSizes = {
  sm: 36,
  md: 48,
  lg: 56,
} as const;

/**
 * Tamaños de touch targets (mínimo recomendado 44px)
 */
export const touchTargets = {
  min: 44,
  comfortable: 48,
  large: 56,
} as const;

export type IconSize = keyof typeof iconSizes;
export type AvatarSize = keyof typeof avatarSizes;
export type ButtonSize = keyof typeof buttonSizes;
export type InputSize = keyof typeof inputSizes;

