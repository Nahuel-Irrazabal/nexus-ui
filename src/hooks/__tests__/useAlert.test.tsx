/**
 * useAlert Hook Tests
 * Cubre el contrato real del hook: error fuera de provider, confirm/dismiss,
 * variantes, botones por defecto/custom y su interacción.
 */

import React from 'react';
import { act, fireEvent, renderHook, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { AlertProvider } from '../../components/overlay/Alert/AlertProvider';
import { useAlert } from '../useAlert';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AlertProvider>{children}</AlertProvider>
    </ThemeProvider>
  );
}

describe('useAlert', () => {
  it('lanza un error si se usa fuera de AlertProvider', () => {
    expect(() => renderHook(() => useAlert())).toThrow(
      'useAlert debe usarse dentro de AlertProvider'
    );
  });

  it('expone confirm y dismiss como funciones', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });
    expect(typeof result.current.confirm).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('confirm muestra título y mensaje del alert', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });
    act(() => {
      result.current.confirm({ title: 'Título', message: 'Mensaje del alert' });
    });
    expect(screen.getByText('Título')).toBeTruthy();
    expect(screen.getByText('Mensaje del alert')).toBeTruthy();
  });

  it('usa el ícono de la variante info por defecto', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });
    act(() => {
      result.current.confirm({ title: 'Sin variant' });
    });
    expect(screen.getByText('ℹ️')).toBeTruthy();
  });

  it.each([
    ['success', '✅'],
    ['warning', '⚠️'],
    ['destructive', '❌'],
    ['info', 'ℹ️'],
  ] as const)('renderiza el ícono correcto para variant=%s', (variant, emoji) => {
    const { result } = renderHook(() => useAlert(), { wrapper });
    act(() => {
      result.current.confirm({ title: `Alert ${variant}`, variant });
    });
    expect(screen.getByText(emoji)).toBeTruthy();
  });

  it('dismiss oculta el alert activo', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });
    act(() => {
      result.current.confirm({ title: 'Se va a ocultar' });
    });
    expect(screen.getByText('Se va a ocultar')).toBeTruthy();

    act(() => {
      result.current.dismiss();
    });

    expect(screen.queryByText('Se va a ocultar')).toBeNull();
  });

  it('usa el botón "OK" por defecto cuando no se especifican buttons', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });
    act(() => {
      result.current.confirm({ title: 'Con boton default' });
    });
    expect(screen.getByText('OK')).toBeTruthy();

    fireEvent.press(screen.getByText('OK'));

    expect(screen.queryByText('Con boton default')).toBeNull();
  });

  it('renderiza botones custom y ejecuta su onPress al presionarlos', () => {
    const onConfirmDelete = jest.fn();
    const { result } = renderHook(() => useAlert(), { wrapper });
    act(() => {
      result.current.confirm({
        title: 'Confirmar eliminación',
        message: 'Esta acción no se puede deshacer',
        variant: 'destructive',
        buttons: [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: onConfirmDelete },
        ],
      });
    });

    expect(screen.getByText('Cancelar')).toBeTruthy();
    expect(screen.getByText('Eliminar')).toBeTruthy();

    fireEvent.press(screen.getByText('Eliminar'));

    expect(onConfirmDelete).toHaveBeenCalledTimes(1);
    // Al presionar cualquier botón, el alert se cierra (onClose -> dismiss)
    expect(screen.queryByText('Confirmar eliminación')).toBeNull();
  });

  it('presionar un botón sin onPress igual cierra el alert', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });
    act(() => {
      result.current.confirm({
        title: 'Alert cancelable',
        buttons: [{ text: 'Cancelar', style: 'cancel' }],
      });
    });

    fireEvent.press(screen.getByText('Cancelar'));

    expect(screen.queryByText('Alert cancelable')).toBeNull();
  });

  it('un nuevo confirm reemplaza al alert anterior', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });
    act(() => {
      result.current.confirm({ title: 'Primer alert' });
    });
    expect(screen.getByText('Primer alert')).toBeTruthy();

    act(() => {
      result.current.confirm({ title: 'Segundo alert' });
    });

    expect(screen.queryByText('Primer alert')).toBeNull();
    expect(screen.getByText('Segundo alert')).toBeTruthy();
  });
});
