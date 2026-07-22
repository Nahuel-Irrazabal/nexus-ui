/**
 * Button Component
 * Botón personalizable con variantes, tamaños, estados e iconos
 */

import React, { forwardRef, memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { borderRadius } from '../../../tokens/borderRadius';
import { fontSizes } from '../../../tokens/typography';
import { palette } from '../../../tokens/colors';

// NOTA: el Theme actual no tiene un token semántico de "texto sobre fondo primario"
// (p.ej. onPrimary/contrastText). Se usa palette.neutral[0] como stopgap tokenizado
// en vez del literal '#fff' hardcodeado. Ver unresolved en la entrega de este fix.
const ON_PRIMARY_FALLBACK = palette.neutral[0];

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';
type IconPosition = 'left' | 'right';

export interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  iconOnly?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** Label de accesibilidad. Por defecto usa `title`. */
  accessibilityLabel?: string;
}

function ButtonBase(
  {
    title,
    variant = 'primary',
    size = 'medium',
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    iconOnly = false,
    disabled,
    style,
    textStyle,
    accessibilityLabel,
    ...props
  }: ButtonProps,
  ref: React.Ref<React.ElementRef<typeof TouchableOpacity>>
) {
  const { theme } = useTheme();

  // Validación: si es iconOnly, debe tener un icon
  if (iconOnly && !icon) {
    console.warn('Button: iconOnly requires an icon prop');
  }

  const getBackgroundColor = () => {
    if (disabled) return theme.border;

    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      case 'danger':
        return theme.error;
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textDisabled;

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return ON_PRIMARY_FALLBACK;
      case 'outline':
      case 'ghost':
        return theme.primary;
      default:
        return ON_PRIMARY_FALLBACK;
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 2,
        borderColor: disabled ? theme.border : theme.primary,
      };
    }
    return {};
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'medium':
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return fontSizes.md;
      case 'medium':
        return fontSizes.lg;
      case 'large':
        return fontSizes.xl;
      default:
        return fontSizes.lg;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getTextColor()} />;
    }

    // Botón solo con icono
    if (iconOnly && icon) {
      return <View style={styles.iconContainer}>{icon}</View>;
    }

    // Botón con icono y texto
    if (icon && title) {
      return (
        <View style={styles.contentContainer}>
          {iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      );
    }

    // Botón solo con texto
    return (
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: getFontSize(),
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      {...props}
      ref={ref}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? title}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          ...getPadding(),
          ...getBorderStyle(),
        },
        iconOnly && styles.iconOnlyButton,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

export const Button = memo(forwardRef(ButtonBase));
Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  iconOnlyButton: {
    aspectRatio: 1,
    minWidth: 48,
    minHeight: 48,
    alignSelf: 'flex-start',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
