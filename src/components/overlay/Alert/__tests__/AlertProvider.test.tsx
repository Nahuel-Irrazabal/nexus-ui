/**
 * AlertProvider + useAlert Tests
 */

import React from 'react';
import { Text, Modal } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AlertProvider } from '../AlertProvider';
import { useAlert } from '../../../../hooks/useAlert';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

// Duplicado intencional del mapping privado de Alert.tsx (no exportado) para poder
// ubicar el ícono por defecto renderizado según variante.
const VARIANT_ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  destructive: '❌',
} as const;

type AlertVariant = keyof typeof VARIANT_ICONS;

const flattenStyle = (style: any): Record<string, any> => {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style ?? {};
};

interface TriggerProps {
  variant?: AlertVariant;
  message?: string;
  title?: string;
  icon?: React.ReactNode;
}

function Trigger({ variant, message, title = 'Titulo', icon }: TriggerProps) {
  const { confirm, dismiss } = useAlert();
  return (
    <>
      <Text
        testID="open"
        onPress={() =>
          confirm({
            title,
            message,
            variant,
            icon,
            buttons: [
              { text: 'Aceptar', style: 'default' },
              { text: 'Cancelar', style: 'cancel' },
            ],
          })
        }
      >
        Abrir
      </Text>
      <Text testID="close" onPress={dismiss}>
        Cerrar
      </Text>
    </>
  );
}

function ConsumerWithoutProvider() {
  useAlert();
  return null;
}

const renderWithProvider = (
  ui: React.ReactElement,
  options?: { themeConfig?: object; icons?: Partial<Record<AlertVariant, React.ReactNode>> }
) =>
  render(
    <ThemeProvider themeConfig={options?.themeConfig}>
      <AlertProvider icons={options?.icons}>{ui}</AlertProvider>
    </ThemeProvider>
  );

describe('AlertProvider', () => {
  it('renderiza sin crashear y mantiene el Alert oculto hasta invocar confirm()', () => {
    const { getByTestId, UNSAFE_getByType } = renderWithProvider(<Trigger />);

    expect(getByTestId('open')).toBeTruthy();
    expect(UNSAFE_getByType(Modal).props.visible).toBe(false);
  });

  it('tiene displayName seteado para debugging', () => {
    expect(AlertProvider.displayName).toBe('AlertProvider');
  });

  it('confirm() abre el Alert con el título y mensaje configurados', () => {
    const { getByTestId, getByText, UNSAFE_getByType } = renderWithProvider(
      <Trigger title="Eliminar cuenta" message="Esta acción no se puede deshacer" />
    );

    fireEvent.press(getByTestId('open'));

    expect(UNSAFE_getByType(Modal).props.visible).toBe(true);
    expect(getByText('Eliminar cuenta')).toBeTruthy();
    expect(getByText('Esta acción no se puede deshacer')).toBeTruthy();
  });

  it('dismiss() del hook cierra el Alert', () => {
    const { getByTestId, UNSAFE_getByType } = renderWithProvider(<Trigger />);

    fireEvent.press(getByTestId('open'));
    expect(UNSAFE_getByType(Modal).props.visible).toBe(true);

    fireEvent.press(getByTestId('close'));
    expect(UNSAFE_getByType(Modal).props.visible).toBe(false);
  });

  it('presionar un botón del Alert lo cierra (onClose vía handleButtonPress)', () => {
    const { getByTestId, UNSAFE_getByProps, UNSAFE_getByType } = renderWithProvider(<Trigger />);

    fireEvent.press(getByTestId('open'));
    expect(UNSAFE_getByType(Modal).props.visible).toBe(true);

    fireEvent.press(UNSAFE_getByProps({ accessibilityLabel: 'Aceptar' }));
    expect(UNSAFE_getByType(Modal).props.visible).toBe(false);
  });

  it('llamar a confirm() de nuevo reemplaza la configuración anterior', () => {
    const { getByTestId, getByText, queryByText } = renderWithProvider(<Trigger />);

    fireEvent.press(getByTestId('open'));
    expect(getByText('Titulo')).toBeTruthy();

    fireEvent.press(getByTestId('open'));
    expect(getByText('Titulo')).toBeTruthy();
    expect(queryByText('undefined')).toBeNull();
  });

  it('expone accessibilityRole="button" y accessibilityLabel en los botones', () => {
    const { getByTestId, UNSAFE_getByProps } = renderWithProvider(<Trigger />);
    fireEvent.press(getByTestId('open'));

    const accept = UNSAFE_getByProps({ accessibilityLabel: 'Aceptar' });
    const cancel = UNSAFE_getByProps({ accessibilityLabel: 'Cancelar' });

    expect(accept.props.accessibilityRole).toBe('button');
    expect(accept.props.accessibilityLabel).toBe('Aceptar');
    expect(cancel.props.accessibilityRole).toBe('button');
    expect(cancel.props.accessibilityLabel).toBe('Cancelar');
  });

  it.each(Object.keys(VARIANT_ICONS) as AlertVariant[])(
    'resuelve el color de fondo del ícono para la variante "%s" sin quedar undefined',
    (variant) => {
      const { getByTestId, getByText } = renderWithProvider(<Trigger variant={variant} />);
      fireEvent.press(getByTestId('open'));

      const iconText = getByText(VARIANT_ICONS[variant]);
      const iconContainerStyle = flattenStyle(iconText.parent?.props.style);

      expect(iconContainerStyle.backgroundColor).toBeDefined();
      expect(iconContainerStyle.backgroundColor).toEqual(expect.any(String));
      expect(iconContainerStyle.backgroundColor).not.toContain('undefined');
    }
  );

  it('el color del título y del mensaje se resuelve desde el theme (nunca undefined)', () => {
    const { getByTestId, getByText } = renderWithProvider(
      <Trigger title="Titulo" message="Mensaje" variant="destructive" />
    );
    fireEvent.press(getByTestId('open'));

    const titleStyle = flattenStyle(getByText('Titulo').props.style);
    const messageStyle = flattenStyle(getByText('Mensaje').props.style);

    expect(titleStyle.color).toBeDefined();
    expect(titleStyle.color).not.toBe('undefined');
    expect(messageStyle.color).toBeDefined();
    expect(messageStyle.color).not.toBe('undefined');
  });

  it('usa el ícono custom de icons[variant] cuando la config no trae icon propio', () => {
    const CustomIcon = () => <Text testID="custom-icon">custom</Text>;
    const { getByTestId } = renderWithProvider(<Trigger variant="warning" />, {
      icons: { warning: <CustomIcon /> },
    });

    fireEvent.press(getByTestId('open'));

    expect(getByTestId('custom-icon')).toBeTruthy();
  });

  it('el icon de la config individual (AlertConfig.icon) tiene prioridad sobre icons[variant]', () => {
    const ProviderIcon = () => <Text testID="provider-icon">provider</Text>;
    const ConfigIcon = () => <Text testID="config-icon">config</Text>;
    const { getByTestId, queryByTestId } = renderWithProvider(
      <Trigger variant="warning" icon={<ConfigIcon />} />,
      { icons: { warning: <ProviderIcon /> } }
    );

    fireEvent.press(getByTestId('open'));

    expect(getByTestId('config-icon')).toBeTruthy();
    expect(queryByTestId('provider-icon')).toBeNull();
  });

  it('useAlert lanza un error si se usa fuera de AlertProvider', () => {
    expect(() => render(<ConsumerWithoutProvider />)).toThrow(
      'useAlert debe usarse dentro de AlertProvider'
    );
  });
});
