/**
 * Divider Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Divider } from '../Divider';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';
import { fontSizes, fontWeights } from '../../../../tokens/typography';
import { spacing as spacingTokens } from '../../../../tokens/spacing';

function renderDivider(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

function flattenStyle(style: unknown): Record<string, unknown> {
  const list = Array.isArray(style) ? style : [style];
  return Object.assign({}, ...list.filter(Boolean));
}

describe('Divider', () => {
  it('renderiza la variante horizontal por defecto sin crashear', () => {
    const { getByTestId } = renderDivider(<Divider testID="divider" />);

    const node = getByTestId('divider');
    expect(node).toBeTruthy();
    expect(node.props.role).toBe('separator');
  });

  it('horizontal usa theme.border como backgroundColor y respeta thickness', () => {
    const { getByTestId } = renderDivider(<Divider testID="divider-h" thickness={2} />);

    const style = flattenStyle(getByTestId('divider-h').props.style);
    expect(style.backgroundColor).toBe(defaultLightTheme.border);
    expect(style.backgroundColor).not.toBeUndefined();
    expect(style.height).toBe(2);
  });

  it('variante vertical aplica width=thickness, marginHorizontal y color de theme.border', () => {
    const { getByTestId } = renderDivider(
      <Divider orientation="vertical" thickness={3} spacing="md" testID="divider-v" />
    );

    const node = getByTestId('divider-v');
    const style = flattenStyle(node.props.style);

    expect(node.props.role).toBe('separator');
    expect(style.width).toBe(3);
    expect(style.marginHorizontal).toBe(spacingTokens.md);
    expect(style.backgroundColor).toBe(defaultLightTheme.border);
    expect(style.backgroundColor).not.toBeUndefined();
  });

  it('con label renderiza el texto, expone accessibilityLabel y colorea con theme.textSecondary', () => {
    const { getByTestId, getByText } = renderDivider(
      <Divider label="O continuar con" testID="divider-label" />
    );

    const container = getByTestId('divider-label');
    expect(container.props.role).toBe('separator');
    expect(container.props.accessibilityLabel).toBe('O continuar con');

    const labelNode = getByText('O continuar con');
    const labelStyle = flattenStyle(labelNode.props.style);

    expect(labelStyle.color).toBe(defaultLightTheme.textSecondary);
    expect(labelStyle.color).not.toBeUndefined();
    expect(labelStyle.fontSize).toBe(fontSizes.md);
    expect(labelStyle.fontWeight).toBe(fontWeights.medium);
  });

  it('permite override de color explícito sin caer en theme ni en undefined', () => {
    const { getByTestId } = renderDivider(<Divider testID="divider-color" color="#123456" />);

    const style = flattenStyle(getByTestId('divider-color').props.style);
    expect(style.backgroundColor).toBe('#123456');
    expect(style.backgroundColor).not.toBe(defaultLightTheme.border);
  });

  it('aplica el token de spacing como margen vertical en la variante horizontal', () => {
    const { getByTestId } = renderDivider(<Divider testID="divider-spacing" spacing="lg" />);

    const style = flattenStyle(getByTestId('divider-spacing').props.style);
    expect(style.marginVertical).toBe(spacingTokens.lg);
  });

  it('está memoizado y expone displayName para debugging', () => {
    expect(Divider.displayName).toBe('Divider');
    // React.memo devuelve un objeto especial, no una función común como un componente sin memoizar
    expect(typeof Divider).toBe('object');
  });
});
