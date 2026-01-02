/**
 * useMediaQuery Hook
 * Responsive design basado en dimensiones de la pantalla
 */

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { breakpoints } from '../tokens/breakpoints';

type BreakpointKey = keyof typeof breakpoints;

export function useMediaQuery(query: string | BreakpointKey): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const checkMatch = ({ window }: { window: ScaledSize }) => {
      const width = window.width;
      
      // Si es una key de breakpoint, usar el valor del token
      if (query in breakpoints) {
        const breakpointValue = breakpoints[query as BreakpointKey];
        setMatches(width >= breakpointValue);
        return;
      }

      // Parsear query string simple (ej: "(min-width: 768px)")
      const minWidthMatch = query.match(/min-width:\s*(\d+)/);
      const maxWidthMatch = query.match(/max-width:\s*(\d+)/);

      let result = true;

      if (minWidthMatch) {
        const minWidth = parseInt(minWidthMatch[1], 10);
        result = result && width >= minWidth;
      }

      if (maxWidthMatch) {
        const maxWidth = parseInt(maxWidthMatch[1], 10);
        result = result && width <= maxWidth;
      }

      setMatches(result);
    };

    // Check inicial
    checkMatch({ window: Dimensions.get('window') });

    // Listener para cambios
    const subscription = Dimensions.addEventListener('change', checkMatch);

    return () => {
      subscription?.remove();
    };
  }, [query]);

  return matches;
}

// Helper hooks para breakpoints comunes
export function useIsMobile(): boolean {
  return useMediaQuery('sm');
}

export function useIsTablet(): boolean {
  const width = Dimensions.get('window').width;
  return width >= breakpoints.md && width < breakpoints.lg;
}

export function useIsDesktop(): boolean {
  return useMediaQuery('lg');
}

