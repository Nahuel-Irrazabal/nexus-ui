/**
 * useAsync Hook
 * Maneja el estado de operaciones asíncronas
 */

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAsyncOptions {
  immediate?: boolean;
}

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseAsyncReturn<T, Args extends any[]> extends UseAsyncState<T> {
  execute: (...args: Args) => Promise<T | undefined>;
  reset: () => void;
}

export function useAsync<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T, Args> {
  const { immediate = false } = options;
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  // Referencia para evitar actualizaciones de estado si el componente se desmonta
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setState({ data: null, error: null, loading: true });

      try {
        const response = await asyncFunction(...args);
        
        if (mountedRef.current) {
          setState({ data: response, error: null, loading: false });
        }
        
        return response;
      } catch (error) {
        if (mountedRef.current) {
          setState({
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
            loading: false,
          });
        }
        
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  // Ejecutar inmediatamente si la opción está habilitada
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    execute,
    reset,
  };
}

