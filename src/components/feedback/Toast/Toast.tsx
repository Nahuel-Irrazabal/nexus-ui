/**
 * Sistema de Toast/Notificaciones para feedback visual
 */

import React, { createContext, useContext, useState, useCallback, useMemo, memo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { borderRadius } from '../../../tokens/borderRadius';
import { getShadow } from '../../../tokens/shadows';
import { fontSizes } from '../../../tokens/typography';
import { palette } from '../../../tokens/colors';

// NOTA: el Theme actual no tiene un token semántico de "texto sobre fondo de color"
// (p.ej. onPrimary/contrastText) — ver unresolved en la entrega de este fix. Se usa
// palette.neutral[0] como stopgap tokenizado en vez del literal '#fff' hardcodeado,
// mismo patrón que Button.tsx (ON_PRIMARY_FALLBACK).
const ON_COLOR_FALLBACK = palette.neutral[0];

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

/** Contexto interno para que ToastItem resuelva los íconos configurados en el provider. */
const ToastIconsContext = createContext<Partial<Record<ToastType, ReactNode>>>({});

interface ToastProviderProps {
  children: ReactNode;
  /** Íconos a usar en vez del emoji por defecto (ej. de @expo/vector-icons), por tipo de toast. */
  icons?: Partial<Record<ToastType, ReactNode>>;
}

export const ToastProvider = memo(function ToastProvider({ children, icons = {} }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-hide después de la duración especificada
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <ToastIconsContext.Provider value={icons}>
        {children}
        <ToastContainer toasts={toasts} onHide={hideToast} />
      </ToastIconsContext.Provider>
    </ToastContext.Provider>
  );
});

ToastProvider.displayName = 'ToastProvider';

// Componente interno para renderizar toasts
interface ToastContainerProps {
  toasts: Toast[];
  onHide: (id: string) => void;
}

const ToastContainer = memo(function ToastContainer({ toasts, onHide }: ToastContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { top: insets.top + 8 }]}
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </View>
  );
});

ToastContainer.displayName = 'ToastContainer';

interface ToastItemProps {
  toast: Toast;
  onHide: (id: string) => void;
}

const ToastItem = memo(function ToastItem({ toast, onHide }: ToastItemProps) {
  const { theme, isDark } = useTheme();
  const icons = useContext(ToastIconsContext);
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    // Animación de entrada
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const handleClose = useCallback(() => {
    // Animación de salida
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onHide(toast.id);
    });
  }, [animation, onHide, toast.id]);

  const { backgroundColor, emoji } = useMemo(() => {
    switch (toast.type) {
      case 'success':
        return { backgroundColor: theme.success, emoji: '✅' };
      case 'error':
        return { backgroundColor: theme.error, emoji: '❌' };
      case 'warning':
        return { backgroundColor: theme.warning, emoji: '⚠️' };
      case 'info':
      default:
        return { backgroundColor: theme.info, emoji: 'ℹ️' };
    }
  }, [theme, toast.type]);

  const icon = icons[toast.type];

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor,
          transform: [{ translateY }],
          opacity: animation,
          ...getShadow('lg', isDark),
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={toast.message}
    >
      {icon ?? <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.message, { color: ON_COLOR_FALLBACK }]}>{toast.message}</Text>
      <TouchableOpacity
        onPress={handleClose}
        style={styles.closeButton}
        accessibilityRole="button"
        accessibilityLabel="Close notification"
      >
        <Text style={[styles.closeText, { color: ON_COLOR_FALLBACK }]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

ToastItem.displayName = 'ToastItem';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 32,
    marginBottom: 8,
    padding: 16,
    borderRadius: borderRadius.lg,
  },
  emoji: {
    fontSize: fontSizes.xxl,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
  },
});

