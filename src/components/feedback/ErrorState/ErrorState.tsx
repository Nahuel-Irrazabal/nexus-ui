/**
 * ErrorState Component
 * Muestra un estado de error con mensaje y opción de reintentar
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
import { borderRadius } from '../../../tokens/borderRadius';
import { fontSizes } from '../../../tokens/typography';
import { palette } from '../../../tokens/colors';
import { Button } from '../../buttons';

export interface ErrorStateProps {
  error?: Error | string;
  title?: string;
  description?: string;
  illustration?: React.ReactNode;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  testID?: string;
  /** Label de accesibilidad del contenedor. Por defecto usa `title`. */
  accessibilityLabel?: string;
}

function ErrorStateBase({
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
  accessibilityLabel,
}: ErrorStateProps) {
  const { theme, isDark } = useTheme();

  // Extraer mensaje del error si es un objeto Error
  const errorMessage = error instanceof Error ? error.message : error;
  const displayDescription = description || errorMessage || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';

  // NOTA: el Theme actual no tiene un token semántico "errorContainer" (fondo suave
  // dark-mode aware para superficies de error). Se usa un tinte de palette.red según
  // isDark como stopgap tokenizado en vez del literal '#fef2f2' hardcodeado.
  // Ver unresolved en la entrega de este fix.
  const errorContainerColor = isDark ? palette.red[900] : palette.red[50];

  // Icono de error por defecto si no se proporciona illustration ni icon
  const defaultIcon = (
    <View
      style={[
        styles.iconCircle,
        { backgroundColor: errorContainerColor },
      ]}
    >
      <Text style={styles.iconEmoji}>⚠️</Text>
    </View>
  );

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel ?? title}
    >
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

export const ErrorState = memo(ErrorStateBase);
ErrorState.displayName = 'ErrorState';

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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: fontSizes.display1,
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
    maxWidth: 320,
  },
  actionContainer: {
    marginTop: spacing.md,
    minWidth: 140,
  },
});
