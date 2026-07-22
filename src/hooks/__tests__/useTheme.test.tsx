/**
 * useTheme Hook Tests
 * El detalle de comportamiento del ThemeProvider (toggle, persistencia, niveles de
 * personalización) se cubre en src/theme/__tests__/ThemeProvider.test.tsx.
 * Acá se valida el contrato específico del hook: lectura del contexto y el error
 * cuando se usa fuera de un ThemeProvider.
 */

import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useTheme } from '../useTheme';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { defaultLightTheme } from '../../theme/createTheme';

describe('useTheme', () => {
  it('lanza un error descriptivo cuando se usa fuera de ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme debe usarse dentro de ThemeProvider'
    );
  });

  it('devuelve el theme, isDark y las funciones de control cuando está dentro de ThemeProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toEqual(defaultLightTheme);
    expect(result.current.isDark).toBe(false);
    expect(typeof result.current.toggleTheme).toBe('function');
    expect(typeof result.current.setTheme).toBe('function');
    expect(typeof result.current.setMode).toBe('function');
    expect(typeof result.current.followSystem).toBe('function');
  });

  it('refleja el themeConfig del ThemeProvider más cercano (no un singleton global)', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider themeConfig={{ primaryColor: 'green' }}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme.primary).not.toBe(defaultLightTheme.primary);
  });
});
