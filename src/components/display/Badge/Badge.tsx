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
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showZero?: boolean;
  testID?: string;
}

const getBadgeColor = (color: BadgeColor, theme: any): string => {
  const colorMap: Record<BadgeColor, string> = {
    primary: theme.primary,
    secondary: theme.secondary,
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  };
  return colorMap[color];
};

export function Badge({
  count = 0,
  max = 99,
  dot = false,
  color = 'error',
  variant = 'rounded',
  children,
  style,
  textStyle,
  showZero = false,
  testID,
}: BadgeProps) {
  const { theme } = useTheme();
  const backgroundColor = getBadgeColor(color, theme);

  // No mostrar badge si count es 0 y showZero es false
  const shouldShow = dot || count > 0 || showZero;

  if (!shouldShow && !children) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  const getBorderRadius = () => {
    if (dot) return 4;
    switch (variant) {
      case 'rounded':
        return 10;
      case 'square':
        return 2;
      case 'dot':
        return 4;
    }
  };

  const badgeContent = (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderRadius: getBorderRadius(),
          minWidth: dot ? 8 : 18,
          height: dot ? 8 : 18,
          paddingHorizontal: dot ? 0 : 5,
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
          {displayCount}
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

