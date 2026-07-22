/**
 * ErrorBoundary Component Tests
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

// Controla desde el test si el hijo debe tirar un error al renderizar.
// Un componente funcional lee esta variable en cada invocación de render,
// así que cambiarla entre asserts permite simular "el problema se solucionó"
// para probar el reset del ErrorBoundary sin necesitar estado propio.
let shouldThrow = true;

function Bomb(): React.ReactElement {
  if (shouldThrow) {
    throw new Error('Boom');
  }
  return <Text>Contenido recuperado</Text>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    shouldThrow = true;
  });

  it('renderiza los children normalmente cuando no hay error', () => {
    const { getByText, queryByText } = renderWithTheme(
      <ErrorBoundary>
        <Text>Todo bien</Text>
      </ErrorBoundary>
    );

    expect(getByText('Todo bien')).toBeTruthy();
    expect(queryByText('¡Algo salió mal!')).toBeNull();
  });

  it('muestra el fallback por defecto (no crashea el árbol) cuando un hijo tira un error en render', () => {
    const { getByText, queryByText } = renderWithTheme(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(getByText('¡Algo salió mal!')).toBeTruthy();
    expect(
      getByText('La aplicación encontró un error inesperado.')
    ).toBeTruthy();
    expect(queryByText('Contenido recuperado')).toBeNull();
  });

  it('muestra el mensaje del error en el error box (rama __DEV__)', () => {
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(getByText('Boom')).toBeTruthy();
  });

  // NOTA: el botón de retry no expone accessibilityRole/accessibilityLabel
  // (deuda de a11y pendiente, ver backlog de calidad). Este test solo cubre
  // que el botón sea presionable, sin inventar a11y que el componente no tiene.
  it('el botón de retry es presionable (expone onPress)', () => {
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    const button = getByText('Intentar de nuevo').parent;
    expect(button?.props.onPress).toBeInstanceOf(Function);
  });

  it('al presionar "Intentar de nuevo" resetea el estado y vuelve a renderizar los children', () => {
    const { getByText, queryByText } = renderWithTheme(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(getByText('¡Algo salió mal!')).toBeTruthy();

    // El problema que causaba el error ya se resolvió antes de reintentar.
    shouldThrow = false;
    fireEvent.press(getByText('Intentar de nuevo'));

    expect(queryByText('¡Algo salió mal!')).toBeNull();
    expect(getByText('Contenido recuperado')).toBeTruthy();
  });

  it('si el error persiste tras el reset, vuelve a mostrar el fallback', () => {
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(getByText('¡Algo salió mal!')).toBeTruthy();

    // shouldThrow sigue en true: el hijo vuelve a tirar el mismo error.
    fireEvent.press(getByText('Intentar de nuevo'));

    expect(getByText('¡Algo salió mal!')).toBeTruthy();
  });

  it('renderiza el fallback custom en vez del default cuando se provee la prop fallback', () => {
    const { getByText, queryByText } = renderWithTheme(
      <ErrorBoundary fallback={<Text>Fallback custom</Text>}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(getByText('Fallback custom')).toBeTruthy();
    expect(queryByText('¡Algo salió mal!')).toBeNull();
    expect(queryByText('Intentar de nuevo')).toBeNull();
  });
});
