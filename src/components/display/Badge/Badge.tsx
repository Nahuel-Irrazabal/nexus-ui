/**
 * Badge Component
 * Indicador numérico o de estado que se puede usar solo o como wrapper
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

type BadgeVariant = 'rounded' | 'square' | 'dot';
type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  count?: number;
  max?: number;
  dot?: boolean;
  color?: BadgeColor;
  variant?: BadgeVariant;
  label?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showZero?: boolean;
  testID?: string;
}

export function Badge({
  count = 0,
  max = 99,
  dot = false,
  color = 'error',
  variant = 'rounded',
  label,
  children,
  style,
  textStyle,
  showZero = false,
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

  const borderRadius = dot ? 4 : { rounded: 10, square: 2, dot: 4 }[variant];

  const badgeContent = (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderRadius,
          minWidth: dot ? 8 : hasLabel ? undefined : 18,
          height: dot ? 8 : 18,
          paddingHorizontal: dot ? 0 : hasLabel ? 8 : 5,
        },
        !children && styles.standalone,
        style,
      ]}
      testID={testID}
    >
      {!dot && shouldShow && (
        <Text
          style={[
            styles.text,
            {
              color: '#ffffff',
              fontSize: 10,
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

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
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

