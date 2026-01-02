/**
 * useTheme Hook Tests
 * Tests simplificados sin React Testing Library
 */

import { useTheme } from '../useTheme';
import { ThemeProvider } from '../../theme/ThemeProvider';
import React from 'react';

describe('useTheme', () => {
  it('should be defined', () => {
    expect(useTheme).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof useTheme).toBe('function');
  });

  it('ThemeProvider should be defined', () => {
    expect(ThemeProvider).toBeDefined();
  });

  it('ThemeProvider should be a component', () => {
    expect(typeof ThemeProvider).toBe('function');
  });
});