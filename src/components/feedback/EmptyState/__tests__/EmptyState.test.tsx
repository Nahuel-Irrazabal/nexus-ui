/**
 * EmptyState Component Tests
 */

import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';
import { fontSizes } from '../../../../tokens/typography';

function renderWithTheme(
  ui: React.ReactElement,
  themeConfig?: Parameters<typeof ThemeProvider>[0]['themeConfig']
) {
  return render(<ThemeProvider themeConfig={themeConfig}>{ui}</ThemeProvider>);
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

describe('EmptyState', () => {
  it('renderiza título sin crashear', () => {
    const { getByText } = renderWithTheme(<EmptyState title="Sin resultados" />);
    expect(getByText('Sin resultados')).toBeTruthy();
  });

  it('tiene displayName seteado (memo)', () => {
    expect(EmptyState.displayName).toBe('EmptyState');
  });

  describe('variantes de contenido', () => {
    it('renderiza la descripción cuando se provee', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="Sin resultados" description="Probá con otra búsqueda" />
      );
      expect(getByText('Sin resultados')).toBeTruthy();
      expect(getByText('Probá con otra búsqueda')).toBeTruthy();
    });

    it('no renderiza la descripción cuando no se provee', () => {
      const { queryByText } = renderWithTheme(<EmptyState title="Sin resultados" />);
      expect(queryByText('Probá con otra búsqueda')).toBeNull();
    });

    it('renderiza el icon cuando no hay illustration', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="Sin resultados" icon={<View testID="icon" />} testID="empty" />
      );
      expect(getByTestId('icon')).toBeTruthy();
    });

    it('prioriza illustration sobre icon si ambos se proveen', () => {
      const { getByTestId, queryByTestId } = renderWithTheme(
        <EmptyState
          title="Sin resultados"
          illustration={<View testID="illustration" />}
          icon={<View testID="icon" />}
        />
      );
      expect(getByTestId('illustration')).toBeTruthy();
      expect(queryByTestId('icon')).toBeNull();
    });

    it('renderiza la acción cuando se provee', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="Sin resultados" action={<View testID="action" />} />
      );
      expect(getByTestId('action')).toBeTruthy();
    });
  });

  describe('theming — colores nunca undefined', () => {
    it('usa theme.text para el título y theme.textSecondary para la descripción', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="Sin resultados" description="Descripción" />
      );

      const titleStyle = flattenStyle(getByText('Sin resultados').props.style);
      expect(titleStyle.color).toBeDefined();
      expect(titleStyle.color).toBe(defaultLightTheme.text);

      const descriptionStyle = flattenStyle(getByText('Descripción').props.style);
      expect(descriptionStyle.color).toBeDefined();
      expect(descriptionStyle.color).toBe(defaultLightTheme.textSecondary);
    });

    it('resuelve colores distintos con un themeConfig custom', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="Sin resultados" />,
        { light: { text: '#123456' } }
      );
      const titleStyle = flattenStyle(getByText('Sin resultados').props.style);
      expect(titleStyle.color).toBeDefined();
      expect(titleStyle.color).toBe('#123456');
    });
  });

  describe('tipografía tokenizada', () => {
    it('el título usa fontSizes.xxl y la descripción fontSizes.md', () => {
      const { getByText } = renderWithTheme(
        <EmptyState title="Sin resultados" description="Descripción" />
      );

      const titleStyle = flattenStyle(getByText('Sin resultados').props.style);
      expect(titleStyle.fontSize).toBeDefined();
      expect(titleStyle.fontSize).toBe(fontSizes.xxl);

      const descriptionStyle = flattenStyle(getByText('Descripción').props.style);
      expect(descriptionStyle.fontSize).toBeDefined();
      expect(descriptionStyle.fontSize).toBe(fontSizes.md);
    });
  });

  describe('accesibilidad', () => {
    it('expone accessibilityRole="text" y accessible=true en el contenedor', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="Sin resultados" testID="empty-state" />
      );
      const node = getByTestId('empty-state');
      expect(node.props.accessible).toBe(true);
      expect(node.props.accessibilityRole).toBe('text');
    });

    it('infiere accessibilityLabel del title por defecto', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState title="No hay datos" testID="empty-state" />
      );
      expect(getByTestId('empty-state').props.accessibilityLabel).toBe('No hay datos');
    });

    it('permite pisar el accessibilityLabel inferido', () => {
      const { getByTestId } = renderWithTheme(
        <EmptyState
          title="No hay datos"
          accessibilityLabel="Lista de productos vacía"
          testID="empty-state"
        />
      );
      expect(getByTestId('empty-state').props.accessibilityLabel).toBe(
        'Lista de productos vacía'
      );
    });
  });
});
