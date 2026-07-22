/**
 * Chip Component
 * Etiqueta seleccionable compacta — filtros, selección simple o múltiple
 */

import React, { ReactNode, forwardRef, memo } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ScrollView,
  ViewStyle,
  StyleProp,
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
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const CHIP_PADDING: Record<ChipSize, { vertical: number; horizontal: number }> = {
  small: { vertical: spacing.xxs, horizontal: spacing.sm },
  medium: { vertical: spacing.xs, horizontal: spacing.md },
};

const ChipBase = forwardRef<View, ChipProps>(function Chip(
  {
    label,
    selected = false,
    icon,
    disabled = false,
    size = 'medium',
    style,
    testID,
    accessibilityLabel,
    ...props
  },
  ref
) {
  const { theme } = useTheme();
  const padding = CHIP_PADDING[size];

  const backgroundColor = disabled
    ? theme.surfaceVariant
    : selected
      ? theme.primary
      : theme.surfaceVariant;
  const borderColor = disabled ? theme.border : selected ? theme.primary : theme.border;
  const textColor = disabled ? theme.textDisabled : selected ? theme.onPrimary : theme.text;

  return (
    <Pressable
      {...props}
      ref={ref}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
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
});

/** Etiqueta seleccionable compacta — filtros, selección simple o múltiple. */
export const Chip = memo(ChipBase);
Chip.displayName = 'Chip';

export interface ChipGroupProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}

function ChipGroupBase({ children, scrollable = false, style }: ChipGroupProps) {
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

export const ChipGroup = memo(ChipGroupBase);
ChipGroup.displayName = 'ChipGroup';

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
