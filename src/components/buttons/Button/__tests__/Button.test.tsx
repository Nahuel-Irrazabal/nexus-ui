/**
 * Button Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../Button';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';
import { fontSizes } from '../../../../tokens/typography';
import { palette } from '../../../../tokens/colors';

const ON_PRIMARY_FALLBACK = palette.neutral[0];

const BACKGROUND_BY_VARIANT = {
  primary: defaultLightTheme.primary,
  secondary: defaultLightTheme.secondary,
  danger: defaultLightTheme.error,
} as const;

function renderWithTheme(ui: React.ReactElement, themeConfig?: Parameters<typeof ThemeProvider>[0]['themeConfig']) {
  return render(<ThemeProvider themeConfig={themeConfig}>{ui}</ThemeProvider>);
}

function flattenStyle(style: unknown): Record<string, unknown> {
  const list = Array.isArray(style) ? style : [style];
  return Object.assign({}, ...list.filter(Boolean));
}

describe('Button', () => {
  it('renderiza el título sin crashear', () => {
    const { getByText } = renderWithTheme(<Button title="Continuar" testID="btn" />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('tiene displayName seteado (memo + forwardRef)', () => {
    expect(Button.displayName).toBe('Button');
  });

  describe('variantes — colores nunca undefined', () => {
    it.each(['primary', 'secondary', 'danger'] as const)(
      'variant="%s" resuelve backgroundColor de theme y texto tokenizado (no color hardcodeado suelto)',
      (variant) => {
        const { getByTestId, getByText } = renderWithTheme(
          <Button title="Acción" variant={variant} testID={`btn-${variant}`} />
        );

        const buttonStyle = flattenStyle(getByTestId(`btn-${variant}`).props.style);
        expect(buttonStyle.backgroundColor).toBeDefined();
        expect(buttonStyle.backgroundColor).toBe(BACKGROUND_BY_VARIANT[variant]);

        const textStyle = flattenStyle(getByText('Acción').props.style);
        expect(textStyle.color).toBeDefined();
        expect(textStyle.color).toBe(ON_PRIMARY_FALLBACK);
      }
    );

    it.each(['outline', 'ghost'] as const)(
      'variant="%s" es transparente y el texto usa theme.primary',
      (variant) => {
        const { getByTestId, getByText } = renderWithTheme(
          <Button title="Acción" variant={variant} testID={`btn-${variant}`} />
        );

        const buttonStyle = flattenStyle(getByTestId(`btn-${variant}`).props.style);
        expect(buttonStyle.backgroundColor).toBe('transparent');

        const textStyle = flattenStyle(getByText('Acción').props.style);
        expect(textStyle.color).toBeDefined();
        expect(textStyle.color).toBe(defaultLightTheme.primary);
      }
    );

    it('usa el primaryColor de themeConfig en vez de un valor hardcodeado', () => {
      const { getByTestId } = renderWithTheme(
        <Button title="Acción" variant="primary" testID="btn-custom" />,
        { primaryColor: 'green' }
      );
      const buttonStyle = flattenStyle(getByTestId('btn-custom').props.style);
      expect(buttonStyle.backgroundColor).toBeDefined();
      expect(buttonStyle.backgroundColor).not.toBe(defaultLightTheme.primary);
    });
  });

  describe('tamaños — font size tokenizado', () => {
    it.each([
      ['small', fontSizes.md],
      ['medium', fontSizes.lg],
      ['large', fontSizes.xl],
    ] as const)('size="%s" usa fontSizes token (%s)', (size, expectedSize) => {
      const { getByText } = renderWithTheme(<Button title="Acción" size={size} />);
      const textStyle = flattenStyle(getByText('Acción').props.style);
      expect(textStyle.fontSize).toBe(expectedSize);
    });
  });

  describe('iconOnly — sin padding de size (no achica el ícono en contenedores fijos chicos)', () => {
    it.each(['small', 'medium', 'large'] as const)(
      'size="%s" no aplica paddingVertical/paddingHorizontal cuando iconOnly',
      (size) => {
        const { getByTestId } = renderWithTheme(
          <Button
            iconOnly
            size={size}
            icon={<></>}
            testID="btn-icon-only"
            style={{ minWidth: 36, minHeight: 36 }}
          />
        );
        const buttonStyle = flattenStyle(getByTestId('btn-icon-only').props.style);
        expect(buttonStyle.paddingVertical).toBeUndefined();
        expect(buttonStyle.paddingHorizontal).toBeUndefined();
      }
    );
  });

  describe('estado disabled', () => {
    it('usa theme.border como background y theme.textDisabled en el texto', () => {
      const { getByTestId, getByText } = renderWithTheme(
        <Button title="Acción" disabled testID="btn-disabled" />
      );
      const buttonStyle = flattenStyle(getByTestId('btn-disabled').props.style);
      expect(buttonStyle.backgroundColor).toBe(defaultLightTheme.border);

      const textStyle = flattenStyle(getByText('Acción').props.style);
      expect(textStyle.color).toBe(defaultLightTheme.textDisabled);
    });
  });

  describe('loading', () => {
    it('oculta el título y marca busy=true mientras carga', () => {
      const { queryByText, getByTestId } = renderWithTheme(
        <Button title="Acción" loading testID="btn-loading" />
      );
      expect(queryByText('Acción')).toBeNull();
      const node = getByTestId('btn-loading');
      expect(node.props.accessibilityState).toEqual({ disabled: true, busy: true });
      expect(node.props.disabled).toBe(true);
    });
  });

  describe('accesibilidad', () => {
    it('expone accessibilityRole="button" y accessibilityState', () => {
      const { getByTestId } = renderWithTheme(<Button title="Guardar" testID="btn-a11y" />);
      const node = getByTestId('btn-a11y');
      expect(node.props.accessibilityRole).toBe('button');
      expect(node.props.accessibilityState).toEqual({ disabled: false, busy: false });
    });

    it('infiere accessibilityLabel del title por defecto', () => {
      const { getByTestId } = renderWithTheme(<Button title="Guardar" testID="btn-a11y-label" />);
      expect(getByTestId('btn-a11y-label').props.accessibilityLabel).toBe('Guardar');
    });

    it('permite pisar el accessibilityLabel inferido', () => {
      const { getByTestId } = renderWithTheme(
        <Button title="Guardar" accessibilityLabel="Guardar cambios del formulario" testID="btn-a11y-custom" />
      );
      expect(getByTestId('btn-a11y-custom').props.accessibilityLabel).toBe('Guardar cambios del formulario');
    });

    it('accessibilityState.disabled es true cuando disabled', () => {
      const { getByTestId } = renderWithTheme(
        <Button title="Guardar" disabled testID="btn-a11y-disabled" />
      );
      expect(getByTestId('btn-a11y-disabled').props.accessibilityState).toEqual({
        disabled: true,
        busy: false,
      });
    });
  });

  describe('forwardRef', () => {
    it('acepta un ref sin crashear (memo(forwardRef) al TouchableOpacity subyacente)', () => {
      const ref = React.createRef<React.ElementRef<typeof Button>>();
      expect(() =>
        renderWithTheme(<Button title="Acción" ref={ref} testID="btn-ref" />)
      ).not.toThrow();
    });
  });
});
