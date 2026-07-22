/**
 * inputTheme Tests
 * Valores base tokenizados y el preset "underline" como override sobre el default.
 */

import { defaultInputTheme, underlineInputTheme, InputTheme } from '../inputTheme';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

describe('defaultInputTheme', () => {
  it('usa tokens de borderRadius/spacing, no valores hardcodeados', () => {
    expect(defaultInputTheme.borderRadius).toBe(borderRadius.md);
    expect(defaultInputTheme.paddingHorizontal).toBe(spacing.md);
    expect(defaultInputTheme.paddingVertical).toBe(spacing.md);
  });

  it('estilo "box": borde completo de 1px, sin borderBottomWidth propio', () => {
    expect(defaultInputTheme.borderWidth).toBe(1);
    expect(defaultInputTheme.borderBottomWidth).toBeUndefined();
    expect(defaultInputTheme.backgroundColor).toBeUndefined();
  });
});

describe('underlineInputTheme (override sobre defaultInputTheme)', () => {
  it('pisa borderRadius/borderWidth/borderBottomWidth/backgroundColor para el estilo underline', () => {
    expect(underlineInputTheme.borderRadius).toBe(0);
    expect(underlineInputTheme.borderWidth).toBe(0);
    expect(underlineInputTheme.borderBottomWidth).toBe(1);
    expect(underlineInputTheme.backgroundColor).toBe('transparent');
  });

  it('hereda del default todo lo que no pisa explícitamente (padding, font sizes)', () => {
    expect(underlineInputTheme.paddingHorizontal).toBe(defaultInputTheme.paddingHorizontal);
    expect(underlineInputTheme.paddingVertical).toBe(defaultInputTheme.paddingVertical);
    expect(underlineInputTheme.labelFontSize).toBe(defaultInputTheme.labelFontSize);
    expect(underlineInputTheme.labelFontWeight).toBe(defaultInputTheme.labelFontWeight);
    expect(underlineInputTheme.helperFontSize).toBe(defaultInputTheme.helperFontSize);
    expect(underlineInputTheme.inputFontSize).toBe(defaultInputTheme.inputFontSize);
  });

  it('no muta defaultInputTheme al construirse (son objetos independientes)', () => {
    const snapshotBefore: InputTheme = { ...defaultInputTheme };
    // tocar el preset no debería afectar al default
    expect(underlineInputTheme).not.toBe(defaultInputTheme);
    expect(defaultInputTheme).toEqual(snapshotBefore);
  });
});
