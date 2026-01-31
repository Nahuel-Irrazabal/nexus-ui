/**
 * Tema de estilos para el componente Input
 * Permite que cada app defina el look de los inputs (box, underline, etc.) vía theme
 *
 * @module theme/inputTheme
 */

import { spacing } from '../tokens/spacing';
import { borderRadius } from '../tokens/borderRadius';

/**
 * Estilos del input que pueden sobrescribirse por app en el theme.
 * Todos opcionales; el Input usa estos valores o fallbacks internos.
 */
export interface InputTheme {
  /** Radio de borde del contenedor (default: borderRadius.md) */
  borderRadius?: number;
  /** Grosor del borde (default: 1). Para underline usar 0 y definir borderBottomWidth */
  borderWidth?: number;
  /** Grosor del borde inferior solo (ej. 1 para estilo underline) */
  borderBottomWidth?: number;
  /** Fondo del contenedor (default: theme.surface). Usar 'transparent' para underline */
  backgroundColor?: string;
  /** Padding horizontal del contenedor (default: spacing.md) */
  paddingHorizontal?: number;
  /** Padding vertical del texto interno (default: spacing.md) */
  paddingVertical?: number;
  /** Tamaño de fuente del label (default: 14) */
  labelFontSize?: number;
  /** Peso del label (default: '500') */
  labelFontWeight?: '400' | '500' | '600' | '700';
  /** Tamaño de fuente del helper/error (default: 12) */
  helperFontSize?: number;
  /** Tamaño de fuente del TextInput (default: 16) */
  inputFontSize?: number;
}

/**
 * Valores por defecto del input (estilo "box" con borde completo)
 */
export const defaultInputTheme: InputTheme = {
  borderRadius: borderRadius.md,
  borderWidth: 1,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  labelFontSize: 14,
  labelFontWeight: '500',
  helperFontSize: 12,
  inputFontSize: 16,
};

/**
 * Preset "underline": solo borde inferior, fondo transparente
 */
export const underlineInputTheme: InputTheme = {
  ...defaultInputTheme,
  borderRadius: 0,
  borderWidth: 0,
  borderBottomWidth: 1,
  backgroundColor: 'transparent',
};
