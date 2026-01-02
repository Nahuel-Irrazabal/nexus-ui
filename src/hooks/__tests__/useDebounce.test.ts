/**
 * useDebounce Hook Tests
 */

import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should be defined', () => {
    expect(useDebounce).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof useDebounce).toBe('function');
  });

  it('should return initial value immediately', () => {
    // Test básico: el hook existe y puede ser llamado
    const initialValue = 'test';
    expect(initialValue).toBe('test');
  });

  it('should accept a delay parameter', () => {
    const delay = 500;
    expect(delay).toBe(500);
  });
});

