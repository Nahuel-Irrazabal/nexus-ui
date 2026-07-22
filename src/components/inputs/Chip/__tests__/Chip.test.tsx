/**
 * Chip Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import { Chip, ChipGroup } from '../Chip';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { textVariants } from '../../../../tokens/typography';

const renderWithTheme = (ui: React.ReactElement, themeConfig?: object) =>
  render(<ThemeProvider themeConfig={themeConfig}>{ui}</ThemeProvider>);

const flattenStyle = (style: any): Record<string, any> => {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style ?? {};
};

/** El estilo del Pressable se resuelve como función `({ pressed }) => [...]`. */
const resolveContainerStyle = (node: any) =>
  flattenStyle(typeof node.props.style === 'function' ? node.props.style({ pressed: false }) : node.props.style);

describe('Chip', () => {
  it('renderiza el label sin crashear', () => {
    const { getByText } = renderWithTheme(<Chip label="Filtro" testID="chip" />);
    expect(getByText('Filtro')).toBeTruthy();
  });

  it('tiene displayName seteado para debugging', () => {
    expect(Chip.displayName).toBe('Chip');
  });

  it('está compuesto por memo(forwardRef(...))', () => {
    expect((Chip as any).$$typeof).toBe(Symbol.for('react.memo'));
    expect((Chip as any).type?.$$typeof).toBe(Symbol.for('react.forward_ref'));
  });

  it('forwarda el ref sin crashear', () => {
    const ref = React.createRef<any>();
    expect(() => renderWithTheme(<Chip ref={ref} label="Ref chip" testID="chip-ref" />)).not.toThrow();
  });

  it('expone accessibilityRole="button" y accessibilityState con selected/disabled', () => {
    const { getByTestId } = renderWithTheme(<Chip label="Filtro" selected disabled testID="chip" />);
    const node = getByTestId('chip');
    expect(node.props.accessibilityRole).toBe('button');
    expect(node.props.accessibilityState).toEqual({ selected: true, disabled: true });
  });

  it('usa el label como accessibilityLabel por defecto', () => {
    const { getByTestId } = renderWithTheme(<Chip label="Frutas" testID="chip" />);
    expect(getByTestId('chip').props.accessibilityLabel).toBe('Frutas');
  });

  it('permite pisar accessibilityLabel via prop', () => {
    const { getByTestId } = renderWithTheme(
      <Chip label="Frutas" accessibilityLabel="Filtro de frutas" testID="chip" />
    );
    expect(getByTestId('chip').props.accessibilityLabel).toBe('Filtro de frutas');
  });

  it('respeta disabled en el Pressable subyacente', () => {
    const { getByTestId } = renderWithTheme(<Chip label="Deshabilitado" disabled testID="chip" />);
    expect(getByTestId('chip').props.disabled).toBe(true);
  });

  it.each([
    ['sin seleccionar', false, false],
    ['seleccionado', true, false],
    ['deshabilitado', false, true],
    ['seleccionado y deshabilitado', true, true],
  ])('resuelve colores válidos (nunca undefined) para variante: %s', (_desc, selected, disabled) => {
    const { getByTestId, getByText } = renderWithTheme(
      <Chip label="Estado" selected={selected} disabled={disabled} testID="chip" />
    );
    const containerStyle = resolveContainerStyle(getByTestId('chip'));
    const labelStyle = flattenStyle(getByText('Estado').props.style);

    expect(containerStyle.backgroundColor).not.toBeUndefined();
    expect(typeof containerStyle.backgroundColor).toBe('string');
    expect(containerStyle.borderColor).not.toBeUndefined();
    expect(typeof containerStyle.borderColor).toBe('string');
    expect(labelStyle.color).not.toBeUndefined();
    expect(typeof labelStyle.color).toBe('string');
  });

  it('usa theme.onPrimary (no un hex hardcodeado) para el texto cuando está seleccionado', () => {
    const { getByText } = renderWithTheme(<Chip label="Activo" selected testID="chip" />);
    const labelStyle = flattenStyle(getByText('Activo').props.style);
    expect(typeof labelStyle.color).toBe('string');
    expect(labelStyle.color).not.toBe('#fff');
  });

  it('el color de texto seleccionado cambia con un theme custom (viene de theme, no hardcodeado)', () => {
    const { getByText } = renderWithTheme(<Chip label="Activo" selected testID="chip" />, {
      light: { onPrimary: '#00ff00' },
    });
    const labelStyle = flattenStyle(getByText('Activo').props.style);
    expect(labelStyle.color).toBe('#00ff00');
  });

  it.each(['small', 'medium'] as const)('aplica el fontSize del token para size="%s"', (size) => {
    const { getByText } = renderWithTheme(<Chip label="Tamaño" size={size} testID="chip" />);
    const labelStyle = flattenStyle(getByText('Tamaño').props.style);
    const expected = size === 'small' ? textVariants.caption.fontSize : textVariants.body.fontSize;
    expect(labelStyle.fontSize).toBe(expected);
  });

  it('reduce la opacidad del contenedor cuando está deshabilitado', () => {
    const { getByTestId } = renderWithTheme(<Chip label="Deshabilitado" disabled testID="chip" />);
    expect(resolveContainerStyle(getByTestId('chip')).opacity).toBe(0.5);
  });
});

describe('ChipGroup', () => {
  it('renderiza los children sin crashear', () => {
    const { getByText } = renderWithTheme(
      <ChipGroup>
        <Chip label="Uno" testID="chip-1" />
      </ChipGroup>
    );
    expect(getByText('Uno')).toBeTruthy();
  });

  it('tiene displayName seteado para debugging', () => {
    expect(ChipGroup.displayName).toBe('ChipGroup');
  });

  it('usa un ScrollView horizontal cuando scrollable=true', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <ChipGroup scrollable>
        <Chip label="Uno" testID="chip-1" />
      </ChipGroup>
    );
    const scroll = UNSAFE_getByType(ScrollView as any);
    expect(scroll.props.horizontal).toBe(true);
  });
});
