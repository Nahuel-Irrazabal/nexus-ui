/**
 * createTheme Tests
 * Cubre los 3 niveles de personalización descritos en createTheme.ts:
 *  - Nivel 1: primaryColor (paleta predefinida)
 *  - Nivel 2: light/dark (colores custom por tema, incl. claves desconocidas)
 *  - Nivel 3 (parcial acá): components (input/text) combinado con los niveles 1 y 2
 */

import { createTheme, defaultLightTheme, defaultDarkTheme } from '../createTheme';
import { defaultInputTheme } from '../inputTheme';
import { defaultTextTheme } from '../textTheme';
import { palette } from '../../tokens/colors';

describe('createTheme', () => {
  describe('sin config', () => {
    it('devuelve los defaults exactos de light y dark', () => {
      const { light, dark } = createTheme();
      expect(light).toEqual(defaultLightTheme);
      expect(dark).toEqual(defaultDarkTheme);
    });

    it('devuelve los defaults exactos cuando config es undefined explícito', () => {
      const { light, dark } = createTheme(undefined);
      expect(light).toEqual(defaultLightTheme);
      expect(dark).toEqual(defaultDarkTheme);
    });
  });

  describe('Nivel 1 — primaryColor', () => {
    it('deriva primary/primaryLight/primaryDark de la paleta elegida para light', () => {
      const { light } = createTheme({ primaryColor: 'green' });
      expect(light.primary).toBe(palette.green[500]);
      expect(light.primaryLight).toBe(palette.green[300]);
      expect(light.primaryDark).toBe(palette.green[700]);
    });

    it('usa una escala distinta para dark (400/300/600) que para light (500/300/700)', () => {
      const { dark } = createTheme({ primaryColor: 'green' });
      expect(dark.primary).toBe(palette.green[400]);
      expect(dark.primaryLight).toBe(palette.green[300]);
      expect(dark.primaryDark).toBe(palette.green[600]);
    });

    it('conserva el resto de los valores default (surface, text, etc.) sin tocarlos', () => {
      const { light, dark } = createTheme({ primaryColor: 'green' });
      expect(light.surface).toBe(defaultLightTheme.surface);
      expect(light.text).toBe(defaultLightTheme.text);
      expect(dark.surface).toBe(defaultDarkTheme.surface);
    });

    it('cae a la paleta blue si primaryColor no existe en la paleta', () => {
      const { light } = createTheme({ primaryColor: 'not-a-color' as never });
      expect(light.primary).toBe(palette.blue[500]);
    });

    it('no altera components cuando no se pasa config.components', () => {
      const { light, dark } = createTheme({ primaryColor: 'orange' });
      expect(light.components).toEqual({ input: defaultInputTheme, text: defaultTextTheme });
      expect(dark.components).toEqual({ input: defaultInputTheme, text: defaultTextTheme });
    });

    it('mergea components cuando se combina primaryColor + components', () => {
      const { light } = createTheme({
        primaryColor: 'orange',
        components: { input: { borderRadius: 0 } },
      });
      expect(light.primary).toBe(palette.orange[500]);
      expect(light.components?.input?.borderRadius).toBe(0);
      // el resto del InputTheme sigue viniendo del default
      expect(light.components?.input?.paddingHorizontal).toBe(defaultInputTheme.paddingHorizontal);
    });
  });

  describe('Nivel 2 — light/dark colors', () => {
    it('sobrescribe solo las claves provistas en light, deja el resto del default intacto', () => {
      const { light } = createTheme({ light: { primary: '#FF0000', surface: '#EEEEEE' } });
      expect(light.primary).toBe('#FF0000');
      expect(light.surface).toBe('#EEEEEE');
      expect(light.text).toBe(defaultLightTheme.text);
      expect(light.error).toBe(defaultLightTheme.error);
    });

    it('sobrescribe dark independientemente de light', () => {
      const { light, dark } = createTheme({
        light: { primary: '#FF0000' },
        dark: { primary: '#00FF00' },
      });
      expect(light.primary).toBe('#FF0000');
      expect(dark.primary).toBe('#00FF00');
    });

    it('si solo se pasa light, dark queda igual al default (clonado)', () => {
      const { dark } = createTheme({ light: { primary: '#FF0000' } });
      expect(dark).toEqual(defaultDarkTheme);
      expect(dark).not.toBe(defaultDarkTheme);
    });

    it('copia claves custom desconocidas (ej. surfaceElevated) para exponerlas en theme.*', () => {
      const { light } = createTheme({ light: { surfaceElevated: '#F0F0F0' } as never });
      expect((light as unknown as Record<string, string>).surfaceElevated).toBe('#F0F0F0');
    });

    it('ignora valores no-string y la clave "components" dentro de light/dark (no pisa el objeto components)', () => {
      const { light } = createTheme({
        light: {
          // @ts-expect-error - se prueba deliberadamente un valor inválido
          components: { input: { borderRadius: 999 } },
          accent: 123 as unknown as string,
        },
      });
      expect(light.components).toEqual({ input: defaultInputTheme, text: defaultTextTheme });
      expect((light as unknown as Record<string, unknown>).accent).toBeUndefined();
    });

    it('mergea components sobre el resultado de light/dark colors', () => {
      const { light, dark } = createTheme({
        light: { primary: '#FF0000' },
        dark: { primary: '#00FF00' },
        components: { input: { borderWidth: 2 }, text: { variants: { title: { fontSize: 99 } } } },
      });
      expect(light.primary).toBe('#FF0000');
      expect(light.components?.input?.borderWidth).toBe(2);
      expect(light.components?.input?.borderRadius).toBe(defaultInputTheme.borderRadius);
      expect(light.components?.text?.variants?.title).toEqual({ fontSize: 99 });

      expect(dark.primary).toBe('#00FF00');
      expect(dark.components?.input?.borderWidth).toBe(2);
    });
  });

  describe('Nivel 3 parcial — solo components (sin light/dark/primaryColor)', () => {
    it('aplica components sobre ambos defaults sin tocar el resto de los colores', () => {
      const { light, dark } = createTheme({
        components: { input: { paddingHorizontal: 0 } },
      });
      expect(light.primary).toBe(defaultLightTheme.primary);
      expect(light.components?.input?.paddingHorizontal).toBe(0);
      expect(dark.primary).toBe(defaultDarkTheme.primary);
      expect(dark.components?.input?.paddingHorizontal).toBe(0);
    });

    it('mergea text.variants preservando defaultTextTheme.variants para las claves no pisadas', () => {
      const { light } = createTheme({
        components: { text: { variants: { body: { fontSize: 15 } } } },
      });
      expect(light.components?.text?.variants).toEqual({ body: { fontSize: 15 } });
    });
  });
});
