/**
 * ErrorState Component Tests
 */

import React from 'react';
import { Text, useColorScheme } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorState } from '../ErrorState';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme, defaultDarkTheme } from '../../../../theme/createTheme';
import { fontSizes } from '../../../../tokens/typography';
import { palette } from '../../../../tokens/colors';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

/** Aplana un array de StyleProp (incluye anidados) en un solo objeto plano. */
function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return style.reduce(
      (acc: Record<string, unknown>, s) => ({ ...acc, ...flattenStyle(s) }),
      {}
    );
  }
  return (style as Record<string, unknown>) ?? {};
}

describe('ErrorState', () => {
  afterEach(() => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
  });

  it('renderiza el título y descripción por defecto sin crashear', () => {
    const { getByText } = renderWithTheme(<ErrorState testID="error-state" />);

    expect(getByText('Algo salió mal')).toBeTruthy();
    expect(
      getByText('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
    ).toBeTruthy();
  });

  it('renderiza title/description custom cuando se pasan', () => {
    const { getByText } = renderWithTheme(
      <ErrorState title="No se pudo cargar" description="Revisá tu conexión" />
    );

    expect(getByText('No se pudo cargar')).toBeTruthy();
    expect(getByText('Revisá tu conexión')).toBeTruthy();
  });

  it('usa el mensaje de un Error como descripción cuando no hay description explícita', () => {
    const { getByText } = renderWithTheme(
      <ErrorState error={new Error('Fallo de red')} />
    );

    expect(getByText('Fallo de red')).toBeTruthy();
  });

  it('usa un string de error como descripción cuando no hay description explícita', () => {
    const { getByText } = renderWithTheme(<ErrorState error="Timeout" />);

    expect(getByText('Timeout')).toBeTruthy();
  });

  it('description explícita tiene prioridad sobre error', () => {
    const { getByText, queryByText } = renderWithTheme(
      <ErrorState error="Fallo de red" description="Mensaje custom" />
    );

    expect(getByText('Mensaje custom')).toBeTruthy();
    expect(queryByText('Fallo de red')).toBeNull();
  });

  describe('variantes de icono', () => {
    it('renderiza el icono de warning (⚠️) por defecto cuando no hay illustration ni icon', () => {
      const { getByText } = renderWithTheme(<ErrorState />);
      expect(getByText('⚠️')).toBeTruthy();
    });

    it('renderiza un icon custom en vez del default cuando se pasa', () => {
      const { queryByText } = renderWithTheme(<ErrorState icon={<Text>🔥</Text>} />);
      expect(queryByText('🔥')).toBeTruthy();
      expect(queryByText('⚠️')).toBeNull();
    });

    it('prioriza illustration sobre icon y sobre el default icon', () => {
      const { queryByText } = renderWithTheme(
        <ErrorState
          illustration={<Text>ILUSTRACION</Text>}
          icon={<Text>🔥</Text>}
        />
      );
      expect(queryByText('ILUSTRACION')).toBeTruthy();
      expect(queryByText('⚠️')).toBeNull();
      expect(queryByText('🔥')).toBeNull();
    });
  });

  describe('acción de reintentar', () => {
    it('no renderiza el botón de reintentar cuando no hay onRetry', () => {
      const { queryByText } = renderWithTheme(<ErrorState />);
      expect(queryByText('Reintentar')).toBeNull();
    });

    it('renderiza el botón con retryLabel y dispara onRetry al presionar', () => {
      const onRetry = jest.fn();
      const { getByText } = renderWithTheme(
        <ErrorState onRetry={onRetry} retryLabel="Volver a intentar" />
      );

      const button = getByText('Volver a intentar');
      fireEvent.press(button);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('accesibilidad', () => {
    it('expone accessibilityRole="alert" en el contenedor', () => {
      const { getByTestId } = renderWithTheme(<ErrorState testID="error-state" />);
      expect(getByTestId('error-state').props.accessibilityRole).toBe('alert');
    });

    it('usa el title como accessibilityLabel por defecto', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState title="No se pudo guardar" testID="error-state" />
      );
      expect(getByTestId('error-state').props.accessibilityLabel).toBe('No se pudo guardar');
    });

    it('permite pisar el accessibilityLabel inferido', () => {
      const { getByTestId } = renderWithTheme(
        <ErrorState accessibilityLabel="Error crítico de carga" testID="error-state" />
      );
      expect(getByTestId('error-state').props.accessibilityLabel).toBe('Error crítico de carga');
    });
  });

  it('expone displayName para debugging (memo)', () => {
    expect(ErrorState.displayName).toBe('ErrorState');
  });

  describe('theming — colores nunca undefined', () => {
    it('resuelve title, description e icono a colores definidos en modo claro', () => {
      const { getByText } = renderWithTheme(<ErrorState testID="error-state" />);

      const titleStyle = flattenStyle(getByText('Algo salió mal').props.style);
      const descriptionStyle = flattenStyle(
        getByText('Ocurrió un error inesperado. Por favor, intenta de nuevo.').props.style
      );

      expect(typeof titleStyle.color).toBe('string');
      expect(titleStyle.color).toBe(defaultLightTheme.text);

      expect(typeof descriptionStyle.color).toBe('string');
      expect(descriptionStyle.color).toBe(defaultLightTheme.textSecondary);
    });

    it('usa palette.red[50] (tinte claro) como fondo del icono en modo claro', () => {
      const { getByText } = renderWithTheme(<ErrorState />);
      const iconCircle = getByText('⚠️').parent;
      const circleStyle = flattenStyle(iconCircle?.props.style);

      expect(typeof circleStyle.backgroundColor).toBe('string');
      expect(circleStyle.backgroundColor).toBe(palette.red[50]);
    });

    it('usa palette.red[900] (tinte oscuro) como fondo del icono en modo oscuro, nunca undefined', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');

      const { getByText } = renderWithTheme(<ErrorState />);
      const iconCircle = getByText('⚠️').parent;
      const circleStyle = flattenStyle(iconCircle?.props.style);

      expect(typeof circleStyle.backgroundColor).toBe('string');
      expect(circleStyle.backgroundColor).toBe(palette.red[900]);
      expect(circleStyle.backgroundColor).not.toBe('#fef2f2');
    });

    it('resuelve title y description en modo oscuro con los colores de defaultDarkTheme', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');

      const { getByText } = renderWithTheme(<ErrorState testID="error-state" />);

      const titleStyle = flattenStyle(getByText('Algo salió mal').props.style);
      const descriptionStyle = flattenStyle(
        getByText('Ocurrió un error inesperado. Por favor, intenta de nuevo.').props.style
      );

      expect(typeof titleStyle.color).toBe('string');
      expect(titleStyle.color).toBe(defaultDarkTheme.text);

      expect(typeof descriptionStyle.color).toBe('string');
      expect(descriptionStyle.color).toBe(defaultDarkTheme.textSecondary);
    });
  });

  describe('tamaños — font size tokenizado', () => {
    it('title usa fontSizes.xxl y description usa fontSizes.md (no literales sueltos)', () => {
      const { getByText } = renderWithTheme(<ErrorState testID="error-state" />);

      const titleStyle = flattenStyle(getByText('Algo salió mal').props.style);
      const descriptionStyle = flattenStyle(
        getByText('Ocurrió un error inesperado. Por favor, intenta de nuevo.').props.style
      );

      expect(titleStyle.fontSize).toBe(fontSizes.xxl);
      expect(descriptionStyle.fontSize).toBe(fontSizes.md);
    });

    it('el emoji del icono default usa fontSizes.display1 (no el literal 32 hardcodeado)', () => {
      const { getByText } = renderWithTheme(<ErrorState />);
      const emojiStyle = flattenStyle(getByText('⚠️').props.style);
      expect(emojiStyle.fontSize).toBe(fontSizes.display1);
    });
  });
});
