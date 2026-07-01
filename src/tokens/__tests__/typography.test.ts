/**
 * Typography Tokens Tests
 */

import { fontSizes, textVariants } from '../typography';

describe('textVariants', () => {
  it('has all expected variants', () => {
    expect(textVariants.display).toBeDefined();
    expect(textVariants.h1).toBeDefined();
    expect(textVariants.h2).toBeDefined();
    expect(textVariants.h3).toBeDefined();
    expect(textVariants.subtitle).toBeDefined();
    expect(textVariants.title).toBeDefined();
    expect(textVariants.body).toBeDefined();
    expect(textVariants.button).toBeDefined();
    expect(textVariants.caption).toBeDefined();
    expect(textVariants.overline).toBeDefined();
  });

  it('keeps title/body/caption backward compatible', () => {
    expect(textVariants.title.fontSize).toBe(fontSizes.lg);
    expect(textVariants.body.fontSize).toBe(fontSizes.md);
    expect(textVariants.caption.fontSize).toBe(fontSizes.sm);
  });

  it('font sizes decrease from display down to overline', () => {
    expect(textVariants.display.fontSize).toBeGreaterThan(textVariants.h1.fontSize);
    expect(textVariants.h1.fontSize).toBeGreaterThan(textVariants.h2.fontSize);
    expect(textVariants.h2.fontSize).toBeGreaterThan(textVariants.h3.fontSize);
    expect(textVariants.h3.fontSize).toBeGreaterThanOrEqual(textVariants.subtitle.fontSize);
    expect(textVariants.subtitle.fontSize).toBeGreaterThan(textVariants.body.fontSize);
    expect(textVariants.body.fontSize).toBeGreaterThan(textVariants.caption.fontSize);
    expect(textVariants.caption.fontSize).toBeGreaterThan(textVariants.overline.fontSize);
  });

  it('subtitle and title share size but differ in weight', () => {
    expect(textVariants.subtitle.fontSize).toBe(textVariants.title.fontSize);
    expect(textVariants.subtitle.fontWeight).not.toBe(textVariants.title.fontWeight);
  });
});
