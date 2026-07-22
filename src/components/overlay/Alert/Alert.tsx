/**
 * Alert Component
 * Diálogo de alerta simple para confirmaciones
 */

import React, { ReactNode, memo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { borderRadius } from '../../../tokens/borderRadius';
import { fontSizes } from '../../../tokens/typography';
import { ThemeWithCustomColors } from '../../../theme/createTheme';

type AlertVariant = 'info' | 'success' | 'warning' | 'destructive';
type ButtonStyle = 'default' | 'cancel' | 'destructive';

export interface AlertButton {
  text: string;
  style?: ButtonStyle;
  onPress?: () => void;
}

export interface AlertProps {
  visible: boolean;
  onClose?: () => void;
  title: string;
  message?: string;
  variant?: AlertVariant;
  /** Ícono a mostrar en vez del emoji por defecto (ej. un ícono de @expo/vector-icons). */
  icon?: ReactNode;
  buttons?: AlertButton[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const VARIANT_ICONS: Record<AlertVariant, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  destructive: '❌',
};

function getVariantColor(variant: AlertVariant, theme: ThemeWithCustomColors): string {
  switch (variant) {
    case 'success':
      return theme.success;
    case 'warning':
      return theme.warning;
    case 'destructive':
      return theme.error;
    case 'info':
    default:
      return theme.info;
  }
}

function AlertComponent({
  visible,
  onClose,
  title,
  message,
  variant = 'info',
  icon,
  buttons = [{ text: 'OK', style: 'default' }],
  style,
  testID,
}: AlertProps) {
  const { theme } = useTheme();
  const variantColor = getVariantColor(variant, theme);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const getButtonColor = (buttonStyle?: ButtonStyle) => {
    switch (buttonStyle) {
      case 'destructive':
        return theme.error;
      case 'cancel':
        return theme.textSecondary;
      default:
        return theme.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <View
          accessibilityViewIsModal
          style={[
            styles.container,
            { backgroundColor: theme.surface },
            style,
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${variantColor}20` },
            ]}
          >
            {icon ?? <Text style={styles.icon}>{VARIANT_ICONS[variant]}</Text>}
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: theme.textSecondary }]}>
              {message}
            </Text>
          )}

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleButtonPress(button)}
                accessibilityRole="button"
                accessibilityLabel={button.text}
                style={[
                  styles.button,
                  {
                    borderColor: theme.border,
                  },
                  index < buttons.length - 1 && styles.buttonMargin,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: getButtonColor(button.style),
                      fontWeight: button.style === 'cancel' ? '400' : '600',
                    },
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const Alert = memo(AlertComponent);
Alert.displayName = 'Alert';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: fontSizes.xxxl,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSizes.md,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  buttonsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonMargin: {
    marginBottom: 0,
  },
  buttonText: {
    fontSize: fontSizes.lg,
  },
});
