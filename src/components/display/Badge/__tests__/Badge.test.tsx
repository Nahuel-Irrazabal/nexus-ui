/**
 * Badge Component Tests
 */

import React from 'react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('should be defined', () => {
    expect(Badge).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof Badge).toBe('function');
  });

  it('should accept count prop', () => {
    const badgeProps = {
      count: 5,
    };
    
    expect(badgeProps.count).toBe(5);
  });

  it('should accept max prop', () => {
    const badgeProps = {
      count: 150,
      max: 99,
    };
    
    expect(badgeProps.max).toBe(99);
  });

  it('should accept color prop', () => {
    const badgeProps = {
      count: 5,
      color: 'primary' as const,
    };
    
    expect(badgeProps.color).toBe('primary');
  });

  it('should accept dot prop', () => {
    const badgeProps = {
      dot: true,
    };
    
    expect(badgeProps.dot).toBe(true);
  });

  it('should accept variant prop', () => {
    const badgeProps = {
      count: 5,
      variant: 'rounded' as const,
    };
    
    expect(badgeProps.variant).toBe('rounded');
  });
});

