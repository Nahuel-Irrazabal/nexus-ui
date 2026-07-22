/**
 * Sheet Component Tests
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Sheet } from '../Sheet';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';

function renderSheet(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Sheet', () => {
  it('renders its children when visible without crashing', () => {
    const { getByText, getByTestId } = renderSheet(
      <Sheet visible onClose={jest.fn()} testID="sheet">
        <Text>Contenido del sheet</Text>
      </Sheet>
    );

    expect(getByTestId('sheet')).toBeTruthy();
    expect(getByText('Contenido del sheet')).toBeTruthy();
  });

  it('no renderiza contenido cuando visible=false', () => {
    const { queryByText } = renderSheet(
      <Sheet visible={false} onClose={jest.fn()}>
        <Text>Contenido oculto</Text>
      </Sheet>
    );

    expect(queryByText('Contenido oculto')).toBeNull();
  });

  it('marca el backdrop como control accesible (role button) cuando es dismissible', () => {
    const onClose = jest.fn();
    const { getByLabelText } = renderSheet(
      <Sheet visible onClose={onClose} dismissible testID="sheet">
        <Text>Contenido</Text>
      </Sheet>
    );

    const backdrop = getByLabelText('Cerrar');
    expect(backdrop.props.accessibilityRole).toBe('button');

    fireEvent.press(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('no expone el backdrop como control cuando dismissible=false', () => {
    const onClose = jest.fn();
    const { queryByLabelText, getByTestId } = renderSheet(
      <Sheet visible onClose={onClose} dismissible={false} testID="sheet">
        <Text>Contenido</Text>
      </Sheet>
    );

    expect(queryByLabelText('Cerrar')).toBeNull();
    expect(getByTestId('sheet')).toBeTruthy();
  });

  it('marca el contenido del sheet con accessibilityViewIsModal', () => {
    const { getByText } = renderSheet(
      <Sheet visible onClose={jest.fn()}>
        <Text>Contenido</Text>
      </Sheet>
    );

    const content = getByText('Contenido').parent;
    expect(content?.props.accessibilityViewIsModal).toBe(true);
  });

  it('resuelve todos los colores de theme.* sin dejar ninguno undefined', () => {
    const { getByText } = renderSheet(
      <Sheet visible onClose={jest.fn()} testID="sheet">
        <Text>Contenido</Text>
      </Sheet>
    );

    const sheetContent = getByText('Contenido').parent;
    const backdrop = sheetContent?.parent?.parent;

    const backdropBackground = Array.isArray(backdrop?.props.style)
      ? backdrop?.props.style.find((s: any) => s && 'backgroundColor' in s)?.backgroundColor
      : backdrop?.props.style?.backgroundColor;

    const contentStyleEntry = Array.isArray(sheetContent?.props.style)
      ? sheetContent?.props.style.find((s: any) => s && 'backgroundColor' in s)
      : undefined;

    expect(backdropBackground).toBe(defaultLightTheme.overlay);
    expect(backdropBackground).not.toBeUndefined();

    expect(contentStyleEntry?.backgroundColor).toBe(defaultLightTheme.surface);
    expect(contentStyleEntry?.backgroundColor).not.toBeUndefined();
  });
});
