/**
 * Checkbox Component
 * Checkbox estilizado con soporte para grupos, estados e indeterminado
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

export interface CheckboxProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

const CHECKBOX_SIZES = {
  small: 18,
  medium: 22,
  large: 26,
};

export function Checkbox({
  label,
  value,
  onChange,
  disabled = false,
  indeterminate = false,
  error,
  size = 'medium',
  style,
  labelStyle,
  testID,
}: CheckboxProps) {
  const { theme } = useTheme();
  const checkboxSize = CHECKBOX_SIZES[size];
  
  const handlePress = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  const getBackgroundColor = () => {
    if (disabled) {
      return '#e5e7eb';
    }
    if (value || indeterminate) {
      return theme.primary;
    }
    return 'transparent';
  };

  const getBorderColor = () => {
    if (error) {
      return '#ef4444';
    }
    if (disabled) {
      return '#d1d5db';
    }
    if (value || indeterminate) {
      return theme.primary;
    }
    return '#9ca3af';
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      <TouchableOpacity
        style={styles.row}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            {
              width: checkboxSize,
              height: checkboxSize,
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          {indeterminate && (
            <View
              style={[
                styles.indeterminateLine,
                {
                  width: checkboxSize * 0.5,
                  height: 2,
                  backgroundColor: disabled ? '#9ca3af' : '#ffffff',
                },
              ]}
            />
          )}
          
          {!indeterminate && value && (
            <View style={styles.checkmarkContainer}>
              <Text
                style={[
                  styles.checkmark,
                  {
                    fontSize: checkboxSize * 0.7,
                    color: disabled ? '#9ca3af' : '#ffffff',
                  },
                ]}
              >
                ✓
              </Text>
            </View>
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

      {error && (
        <Text style={[styles.error, { color: '#ef4444' }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

// CheckboxGroup Component
interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  children: React.ReactElement<CheckboxItemProps>[];
  style?: ViewStyle;
}

interface CheckboxItemProps {
  label: string;
  value: string;
  disabled?: boolean;
}

export function CheckboxGroup({
  value,
  onChange,
  label,
  error,
  children,
  style,
}: CheckboxGroupProps) {
  const { theme } = useTheme();

  const handleChange = (itemValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, itemValue]);
    } else {
      onChange(value.filter(v => v !== itemValue));
    }
  };

  return (
    <View style={[styles.groupContainer, style]}>
      {label && (
        <Text style={[styles.groupLabel, { color: theme.text }]}>
          {label}
        </Text>
      )}
      
      <View>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<CheckboxItemProps>(child)) return null;
          
          const isChecked = value.includes(child.props.value);
          
          return (
            <Checkbox
              key={child.props.value}
              label={child.props.label}
              value={isChecked}
              onChange={(checked) => handleChange(child.props.value, checked)}
              disabled={child.props.disabled}
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

// CheckboxItem Component para uso con CheckboxGroup
export function CheckboxItem(_props: CheckboxItemProps) {
  // Este componente solo se usa para tipar las props del grupo
  // No renderiza nada por sí mismo
  return null;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontWeight: '700',
    lineHeight: undefined,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  indeterminateLine: {
    borderRadius: 1,
  },
  label: {
    fontSize: 15,
    marginLeft: spacing.sm,
    flex: 1,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.sm + 22, // Align with label
  },
  groupContainer: {
    marginBottom: spacing.md,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
});

