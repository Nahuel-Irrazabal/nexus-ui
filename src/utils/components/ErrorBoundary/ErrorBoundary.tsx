/**
 * ErrorBoundary Component
 * Componente para capturar errores de React
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Aquí puedes enviar el error a un servicio de logging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Ejemplo: enviar a Sentry, Bugsnag, etc.
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: theme.background,
    },
    emoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    errorBox: {
      backgroundColor: theme.error + '20',
      padding: 16,
      borderRadius: 8,
      marginBottom: 24,
      width: '100%',
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      fontFamily: 'monospace',
    },
    button: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😕</Text>
      <Text style={styles.title}>¡Algo salió mal!</Text>
      <Text style={styles.message}>
        La aplicación encontró un error inesperado.
      </Text>
      {__DEV__ && error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );
}

