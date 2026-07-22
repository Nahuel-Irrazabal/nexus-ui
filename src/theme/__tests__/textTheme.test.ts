/**
 * textTheme Tests
 * Baseline del tema de texto (sin overrides) usado como "base" en los merges
 * de createTheme/defineTheme.
 */

import { defaultTextTheme, TextTheme } from '../textTheme';

describe('defaultTextTheme', () => {
  it('no trae overrides propios: variants arranca vacío', () => {
    expect(defaultTextTheme.variants).toEqual({});
  });

  it('variants admite tanto TextVariant conocidas como claves custom (ej. heading)', () => {
    const custom: TextTheme = {
      variants: {
        title: { fontSize: 20 },
        heading: { fontSize: 30, fontWeight: '700' },
      },
    };
    expect(custom.variants?.title).toEqual({ fontSize: 20 });
    expect(custom.variants?.heading).toEqual({ fontSize: 30, fontWeight: '700' });
  });

  it('es un objeto independiente en cada import (no se comparte por referencia entre merges)', () => {
    const copy = { ...defaultTextTheme, variants: { ...defaultTextTheme.variants } };
    copy.variants!.title = { fontSize: 999 };
    expect(defaultTextTheme.variants?.title).toBeUndefined();
  });
});
