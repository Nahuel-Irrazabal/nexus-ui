/**
 * usePrevious Hook Tests
 * Cubre el comportamiento real del hook: devuelve undefined en el primer render,
 * retorna el valor anterior tras un re-render con nuevo valor, y se actualiza
 * correctamente en renders sucesivos.
 */

import { renderHook } from '@testing-library/react-native';
import { usePrevious } from '../usePrevious';

describe('usePrevious', () => {
  it('devuelve undefined en el primer render', () => {
    const { result } = renderHook(() => usePrevious('inicial'));
    expect(result.current).toBeUndefined();
  });

  it('devuelve el valor anterior tras un re-render con nuevo valor', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'primer' } }
    );

    // Primer render: undefined
    expect(result.current).toBeUndefined();

    // Re-render con nuevo valor: debe retornar el valor anterior ('primer')
    rerender({ value: 'segundo' });
    expect(result.current).toBe('primer');
  });

  it('se actualiza correctamente en renders sucesivos', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'A' } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: 'B' });
    expect(result.current).toBe('A');

    rerender({ value: 'C' });
    expect(result.current).toBe('B');

    rerender({ value: 'D' });
    expect(result.current).toBe('C');
  });

  it('funciona con cualquier tipo de valor (string, number, object)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 42 } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: 100 });
    expect(result.current).toBe(42);

    const obj = { name: 'test' };
    rerender({ value: obj });
    expect(result.current).toBe(100);

    rerender({ value: null });
    expect(result.current).toBe(obj);
  });

  it('devuelve undefined cuando el valor cambia a undefined', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'algo' } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: 'otro' });
    expect(result.current).toBe('algo');

    rerender({ value: undefined });
    expect(result.current).toBe('otro');

    rerender({ value: 'nuevo' });
    expect(result.current).toBeUndefined();
  });

  it('preserva referencias de objetos (no hace copia profunda)', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj1 } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: obj2 });
    expect(result.current).toBe(obj1); // misma referencia
    expect(result.current?.id).toBe(1);
  });
});

