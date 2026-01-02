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

/**
 * Colores personalizables de un tema
 */
export interface ThemeColors {
  /** Color primario principal */
  primary?: string;
  /** Variante clara del primario */
  primaryLight?: string;
  /** Variante oscura del primario */
  primaryDark?: string;
  /** Color secundario */
  secondary?: string;
  /** Variante clara del secundario */
  secondaryLight?: string;
  /** Variante oscura del secundario */
  secondaryDark?: string;
  /** Color de fondo principal */
  background?: string;
  /** Color de superficies (cards, modals) */
  surface?: string;
  /** Variante de superficie */
  surfaceVariant?: string;
  /** Color de texto principal */
  text?: string;
  /** Color de texto secundario */
  textSecondary?: string;
  /** Color de texto deshabilitado */
  textDisabled?: string;
  /** Color de bordes */
  border?: string;
  /** Color de divisores */
  divider?: string;
}

/**
 * Configuración de tema para una app
 * 
 * @example
 * // Nivel 1: Simple - Solo cambiar color primario
 * const config = { primaryColor: 'orange' };
 * 
 * @example
 * // Nivel 2: Medio - Personalización por tema
 * const config = {
 *   light: {
 *     primary: '#FF9800',
 *     background: '#FFFFFF',
 *     text: '#212121',
 *   },
 *   dark: {
 *     primary: '#FFB74D',
 *     background: '#0A0A0A',
 *     text: '#F5F5F5',
 *   }
 * };
 */
export interface ThemeConfig {
  /** 
   * NIVEL 1: Shortcut para usar una paleta predefinida
   * Valores disponibles: 'blue', 'green', 'purple', 'orange', 'red', 'yellow'
   * Se ignora si se especifican light/dark
   */
  primaryColor?: PaletteColor;
  
  /** 
   * NIVEL 2: Personalización completa del tema claro
   * Sobrescribe primaryColor si está definido
   */
  light?: ThemeColors;
  
  /** 
   * NIVEL 2: Personalización completa del tema oscuro
   * Sobrescribe primaryColor si está definido
   */
  dark?: ThemeColors;
}

/**
 * Tema por defecto (azul)
 */
export const defaultLightTheme = {
  // Primarios
  primary: palette.blue[500],
  primaryLight: palette.blue[300],
  primaryDark: palette.blue[700],
  
  // Secundarios
  secondary: palette.purple[500],
  secondaryLight: palette.purple[300],
  secondaryDark: palette.purple[700],
  
  // Superficies
  background: palette.neutral[0],
  surface: palette.neutral[50],
  surfaceVariant: palette.neutral[100],
  
  // Textos
  text: palette.neutral[900],
  textSecondary: palette.neutral[700],
  textDisabled: palette.neutral[500],
  
  // Bordes y divisores
  border: palette.neutral[300],
  divider: palette.neutral[200],
  
  // Estados
  success: palette.success.main,
  error: palette.error.main,
  warning: palette.warning.main,
  info: palette.info.main,
  
  // Efectos
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export const defaultDarkTheme = {
  // Primarios
  primary: palette.blue[400],
  primaryLight: palette.blue[300],
  primaryDark: palette.blue[600],
  
  // Secundarios
  secondary: palette.purple[400],
  secondaryLight: palette.purple[300],
  secondaryDark: palette.purple[600],
  
  // Superficies
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  
  // Textos
  text: palette.neutral[50],
  textSecondary: palette.neutral[300],
  textDisabled: palette.neutral[600],
  
  // Bordes y divisores
  border: palette.neutral[700],
  divider: palette.neutral[800],
  
  // Estados
  success: palette.success.light,
  error: palette.error.light,
  warning: palette.warning.light,
  info: palette.info.light,
  
  // Efectos
  shadow: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.7)',
} as const;

/**
 * Tipo de un tema - estructura completa de colores
 */
export interface Theme {
  // Primarios
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secundarios
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Superficies
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Textos
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Bordes y divisores
  border: string;
  divider: string;
  
  // Estados
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Efectos
  shadow: string;
  overlay: string;
}

/**
 * Crea temas personalizados para cada app
 * 
 * @example
 * // NIVEL 1: Simple - Solo cambiar color primario
 * const themes = createTheme({ primaryColor: 'orange' });
 * 
 * @example
 * // NIVEL 2: Medio - Personalización por tema
 * const themes = createTheme({
 *   light: {
 *     primary: '#FF9800',
 *     background: '#FFFFFF',
 *     text: '#212121',
 *   },
 *   dark: {
 *     primary: '#FFB74D',
 *     background: '#0A0A0A',
 *     text: '#F5F5F5',
 *   }
 * });
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
    return {
      light: mergeThemeColors(defaultLightTheme, config.light),
      dark: mergeThemeColors(defaultDarkTheme, config.dark),
    };
  }

  // Si solo hay primaryColor, usar paleta predefinida (NIVEL 1)
  if (config.primaryColor) {
    const primaryPalette = palette[config.primaryColor as keyof typeof palette] || palette.blue;

    return {
      light: {
        ...defaultLightTheme,
        primary: (primaryPalette as any)[500],
        primaryLight: (primaryPalette as any)[300],
        primaryDark: (primaryPalette as any)[700],
      },
      dark: {
        ...defaultDarkTheme,
        primary: (primaryPalette as any)[400],
        primaryLight: (primaryPalette as any)[300],
        primaryDark: (primaryPalette as any)[600],
      },
    };
  }

  // Fallback a default
  return { light: defaultLightTheme, dark: defaultDarkTheme };
}

/**
 * Helper para mergear colores personalizados con tema por defecto
 */
function mergeThemeColors(defaultTheme: typeof defaultLightTheme | typeof defaultDarkTheme, customColors?: ThemeColors): Theme {
  if (!customColors) {
    return { ...defaultTheme };
  }

  return {
    ...defaultTheme,
    ...(customColors.primary && { primary: customColors.primary }),
    ...(customColors.primaryLight && { primaryLight: customColors.primaryLight }),
    ...(customColors.primaryDark && { primaryDark: customColors.primaryDark }),
    ...(customColors.secondary && { secondary: customColors.secondary }),
    ...(customColors.secondaryLight && { secondaryLight: customColors.secondaryLight }),
    ...(customColors.secondaryDark && { secondaryDark: customColors.secondaryDark }),
    ...(customColors.background && { background: customColors.background }),
    ...(customColors.surface && { surface: customColors.surface }),
    ...(customColors.surfaceVariant && { surfaceVariant: customColors.surfaceVariant }),
    ...(customColors.text && { text: customColors.text }),
    ...(customColors.textSecondary && { textSecondary: customColors.textSecondary }),
    ...(customColors.textDisabled && { textDisabled: customColors.textDisabled }),
    ...(customColors.border && { border: customColors.border }),
    ...(customColors.divider && { divider: customColors.divider }),
  };
}
