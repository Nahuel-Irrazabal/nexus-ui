/**
 * defineTheme Tests
 * Nivel 3: control total sobre light y dark, con defaults inteligentes por campo faltante,
 * merge de components (input/text) y claves custom en la raíz.
 */

import { defineTheme } from '../defineTheme';
import { defaultLightTheme, defaultDarkTheme } from '../createTheme';
import { defaultInputTheme } from '../inputTheme';

describe('defineTheme', () => {
  it('usa los valores provistos y cae a los defaults de cada tema para los campos faltantes', () => {
    const { lightTheme, darkTheme } = defineTheme({
      light: { primary: '#FF9800', text: '#212121' },
      dark: { primary: '#FFB74D' },
    });

    expect(lightTheme.primary).toBe('#FF9800');
    expect(lightTheme.text).toBe('#212121');
    // no especificado en light -> default de light (no de dark)
    expect(lightTheme.background).toBe(defaultLightTheme.background);
    expect(lightTheme.secondary).toBe(defaultLightTheme.secondary);

    expect(darkTheme.primary).toBe('#FFB74D');
    // no especificado en dark -> default de dark (no el light custom)
    expect(darkTheme.text).toBe(defaultDarkTheme.text);
    expect(darkTheme.background).toBe(defaultDarkTheme.background);
  });

  it('light y dark son independientes entre sí (pisar uno no afecta al otro)', () => {
    const { lightTheme, darkTheme } = defineTheme({
      light: { primary: '#000000' },
      dark: {},
    });
    expect(lightTheme.primary).toBe('#000000');
    expect(darkTheme.primary).toBe(defaultDarkTheme.primary);
  });

  it('cubre los 4 estados semánticos (success/warning/error/info) con default si no se especifican', () => {
    const { lightTheme } = defineTheme({ light: {}, dark: {} });
    expect(lightTheme.success).toBe(defaultLightTheme.success);
    expect(lightTheme.warning).toBe(defaultLightTheme.warning);
    expect(lightTheme.error).toBe(defaultLightTheme.error);
    expect(lightTheme.info).toBe(defaultLightTheme.info);
  });

  it('copia claves custom desconocidas (ej. accent) a la raíz del theme resultante', () => {
    const { lightTheme, darkTheme } = defineTheme({
      light: { accent: '#123456' },
      dark: { accent: '#654321' },
    });
    expect((lightTheme as unknown as Record<string, string>).accent).toBe('#123456');
    expect((darkTheme as unknown as Record<string, string>).accent).toBe('#654321');
  });

  it('no copia como clave custom valores no-string (ej. objetos)', () => {
    const { lightTheme } = defineTheme({
      light: { weirdConfig: { nested: true } as unknown as string },
      dark: {},
    });
    expect((lightTheme as unknown as Record<string, unknown>).weirdConfig).toBeUndefined();
  });

  describe('merge de components.input', () => {
    it('cuando no se pasa components, usa el default del tema base tal cual', () => {
      const { lightTheme } = defineTheme({ light: {}, dark: {} });
      expect(lightTheme.components?.input).toEqual(defaultInputTheme);
    });

    it('el custom pisa solo las claves provistas, el resto sigue siendo defaultInputTheme', () => {
      const { lightTheme } = defineTheme({
        light: { components: { input: { borderRadius: 0, borderWidth: 0, borderBottomWidth: 1 } } },
        dark: {},
      });
      expect(lightTheme.components?.input?.borderRadius).toBe(0);
      expect(lightTheme.components?.input?.borderBottomWidth).toBe(1);
      expect(lightTheme.components?.input?.paddingHorizontal).toBe(defaultInputTheme.paddingHorizontal);
      expect(lightTheme.components?.input?.inputFontSize).toBe(defaultInputTheme.inputFontSize);
    });

    it('light y dark pueden tener overrides de input distintos', () => {
      const { lightTheme, darkTheme } = defineTheme({
        light: { components: { input: { borderRadius: 0 } } },
        dark: { components: { input: { borderRadius: 20 } } },
      });
      expect(lightTheme.components?.input?.borderRadius).toBe(0);
      expect(darkTheme.components?.input?.borderRadius).toBe(20);
    });
  });

  describe('merge de components.text', () => {
    it('sin components, variants queda como el default ({})', () => {
      const { lightTheme } = defineTheme({ light: {}, dark: {} });
      expect(lightTheme.components?.text?.variants).toEqual({});
    });

    it('agrega/pisa variantes provistas sin descartar el resto del objeto variants', () => {
      const { lightTheme } = defineTheme({
        light: {
          components: {
            text: { variants: { title: { fontSize: 22, fontWeight: '700' }, caption: { fontSize: 10 } } },
          },
        },
        dark: {},
      });
      expect(lightTheme.components?.text?.variants).toEqual({
        title: { fontSize: 22, fontWeight: '700' },
        caption: { fontSize: 10 },
      });
    });
  });
});
