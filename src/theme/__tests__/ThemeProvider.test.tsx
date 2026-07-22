/**
 * ThemeProvider Tests
 * Cubre: provisión del theme vía contexto (leído por useTheme), modo 'auto' siguiendo
 * al sistema, toggle/set explícito, persistencia en AsyncStorage y override total
 * con lightTheme/darkTheme custom.
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../../hooks/useTheme';
import { defaultLightTheme, defaultDarkTheme, Theme } from '../createTheme';

const mockUseColorScheme = useColorScheme as jest.Mock;
const mockGetItem = AsyncStorage.getItem as jest.Mock;

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    mockUseColorScheme.mockReturnValue('light');
    mockGetItem.mockResolvedValue(null);
  });

  it('useTheme() lanza fuera de un ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme debe usarse dentro de ThemeProvider'
    );
  });

  it('provee el theme claro por defecto cuando el sistema está en light y el modo es auto', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.mode).toBe('auto');
    expect(result.current.isDark).toBe(false);
    expect(result.current.theme).toEqual(defaultLightTheme);
  });

  it('sigue al sistema en modo auto: sistema dark => theme oscuro', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.isDark).toBe(true);
    expect(result.current.theme).toEqual(defaultDarkTheme);
  });

  it('toggleTheme cambia de light a dark y actualiza el theme expuesto', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.isDark).toBe(false);

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.theme).toEqual(defaultDarkTheme);
  });

  it('toggleTheme invierte de nuevo a light en la segunda llamada', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.toggleTheme();
    });
    expect(result.current.isDark).toBe(true);

    await act(async () => {
      result.current.toggleTheme();
    });
    expect(result.current.isDark).toBe(false);
    expect(result.current.mode).toBe('light');
  });

  it('setTheme fija el modo explícito, dejando de seguir al sistema', async () => {
    mockUseColorScheme.mockReturnValue('light');
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.setTheme('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.followingSystem).toBe(false);
    expect(result.current.isDark).toBe(true);
  });

  it('followSystem vuelve a modo auto y sigue al sistema otra vez', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.setTheme('dark');
    });
    expect(result.current.followingSystem).toBe(false);

    await act(async () => {
      result.current.followSystem();
    });
    expect(result.current.mode).toBe('auto');
    expect(result.current.followingSystem).toBe(true);
    expect(result.current.isDark).toBe(false); // sistema mockeado en 'light'
  });

  it('persiste el modo en AsyncStorage al hacer setMode/toggleTheme', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@nexus-ui/theme-mode', 'dark');
  });

  it('carga el modo persistido desde AsyncStorage al montar', async () => {
    mockGetItem.mockResolvedValue('dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('ignora un valor persistido inválido y mantiene el modo auto', async () => {
    mockGetItem.mockResolvedValue('not-a-valid-mode');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.mode).toBe('auto');
  });

  it('expone systemTheme con el valor crudo de useColorScheme', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.systemTheme).toBe('dark');
  });

  it('themeConfig (nivel 1) se propaga al theme leído por useTheme', () => {
    const configWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider themeConfig={{ primaryColor: 'green' }}>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper: configWrapper });
    expect(result.current.theme.primary).not.toBe(defaultLightTheme.primary);
  });

  it('lightTheme/darkTheme custom completos tienen prioridad sobre themeConfig', () => {
    const customLight: Theme = { ...defaultLightTheme, primary: '#ABCDEF' };
    const customDark: Theme = { ...defaultDarkTheme, primary: '#FEDCBA' };
    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider
        themeConfig={{ primaryColor: 'green' }}
        lightTheme={customLight}
        darkTheme={customDark}
      >
        {children}
      </ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });
    expect(result.current.theme.primary).toBe('#ABCDEF');
  });
});
