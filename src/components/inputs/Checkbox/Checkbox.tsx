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
  StyleProp,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { borderRadius as radiusTokens } from '../../../tokens/borderRadius';
import { fontSizes, fontWeights } from '../../../tokens/typography';
import { getContrastColor } from '../../../utils/color';

export interface CheckboxProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  /** Color del borde y relleno cuando está checked/indeterminado. Si no se pasa, se usa theme.primary. */
  color?: string;
  /** Radio de las esquinas del cuadro. Por defecto borderRadius.sm (4). */
  borderRadius?: number;
  /** Estilos del ícono de check (✓). Por ejemplo fontSize, color, fontWeight. */
  checkStyle?: StyleProp<TextStyle>;
  /** Estilos del contenedor del check (alineación, etc.). */
  checkContainerStyle?: StyleProp<ViewStyle>;
  /** Estilos de la línea en estado indeterminado. */
  indeterminateLineStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  /** Label para lectores de pantalla. Por defecto usa `label`; pasalo explícitamente si el checkbox no tiene `label` visible. */
  accessibilityLabel?: string;
  testID?: string;
}

const CHECKBOX_SIZES = {
  small: 18,
  medium: 22,
  large: 26,
};

export const Checkbox = React.memo(
  React.forwardRef<React.ElementRef<typeof TouchableOpacity>, CheckboxProps>(function Checkbox(
    {
      label,
      value,
      onChange,
      disabled = false,
      indeterminate = false,
      error,
      size = 'medium',
      color,
      borderRadius: borderRadiusProp,
      checkStyle,
      checkContainerStyle,
      indeterminateLineStyle,
      style,
      labelStyle,
      accessibilityLabel,
      testID,
    },
    ref
  ) {
    const { theme } = useTheme();
    const checkboxSize = CHECKBOX_SIZES[size];
    const checked = value || indeterminate;
    const checkedColor = color ?? theme.primary;

    const handlePress = () => {
      if (!disabled) onChange(!value);
    };

    const backgroundColor = disabled ? theme.border : checked ? checkedColor : 'transparent';
    const borderColor = error
      ? theme.error
      : disabled
        ? theme.border
        : (color ?? (checked ? theme.primary : theme.border));
    const borderRadius = borderRadiusProp ?? radiusTokens.sm;
    // Color del check sobre el fondo. theme.onPrimary está calibrado para dar
    // contraste sobre theme.primary, no sobre un `color` custom arbitrario:
    // si el consumidor pasa `color`, el fondo del checkbox es ese color (ver
    // checkedColor arriba), así que el check se recalcula por luminancia en
    // vez de asumir onPrimary a ciegas. Sin `color` custom, comportamiento
    // sin cambios (theme.onPrimary).
    const iconColor = disabled
      ? theme.textDisabled
      : color
        ? getContrastColor(color, theme.onPrimary)
        : theme.onPrimary;

    return (
      <View style={[styles.container, style]} testID={testID}>
        <TouchableOpacity
          ref={ref}
          style={styles.row}
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.7}
          accessible
          accessibilityRole="checkbox"
          accessibilityState={{ checked: value, disabled }}
          accessibilityLabel={accessibilityLabel ?? label}
        >
          <View
            style={[
              styles.checkbox,
              {
                width: checkboxSize,
                height: checkboxSize,
                borderRadius,
                backgroundColor,
                borderColor,
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
                    backgroundColor: iconColor,
                  },
                  indeterminateLineStyle,
                ]}
              />
            )}

            {!indeterminate && value && (
              <View style={[styles.checkmarkContainer, checkContainerStyle]}>
                <Text
                  style={[
                    styles.checkmark,
                    { fontSize: checkboxSize * 0.7, color: iconColor },
                    checkStyle,
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
                { color: disabled ? theme.textDisabled : theme.text },
                labelStyle,
              ]}
            >
              {label}
            </Text>
          )}
        </TouchableOpacity>

        {error && (
          <Text style={[styles.error, { color: theme.error }]}>
            {error}
          </Text>
        )}
      </View>
    );
  })
);

Checkbox.displayName = 'Checkbox';

// CheckboxGroup Component
interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  children: React.ReactElement<CheckboxItemProps>[];
  /** Props que se aplican a cada Checkbox del grupo (color, size, checkStyle, etc.). */
  checkboxProps?: Omit<Partial<CheckboxProps>, 'value' | 'onChange' | 'label'>;
  style?: StyleProp<ViewStyle>;
}

interface CheckboxItemProps {
  label: string;
  value: string;
  disabled?: boolean;
}

export const CheckboxGroup = React.memo(function CheckboxGroup({
  value,
  onChange,
  label,
  error,
  children,
  checkboxProps,
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
              {...checkboxProps}
              label={child.props.label}
              value={isChecked}
              onChange={(checked) => handleChange(child.props.value, checked)}
              disabled={child.props.disabled ?? checkboxProps?.disabled}
            />
          );
        })}
      </View>

      {error && (
        <Text style={[styles.error, { color: theme.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
});

CheckboxGroup.displayName = 'CheckboxGroup';

// CheckboxItem Component para uso con CheckboxGroup
export function CheckboxItem(_props: CheckboxItemProps) {
  // Este componente solo se usa para tipar las props del grupo
  // No renderiza nada por sí mismo
  return null;
}

CheckboxItem.displayName = 'CheckboxItem';

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
    borderRadius: radiusTokens.xs,
  },
  label: {
    fontSize: fontSizes.md,
    marginLeft: spacing.sm,
    flex: 1,
  },
  error: {
    fontSize: fontSizes.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.sm + CHECKBOX_SIZES.medium, // Alinear con label (tamaño medio por defecto)
  },
  groupContainer: {
    marginBottom: spacing.md,
  },
  groupLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm,
  },
});
