/**
 * Factory para crear temas customizados
 * Permite que cada app tenga su propia paleta de colores
 * 
 * Soporta 3 niveles de personalización:
 * 1. Simple: Solo primaryColor (usa paleta predefinida)
 * 2. Medio: Personalización separada para light y dark
 * 3. Avanzado: Usar defineTheme() para control total
 */

import { palette, PaletteColor } from '../tokens/colors';
import type { InputTheme } from './inputTheme';
import { defaultInputTheme } from './inputTheme';
import type { TextTheme } from './textTheme';
import { defaultTextTheme } from './textTheme';

/**
 * Colores personalizables de un tema.
 * Podés usar las claves conocidas (primary, background, text, etc.) o cualquier otra;
 * el merge copia al tema todas las entradas cuyo valor es string.
 */
export type ThemeColors = Partial<Record<string, string>>;

/**
 * Estilos de componentes opcionales (Input, Text, etc.)
 * Cada app puede definir el look por defecto vía theme
 */
export interface ThemeComponents {
  input?: Partial<InputTheme>;
  text?: Partial<TextTheme>;
}

/**
 * Configuración de tema para una app
 * 
 * @example
 * // Nivel 1: Simple - Solo cambiar color primario
 * const config = { primaryColor: 'orange' };
 *
 */
export interface ThemeConfig {
  primaryColor?: PaletteColor;
  
  light?: ThemeColors;
  
  dark?: ThemeColors;
  
  components?: ThemeComponents;
}


export const defaultLightTheme = {
  primary: palette.blue[500],
  primaryLight: palette.blue[300],
  primaryDark: palette.blue[700],
  
  secondary: palette.purple[500],
  secondaryLight: palette.purple[300],
  secondaryDark: palette.purple[700],
  
  background: palette.neutral[0],
  surface: palette.neutral[50],
  surfaceVariant: palette.neutral[100],
  
  text: palette.neutral[900],
  textSecondary: palette.neutral[700],
  textDisabled: palette.neutral[500],
  
  border: palette.neutral[300],
  divider: palette.neutral[200],
  
  success: palette.success.main,
  error: palette.error.main,
  warning: palette.warning.main,
  info: palette.info.main,
  
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Componentes (Input, Text, etc.)
  components: { input: defaultInputTheme, text: defaultTextTheme },
} as const;

export const defaultDarkTheme = {
  primary: palette.blue[400],
  primaryLight: palette.blue[300],
  primaryDark: palette.blue[600],
  
  secondary: palette.purple[400],
  secondaryLight: palette.purple[300],
  secondaryDark: palette.purple[600],
  
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  
  text: palette.neutral[50],
  textSecondary: palette.neutral[300],
  textDisabled: palette.neutral[600],
  
  border: palette.neutral[700],
  divider: palette.neutral[800],
  
  success: palette.success.light,
  error: palette.error.light,
  warning: palette.warning.light,
  info: palette.info.light,
  
  shadow: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Componentes (Input, Text, etc.)
  components: { input: defaultInputTheme, text: defaultTextTheme },
} as const;

export interface Theme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  background: string;
  surface: string;
  surfaceVariant: string;
  
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  border: string;
  divider: string;
  
  success: string;
  error: string;
  warning: string;
  info: string;
  
  shadow: string;
  overlay: string;
  
  /** Estilos de componentes (Input, etc.) opcionales */
  components?: ThemeComponents;
}

/**
 * Tema tal como lo expone useTheme(): incluye claves custom en la raíz.
 * Cualquier clave extra que definas en defineTheme (surfaceLight, borderSecondary, etc.)
 * se infiere como string | undefined, listo para backgroundColor, color, etc.
 */
export type ThemeWithCustomColors = Omit<Theme, 'components'> &
  Record<string, string | undefined> &
  Pick<Theme, 'components'>;

/**
 * Crea temas personalizados para cada app
 * 
 * @example
 * // NIVEL 1: Simple - Solo cambiar color primario
 * const themes = createTheme({ primaryColor: 'orange' });
 *
 */
export function createTheme(config?: ThemeConfig): {
  light: Theme;
  dark: Theme;
} {
  // Si no hay config, usar default
  if (!config) {
    return { light: defaultLightTheme, dark: defaultDarkTheme };
  }

  // Si hay personalización light/dark, usarla (NIVEL 2)
  if (config.light || config.dark) {
    const lightTheme = mergeThemeColors(defaultLightTheme, config.light);
    const darkTheme = mergeThemeColors(defaultDarkTheme, config.dark);
    if (config.components) {
      lightTheme.components = mergeThemeComponents(defaultLightTheme.components, config.components);
      darkTheme.components = mergeThemeComponents(defaultDarkTheme.components, config.components);
    }
    return { light: lightTheme, dark: darkTheme };
  }

  // Si solo hay primaryColor, usar paleta predefinida (NIVEL 1)
  if (config.primaryColor) {
    const primaryPalette = palette[config.primaryColor as keyof typeof palette] || palette.blue;
    const lightTheme: Theme = {
      ...defaultLightTheme,
      primary: (primaryPalette as Record<string, string>)[500],
      primaryLight: (primaryPalette as Record<string, string>)[300],
      primaryDark: (primaryPalette as Record<string, string>)[700],
    };
    const darkTheme: Theme = {
      ...defaultDarkTheme,
      primary: (primaryPalette as Record<string, string>)[400],
      primaryLight: (primaryPalette as Record<string, string>)[300],
      primaryDark: (primaryPalette as Record<string, string>)[600],
    };
    if (config.components) {
      lightTheme.components = mergeThemeComponents(defaultLightTheme.components, config.components);
      darkTheme.components = mergeThemeComponents(defaultDarkTheme.components, config.components);
    }
    return { light: lightTheme, dark: darkTheme };
  }

  // Si solo hay components (sin light/dark), aplicar a defaults
  if (config.components) {
    const lightTheme: Theme = { ...defaultLightTheme };
    const darkTheme: Theme = { ...defaultDarkTheme };
    lightTheme.components = mergeThemeComponents(defaultLightTheme.components, config.components);
    darkTheme.components = mergeThemeComponents(defaultDarkTheme.components, config.components);
    return { light: lightTheme, dark: darkTheme };
  }

  // Fallback a default
  return { light: defaultLightTheme, dark: defaultDarkTheme };
}

/**
 * Merge de estilos de componentes (input, text, etc.)
 */
function mergeThemeComponents(
  base: Theme['components'],
  custom: ThemeComponents
): ThemeComponents {
  const mergedText: TextTheme = {
    ...defaultTextTheme,
    variants: {
      ...(defaultTextTheme.variants ?? {}),
      ...(base?.text?.variants ?? {}),
      ...(custom.text?.variants ?? {}),
    },
  };
  return {
    ...base,
    ...custom,
    input: {
      ...defaultInputTheme,
      ...(base?.input ?? {}),
      ...(custom.input ?? {}),
    },
    text: mergedText,
  };
}

/**
 * Helper para mergear colores personalizados con tema por defecto.
 * Cualquier clave con valor string en customColors se copia al tema (incl. custom como surfaceElevated).
 */
function mergeThemeColors(defaultTheme: typeof defaultLightTheme | typeof defaultDarkTheme, customColors?: ThemeColors): Theme {
  if (!customColors) {
    return { ...defaultTheme };
  }
  const result = { ...defaultTheme } as Theme & Record<string, string>;
  for (const [key, value] of Object.entries(customColors)) {
    if (key !== 'components' && typeof value === 'string') {
      result[key] = value;
    }
  }
  return result;
}
