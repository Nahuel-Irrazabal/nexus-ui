/**
 * Border Radius Tokens Tests
 */

import { borderRadius, getBorderRadius } from '../borderRadius';

describe('borderRadius', () => {
  it('has all required border radius sizes', () => {
    expect(borderRadius.none).toBeDefined();
    expect(borderRadius.xs).toBeDefined();
    expect(borderRadius.sm).toBeDefined();
    expect(borderRadius.md).toBeDefined();
    expect(borderRadius.lg).toBeDefined();
    expect(borderRadius.xl).toBeDefined();
    expect(borderRadius['2xl']).toBeDefined();
    expect(borderRadius['3xl']).toBeDefined();
    expect(borderRadius.full).toBeDefined();
  });

  it('border radius values are in ascending order', () => {
    expect(borderRadius.none).toBe(0);
    expect(borderRadius.xs).toBe(2);
    expect(borderRadius.sm).toBe(4);
    expect(borderRadius.md).toBe(8);
    expect(borderRadius.lg).toBe(12);
    expect(borderRadius.xl).toBe(16);
    expect(borderRadius['2xl']).toBe(20);
    expect(borderRadius['3xl']).toBe(24);
    expect(borderRadius.full).toBe(999);
  });

  it('border radius values increase progressively', () => {
    expect(borderRadius.xs).toBeGreaterThan(borderRadius.none);
    expect(borderRadius.sm).toBeGreaterThan(borderRadius.xs);
    expect(borderRadius.md).toBeGreaterThan(borderRadius.sm);
    expect(borderRadius.lg).toBeGreaterThan(borderRadius.md);
    expect(borderRadius.xl).toBeGreaterThan(borderRadius.lg);
    expect(borderRadius['2xl']).toBeGreaterThan(borderRadius.xl);
    expect(borderRadius['3xl']).toBeGreaterThan(borderRadius['2xl']);
    expect(borderRadius.full).toBeGreaterThan(borderRadius['3xl']);
  });

  it('all border radius values are non-negative numbers', () => {
    Object.values(borderRadius).forEach((value) => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('getBorderRadius', () => {
  it('returns correct radius for each size', () => {
    expect(getBorderRadius('none')).toBe(0);
    expect(getBorderRadius('xs')).toBe(2);
    expect(getBorderRadius('sm')).toBe(4);
    expect(getBorderRadius('md')).toBe(8);
    expect(getBorderRadius('lg')).toBe(12);
    expect(getBorderRadius('xl')).toBe(16);
    expect(getBorderRadius('2xl')).toBe(20);
    expect(getBorderRadius('3xl')).toBe(24);
    expect(getBorderRadius('full')).toBe(999);
  });

  it('returns default (md) radius when no size specified', () => {
    expect(getBorderRadius()).toBe(borderRadius.md);
  });

  it('returns default (md) radius when undefined specified', () => {
    expect(getBorderRadius(undefined)).toBe(borderRadius.md);
  });

  it('always returns a number', () => {
    Object.keys(borderRadius).forEach((key) => {
      const result = getBorderRadius(key as keyof typeof borderRadius);
      expect(typeof result).toBe('number');
    });
  });
});
