/**
 * Text Component
 * Componente de texto con variantes de tipografía del tema
 */

import React, { forwardRef, memo } from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { textVariants, fontWeights } from '../../../tokens/typography';

type TypographyVariant = keyof typeof textVariants;

export interface TextProps extends RNTextProps {
  /** Variantes de nexus-ui (display, h1, h2, h3, subtitle, title, body, button, caption, overline) o custom definidas en theme.components.text.variants */
  variant?: TypographyVariant | (string & {});
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  bold?: boolean;
  italic?: boolean;
}

export const Text = memo(
  forwardRef<RNText, TextProps>(function Text(
    {
      variant = 'body',
      color,
      align = 'left',
      bold = false,
      italic = false,
      style,
      children,
      ...props
    }: TextProps,
    ref
  ) {
    const { theme } = useTheme();

    const baseVariant = textVariants[variant as TypographyVariant] ?? textVariants.body;
    const themeOverrides = theme.components?.text?.variants?.[variant];
    const variantStyle = themeOverrides
      ? { ...baseVariant, ...themeOverrides }
      : baseVariant;
    const textColor = color || theme.text;

    return (
      <RNText
        ref={ref}
        {...props}
        style={[
          styles.base,
          {
            ...variantStyle,
            color: textColor,
            textAlign: align,
            fontStyle: italic ? 'italic' : 'normal',
            ...(bold && { fontWeight: fontWeights.bold }),
          },
          style,
        ]}
      >
        {children}
      </RNText>
    );
  })
);

Text.displayName = 'Text';

const styles = StyleSheet.create({
  base: {
    // Estilos base que siempre se aplican
  },
});

