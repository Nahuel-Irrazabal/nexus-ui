/**
 * Badge Component
 * Indicador numérico o de estado que se puede usar solo o como wrapper
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { borderRadius as radiusTokens } from '../../../tokens/borderRadius';
import { fontSizes } from '../../../tokens/typography';

type BadgeVariant = 'rounded' | 'square' | 'dot';
type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  count?: number;
  max?: number;
  dot?: boolean;
  color?: BadgeColor;
  variant?: BadgeVariant;
  label?: string;
  /** Radio de las esquinas. Si no se pasa, se usa el valor según variant/dot. */
  borderRadius?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  showZero?: boolean;
  /** Etiqueta de accesibilidad. Si no se pasa, se infiere de label/count. */
  accessibilityLabel?: string;
  testID?: string;
}

function BadgeComponent({
  count = 0,
  max = 99,
  dot = false,
  color = 'error',
  variant = 'rounded',
  label,
  borderRadius: borderRadiusProp,
  children,
  style,
  textStyle,
  showZero = false,
  accessibilityLabel,
  testID,
}: BadgeProps) {
  const { theme } = useTheme();
  const backgroundColor = theme[color] ?? theme.primary;

  const hasLabel = label != null && label !== '';
  const shouldShow = hasLabel || dot || count > 0 || showZero;

  if (!shouldShow && !children) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();
  const displayText = hasLabel ? label : displayCount;

  const resolvedAccessibilityLabel = accessibilityLabel ?? (dot ? undefined : displayText);
  const isAccessible = dot ? Boolean(resolvedAccessibilityLabel) : shouldShow;

  const defaultRadius = dot
    ? radiusTokens.sm
    : { rounded: radiusTokens.full, square: radiusTokens.xs, dot: radiusTokens.sm }[variant];
  const borderRadius = borderRadiusProp ?? defaultRadius;

  const badgeContent = (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderColor: theme.onPrimary,
          borderRadius,
          minWidth: dot ? 8 : hasLabel ? undefined : 18,
          height: dot ? 8 : 18,
          paddingHorizontal: dot ? 0 : hasLabel ? 8 : 5,
        },
        !children && styles.standalone,
        style,
      ]}
      testID={testID}
      accessible={isAccessible}
      accessibilityRole={isAccessible ? (dot ? 'image' : 'text') : undefined}
      accessibilityLabel={resolvedAccessibilityLabel}
    >
      {!dot && shouldShow && (
        <Text
          style={[
            styles.text,
            {
              color: theme.onPrimary,
              fontSize: fontSizes.xs,
              fontWeight: '600',
            },
            textStyle,
          ]}
        >
          {displayText}
        </Text>
      )}
    </View>
  );

  if (children) {
    return (
      <View style={styles.wrapper}>
        {children}
        {shouldShow && (
          <View style={styles.badgePosition}>
            {badgeContent}
          </View>
        )}
      </View>
    );
  }

  return badgeContent;
}

export const Badge = memo(BadgeComponent);
Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  standalone: {
    alignSelf: 'flex-start',
  },
  badgePosition: {
    position: 'absolute',
    top: -4,
    right: -4,
    zIndex: 10,
  },
  text: {
    textAlign: 'center',
    lineHeight: 14,
  },
});
