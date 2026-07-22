/**
 * AlertProvider
 * Puente imperativo sobre el componente Alert — mismo patrón que ToastProvider/useToast
 */

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Alert, AlertProps } from './Alert';

type AlertVariant = NonNullable<AlertProps['variant']>;

export type AlertConfig = Omit<AlertProps, 'visible' | 'onClose'>;

export interface AlertContextType {
  confirm: (config: AlertConfig) => void;
  dismiss: () => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
  /** Íconos a usar en vez del emoji por defecto (ej. de @expo/vector-icons), por variante. */
  icons?: Partial<Record<AlertVariant, ReactNode>>;
}

export function AlertProvider({ children, icons = {} }: AlertProviderProps) {
  const [current, setCurrent] = useState<AlertConfig | null>(null);

  const confirm = useCallback((config: AlertConfig) => {
    setCurrent(config);
  }, []);

  const dismiss = useCallback(() => {
    setCurrent(null);
  }, []);

  const variant = current?.variant ?? 'info';

  return (
    <AlertContext.Provider value={{ confirm, dismiss }}>
      {children}
      <Alert
        visible={current !== null}
        onClose={dismiss}
        title={current?.title ?? ''}
        message={current?.message}
        variant={current?.variant}
        buttons={current?.buttons}
        icon={current?.icon ?? icons[variant]}
        style={current?.style}
        testID={current?.testID}
      />
    </AlertContext.Provider>
  );
}

AlertProvider.displayName = 'AlertProvider';
