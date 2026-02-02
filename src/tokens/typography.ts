/**
 * Sistema tipográfico
 * Define tamaños, pesos y estilos de texto consistentes
 */

import { TextStyle } from 'react-native';

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display1: 32,
  display2: 40,
  display3: 48,
  display4: 64,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

export const letterSpacings = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

/**
 * Variantes de texto de ejemplo.
 * Las apps pueden extender/pisar vía theme.components.text.variants.
 */
export const textVariants = {
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
