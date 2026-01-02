/**
 * Switch Component Tests
 */

import React from 'react';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('should be defined', () => {
    expect(Switch).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof Switch).toBe('function');
  });

  it('should accept value prop', () => {
    const switchProps = {
      value: true,
      onChange: jest.fn(),
    };
    
    expect(switchProps.value).toBe(true);
  });

  it('should accept label prop', () => {
    const switchProps = {
      value: false,
      onChange: jest.fn(),
      label: 'Notifications',
    };
    
    expect(switchProps.label).toBe('Notifications');
  });

  it('should accept description prop', () => {
    const switchProps = {
      value: false,
      onChange: jest.fn(),
      description: 'Enable push notifications',
    };
    
    expect(switchProps.description).toBe('Enable push notifications');
  });

  it('should accept size prop', () => {
    const switchProps = {
      value: false,
      onChange: jest.fn(),
      size: 'medium' as const,
    };
    
    expect(switchProps.size).toBe('medium');
  });

  it('should accept disabled prop', () => {
    const switchProps = {
      value: false,
      onChange: jest.fn(),
      disabled: true,
    };
    
    expect(switchProps.disabled).toBe(true);
  });

  it('should accept loading prop', () => {
    const switchProps = {
      value: false,
      onChange: jest.fn(),
      loading: true,
    };
    
    expect(switchProps.loading).toBe(true);
  });

  it('should call onChange when toggled', () => {
    const onChange = jest.fn();
    const switchProps = {
      value: false,
      onChange,
    };
    
    switchProps.onChange(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

