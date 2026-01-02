/**
 * Divider Component
 * Línea separadora horizontal o vertical con soporte para etiquetas
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
import { spacing as spacingTokens } from '../../../tokens/spacing';

type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  spacing?: keyof typeof spacingTokens;
  thickness?: number;
  color?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

export function Divider({
  orientation = 'horizontal',
  label,
  spacing,
  thickness = 1,
  color,
  style,
  labelStyle,
  testID,
}: DividerProps) {
  const { theme } = useTheme();
  const dividerColor = color || theme.border;
  const marginValue = spacing ? spacingTokens[spacing] : 0;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.verticalContainer,
          {
            width: thickness,
            backgroundColor: dividerColor,
            marginHorizontal: marginValue,
          },
          style,
        ]}
        testID={testID}
      />
    );
  }

  // Horizontal orientation
  if (label) {
    return (
      <View
        style={[
          styles.horizontalWithLabel,
          {
            marginVertical: marginValue,
          },
          style,
        ]}
        testID={testID}
      >
        <View
          style={[
            styles.line,
            {
              height: thickness,
              backgroundColor: dividerColor,
            },
          ]}
        />
        <Text
          style={[
            styles.label,
            {
              color: theme.textSecondary,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
        <View
          style={[
            styles.line,
            {
              height: thickness,
              backgroundColor: dividerColor,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          height: thickness,
          backgroundColor: dividerColor,
          marginVertical: marginValue,
        },
        style,
      ]}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  verticalContainer: {
    alignSelf: 'stretch',
  },
  horizontalWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
  },
  label: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});

