/**
 * Sistema de opacidades
 * Define niveles de opacidad consistentes
 */

export const opacity = {
  /** Completamente transparente */
  transparent: 0,
  
  /** Muy sutil - hover states, overlays ligeros */
  subtle: 0.05,
  
  /** Ligero - disabled states ligeros */
  light: 0.1,
  
  /** Medio-bajo - pressed states */
  muted: 0.2,
  
  /** Medio - overlays, backdrops ligeros */
  medium: 0.4,
  
  /** Medio-alto - overlays medios */
  high: 0.6,
  
  /** Alto - backdrops, modales */
  heavy: 0.75,
  
  /** Muy alto - overlays oscuros */
  intense: 0.9,
  
  /** Completamente opaco */
  opaque: 1,
} as const;

/**
 * Opacidades para estados de UI
 */
export const stateOpacity = {
  /** Estado hover */
  hover: 0.08,
  
  /** Estado focus */
  focus: 0.12,
  
  /** Estado pressed/active */
  pressed: 0.16,
  
  /** Estado disabled */
  disabled: 0.38,
  
  /** Estado selected */
  selected: 0.12,
} as const;

/**
 * Helper para aplicar opacidad a un color hex
 * @example withOpacity('#FF0000', 0.5) => 'rgba(255, 0, 0, 0.5)'
 */
export function withOpacity(hexColor: string, opacityValue: number): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
}

export type Opacity = keyof typeof opacity;
export type StateOpacity = keyof typeof stateOpacity;

