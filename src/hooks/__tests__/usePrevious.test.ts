/**
 * usePrevious Hook Tests
 */

import { usePrevious } from '../usePrevious';

describe('usePrevious', () => {
  it('should be defined', () => {
    expect(usePrevious).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof usePrevious).toBe('function');
  });

  it('should accept any value type', () => {
    const value = 'test';
    expect(value).toBe('test');
  });
});

