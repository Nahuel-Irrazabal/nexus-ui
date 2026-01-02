/**
 * Text Component
 * Componente de texto con variantes de tipografía del tema
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { textVariants } from '../../../tokens/typography';

type TypographyVariant = keyof typeof textVariants;

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  bold?: boolean;
  italic?: boolean;
}

export function Text({
  variant = 'body',
  color,
  align = 'left',
  bold = false,
  italic = false,
  style,
  children,
  ...props
}: TextProps) {
  const { theme } = useTheme();

  const variantStyle = textVariants[variant] || textVariants.body;
  const textColor = color || theme.text;

  return (
    <RNText
      {...props}
      style={[
        styles.base,
        {
          fontSize: variantStyle.fontSize,
          lineHeight: variantStyle.lineHeight,
          color: textColor,
          textAlign: align,
          fontWeight: bold ? '700' : variantStyle.fontWeight,
          fontStyle: italic ? 'italic' : 'normal',
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    // Estilos base que siempre se aplican
  },
});

