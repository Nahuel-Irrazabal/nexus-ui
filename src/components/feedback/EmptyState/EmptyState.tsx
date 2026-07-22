/**
 * EmptyState Component
 * Muestra un estado vacío con icono, título, descripción y acción opcional
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { fontSizes } from '../../../tokens/typography';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  testID?: string;
  /** Label de accesibilidad del contenedor. Por defecto usa `title`. */
  accessibilityLabel?: string;
}

function EmptyStateBase({
  icon,
  illustration,
  title,
  description,
  action,
  style,
  titleStyle,
  descriptionStyle,
  testID,
  accessibilityLabel,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? title}
    >
      {/* Illustration o Icon */}
      {illustration && (
        <View style={styles.illustrationContainer}>
          {illustration}
        </View>
      )}
      
      {!illustration && icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}

      {/* Título */}
      <Text
        style={[
          styles.title,
          {
            color: theme.text,
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>

      {/* Descripción */}
      {description && (
        <Text
          style={[
            styles.description,
            {
              color: theme.textSecondary,
            },
            descriptionStyle,
          ]}
        >
          {description}
        </Text>
      )}

      {/* Acción */}
      {action && (
        <View style={styles.actionContainer}>
          {action}
        </View>
      )}
    </View>
  );
}

export const EmptyState = memo(EmptyStateBase);
EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  illustrationContainer: {
    marginBottom: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.md,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    maxWidth: 300,
  },
  actionContainer: {
    marginTop: spacing.md,
  },
});

