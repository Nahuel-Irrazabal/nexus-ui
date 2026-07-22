/**
 * Badge Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../Badge';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';
import { palette } from '../../../../tokens/colors';

function renderWithTheme(ui: React.ReactElement, themeConfig?: Parameters<typeof ThemeProvider>[0]['themeConfig']) {
  return render(<ThemeProvider themeConfig={themeConfig}>{ui}</ThemeProvider>);
}

function flattenStyle(style: unknown): Record<string, unknown> {
  const list = Array.isArray(style) ? style : [style];
  return Object.assign({}, ...list.filter(Boolean));
}

describe('Badge', () => {
  it('renderiza el count sin crashear', () => {
    const { getByText, getByTestId } = renderWithTheme(<Badge count={5} testID="badge" />);
    expect(getByText('5')).toBeTruthy();
    expect(getByTestId('badge')).toBeTruthy();
  });

  it('no renderiza nada si count es 0 y showZero es false', () => {
    const { queryByTestId } = renderWithTheme(<Badge count={0} testID="badge" />);
    expect(queryByTestId('badge')).toBeNull();
  });

  it('renderiza "0" cuando showZero es true', () => {
    const { getByText } = renderWithTheme(<Badge count={0} showZero testID="badge" />);
    expect(getByText('0')).toBeTruthy();
  });

  it('trunca el count a "max+" cuando lo excede', () => {
    const { getByText } = renderWithTheme(<Badge count={150} max={99} testID="badge" />);
    expect(getByText('99+')).toBeTruthy();
  });

  it('prioriza label sobre count cuando se pasa label', () => {
    const { getByText, queryByText } = renderWithTheme(<Badge count={5} label="Nuevo" testID="badge" />);
    expect(getByText('Nuevo')).toBeTruthy();
    expect(queryByText('5')).toBeNull();
  });

  it('renderiza como wrapper cuando recibe children', () => {
    const { getByText, getByTestId } = renderWithTheme(
      <Badge count={2} testID="badge">
        <Badge count={0} testID="child-marker" showZero />
      </Badge>
    );
    expect(getByText('2')).toBeTruthy();
    expect(getByTestId('child-marker')).toBeTruthy();
  });

  describe('variantes', () => {
    it.each(['rounded', 'square', 'dot'] as const)('renderiza la variante "%s" sin crashear', (variant) => {
      const { getByTestId } = renderWithTheme(
        <Badge count={3} variant={variant} testID={`badge-${variant}`} />
      );
      expect(getByTestId(`badge-${variant}`)).toBeTruthy();
    });

    it('el dot no muestra texto', () => {
      const { queryByText, getByTestId } = renderWithTheme(<Badge dot count={5} testID="badge-dot" />);
      expect(getByTestId('badge-dot')).toBeTruthy();
      expect(queryByText('5')).toBeNull();
    });
  });

  describe('theming — colores nunca undefined', () => {
    it.each(['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const)(
      'resuelve backgroundColor, borderColor y color de texto para color="%s"',
      (color) => {
        const { getByTestId, getByText } = renderWithTheme(
          <Badge count={4} color={color} testID={`badge-${color}`} />
        );

        const badgeNode = getByTestId(`badge-${color}`);
        const badgeStyle = flattenStyle(badgeNode.props.style);
        expect(badgeStyle.backgroundColor).toBeDefined();
        expect(badgeStyle.backgroundColor).toBe(defaultLightTheme[color]);
        expect(badgeStyle.borderColor).toBeDefined();
        expect(badgeStyle.borderColor).toBe(defaultLightTheme.onPrimary);

        const textNode = getByText('4');
        const textStyle = flattenStyle(textNode.props.style);
        expect(textStyle.color).toBeDefined();
        expect(textStyle.color).toBe(defaultLightTheme.onPrimary);
      }
    );

    it('usa el primaryColor de themeConfig en vez de un valor hardcodeado', () => {
      const { getByTestId } = renderWithTheme(
        <Badge count={1} color="primary" testID="badge-custom" />,
        { primaryColor: 'green' }
      );
      const badgeStyle = flattenStyle(getByTestId('badge-custom').props.style);
      expect(badgeStyle.backgroundColor).toBe(palette.green[500]);
      expect(badgeStyle.backgroundColor).not.toBe(defaultLightTheme.primary);
    });
  });

  describe('accesibilidad', () => {
    it('expone accessibilityRole="text" y accessibilityLabel inferido del count', () => {
      const { getByTestId } = renderWithTheme(<Badge count={7} testID="badge-a11y" />);
      const node = getByTestId('badge-a11y');
      expect(node.props.accessible).toBe(true);
      expect(node.props.accessibilityRole).toBe('text');
      expect(node.props.accessibilityLabel).toBe('7');
    });

    it('permite pisar el accessibilityLabel inferido', () => {
      const { getByTestId } = renderWithTheme(
        <Badge count={7} accessibilityLabel="7 mensajes sin leer" testID="badge-a11y-custom" />
      );
      const node = getByTestId('badge-a11y-custom');
      expect(node.props.accessibilityLabel).toBe('7 mensajes sin leer');
    });

    it('un dot sin accessibilityLabel se marca como decorativo (no accesible)', () => {
      const { getByTestId } = renderWithTheme(<Badge dot testID="badge-dot-a11y" />);
      const node = getByTestId('badge-dot-a11y');
      expect(node.props.accessible).toBe(false);
      expect(node.props.accessibilityLabel).toBeUndefined();
      expect(node.props.accessibilityRole).toBeUndefined();
    });

    it('un dot con accessibilityLabel explícito se marca accesible con role="image"', () => {
      const { getByTestId } = renderWithTheme(
        <Badge dot accessibilityLabel="Notificación nueva" testID="badge-dot-labeled" />
      );
      const node = getByTestId('badge-dot-labeled');
      expect(node.props.accessible).toBe(true);
      expect(node.props.accessibilityRole).toBe('image');
      expect(node.props.accessibilityLabel).toBe('Notificación nueva');
    });
  });
});
