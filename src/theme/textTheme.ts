/**
 * Tema de estilos para el componente Text (tipografía).
 * Permite que cada app pise variantes (title, body, h1, etc.) vía theme.components.text,
 * igual que con components.input para Input.
 *
 * @module theme/textTheme
 */

import type { TextStyle } from 'react-native';
import type { TextVariant } from '../tokens/typography';

/**
 * Overrides por variante. Podés pisar title/body/caption o definir custom (ej. heading).
 * El Text usa textVariants[variant] si existe, si no body, y aplica encima estos overrides.
 */
export interface TextTheme {
  variants?: Partial<Record<TextVariant, Partial<TextStyle>>> & Record<string, Partial<TextStyle> | undefined>;
}

/**
 * Tema de texto por defecto (sin overrides).
 */
export const defaultTextTheme: TextTheme = {
  variants: {},
};
