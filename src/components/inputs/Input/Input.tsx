/**
 * Input Component
 * Input personalizable con label, validación y estados.
 * Estilos por defecto vienen del theme (theme.components.input); cada app puede definirlos en defineTheme/createTheme.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { defaultInputTheme, type InputTheme } from '../../../theme/inputTheme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  editable = true,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const inputTheme: InputTheme = useMemo(
    () => ({ ...defaultInputTheme, ...theme.components?.input }),
    [theme.components?.input]
  );

  const getBorderColor = () => {
    if (error) return theme.error;
    if (isFocused) return theme.primary;
    return theme.border;
  };

  const containerDynamicStyle: ViewStyle = {
    borderColor: getBorderColor(),
    backgroundColor:
      inputTheme.backgroundColor !== undefined
        ? inputTheme.backgroundColor
        : editable
          ? theme.surface
          : theme.surfaceVariant,
    borderRadius: inputTheme.borderRadius ?? defaultInputTheme.borderRadius,
    borderWidth: inputTheme.borderWidth ?? defaultInputTheme.borderWidth,
    paddingHorizontal: inputTheme.paddingHorizontal ?? defaultInputTheme.paddingHorizontal,
    ...(inputTheme.borderBottomWidth !== undefined && {
      borderBottomWidth: inputTheme.borderBottomWidth,
    }),
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.text,
              fontSize: inputTheme.labelFontSize ?? defaultInputTheme.labelFontSize,
              fontWeight: inputTheme.labelFontWeight ?? defaultInputTheme.labelFontWeight,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View style={[styles.inputContainer, containerDynamicStyle, inputStyle]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          {...props}
          editable={editable}
          style={[
            styles.input,
            {
              color: theme.text,
              fontSize: inputTheme.inputFontSize ?? defaultInputTheme.inputFontSize,
              paddingVertical: inputTheme.paddingVertical ?? defaultInputTheme.paddingVertical,
            },
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
          ]}
          placeholderTextColor={theme.textDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.error : theme.textSecondary,
              fontSize: inputTheme.helperFontSize ?? defaultInputTheme.helperFontSize,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  inputWithLeftIcon: {
    marginLeft: spacing.sm,
  },
  inputWithRightIcon: {
    marginRight: spacing.sm,
  },
  iconLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

