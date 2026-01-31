/**
 * Helper avanzado para definir temas personalizados completos
 * 
 * Este helper proporciona máxima flexibilidad para crear temas desde cero,
 * con defaults inteligentes y type-safety completo.
 * 
 * @module theme/defineTheme
 */

import { Theme, defaultLightTheme, defaultDarkTheme, ThemeComponents } from './createTheme';
import type { InputTheme } from './inputTheme';
import { defaultInputTheme } from './inputTheme';

/**
 * Opciones completas para definir un tema
 * Todos los campos son opcionales - se usan defaults inteligentes
 */
export interface DefineThemeColors {
  // Colores primarios
  primary?: string;
  primaryLight?: string;
  primaryDark?: string;
  
  // Colores secundarios
  secondary?: string;
  secondaryLight?: string;
  secondaryDark?: string;
  
  // Superficies
  background?: string;
  surface?: string;
  surfaceVariant?: string;
  
  // Textos
  text?: string;
  textSecondary?: string;
  textDisabled?: string;
  
  // Bordes y divisores
  border?: string;
  divider?: string;
  
  // Estados (opcionales - se mantienen defaults si no se especifican)
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  
  // Efectos
  shadow?: string;
  overlay?: string;
  
  /** Estilos de componentes (Input, etc.) opcionales */
  components?: ThemeComponents;

  /** Claves custom por app (ej. borderSecondary, accent). Se copian al tema resultante. */
  [key: string]: string | ThemeComponents | undefined;
}

/**
 * NIVEL 3: Helper avanzado para definir temas personalizados completos
 * 
 * Proporciona control total sobre ambos temas (light y dark) con defaults inteligentes.
 * Los campos no especificados heredan valores sensibles del tema por defecto.
 * 
 * @param light - Configuración del tema claro
 * @param dark - Configuración del tema oscuro
 * @returns Objeto con lightTheme y darkTheme listos para usar con ThemeProvider
 * 
 * @example
 * ```typescript
 * import { defineTheme } from '@nexus-ui/design-system';
 * 
 * export const myAppTheme = defineTheme({
 *   light: {
 *     primary: '#FF9800',
 *     primaryLight: '#FFB74D',
 *     primaryDark: '#F57C00',
 *     background: '#FFFFFF',
 *     surface: '#F5F5F5',
 *     text: '#212121',
 *     textSecondary: '#616161',
 *   },
 *   dark: {
 *     primary: '#FFB74D',
 *     primaryLight: '#FFCC80',
 *     primaryDark: '#FB8C00',
 *     background: '#0A0A0A',
 *     surface: '#1A1A1A',
 *     text: '#F5F5F5',
 *     textSecondary: '#BDBDBD',
 *   }
 * });
 * 
 * // En App.tsx
 * <ThemeProvider {...myAppTheme}>
 *   <MyApp />
 * </ThemeProvider>
 * ```
 */
function mergeInputTheme(base: InputTheme | undefined, custom: Partial<InputTheme> | undefined): InputTheme {
  return { ...defaultInputTheme, ...base, ...custom };
}

