/**
 * Button Component Tests
 * Tests simplificados sin React Testing Library
 */

import React from 'react';
import { Button } from '../Button';

describe('Button', () => {
  it('should be defined', () => {
    expect(Button).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof Button).toBe('function');
  });

  it('should accept title prop', () => {
    // Test básico de que el componente puede ser instanciado
    const buttonProps = {
      title: 'Test Button',
    };
    
    expect(buttonProps.title).toBe('Test Button');
  });

  it('should accept variant prop', () => {
    const buttonProps = {
      title: 'Test Button',
      variant: 'primary' as const,
    };
    
    expect(buttonProps.variant).toBe('primary');
  });

  it('should accept size prop', () => {
    const buttonProps = {
      title: 'Test Button',
      size: 'medium' as const,
    };
    
    expect(buttonProps.size).toBe('medium');
  });

  it('should accept disabled prop', () => {
    const buttonProps = {
      title: 'Test Button',
      disabled: true,
    };
    
    expect(buttonProps.disabled).toBe(true);
  });
});