/**
 * Spacing Tokens Tests
 */

import { spacing, getSpacing } from '../spacing';

describe('spacing', () => {
  it('has all required spacing values', () => {
    expect(spacing.xxs).toBe(2);
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(12);
    expect(spacing.lg).toBe(16);
    expect(spacing.xl).toBe(20);
    expect(spacing.xxl).toBe(24);
    expect(spacing.xxxl).toBe(32);
    expect(spacing.huge).toBe(40);
    expect(spacing.massive).toBe(48);
    expect(spacing.giant).toBe(64);
  });

  it('getSpacing returns correct values', () => {
    expect(getSpacing('md')).toBe(12);
    expect(getSpacing('lg')).toBe(16);
    expect(getSpacing('xl')).toBe(20);
  });

  it('getSpacing with number returns the number', () => {
    expect(getSpacing(10)).toBe(10);
    expect(getSpacing(25)).toBe(25);
  });

  it('spacing values are in ascending order', () => {
    const values = Object.values(spacing);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

