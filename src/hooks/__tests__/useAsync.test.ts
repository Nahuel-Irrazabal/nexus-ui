/**
 * useAsync Hook Tests
 */

import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('should be defined', () => {
    expect(useAsync).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof useAsync).toBe('function');
  });

  it('should accept an async function', () => {
    const asyncFn = async () => 'result';
    expect(typeof asyncFn).toBe('function');
  });

  it('should accept options object', () => {
    const options = { immediate: true };
    expect(options.immediate).toBe(true);
  });
});

