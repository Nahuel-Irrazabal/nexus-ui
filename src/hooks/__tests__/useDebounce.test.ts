/**
 * useDebounce Hook Tests
 * Valida el comportamiento real del hook: retraso configurable,
 * cancelación de timers pendientes y reinicio ante cambios sucesivos.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('devuelve el valor inicial inmediatamente (antes del delay)', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('no actualiza el valor debounced antes de cumplirse el delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    expect(result.current).toBe('first');

    act(() => {
      rerender({ value: 'second', delay: 500 });
    });

    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(result.current).toBe('first');
  });

  it('actualiza el valor debounced después de cumplirse el delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    act(() => {
      rerender({ value: 'second', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('second');
  });

  it('reinicia el timer cuando el valor cambia antes del delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    act(() => {
      rerender({ value: 'second', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe('first');

    act(() => {
      rerender({ value: 'third', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('third');
  });

  it('solo aplica el valor final cuando hay cambios rápidos sucesivos', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'value1', delay: 500 } }
    );

    act(() => {
      rerender({ value: 'value2', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      rerender({ value: 'value3', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      rerender({ value: 'value4', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('value1');

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(result.current).toBe('value4');
  });

  it('usa un delay por defecto de 500ms cuando no se especifica', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'first' } }
    );

    act(() => {
      rerender({ value: 'second' });
    });

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('second');
  });

  it('cancela el timeout al desmontar el hook', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    act(() => {
      rerender({ value: 'second', delay: 500 });
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('first');
  });

  it('soporta valores de tipo genérico (números, objetos, arrays)', () => {
    const { result: resultNum, rerender: rerenderNum } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 42, delay: 300 } }
    );
    expect(resultNum.current).toBe(42);

    act(() => {
      rerenderNum({ value: 100, delay: 300 });
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(resultNum.current).toBe(100);

    const obj = { name: 'test' };
    const { result: resultObj, rerender: rerenderObj } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: obj, delay: 300 } }
    );
    expect(resultObj.current).toBe(obj);

    const newObj = { name: 'updated' };
    act(() => {
      rerenderObj({ value: newObj, delay: 300 });
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(resultObj.current).toBe(newObj);
  });
});

