/**
 * Chip Component
 * Etiqueta seleccionable compacta — filtros, selección simple o múltiple
 */

import React, { ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ScrollView,
  ViewStyle,
  PressableProps,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { borderRadius } from '../../../tokens/borderRadius';
import { textVariants } from '../../../tokens/typography';

type ChipSize = 'small' | 'medium';

export interface ChipProps extends Omit<PressableProps, 'style'> {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  size?: ChipSize;
  style?: ViewStyle;
  testID?: string;
}

const CHIP_PADDING: Record<ChipSize, { vertical: number; horizontal: number }> = {
  small: { vertical: spacing.xxs, horizontal: spacing.sm },
  medium: { vertical: spacing.xs, horizontal: spacing.md },
};

export function Chip({
  label,
  selected = false,
  icon,
  disabled = false,
  size = 'medium',
  style,
  testID,
  ...props
}: ChipProps) {
  const { theme } = useTheme();
  const padding = CHIP_PADDING[size];

  const backgroundColor = disabled
    ? theme.surfaceVariant
    : selected
      ? theme.primary
      : theme.surfaceVariant;
  const borderColor = disabled ? theme.border : selected ? theme.primary : theme.border;
  const textColor = disabled ? theme.textDisabled : selected ? '#fff' : theme.text;

  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      testID={testID}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor,
          borderColor,
          paddingVertical: padding.vertical,
          paddingHorizontal: padding.horizontal,
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.label,
          {
            color: textColor,
            fontSize: size === 'small' ? textVariants.caption.fontSize : textVariants.body.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export interface ChipGroupProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function ChipGroup({ children, scrollable = false, style }: ChipGroupProps) {
  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.group, style]}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.group, styles.groupWrap, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  icon: {
    marginRight: spacing.xxs,
  },
  label: {
    fontWeight: '600',
  },
  group: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  groupWrap: {
    flexWrap: 'wrap',
  },
});
