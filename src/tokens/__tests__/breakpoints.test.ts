/**
 * Breakpoints Tokens Tests
 */

import { breakpoints, getCurrentBreakpoint, isBreakpointUp, isBreakpointDown, isBreakpointBetween } from '../breakpoints';

// Mock react-native Dimensions
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: 800, height: 600 })),
  },
}));

import { Dimensions } from 'react-native';

describe('breakpoints', () => {
  it('has all required breakpoint values', () => {
    expect(breakpoints.xs).toBeDefined();
    expect(breakpoints.sm).toBeDefined();
    expect(breakpoints.md).toBeDefined();
    expect(breakpoints.lg).toBeDefined();
    expect(breakpoints.xl).toBeDefined();
    expect(breakpoints['2xl']).toBeDefined();
  });

  it('breakpoint values are in ascending order', () => {
    expect(breakpoints.xs).toBe(375);
    expect(breakpoints.sm).toBe(480);
    expect(breakpoints.md).toBe(768);
    expect(breakpoints.lg).toBe(1024);
    expect(breakpoints.xl).toBe(1280);
    expect(breakpoints['2xl']).toBe(1536);
  });

  it('all breakpoint values are positive numbers', () => {
    Object.values(breakpoints).forEach((value) => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    });
  });

  it('breakpoint values are in ascending order comparison', () => {
    expect(breakpoints.xs).toBeLessThan(breakpoints.sm);
    expect(breakpoints.sm).toBeLessThan(breakpoints.md);
    expect(breakpoints.md).toBeLessThan(breakpoints.lg);
    expect(breakpoints.lg).toBeLessThan(breakpoints.xl);
    expect(breakpoints.xl).toBeLessThan(breakpoints['2xl']);
  });
});

describe('getCurrentBreakpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns xs for very small widths', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 300, height: 600 });
    expect(getCurrentBreakpoint()).toBe('xs');
  });

  it('returns sm for small widths', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 400, height: 600 });
    expect(getCurrentBreakpoint()).toBe('sm');
  });

  it('returns md for tablet widths', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 750, height: 600 });
    expect(getCurrentBreakpoint()).toBe('md');
  });

  it('returns lg for large widths', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 1000, height: 600 });
    expect(getCurrentBreakpoint()).toBe('lg');
  });

  it('returns xl for extra large widths', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 1200, height: 600 });
    expect(getCurrentBreakpoint()).toBe('xl');
  });

  it('returns 2xl for very large widths', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 1600, height: 600 });
    expect(getCurrentBreakpoint()).toBe('2xl');
  });

  it('handles edge case at breakpoint boundaries', () => {
    // At exactly xs boundary
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 375, height: 600 });
    expect(getCurrentBreakpoint()).toBe('sm');

    // Just below xs
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 374, height: 600 });
    expect(getCurrentBreakpoint()).toBe('xs');
  });
});

describe('isBreakpointUp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns true when width is greater than or equal to breakpoint', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 800, height: 600 });
    expect(isBreakpointUp('md')).toBe(true);
    expect(isBreakpointUp('sm')).toBe(true);
  });

  it('returns false when width is less than breakpoint', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 500, height: 600 });
    expect(isBreakpointUp('lg')).toBe(false);
    expect(isBreakpointUp('md')).toBe(false);
  });

  it('returns true at exact breakpoint boundary', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 768, height: 600 });
    expect(isBreakpointUp('md')).toBe(true);
  });

  it('works with all breakpoint keys', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 2000, height: 600 });
    expect(isBreakpointUp('xs')).toBe(true);
    expect(isBreakpointUp('sm')).toBe(true);
    expect(isBreakpointUp('md')).toBe(true);
    expect(isBreakpointUp('lg')).toBe(true);
    expect(isBreakpointUp('xl')).toBe(true);
    expect(isBreakpointUp('2xl')).toBe(true);
  });
});

describe('isBreakpointDown', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns true when width is less than breakpoint', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 600, height: 600 });
    expect(isBreakpointDown('lg')).toBe(true);
    expect(isBreakpointDown('xl')).toBe(true);
  });

  it('returns false when width is greater than or equal to breakpoint', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 1000, height: 600 });
    expect(isBreakpointDown('md')).toBe(false);
    expect(isBreakpointDown('sm')).toBe(false);
  });

  it('returns false at exact breakpoint boundary', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 768, height: 600 });
    expect(isBreakpointDown('md')).toBe(false);
  });

  it('works with all breakpoint keys', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 100, height: 600 });
    expect(isBreakpointDown('xs')).toBe(true);
    expect(isBreakpointDown('sm')).toBe(true);
    expect(isBreakpointDown('md')).toBe(true);
    expect(isBreakpointDown('lg')).toBe(true);
    expect(isBreakpointDown('xl')).toBe(true);
    expect(isBreakpointDown('2xl')).toBe(true);
  });
});

describe('isBreakpointBetween', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns true when width is within range', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 800, height: 600 });
    expect(isBreakpointBetween('md', 'lg')).toBe(true);
  });

  it('returns false when width is below range', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 600, height: 600 });
    expect(isBreakpointBetween('md', 'lg')).toBe(false);
  });

  it('returns false when width is above range', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 1200, height: 600 });
    expect(isBreakpointBetween('md', 'lg')).toBe(false);
  });

  it('returns true at lower boundary', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 768, height: 600 });
    expect(isBreakpointBetween('md', 'lg')).toBe(true);
  });

  it('returns false at upper boundary (exclusive)', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 1024, height: 600 });
    expect(isBreakpointBetween('md', 'lg')).toBe(false);
  });

  it('works with different breakpoint combinations', () => {
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 600, height: 600 });
    expect(isBreakpointBetween('sm', 'md')).toBe(true);
    expect(isBreakpointBetween('sm', 'lg')).toBe(true);

    (Dimensions.get as jest.Mock).mockReturnValue({ width: 1300, height: 600 });
    expect(isBreakpointBetween('xl', '2xl')).toBe(true);
  });

  it('handles range with exclusive upper bound', () => {
    // When min and max are different, upper bound is exclusive
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 768, height: 600 });
    expect(isBreakpointBetween('md', 'lg')).toBe(true);

    // At the exact upper bound (exclusive), should be false
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 1024, height: 600 });
    expect(isBreakpointBetween('md', 'lg')).toBe(false);
  });
});
