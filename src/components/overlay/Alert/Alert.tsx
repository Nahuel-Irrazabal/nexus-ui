/**
 * Alert Component
 * Diálogo de alerta simple para confirmaciones
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';

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
  buttons?: AlertButton[];
  style?: ViewStyle;
  testID?: string;
}

const VARIANT_ICONS: Record<AlertVariant, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  destructive: '❌',
};

const VARIANT_COLORS: Record<AlertVariant, string> = {
  info: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  destructive: '#ef4444',
};

export function Alert({
  visible,
  onClose,
  title,
  message,
  variant = 'info',
  buttons = [{ text: 'OK', style: 'default' }],
  style,
  testID,
}: AlertProps) {
  const { theme } = useTheme();

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
        return '#ef4444';
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
      <View style={styles.backdrop}>
        <View
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
              { backgroundColor: `${VARIANT_COLORS[variant]}20` },
            ]}
          >
            <Text style={styles.icon}>{VARIANT_ICONS[variant]}</Text>
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
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
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonMargin: {
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 16,
  },
});

