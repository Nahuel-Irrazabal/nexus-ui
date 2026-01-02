/**
 * Shadow Tokens Tests
 */

import { shadows, darkShadows, getShadow } from '../shadows';

describe('shadows', () => {
  it('has all required shadow sizes', () => {
    expect(shadows.none).toBeDefined();
    expect(shadows.sm).toBeDefined();
    expect(shadows.md).toBeDefined();
    expect(shadows.lg).toBeDefined();
    expect(shadows.xl).toBeDefined();
    expect(shadows['2xl']).toBeDefined();
  });

  it('none shadow has zero values', () => {
    expect(shadows.none.shadowOpacity).toBe(0);
    expect(shadows.none.shadowRadius).toBe(0);
    expect(shadows.none.elevation).toBe(0);
  });

  it('shadow elevation increases with size', () => {
    expect(shadows.sm.elevation).toBeLessThan(shadows.md.elevation);
    expect(shadows.md.elevation).toBeLessThan(shadows.lg.elevation);
    expect(shadows.lg.elevation).toBeLessThan(shadows.xl.elevation);
    expect(shadows.xl.elevation).toBeLessThan(shadows['2xl'].elevation);
  });

  it('dark shadows have higher opacity', () => {
    expect(darkShadows.md.shadowOpacity).toBeGreaterThan(shadows.md.shadowOpacity);
    expect(darkShadows.lg.shadowOpacity).toBeGreaterThan(shadows.lg.shadowOpacity);
  });

  it('getShadow returns correct shadow for light mode', () => {
    const shadow = getShadow('md', false);
    expect(shadow).toEqual(shadows.md);
  });

  it('getShadow returns correct shadow for dark mode', () => {
    const shadow = getShadow('md', true);
    expect(shadow).toEqual(darkShadows.md);
  });

  it('getShadow returns default size when not specified', () => {
    const shadow = getShadow();
    expect(shadow).toEqual(shadows.md);
  });
});

