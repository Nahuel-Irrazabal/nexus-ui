/**
 * Input Component Tests
 */

import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';

function renderInput(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Input', () => {
  it('renderiza sin crashear con label, helper text y contenido', () => {
    const { getByText, getByTestId } = renderInput(
      <Input label="Nombre" helperText="Como figura en tu DNI" testID="input" />
    );

    expect(getByText('Nombre')).toBeTruthy();
    expect(getByText('Como figura en tu DNI')).toBeTruthy();
    expect(getByTestId('input')).toBeTruthy();
  });

  it('usa accessibilityLabel = label por defecto cuando no se pasa uno explícito', () => {
    const { getByLabelText } = renderInput(<Input label="Email" testID="input" />);

    const field = getByLabelText('Email');
    expect(field).toBeTruthy();
  });

  it('respeta un accessibilityLabel explícito por sobre el label', () => {
    const { getByLabelText, queryByLabelText } = renderInput(
      <Input label="Email" accessibilityLabel="Correo electrónico" testID="input" />
    );

    expect(getByLabelText('Correo electrónico')).toBeTruthy();
    expect(queryByLabelText('Email')).toBeNull();
  });

  it('expone accessibilityState.disabled cuando editable=false', () => {
    const { getByTestId } = renderInput(<Input label="Nombre" editable={false} testID="input" />);

    const field = getByTestId('input');
    expect(field.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('expone accessibilityState.invalid cuando hay error', () => {
    const { getByTestId } = renderInput(
      <Input label="Nombre" error="Campo requerido" testID="input" />
    );

    const field = getByTestId('input');
    expect(field.props.accessibilityState).toMatchObject({ disabled: false, invalid: true });
  });

  it('el borde usa theme.border por defecto, theme.primary al enfocar y theme.error con error (nunca undefined)', () => {
    const { getByTestId } = renderInput(<Input label="Nombre" testID="input" />);
    const field = getByTestId('input');

    const containerStyle = () => StyleSheet.flatten(field.parent!.props.style) ?? {};

    expect(containerStyle().borderColor).toBe(defaultLightTheme.border);
    expect(containerStyle().borderColor).not.toBeUndefined();

    fireEvent(field, 'focus');
    expect(containerStyle().borderColor).toBe(defaultLightTheme.primary);

    fireEvent(field, 'blur');
    expect(containerStyle().borderColor).toBe(defaultLightTheme.border);
  });

  it('el borde y el helper text usan theme.error cuando hay error, y ningún color resuelve a undefined', () => {
    const { getByTestId, getByText } = renderInput(
      <Input label="Nombre" error="Campo requerido" testID="input" />
    );

    const field = getByTestId('input');
    const containerStyle = StyleSheet.flatten(field.parent!.props.style) ?? {};
    expect(containerStyle.borderColor).toBe(defaultLightTheme.error);
    expect(containerStyle.borderColor).not.toBeUndefined();

    const helper = getByText('Campo requerido');
    const helperStyle = StyleSheet.flatten(helper.props.style) ?? {};
    expect(helperStyle.color).toBe(defaultLightTheme.error);
    expect(helperStyle.color).not.toBeUndefined();
  });

  it('el texto y el label usan theme.text, y el placeholder theme.textDisabled', () => {
    const { getByTestId, getByText } = renderInput(<Input label="Nombre" testID="input" />);

    const field = getByTestId('input');
    const fieldStyle = StyleSheet.flatten(field.props.style) ?? {};
    expect(fieldStyle.color).toBe(defaultLightTheme.text);
    expect(fieldStyle.color).not.toBeUndefined();
    expect(field.props.placeholderTextColor).toBe(defaultLightTheme.textDisabled);

    const label = getByText('Nombre');
    const labelStyle = StyleSheet.flatten(label.props.style) ?? {};
    expect(labelStyle.color).toBe(defaultLightTheme.text);
    expect(labelStyle.color).not.toBeUndefined();
  });

  it('forwardRef expone focus()/blur() imperativos hacia el TextInput nativo', () => {
    const ref = React.createRef<TextInput>();
    const focus = jest.fn();
    const blur = jest.fn();

    render(
      <ThemeProvider>
        <Input label="Nombre" ref={ref} testID="input" />
      </ThemeProvider>,
      { createNodeMock: () => ({ focus, blur }) }
    );

    expect(ref.current).not.toBeNull();
    ref.current?.focus();
    ref.current?.blur();
    expect(focus).toHaveBeenCalledTimes(1);
    expect(blur).toHaveBeenCalledTimes(1);
  });

  it('tiene displayName para debugging (memo + forwardRef)', () => {
    expect(Input.displayName).toBe('Input');
  });

  it('memoiza: dos renders con las mismas props no generan crash y mantienen el output', () => {
    const { getByText, rerender } = renderInput(<Input label="Nombre" testID="input" />);
    expect(getByText('Nombre')).toBeTruthy();

    rerender(
      <ThemeProvider>
        <Input label="Nombre" testID="input" />
      </ThemeProvider>
    );
    expect(getByText('Nombre')).toBeTruthy();
  });
});
