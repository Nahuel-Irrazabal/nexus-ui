/**
 * @nexus-ui/design-system
 * Sistema de diseño modular para aplicaciones React Native
 * 
 * @example
 * ```ts
 * import { 
 *   useTheme, 
 *   Button, 
 *   Card, 
 *   ListItem, 
 *   spacing, 
 *   textVariants 
 * } from '@nexus-ui/design-system';
 * ```
 */

// Design Tokens (todos centralizados)
export * from './tokens';

// Theme System
export { ThemeProvider } from './theme/ThemeProvider';
export { createTheme, defaultLightTheme, defaultDarkTheme } from './theme/createTheme';
export { defineTheme } from './theme/defineTheme';
export type { Theme, ThemeConfig, ThemeColors, ThemeComponents, ThemeWithCustomColors } from './theme/createTheme';
export type { DefineThemeColors } from './theme/defineTheme';
export type { InputTheme } from './theme/inputTheme';
export { defaultInputTheme, underlineInputTheme } from './theme/inputTheme';
export type { TextTheme } from './theme/textTheme';
export { defaultTextTheme } from './theme/textTheme';
export type { ThemeMode, ThemeContextType } from './theme/ThemeProvider';

// Hooks
export * from './hooks';

// Components (organizados por categoría)
export * from './components';

// Utils
export * from './utils';
