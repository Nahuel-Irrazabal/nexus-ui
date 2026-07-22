/**
 * Alert Component Tests
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert, AlertButton } from '../Alert';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';

function renderAlert(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const VARIANT_ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  destructive: '❌',
} as const;

describe('Alert', () => {
  it('renderiza título y mensaje sin crashear', () => {
    const { getByText } = renderAlert(
      <Alert visible title="Confirmar acción" message="¿Estás seguro?" />
    );

    expect(getByText('Confirmar acción')).toBeTruthy();
    expect(getByText('¿Estás seguro?')).toBeTruthy();
  });

  it('no renderiza el texto de mensaje cuando no se pasa', () => {
    const { queryByText } = renderAlert(<Alert visible title="Solo título" />);

    expect(queryByText('¿Estás seguro?')).toBeNull();
  });

  it('renderiza el botón "OK" por defecto cuando no se pasan buttons', () => {
    const { getByText } = renderAlert(<Alert visible title="Aviso" />);

    expect(getByText('OK')).toBeTruthy();
  });

  it.each(Object.entries(VARIANT_ICONS) as [keyof typeof VARIANT_ICONS, string][])(
    'renderiza el ícono default correspondiente a la variante %s',
    (variant, expectedIcon) => {
      const { getByText } = renderAlert(
        <Alert visible title="Título" variant={variant} />
      );

      expect(getByText(expectedIcon)).toBeTruthy();
    }
  );

  it('renderiza el ícono custom en vez del emoji por defecto cuando se pasa `icon`', () => {
    const { getByTestId, queryByText } = renderAlert(
      <Alert
        visible
        title="Título"
        variant="destructive"
        icon={<Text testID="custom-icon">🔥</Text>}
      />
    );

    // Con icon custom, no debe quedar el emoji default de la variante
    expect(queryByText(VARIANT_ICONS.destructive)).toBeNull();
    expect(getByTestId('custom-icon')).toBeTruthy();
  });

  it('cada botón de acción expone accessibilityRole="button" y accessibilityLabel con su texto', () => {
    const buttons: AlertButton[] = [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive' },
    ];
    const { getByLabelText } = renderAlert(
      <Alert visible title="Eliminar item" buttons={buttons} />
    );

    const cancelButton = getByLabelText('Cancelar');
    const destructiveButton = getByLabelText('Eliminar');

    expect(cancelButton.props.accessibilityRole).toBe('button');
    expect(destructiveButton.props.accessibilityRole).toBe('button');
  });

  it('al presionar un botón dispara su onPress y luego onClose', () => {
    const onPress = jest.fn();
    const onClose = jest.fn();
    const { getByLabelText } = renderAlert(
      <Alert
        visible
        title="Confirmar"
        onClose={onClose}
        buttons={[{ text: 'Confirmar', onPress }]}
      />
    );

    fireEvent.press(getByLabelText('Confirmar'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('marca el contenedor del diálogo con accessibilityViewIsModal', () => {
    const { getByText } = renderAlert(<Alert visible title="Título" />);

    const container = getByText('Título').parent;
    expect(container?.props.accessibilityViewIsModal).toBe(true);
  });

  it('resuelve todos los colores de theme.* sin dejar ninguno undefined', () => {
    const { getByText, getByLabelText } = renderAlert(
      <Alert
        visible
        title="Título"
        message="Mensaje"
        variant="destructive"
        buttons={[
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive' },
        ]}
      />
    );

    const titleNode = getByText('Título');
    const container = titleNode.parent;
    const backdrop = container?.parent;

    const findBackgroundColor = (node: any) =>
      Array.isArray(node?.props.style)
        ? node?.props.style.find((s: any) => s && 'backgroundColor' in s)?.backgroundColor
        : node?.props.style?.backgroundColor;

    const backdropBg = findBackgroundColor(backdrop);
    const containerBg = findBackgroundColor(container);

    expect(backdropBg).toBe(defaultLightTheme.overlay);
    expect(backdropBg).not.toBeUndefined();

    expect(containerBg).toBe(defaultLightTheme.surface);
    expect(containerBg).not.toBeUndefined();

    const titleColor = Array.isArray(titleNode.props.style)
      ? titleNode.props.style.find((s: any) => s && 'color' in s)?.color
      : undefined;
    expect(titleColor).toBe(defaultLightTheme.text);
    expect(titleColor).not.toBeUndefined();

    const messageNode = getByText('Mensaje');
    const messageColor = Array.isArray(messageNode.props.style)
      ? messageNode.props.style.find((s: any) => s && 'color' in s)?.color
      : undefined;
    expect(messageColor).toBe(defaultLightTheme.textSecondary);
    expect(messageColor).not.toBeUndefined();

    const cancelText = getByText('Cancelar');
    const cancelColor = Array.isArray(cancelText.props.style)
      ? cancelText.props.style.find((s: any) => s && 'color' in s)?.color
      : undefined;
    expect(cancelColor).toBe(defaultLightTheme.textSecondary);
    expect(cancelColor).not.toBeUndefined();

    const destructiveText = getByText('Eliminar');
    const destructiveColor = Array.isArray(destructiveText.props.style)
      ? destructiveText.props.style.find((s: any) => s && 'color' in s)?.color
      : undefined;
    expect(destructiveColor).toBe(defaultLightTheme.error);
    expect(destructiveColor).not.toBeUndefined();

    const cancelButton = getByLabelText('Cancelar');
    const buttonBorderColor = Array.isArray(cancelButton.props.style)
      ? cancelButton.props.style.find((s: any) => s && 'borderColor' in s)?.borderColor
      : undefined;
    expect(buttonBorderColor).toBe(defaultLightTheme.border);
    expect(buttonBorderColor).not.toBeUndefined();
  });
});
