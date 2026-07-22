/**
 * Utilidades de color.
 *
 * No es parte del API público (no se re-exporta desde `src/utils/index.ts`):
 * es soporte interno para componentes que necesitan resolver un color de
 * alto contraste sobre un `color` custom pasado por el consumidor (ej.
 * Checkbox). No hay librería de parseo de color en el repo, así que el
 * soporte de formatos es intencionalmente acotado (ver `parseColorToRgb`).
 */
import { palette } from '../tokens/colors';

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Set acotado de named colors CSS/RN más comunes. No pretende ser exhaustivo. */
const NAMED_COLORS: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  aqua: '#00FFFF',
  magenta: '#FF00FF',
  fuchsia: '#FF00FF',
  gray: '#808080',
  grey: '#808080',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  brown: '#A52A2A',
  navy: '#000080',
  teal: '#008080',
  lime: '#00FF00',
  maroon: '#800000',
  olive: '#808000',
  silver: '#C0C0C0',
  gold: '#FFD700',
};

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
const RGB_PATTERN = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/;

/**
 * Parsea un color a componentes RGB (0-255). Soporta hex (#rgb/#rgba/
 * #rrggbb/#rrggbbaa), `rgb()`/`rgba()` y un set acotado de named colors.
 * Devuelve `null` si no puede parsearlo (HSL, named colors fuera del set,
 * variables de sistema, etc.) en vez de intentar adivinar.
 */
export function parseColorToRgb(color: string): Rgb | null {
  const value = color.trim().toLowerCase();

  if (NAMED_COLORS[value]) {
    return parseColorToRgb(NAMED_COLORS[value]);
  }

  const hexMatch = value.match(HEX_PATTERN);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgbMatch = value.match(RGB_PATTERN);
  if (rgbMatch) {
    return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) };
  }

  return null;
}

/** Luminancia relativa WCAG 2.x (con corrección gamma sRGB por canal). */
function relativeLuminance({ r, g, b }: Rgb): number {
  const linearize = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Umbral de cruce donde el contraste con negro (L=0) y con blanco (L=1) se
 * igualan, derivado de la fórmula de contraste WCAG: (L+0.05)/0.05 = 1.05/(L+0.05).
 */
const LUMINANCE_THRESHOLD = 0.179;

/**
 * Devuelve un color de alto contraste (blanco o negro, tokenizados desde
 * `palette.neutral`) para pintar contenido encima de `backgroundColor`.
 *
 * Si `backgroundColor` no se puede parsear, devuelve `fallback` sin intentar
 * adivinar (evita comportamiento sorpresivo con colores no soportados).
 */
export function getContrastColor(backgroundColor: string, fallback: string): string {
  const rgb = parseColorToRgb(backgroundColor);
  if (!rgb) return fallback;

  const luminance = relativeLuminance(rgb);
  return luminance > LUMINANCE_THRESHOLD ? palette.neutral[1000] : palette.neutral[0];
}
