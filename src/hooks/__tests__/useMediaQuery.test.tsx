/**
 * useMediaQuery Hook Tests
 * El mock global de react-native (jest.setup.js) fija Dimensions en
 * 375x667 y no captura el listener de 'change', así que este archivo
 * sobreescribe el mock localmente para controlar el ancho y simular
 * cambios de tamaño de pantalla.
 */

import { act, renderHook } from '@testing-library/react-native';

type ChangeCallback = (payload: { window: { width: number; height: number } }) => void;

let currentWidth = 375;
const changeListeners: ChangeCallback[] = [];
const removeMocks: jest.Mock[] = [];

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: currentWidth, height: 667 })),
    addEventListener: jest.fn((_eventName: string, cb: ChangeCallback) => {
      changeListeners.push(cb);
      const remove = jest.fn();
      removeMocks.push(remove);
      return { remove };
    }),
  },
}));

function fireResize(width: number) {
  changeListeners.forEach((cb) => cb({ window: { width, height: 800 } }));
}

import { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from '../useMediaQuery';
import { breakpoints } from '../../tokens/breakpoints';

describe('useMediaQuery', () => {
  beforeEach(() => {
    currentWidth = 375;
    changeListeners.length = 0;
    removeMocks.length = 0;
  });

  it('con una key de breakpoint, matchea cuando el ancho es >= al breakpoint', () => {
    currentWidth = breakpoints.md; // exactamente en el límite
    const { result } = renderHook(() => useMediaQuery('md'));
    expect(result.current).toBe(true);
  });

  it('con una key de breakpoint, no matchea por debajo del breakpoint', () => {
    currentWidth = breakpoints.md - 1;
    const { result } = renderHook(() => useMediaQuery('md'));
    expect(result.current).toBe(false);
  });

  it('parsea un query string de min-width', () => {
    currentWidth = 800;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('un query de min-width no matchea por debajo del mínimo', () => {
    currentWidth = 700;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('parsea un query string de max-width', () => {
    currentWidth = 400;
    const { result } = renderHook(() => useMediaQuery('(max-width: 480px)'));
    expect(result.current).toBe(true);
  });

  it('un query de max-width no matchea por encima del máximo', () => {
    currentWidth = 500;
    const { result } = renderHook(() => useMediaQuery('(max-width: 480px)'));
    expect(result.current).toBe(false);
  });

  it('combina min-width y max-width con AND', () => {
    const query = '(min-width: 400px) (max-width: 900px)';

    currentWidth = 600;
    expect(renderHook(() => useMediaQuery(query)).result.current).toBe(true);

    currentWidth = 300;
    expect(renderHook(() => useMediaQuery(query)).result.current).toBe(false);

    currentWidth = 950;
    expect(renderHook(() => useMediaQuery(query)).result.current).toBe(false);
  });

  it('reacciona a cambios de tamaño de pantalla vía el listener de Dimensions', () => {
    currentWidth = 375;
    const { result } = renderHook(() => useMediaQuery('md'));
    expect(result.current).toBe(false);

    act(() => {
      fireResize(800);
    });

    expect(result.current).toBe(true);
  });

  it('recalcula el match si cambia la query entre renders', () => {
    const { result, rerender } = renderHook(({ query }: { query: string }) => useMediaQuery(query), {
      initialProps: { query: 'md' },
    });
    currentWidth = 375;
    expect(result.current).toBe(false);

    currentWidth = 1024;
    rerender({ query: 'lg' });
    expect(result.current).toBe(true);
  });

  it('remueve la suscripción de Dimensions al desmontar', () => {
    const { unmount } = renderHook(() => useMediaQuery('md'));
    expect(removeMocks[0]).not.toHaveBeenCalled();

    unmount();

    expect(removeMocks[0]).toHaveBeenCalledTimes(1);
  });

  it('useIsMobile matchea el breakpoint sm', () => {
    currentWidth = breakpoints.sm;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    currentWidth = breakpoints.sm - 1;
    const { result: result2 } = renderHook(() => useIsMobile());
    expect(result2.current).toBe(false);
  });

  it('useIsTablet es true solo entre breakpoints.md y breakpoints.lg', () => {
    currentWidth = breakpoints.md;
    expect(renderHook(() => useIsTablet()).result.current).toBe(true);

    currentWidth = breakpoints.lg;
    expect(renderHook(() => useIsTablet()).result.current).toBe(false);

    currentWidth = breakpoints.md - 1;
    expect(renderHook(() => useIsTablet()).result.current).toBe(false);
  });

  it('useIsDesktop matchea el breakpoint lg', () => {
    currentWidth = breakpoints.lg;
    expect(renderHook(() => useIsDesktop()).result.current).toBe(true);

    currentWidth = breakpoints.lg - 1;
    expect(renderHook(() => useIsDesktop()).result.current).toBe(false);
  });
});
