/**
 * SkeletonLoader Component Tests
 */

import React from 'react';
import { Animated, useColorScheme } from 'react-native';
import { render } from '@testing-library/react-native';
import { SkeletonLoader } from '../SkeletonLoader';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { borderRadius as radiusTokens } from '../../../../tokens/borderRadius';

function flattenStyle(style: unknown): Record<string, unknown> {
  const list = Array.isArray(style) ? style : [style];
  return Object.assign({}, ...list.filter(Boolean));
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

// El contenedor tiene accessibilityElementsHidden/importantForAccessibility
// a propósito (ver comentario en SkeletonLoader.tsx), por lo que las queries
// de RNTL lo excluyen por defecto. Para inspeccionar sus estilos hay que
// pedir explícitamente los elementos ocultos de accesibilidad.
const HIDDEN = { includeHiddenElements: true };

describe('SkeletonLoader', () => {
  afterEach(() => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
  });

  it('renderiza sin crashear', () => {
    const { getByTestId } = renderWithTheme(<SkeletonLoader testID="skeleton" />);
    expect(getByTestId('skeleton', HIDDEN)).toBeTruthy();
  });

  it('tiene displayName seteado (memo)', () => {
    expect(SkeletonLoader.displayName).toBe('SkeletonLoader');
  });

  it('está envuelto en React.memo', () => {
    expect((SkeletonLoader as unknown as { $$typeof: symbol }).$$typeof).toBe(
      Symbol.for('react.memo')
    );
  });

  describe('variantes — dimensiones y borderRadius por defecto', () => {
    it.each([
      ['text', '100%', 16, radiusTokens.sm],
      ['avatar', 40, 40, radiusTokens['2xl']],
      ['card', '100%', 200, radiusTokens.lg],
      ['image', '100%', 150, radiusTokens.md],
      ['custom', 100, 100, radiusTokens.none],
    ] as const)('variant="%s" usa width=%s height=%s borderRadius=%s', (variant, expectedWidth, expectedHeight, expectedRadius) => {
      const { getByTestId } = renderWithTheme(
        <SkeletonLoader variant={variant} testID={`skeleton-${variant}`} />
      );
      const style = flattenStyle(getByTestId(`skeleton-${variant}`, HIDDEN).props.style);
      expect(style.width).toBe(expectedWidth);
      expect(style.height).toBe(expectedHeight);
      expect(style.borderRadius).toBe(expectedRadius);
    });

    it('permite pisar width, height y borderRadius por props', () => {
      const { getByTestId } = renderWithTheme(
        <SkeletonLoader variant="card" width={80} height={30} borderRadius={12} testID="skeleton-custom" />
      );
      const style = flattenStyle(getByTestId('skeleton-custom', HIDDEN).props.style);
      expect(style.width).toBe(80);
      expect(style.height).toBe(30);
      expect(style.borderRadius).toBe(12);
    });
  });

  describe('animación', () => {
    it('animation="wave" agrega una capa extra de shimmer', () => {
      const { UNSAFE_getAllByType } = renderWithTheme(
        <SkeletonLoader animation="wave" testID="skeleton-wave" />
      );
      expect(UNSAFE_getAllByType(Animated.View)).toHaveLength(2);
    });

    it.each(['pulse', 'none'] as const)(
      'animation="%s" no agrega la capa de wave',
      (animation) => {
        const { UNSAFE_getAllByType } = renderWithTheme(
          <SkeletonLoader animation={animation} testID={`skeleton-${animation}`} />
        );
        expect(UNSAFE_getAllByType(Animated.View)).toHaveLength(1);
      }
    );
  });

  describe('accesibilidad', () => {
    it('se oculta del árbol de accesibilidad por ser decorativo', () => {
      const { getByTestId } = renderWithTheme(<SkeletonLoader testID="skeleton-a11y" />);
      const node = getByTestId('skeleton-a11y', HIDDEN);
      expect(node.props.accessibilityElementsHidden).toBe(true);
      expect(node.props.importantForAccessibility).toBe('no-hide-descendants');
    });
  });

  describe('theming — colores nunca undefined', () => {
    it('resuelve el color del skeleton y del wave en modo claro', () => {
      const { UNSAFE_getAllByType } = renderWithTheme(
        <SkeletonLoader animation="wave" testID="skeleton-light" />
      );
      const [skeletonLayer, waveLayer] = UNSAFE_getAllByType(Animated.View);

      const skeletonStyle = flattenStyle(skeletonLayer.props.style);
      expect(typeof skeletonStyle.backgroundColor).toBe('string');
      expect(skeletonStyle.backgroundColor).toBeTruthy();

      const waveStyle = flattenStyle(waveLayer.props.style);
      expect(typeof waveStyle.backgroundColor).toBe('string');
      expect(waveStyle.backgroundColor).toBeTruthy();
    });

    it('resuelve el color del skeleton y del wave en modo oscuro', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');

      const { UNSAFE_getAllByType } = renderWithTheme(
        <SkeletonLoader animation="wave" testID="skeleton-dark" />
      );
      const [skeletonLayer, waveLayer] = UNSAFE_getAllByType(Animated.View);

      const skeletonStyle = flattenStyle(skeletonLayer.props.style);
      expect(skeletonStyle.backgroundColor).toBeTruthy();

      const waveStyle = flattenStyle(waveLayer.props.style);
      expect(waveStyle.backgroundColor).toBeTruthy();

      // Los dos modos deben diferenciarse (no es el mismo literal hardcodeado).
      expect(skeletonStyle.backgroundColor).not.toBe('#E0E0E0');
    });
  });
});
