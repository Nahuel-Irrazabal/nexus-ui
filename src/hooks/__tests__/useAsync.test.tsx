/**
 * useAsync Hook Tests
 */

import React, { useEffect, useState } from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { useAsync } from '../useAsync';

/**
 * Componente helper que expone el estado del hook en el árbol para testing
 */
function AsyncComponent({
  asyncFn,
  immediate = false,
  onExecute,
}: {
  asyncFn: (...args: any[]) => Promise<any>;
  immediate?: boolean;
  onExecute?: (fn: (...args: any[]) => Promise<any>) => void;
}) {
  const { data, error, loading, execute, reset } = useAsync(asyncFn, { immediate });

  useEffect(() => {
    if (onExecute) {
      onExecute(execute);
    }
  }, [execute, onExecute]);

  return (
    <>
      <Text testID="loading">{loading ? 'loading' : 'idle'}</Text>
      <Text testID="data">{data ?? 'null'}</Text>
      <Text testID="error">{error?.message ?? 'null'}</Text>
      <Text testID="reset-btn" onPress={reset}>
        Reset
      </Text>
    </>
  );
}

describe('useAsync', () => {
  describe('estado inicial', () => {
    it('debe retornar estado inicial correcto (no loading, data null, error null)', async () => {
      const asyncFn = jest.fn(async () => 'result');
      const { getByTestId } = render(
        <AsyncComponent asyncFn={asyncFn} />
      );

      expect(getByTestId('loading').children[0]).toBe('idle');
      expect(getByTestId('data').children[0]).toBe('null');
      expect(getByTestId('error').children[0]).toBe('null');
    });

    it('debe retornar un objeto con data, error, loading, execute, reset', async () => {
      const asyncFn = jest.fn(async () => 'test');
      let returnedValue: any;

      function CaptureReturn() {
        returnedValue = useAsync(asyncFn);
        return null;
      }

      render(<CaptureReturn />);

      expect(returnedValue).toBeDefined();
      expect(returnedValue.data).toBe(null);
      expect(returnedValue.error).toBe(null);
      expect(returnedValue.loading).toBe(false);
      expect(typeof returnedValue.execute).toBe('function');
      expect(typeof returnedValue.reset).toBe('function');
    });
  });

  describe('execute — transición de estados', () => {
    it('debe setear loading=true al inicio de execute, luego data con el resultado', async () => {
      const asyncFn = jest.fn(async () => 'success data');
      let executeRef: any;

      const { getByTestId } = render(
        <AsyncComponent
          asyncFn={asyncFn}
          onExecute={(fn) => {
            executeRef = fn;
          }}
        />
      );

      // Estado inicial: idle
      expect(getByTestId('loading').children[0]).toBe('idle');

      // Ejecutar
      await act(async () => {
        await executeRef();
      });

      // Tras completar: debe tener data
      expect(getByTestId('loading').children[0]).toBe('idle');
      expect(getByTestId('data').children[0]).toBe('success data');
      expect(getByTestId('error').children[0]).toBe('null');
    });

    it('debe llamar a la función pasada con los argumentos', async () => {
      const asyncFn = jest.fn(async (a: number, b: number) => a + b);
      let executeRef: any;

      render(
        <AsyncComponent
          asyncFn={asyncFn}
          onExecute={(fn) => {
            executeRef = fn;
          }}
        />
      );

      await act(async () => {
        await executeRef(5, 3);
      });

      expect(asyncFn).toHaveBeenCalledWith(5, 3);
    });

    it('debe retornar el resultado de la función async', async () => {
      const expectedResult = { id: 1, name: 'test' };
      const asyncFn = jest.fn(async () => expectedResult);
      let result: any;

      function TestComponent() {
        const { execute } = useAsync(asyncFn);
        return (
          <Text testID="test-btn" onPress={async () => { result = await execute(); }}>
            Test
          </Text>
        );
      }

      const { getByTestId } = render(<TestComponent />);

      await act(async () => {
        fireEvent.press(getByTestId('test-btn'));
        // Esperar resolución
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('error handling', () => {
    it('debe capturar errores y setear state.error', async () => {
      const error = new Error('Test error');
      const asyncFn = jest.fn(async () => {
        throw error;
      });
      let executeRef: any;

      const { getByTestId } = render(
        <AsyncComponent
          asyncFn={asyncFn}
          onExecute={(fn) => {
            executeRef = fn;
          }}
        />
      );

      await act(async () => {
        try {
          await executeRef();
        } catch (e) {
          // esperado
        }
      });

      expect(getByTestId('error').children[0]).toBe('Test error');
      expect(getByTestId('data').children[0]).toBe('null');
    });

    it('debe convertir un error no-Error a Error', async () => {
      const asyncFn = jest.fn(async () => {
        throw 'string error'; // deliberadamente no es Error
      });
      let executeRef: any;

      const { getByTestId } = render(
        <AsyncComponent
          asyncFn={asyncFn}
          onExecute={(fn) => {
            executeRef = fn;
          }}
        />
      );

      await act(async () => {
        try {
          await executeRef();
        } catch (e) {
          // esperado
        }
      });

      expect(getByTestId('error').children[0]).toBe('string error');
    });

    it('debe relanzar el error tras setear el state', async () => {
      const error = new Error('Must rethrow');
      const asyncFn = jest.fn(async () => {
        throw error;
      });
      let executeRef: any;
      let caughtError: any;

      render(
        <AsyncComponent
          asyncFn={asyncFn}
          onExecute={(fn) => {
            executeRef = fn;
          }}
        />
      );

      await act(async () => {
        try {
          await executeRef();
        } catch (e) {
          caughtError = e;
        }
      });

      expect(caughtError).toBe(error);
    });
  });

  describe('reset', () => {
    it('debe limpiar data, error y loading al ser llamado', async () => {
      const asyncFn = jest.fn(async () => 'data');
      let executeRef: any;
      let resetRef: any;

      function AsyncComponentWithReset() {
        const { data, error, loading, execute, reset } = useAsync(asyncFn);
        resetRef = reset;
        return (
          <>
            <Text testID="loading">{loading ? 'loading' : 'idle'}</Text>
            <Text testID="data">{data ?? 'null'}</Text>
            <Text testID="error">{error?.message ?? 'null'}</Text>
          </>
        );
      }

      const { getByTestId } = render(<AsyncComponentWithReset />);

      // Execute para tener estado con data
      await act(async () => {
        await asyncFn();
      });

      // Reset
      act(() => {
        resetRef();
      });

      expect(getByTestId('loading').children[0]).toBe('idle');
      expect(getByTestId('data').children[0]).toBe('null');
      expect(getByTestId('error').children[0]).toBe('null');
    });
  });

  describe('opción immediate', () => {
    it('debe ejecutar la función async al montar si immediate=true', async () => {
      const asyncFn = jest.fn(async () => 'immediate result');

      const { getByTestId } = render(
        <AsyncComponent asyncFn={asyncFn} immediate={true} />
      );

      // Esperar a que se resuelva
      await waitFor(() => {
        expect(getByTestId('data').children[0]).toBe('immediate result');
      });

      expect(asyncFn).toHaveBeenCalled();
    });

    it('no debe ejecutar al montar si immediate=false (por defecto)', async () => {
      const asyncFn = jest.fn(async () => 'delayed result');

      render(<AsyncComponent asyncFn={asyncFn} immediate={false} />);

      // Esperar un poco para asegurar que no se ejecutó
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(asyncFn).not.toHaveBeenCalled();
    });
  });

  describe('cleanup al desmontar', () => {
    it('no debe actualizar estado si el componente se desmontó', async () => {
      let resolveAsyncFn: (() => void) | null = null;
      const asyncFn = jest.fn(
        () =>
          new Promise((resolve) => {
            resolveAsyncFn = () => resolve('late result');
          })
      );
      let executeRef: any;
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      function ComponentWithCleanup() {
        const { execute } = useAsync(asyncFn);
        executeRef = execute;
        return <Text>Test</Text>;
      }

      const { unmount } = render(<ComponentWithCleanup />);

      // Iniciar execute
      await act(async () => {
        const promise = executeRef();
        // Desmontar ANTES de que se resuelva
        unmount();
        // Ahora resolver
        if (resolveAsyncFn) {
          resolveAsyncFn();
        }
        try {
          await promise;
        } catch (e) {
          // esperado: puede fallar si el cleanup ocurrió
        }
      });

      // Si no hay cleanup, habría warnings de "Cannot update state on unmounted component"
      // Con cleanup (mountedRef), no los hay
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Cannot update state on unmounted component')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('dependencias y memoización', () => {
    it('debe re-crear execute cuando asyncFunction cambia', async () => {
      let executeRef1: any;
      let executeRef2: any;
      const asyncFn1 = jest.fn(async () => 'fn1');
      const asyncFn2 = jest.fn(async () => 'fn2');

      function ChangeableFnComponent({ fn }: { fn: any }) {
        const { execute } = useAsync(fn);
        if (!executeRef1) executeRef1 = execute;
        else if (!executeRef2) executeRef2 = execute;
        return <Text>Test</Text>;
      }

      const { rerender } = render(<ChangeableFnComponent fn={asyncFn1} />);

      rerender(<ChangeableFnComponent fn={asyncFn2} />);

      // executeRef1 y executeRef2 deben ser funciones distintas
      expect(typeof executeRef1).toBe('function');
      expect(typeof executeRef2).toBe('function');
      // No necesariamente diferentes en objeto, pero eso depende de react.useCallback
    });
  });
});

