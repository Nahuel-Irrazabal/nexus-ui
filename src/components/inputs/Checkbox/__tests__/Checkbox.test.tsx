/**
 * Checkbox Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';
import { Checkbox, CheckboxGroup, CheckboxItem } from '../Checkbox';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';

function renderWithTheme(ui: React.ReactElement, options?: RenderOptions) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
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

describe('Checkbox', () => {
  it('renderiza sin crashear con un label', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Checkbox value={false} onChange={jest.fn()} label="Aceptar términos" />
    );

    expect(getByRole('checkbox')).toBeTruthy();
    expect(getByText('Aceptar términos')).toBeTruthy();
  });

  it('expone accessibilityState.checked acorde a value', () => {
    const { getByRole, rerender } = renderWithTheme(
      <Checkbox value={false} onChange={jest.fn()} label="Términos" />
    );
    expect(getByRole('checkbox').props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });

    rerender(
      <ThemeProvider>
        <Checkbox value={true} onChange={jest.fn()} label="Términos" />
      </ThemeProvider>
    );
    expect(getByRole('checkbox').props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
  });

  it('usa el label como accessibilityLabel por defecto, sin texto hardcodeado', () => {
    const { getByRole } = renderWithTheme(
      <Checkbox value={true} onChange={jest.fn()} label="Suscribirme" />
    );
    expect(getByRole('checkbox').props.accessibilityLabel).toBe('Suscribirme');
  });

  it('permite pisar el accessibilityLabel explícitamente (checkbox sin label visible)', () => {
    const { getByRole } = renderWithTheme(
      <Checkbox value={false} onChange={jest.fn()} accessibilityLabel="Filtro activo" />
    );
    expect(getByRole('checkbox').props.accessibilityLabel).toBe('Filtro activo');
  });

  it('dispara onChange con el valor invertido al presionar', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Checkbox value={false} onChange={onChange} label="Términos" />
    );

    fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('no dispara onChange cuando está disabled', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Checkbox value={false} onChange={onChange} label="Términos" disabled />
    );

    fireEvent.press(getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('checkbox').props.accessibilityState.disabled).toBe(true);
  });

  it('resuelve el color del check (✓) a un color de theme.*, nunca a undefined (regresión del bug theme.textContrast)', () => {
    const { getByText } = renderWithTheme(
      <Checkbox value={true} onChange={jest.fn()} label="Checked" />
    );

    const checkmark = getByText('✓');
    const flattened = flattenStyle(checkmark.props.style);

    expect(flattened.color).toBeDefined();
    expect(flattened.color).toBe(defaultLightTheme.background);
  });

  it('resuelve el color de la línea indeterminada a theme.textDisabled cuando disabled, nunca a undefined', () => {
    const { UNSAFE_getAllByProps } = renderWithTheme(
      <Checkbox value={false} onChange={jest.fn()} indeterminate disabled />
    );

    const candidates = UNSAFE_getAllByProps({}).filter((node: any) => {
      const flattened = flattenStyle(node.props.style);
      return flattened.height === 2;
    });

    expect(candidates.length).toBeGreaterThan(0);
    const flattened = flattenStyle(candidates[0].props.style);
    expect(flattened.backgroundColor).toBeDefined();
    expect(flattened.backgroundColor).toBe(defaultLightTheme.textDisabled);
  });

  it('reenvía el ref al TouchableOpacity subyacente (forwardRef)', () => {
    const ref = React.createRef<any>();
    // react-test-renderer no crea instancias de host components por defecto;
    // createNodeMock es necesario para poder observar el ref reenviado.
    renderWithTheme(
      <Checkbox ref={ref} value={false} onChange={jest.fn()} label="Ref test" />,
      { createNodeMock: () => ({}) }
    );

    expect(ref.current).not.toBeNull();
  });

  it('expone displayName para debugging', () => {
    expect(Checkbox.displayName).toBe('Checkbox');
    expect(CheckboxGroup.displayName).toBe('CheckboxGroup');
    expect(CheckboxItem.displayName).toBe('CheckboxItem');
  });

  it('renderiza el mensaje de error con theme.error', () => {
    const { getByText } = renderWithTheme(
      <Checkbox value={false} onChange={jest.fn()} label="Términos" error="Campo requerido" />
    );

    const errorText = getByText('Campo requerido');
    const flattened = flattenStyle(errorText.props.style);
    expect(flattened.color).toBe(defaultLightTheme.error);
  });
});

describe('CheckboxGroup', () => {
  it('renderiza un Checkbox por cada CheckboxItem hijo', () => {
    const { getAllByRole } = renderWithTheme(
      <CheckboxGroup value={['a']} onChange={jest.fn()} label="Opciones">
        <CheckboxItem label="Opción A" value="a" />
        <CheckboxItem label="Opción B" value="b" />
      </CheckboxGroup>
    );

    const checkboxes = getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0].props.accessibilityState.checked).toBe(true);
    expect(checkboxes[1].props.accessibilityState.checked).toBe(false);
  });

  it('agrega el value al array al tildar un item no seleccionado', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <CheckboxGroup value={['a']} onChange={onChange} label="Opciones">
        <CheckboxItem label="Opción A" value="a" />
        <CheckboxItem label="Opción B" value="b" />
      </CheckboxGroup>
    );

    fireEvent.press(getAllByRole('checkbox')[1]);
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('quita el value del array al destildar un item seleccionado', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <CheckboxGroup value={['a', 'b']} onChange={onChange} label="Opciones">
        <CheckboxItem label="Opción A" value="a" />
        <CheckboxItem label="Opción B" value="b" />
      </CheckboxGroup>
    );

    fireEvent.press(getAllByRole('checkbox')[0]);
    expect(onChange).toHaveBeenCalledWith(['b']);
  });
});
