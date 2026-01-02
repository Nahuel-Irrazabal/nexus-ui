/**
 * ErrorState Component
 * Muestra un estado de error con mensaje y opción de reintentar
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
import { Button } from '../../buttons';

export interface ErrorStateProps {
  error?: Error | string;
  title?: string;
  description?: string;
  illustration?: React.ReactNode;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  testID?: string;
}

export function ErrorState({
  error,
  title = 'Algo salió mal',
  description,
  illustration,
  icon,
  onRetry,
  retryLabel = 'Reintentar',
  style,
  titleStyle,
  descriptionStyle,
  testID,
}: ErrorStateProps) {
  const { theme } = useTheme();

  // Extraer mensaje del error si es un objeto Error
  const errorMessage = error instanceof Error ? error.message : error;
  const displayDescription = description || errorMessage || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';

  // Icono de error por defecto si no se proporciona illustration ni icon
  const defaultIcon = (
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 32 }}>⚠️</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Illustration o Icon */}
      {illustration && (
        <View style={styles.illustrationContainer}>
          {illustration}
        </View>
      )}
      
      {!illustration && (icon || defaultIcon) && (
        <View style={styles.iconContainer}>
          {icon || defaultIcon}
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
      <Text
        style={[
          styles.description,
          {
            color: theme.textSecondary,
          },
          descriptionStyle,
        ]}
      >
        {displayDescription}
      </Text>

      {/* Botón de reintentar */}
      {onRetry && (
        <View style={styles.actionContainer}>
          <Button
            title={retryLabel}
            onPress={onRetry}
            variant="primary"
          />
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
    maxWidth: 320,
  },
  actionContainer: {
    marginTop: spacing.md,
    minWidth: 140,
  },
});