export function defineTheme(config: {
  light: DefineThemeColors;
  dark: DefineThemeColors;
}): {
  lightTheme: Theme;
  darkTheme: Theme;
} {
  const lightComponents = config.light.components
    ? { input: mergeInputTheme(defaultLightTheme.components?.input, config.light.components.input) }
    : defaultLightTheme.components;
  const darkComponents = config.dark.components
    ? { input: mergeInputTheme(defaultDarkTheme.components?.input, config.dark.components.input) }
    : defaultDarkTheme.components;

  const knownThemeKeys = new Set([
    'primary', 'primaryLight', 'primaryDark', 'secondary', 'secondaryLight', 'secondaryDark',
    'background', 'surface', 'surfaceVariant', 'text', 'textSecondary', 'textDisabled',
    'border', 'divider', 'success', 'error', 'warning', 'info', 'shadow', 'overlay', 'components',
  ]);

  const lightTheme: Theme = {
    // Primarios
    primary: config.light.primary || defaultLightTheme.primary,
    primaryLight: config.light.primaryLight || defaultLightTheme.primaryLight,
    primaryDark: config.light.primaryDark || defaultLightTheme.primaryDark,
    
    // Secundarios
    secondary: config.light.secondary || defaultLightTheme.secondary,
    secondaryLight: config.light.secondaryLight || defaultLightTheme.secondaryLight,
    secondaryDark: config.light.secondaryDark || defaultLightTheme.secondaryDark,
    
    // Superficies
    background: config.light.background || defaultLightTheme.background,
    surface: config.light.surface || defaultLightTheme.surface,
    surfaceVariant: config.light.surfaceVariant || defaultLightTheme.surfaceVariant,
    
    // Textos
    text: config.light.text || defaultLightTheme.text,
    textSecondary: config.light.textSecondary || defaultLightTheme.textSecondary,
    textDisabled: config.light.textDisabled || defaultLightTheme.textDisabled,
    
    // Bordes y divisores
    border: config.light.border || defaultLightTheme.border,
    divider: config.light.divider || defaultLightTheme.divider,
    
    // Estados
    success: config.light.success || defaultLightTheme.success,
    error: config.light.error || defaultLightTheme.error,
    warning: config.light.warning || defaultLightTheme.warning,
    info: config.light.info || defaultLightTheme.info,
    
    // Efectos
    shadow: config.light.shadow || defaultLightTheme.shadow,
    overlay: config.light.overlay || defaultLightTheme.overlay,
    
    // Componentes
    components: lightComponents,
  };

  // Claves custom en la raíz (surfaceLight, borderSecondary, etc.) para theme.surfaceLight
  for (const key of Object.keys(config.light)) {
    if (!knownThemeKeys.has(key)) {
      const value = (config.light as Record<string, unknown>)[key];
      if (typeof value === 'string') (lightTheme as unknown as Record<string, unknown>)[key] = value;
    }
  }

  const darkTheme: Theme = {
    // Primarios
    primary: config.dark.primary || defaultDarkTheme.primary,
    primaryLight: config.dark.primaryLight || defaultDarkTheme.primaryLight,
    primaryDark: config.dark.primaryDark || defaultDarkTheme.primaryDark,
    
    // Secundarios
    secondary: config.dark.secondary || defaultDarkTheme.secondary,
    secondaryLight: config.dark.secondaryLight || defaultDarkTheme.secondaryLight,
    secondaryDark: config.dark.secondaryDark || defaultDarkTheme.secondaryDark,
    
    // Superficies
    background: config.dark.background || defaultDarkTheme.background,
    surface: config.dark.surface || defaultDarkTheme.surface,
    surfaceVariant: config.dark.surfaceVariant || defaultDarkTheme.surfaceVariant,
    
    // Textos
    text: config.dark.text || defaultDarkTheme.text,
    textSecondary: config.dark.textSecondary || defaultDarkTheme.textSecondary,
    textDisabled: config.dark.textDisabled || defaultDarkTheme.textDisabled,
    
    // Bordes y divisores
    border: config.dark.border || defaultDarkTheme.border,
    divider: config.dark.divider || defaultDarkTheme.divider,
    
    // Estados
    success: config.dark.success || defaultDarkTheme.success,
    error: config.dark.error || defaultDarkTheme.error,
    warning: config.dark.warning || defaultDarkTheme.warning,
    info: config.dark.info || defaultDarkTheme.info,
    
    // Efectos
    shadow: config.dark.shadow || defaultDarkTheme.shadow,
    overlay: config.dark.overlay || defaultDarkTheme.overlay,
    
    // Componentes
    components: darkComponents,
  };

  for (const key of Object.keys(config.dark)) {
    if (!knownThemeKeys.has(key)) {
      const value = (config.dark as Record<string, unknown>)[key];
      if (typeof value === 'string') (darkTheme as unknown as Record<string, unknown>)[key] = value;
    }
  }

  return { lightTheme, darkTheme };
}

