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
export type { Theme, ThemeConfig, ThemeColors } from './theme/createTheme';
export type { DefineThemeColors } from './theme/defineTheme';
export type { ThemeMode, ThemeContextType } from './theme/ThemeProvider';

// Hooks
export * from './hooks';

// Components (organizados por categoría)
export * from './components';

// Utils
export * from './utils';
