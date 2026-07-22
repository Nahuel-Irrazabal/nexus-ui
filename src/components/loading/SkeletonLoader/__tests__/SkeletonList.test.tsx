/**
 * SkeletonList Component Tests
 */

import React from 'react';
import { Animated, useColorScheme } from 'react-native';
import { render } from '@testing-library/react-native';
import { SkeletonList } from '../SkeletonList';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { spacing } from '../../../../tokens/spacing';
import { borderRadius as radiusTokens } from '../../../../tokens/borderRadius';

afterEach(() => {
  (useColorScheme as jest.Mock).mockReturnValue('light');
});

type JsonNode = {
  type: string;
  props?: Record<string, unknown>;
  children?: JsonNode[] | null;
} | null;

function flattenStyle(style: unknown): Record<string, unknown> {
  const list = Array.isArray(style) ? style : [style];
  return Object.assign({}, ...list.filter(Boolean));
}

function findNodeByStyle(
  node: JsonNode | JsonNode[] | null,
  predicate: (style: Record<string, unknown>) => boolean
): JsonNode {
  if (!node) return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findNodeByStyle(child, predicate);
      if (found) return found;
    }
    return null;
  }
  const style = flattenStyle(node.props?.style);
  if (predicate(style)) return node;
  return findNodeByStyle(node.children ?? null, predicate);
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('SkeletonList', () => {
  it('renderiza sin crashear con los valores por defecto', () => {
    const { getByTestId } = renderWithTheme(<SkeletonList testID="skeleton-list" />);
    expect(getByTestId('skeleton-list')).toBeTruthy();
  });

  it('tiene displayName seteado (memo)', () => {
    expect(SkeletonList.displayName).toBe('SkeletonList');
  });

  it('está envuelto en React.memo', () => {
    expect((SkeletonList as unknown as { $$typeof: symbol }).$$typeof).toBe(
      Symbol.for('react.memo')
    );
  });

  it('renderiza tantos SkeletonLoader como corresponde a la prop `items`', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <SkeletonList items={5} variant="avatar" testID="skeleton-list-count" />
    );
    // variant="avatar" -> 2 SkeletonLoader por item (avatar + texto) -> 2 Animated.View por item
    expect(UNSAFE_getAllByType(Animated.View)).toHaveLength(5 * 2);
  });

  describe('variantes', () => {
    it('variant="listItem" arma la fila (avatar + 2 textos) con 3 SkeletonLoader por item', () => {
      const { getByTestId, UNSAFE_getAllByType, toJSON } = renderWithTheme(
        <SkeletonList items={1} variant="listItem" testID="skeleton-list-item" />
      );
      expect(getByTestId('skeleton-list-item')).toBeTruthy();
      expect(UNSAFE_getAllByType(Animated.View)).toHaveLength(3);

      const rowNode = findNodeByStyle(
        toJSON() as JsonNode,
        (style) => style.flexDirection === 'row' && style.alignItems === 'center' && style.padding === spacing.md
      );
      expect(rowNode).not.toBeNull();
    });

    it('variant="card" usa borderRadius.lg y overflow hidden, con 4 SkeletonLoader por item (imagen + 3 textos)', () => {
      const { UNSAFE_getAllByType, toJSON } = renderWithTheme(
        <SkeletonList items={1} variant="card" testID="skeleton-list-card" />
      );
      expect(UNSAFE_getAllByType(Animated.View)).toHaveLength(4);

      const cardNode = findNodeByStyle(
        toJSON() as JsonNode,
        (style) => style.borderRadius === radiusTokens.lg && style.overflow === 'hidden'
      );
      expect(cardNode).not.toBeNull();
    });

    it('variant="avatar" renderiza 2 SkeletonLoader por item (avatar + texto)', () => {
      const { UNSAFE_getAllByType } = renderWithTheme(
        <SkeletonList items={1} variant="avatar" testID="skeleton-list-avatar" />
      );
      expect(UNSAFE_getAllByType(Animated.View)).toHaveLength(2);
    });
  });

  describe('spacing tokenizado', () => {
    it.each(['xs', 'md', 'lg'] as const)(
      'spacing="%s" aplica marginBottom desde el token de spacing (no un número hardcodeado)',
      (spacingKey) => {
        const { toJSON } = renderWithTheme(
          <SkeletonList items={2} spacing={spacingKey} testID={`skeleton-list-${spacingKey}`} />
        );
        const node = findNodeByStyle(
          toJSON() as JsonNode,
          (style) => style.marginBottom === spacing[spacingKey]
        );
        expect(node).not.toBeNull();
      }
    );
  });

  describe('accesibilidad', () => {
    it('expone accessibilityRole="progressbar" y accessibilityState busy en el contenedor', () => {
      const { getByTestId } = renderWithTheme(<SkeletonList testID="skeleton-list-a11y" />);
      const node = getByTestId('skeleton-list-a11y');
      expect(node.props.accessible).toBe(true);
      expect(node.props.accessibilityRole).toBe('progressbar');
      expect(node.props.accessibilityState).toEqual({ busy: true });
    });

    it('permite pisar el accessibilityLabel por prop', () => {
      const { getByTestId } = renderWithTheme(
        <SkeletonList accessibilityLabel="Cargando resultados" testID="skeleton-list-a11y-label" />
      );
      expect(getByTestId('skeleton-list-a11y-label').props.accessibilityLabel).toBe(
        'Cargando resultados'
      );
    });
  });

  describe('theming — colores nunca undefined', () => {
    it.each(['listItem', 'card', 'avatar'] as const)(
      'variant="%s" resuelve backgroundColor definido en modo claro',
      (variant) => {
        const { UNSAFE_getAllByType } = renderWithTheme(
          <SkeletonList items={1} variant={variant} testID={`skeleton-list-color-${variant}`} />
        );
        const layers = UNSAFE_getAllByType(Animated.View);
        expect(layers.length).toBeGreaterThan(0);
        layers.forEach((layer) => {
          const style = flattenStyle(layer.props.style);
          expect(style.backgroundColor).toBeDefined();
          expect(typeof style.backgroundColor).toBe('string');
          expect(style.backgroundColor).not.toBe('');
        });
      }
    );

    it('resuelve backgroundColor definido en modo oscuro (no queda en undefined al cambiar isDark)', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');
      const { UNSAFE_getAllByType } = renderWithTheme(
        <SkeletonList items={1} variant="listItem" testID="skeleton-list-dark" />
      );
      const layers = UNSAFE_getAllByType(Animated.View);
      expect(layers.length).toBeGreaterThan(0);
      layers.forEach((layer) => {
        const style = flattenStyle(layer.props.style);
        expect(style.backgroundColor).toBeDefined();
        expect(typeof style.backgroundColor).toBe('string');
      });
    });
  });
});
