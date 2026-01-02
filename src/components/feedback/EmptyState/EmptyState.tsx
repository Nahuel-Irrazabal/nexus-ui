/**
 * EmptyState Component
 * Muestra un estado vacío con icono, título, descripción y acción opcional
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
import { spacing } from '../../../tokens/spacing';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  testID?: string;
}

export function EmptyState({
  icon,
  illustration,
  title,
  description,
  action,
  style,
  titleStyle,
  descriptionStyle,
  testID,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
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
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    maxWidth: 300,
  },
  actionContainer: {
    marginTop: spacing.md,
  },
});

