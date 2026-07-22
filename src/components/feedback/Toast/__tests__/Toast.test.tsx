/**
 * Toast Component Tests
 */

import React, { useEffect } from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ToastProvider } from '../Toast';
import type { ToastType } from '../Toast';
import { useToast } from '../../../../hooks/useToast';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';
import { fontSizes } from '../../../../tokens/typography';
import { palette } from '../../../../tokens/colors';

/** Dispara showToast al montar, con duration=0 para no depender de timers reales. */
function ToastTrigger({ message, type }: { message: string; type?: ToastType }) {
  const { showToast } = useToast();
  useEffect(() => {
    showToast(message, type, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function renderToast(
  message: string,
  type?: ToastType,
  themeConfig?: Parameters<typeof ThemeProvider>[0]['themeConfig']
) {
  return render(
    <ThemeProvider themeConfig={themeConfig}>
      <ToastProvider>
        <ToastTrigger message={message} type={type} />
      </ToastProvider>
    </ThemeProvider>
  );
}

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return style.reduce(
      (acc: Record<string, unknown>, s) => ({ ...acc, ...flattenStyle(s) }),
      {}
    );
  }
  return (style as Record<string, unknown>) ?? {};
}

describe('Toast', () => {
  it('renderiza el mensaje sin crashear', () => {
    const { getByText } = renderToast('Guardado con éxito');
    expect(getByText('Guardado con éxito')).toBeTruthy();
  });

  it('tiene displayName seteado (memo)', () => {
    expect(ToastProvider.displayName).toBe('ToastProvider');
  });

  describe('variantes — backgroundColor nunca undefined', () => {
    it.each([
      ['success', defaultLightTheme.success],
      ['error', defaultLightTheme.error],
      ['warning', defaultLightTheme.warning],
      ['info', defaultLightTheme.info],
    ] as const)('type="%s" resuelve backgroundColor de theme.%s', (type, expected) => {
      const { getByText } = renderToast('Mensaje', type);
      const alertStyle = flattenStyle(getByText('Mensaje').parent!.props.style);
      expect(alertStyle.backgroundColor).toBeDefined();
      expect(alertStyle.backgroundColor).toBe(expected);
    });

    it('sin type explícito, cae en "info"', () => {
      const { getByText } = renderToast('Mensaje sin tipo');
      const alertStyle = flattenStyle(getByText('Mensaje sin tipo').parent!.props.style);
      expect(alertStyle.backgroundColor).toBe(defaultLightTheme.info);
    });
  });

  describe('colores de texto — nunca undefined, nunca hex hardcodeado suelto', () => {
    it('el mensaje y el botón de cierre resuelven un color definido', () => {
      const { getByText } = renderToast('Texto visible', 'error');
      const messageStyle = flattenStyle(getByText('Texto visible').props.style);
      expect(messageStyle.color).toBeDefined();
      expect(typeof messageStyle.color).toBe('string');

      const closeStyle = flattenStyle(getByText('✕').props.style);
      expect(closeStyle.color).toBeDefined();
      expect(typeof closeStyle.color).toBe('string');
    });

    it('usa el stopgap tokenizado (palette.neutral[0]), no queda en el objeto de estilo estático', () => {
      const { getByText } = renderToast('Texto visible', 'success');
      const messageStyle = flattenStyle(getByText('Texto visible').props.style);
      expect(messageStyle.color).toBe(palette.neutral[0]);
    });
  });

  describe('tipografía tokenizada', () => {
    it('el mensaje usa fontSizes.md y el botón de cierre fontSizes.xl', () => {
      const { getByText } = renderToast('Tamaño de fuente');
      const messageStyle = flattenStyle(getByText('Tamaño de fuente').props.style);
      expect(messageStyle.fontSize).toBe(fontSizes.md);

      const closeStyle = flattenStyle(getByText('✕').props.style);
      expect(closeStyle.fontSize).toBe(fontSizes.xl);
    });
  });

  describe('accesibilidad', () => {
    it('expone accessibilityRole="alert" y accessibilityLiveRegion="polite" en el contenedor del toast', () => {
      const { getByText } = renderToast('Mensaje accesible');
      const node = getByText('Mensaje accesible').parent!;
      expect(node.props.accessibilityRole).toBe('alert');
      expect(node.props.accessibilityLiveRegion).toBe('polite');
    });

    it('el accessibilityLabel del toast refleja el mensaje', () => {
      const { getByText } = renderToast('Operación completada');
      const node = getByText('Operación completada').parent!;
      expect(node.props.accessibilityLabel).toBe('Operación completada');
    });

    it('el botón de cierre expone accessibilityRole="button" y un label', () => {
      const { getByLabelText } = renderToast('Con botón de cierre');
      const closeButton = getByLabelText('Cerrar notificación');
      expect(closeButton.props.accessibilityRole).toBe('button');
      expect(closeButton.props.accessibilityLabel).toBeTruthy();
    });

    it('el botón de cierre usa "Cerrar notificación" por defecto si el provider no pasa override', () => {
      const { getByLabelText } = renderToast('Sin override de label');
      expect(getByLabelText('Cerrar notificación')).toBeTruthy();
    });

    it('permite overridear el accessibilityLabel del botón de cierre via closeAccessibilityLabel', () => {
      const { getByLabelText, queryByLabelText } = render(
        <ThemeProvider>
          <ToastProvider closeAccessibilityLabel="Dismiss alert">
            <ToastTrigger message="Con label custom" />
          </ToastProvider>
        </ThemeProvider>
      );

      expect(getByLabelText('Dismiss alert')).toBeTruthy();
      expect(queryByLabelText('Cerrar notificación')).toBeNull();
    });
  });

  describe('interacción', () => {
    it('oculta el toast al presionar el botón de cierre', () => {
      const { getByLabelText, queryByText } = renderToast('Se puede cerrar');
      expect(queryByText('Se puede cerrar')).toBeTruthy();

      act(() => {
        fireEvent.press(getByLabelText('Cerrar notificación'));
      });

      expect(queryByText('Se puede cerrar')).toBeNull();
    });
  });
});
