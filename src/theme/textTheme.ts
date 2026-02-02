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
 * Overrides por variante. Solo hace falta definir las variantes que quieras pisar.
 * El Text usa textVariants[variant] y aplica encima estos overrides.
 */
export interface TextTheme {
  variants?: Partial<Record<TextVariant, Partial<TextStyle>>>;
}

/**
 * Tema de texto por defecto (sin overrides).
 */
export const defaultTextTheme: TextTheme = {
  variants: {},
};
