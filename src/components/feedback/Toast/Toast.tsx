/**
 * Sistema de Toast/Notificaciones para feedback visual
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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

export function ToastProvider({ children, icons = {} }: ToastProviderProps) {
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
}

// Componente interno para renderizar toasts
interface ToastContainerProps {
  toasts: Toast[];
  onHide: (id: string) => void;
}

function ToastContainer({ toasts, onHide }: ToastContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { top: insets.top + 8 }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </View>
  );
}

interface ToastItemProps {
  toast: Toast;
  onHide: (id: string) => void;
}

function ToastItem({ toast, onHide }: ToastItemProps) {
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

  const handleClose = () => {
    // Animación de salida
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onHide(toast.id);
    });
  };

  const getToastColors = () => {
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
  };

  const { backgroundColor, emoji } = getToastColors();
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
    >
      {icon ?? <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={styles.message}>{toast.message}</Text>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

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
    fontSize: 20,
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

