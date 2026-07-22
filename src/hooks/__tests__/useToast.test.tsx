/**
 * useToast Hook Tests
 * Cubre el contrato real del hook: error fuera de provider, render de
 * mensajes/tipos, auto-hide por duration y ocultamiento manual.
 */

import React from 'react';
import { act, fireEvent, renderHook, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { ToastProvider } from '../../components/feedback/Toast/Toast';
import { useToast } from '../useToast';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('lanza un error si se usa fuera de ToastProvider', () => {
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast debe usarse dentro de ToastProvider'
    );
  });

  it('expone showToast y hideToast como funciones', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    expect(typeof result.current.showToast).toBe('function');
    expect(typeof result.current.hideToast).toBe('function');
  });

  it('renderiza el mensaje al llamar showToast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showToast('Operación exitosa', 'info', 0);
    });
    expect(screen.getByText('Operación exitosa')).toBeTruthy();
  });

  it('usa type="info" por defecto cuando no se especifica', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showToast('mensaje sin tipo', undefined, 0);
    });
    expect(screen.getByText('ℹ️')).toBeTruthy();
  });

  it.each([
    ['success', '✅'],
    ['error', '❌'],
    ['warning', '⚠️'],
    ['info', 'ℹ️'],
  ] as const)('renderiza el emoji correcto para type=%s', (type, emoji) => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showToast('msg', type, 0);
    });
    expect(screen.getByText(emoji)).toBeTruthy();
  });

  it('oculta el toast automáticamente al cumplirse la duration indicada', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showToast('temporal', 'info', 1000);
    });
    expect(screen.getByText('temporal')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(screen.getByText('temporal')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.queryByText('temporal')).toBeNull();
  });

  it('usa 3000ms de duration por defecto cuando no se especifica', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showToast('default duration');
    });
    expect(screen.getByText('default duration')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(screen.getByText('default duration')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.queryByText('default duration')).toBeNull();
  });

  it('no programa auto-hide si duration es 0', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showToast('persistente', 'info', 0);
    });
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(screen.getByText('persistente')).toBeTruthy();
  });

  it('apila múltiples toasts simultáneos', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showToast('primero', 'info', 0);
      result.current.showToast('segundo', 'info', 0);
    });
    expect(screen.getByText('primero')).toBeTruthy();
    expect(screen.getByText('segundo')).toBeTruthy();
  });

  it('hideToast oculta un toast puntual por id sin afectar a los demás', () => {
    const dateSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(111).mockReturnValueOnce(222);
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('toast uno', 'info', 0);
      result.current.showToast('toast dos', 'info', 0);
    });
    expect(screen.getByText('toast uno')).toBeTruthy();
    expect(screen.getByText('toast dos')).toBeTruthy();

    act(() => {
      result.current.hideToast('111');
    });

    expect(screen.queryByText('toast uno')).toBeNull();
    expect(screen.getByText('toast dos')).toBeTruthy();

    dateSpy.mockRestore();
  });

  it('el botón de cerrar oculta el toast correspondiente', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showToast('cerrable', 'info', 0);
    });
    expect(screen.getByText('cerrable')).toBeTruthy();

    fireEvent.press(screen.getByText('✕'));

    expect(screen.queryByText('cerrable')).toBeNull();
  });
});
