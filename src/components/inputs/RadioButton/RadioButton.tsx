/**
 * RadioButton Component
 * Radio button para selección única con soporte para grupos
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';

export interface RadioButtonProps {
  label?: string;
  value: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

const RADIO_SIZES = {
  small: 18,
  medium: 22,
  large: 26,
};

export function RadioButton({
  label,
  value,
  selected = false,
  onSelect,
  disabled = false,
  size = 'medium',
  style,
  labelStyle,
  testID,
}: RadioButtonProps) {
  const { theme } = useTheme();
  const radioSize = RADIO_SIZES[size];
  const innerSize = radioSize * 0.5;
  
  const handlePress = () => {
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };

  const getBorderColor = () => {
    if (disabled) {
      return '#d1d5db';
    }
    if (selected) {
      return theme.primary;
    }
    return '#9ca3af';
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
    >
      <View
        style={[
          styles.radio,
          {
            width: radioSize,
            height: radioSize,
            borderRadius: radioSize / 2,
            borderColor: getBorderColor(),
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.innerCircle,
              {
                width: innerSize,
                height: innerSize,
                borderRadius: innerSize / 2,
                backgroundColor: disabled ? '#9ca3af' : theme.primary,
              },
            ]}
          />
        )}
      </View>

      {label && (
        <Text
          style={[
            styles.label,
            {
              color: disabled ? '#9ca3af' : theme.text,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// RadioGroup Component
interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  direction?: 'vertical' | 'horizontal';
  children: React.ReactElement<RadioItemProps>[];
  style?: ViewStyle;
}

interface RadioItemProps {
  label: string;
  value: string;
  disabled?: boolean;
}

export function RadioGroup({
  value,
  onChange,
  label,
  error,
  direction = 'vertical',
  children,
  style,
}: RadioGroupProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.groupContainer, style]}>
      {label && (
        <Text style={[styles.groupLabel, { color: theme.text }]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.optionsContainer,
          direction === 'horizontal' && styles.horizontal,
        ]}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<RadioItemProps>(child)) return null;
          
          const isSelected = value === child.props.value;
          
          return (
            <RadioButton
              key={child.props.value}
              label={child.props.label}
              value={child.props.value}
              selected={isSelected}
              onSelect={onChange}
              disabled={child.props.disabled}
              style={
                direction === 'horizontal'
                  ? { marginRight: spacing.md }
                  : undefined
              }
            />
          );
        })}
      </View>

      {error && (
        <Text style={[styles.error, { color: '#ef4444' }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

// RadioItem Component para uso con RadioGroup
export function RadioItem(_props: RadioItemProps) {
  // Este componente solo se usa para tipar las props del grupo
  // No renderiza nada por sí mismo
  return null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  radio: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {},
  label: {
    fontSize: 15,
    marginLeft: spacing.sm,
    flex: 1,
  },
  groupContainer: {
    marginBottom: spacing.md,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  error: {
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.sm + 22, // Align with label
  },
});

