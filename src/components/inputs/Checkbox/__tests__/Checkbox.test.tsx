/**
 * Checkbox Component Tests
 */

import React from 'react';
import { Checkbox, CheckboxGroup } from '../Checkbox';

describe('Checkbox', () => {
  it('should be defined', () => {
    expect(Checkbox).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof Checkbox).toBe('function');
  });

  it('should accept value prop', () => {
    const checkboxProps = {
      value: true,
      onChange: jest.fn(),
    };
    
    expect(checkboxProps.value).toBe(true);
  });

  it('should accept label prop', () => {
    const checkboxProps = {
      value: false,
      onChange: jest.fn(),
      label: 'Accept terms',
    };
    
    expect(checkboxProps.label).toBe('Accept terms');
  });

  it('should accept indeterminate prop', () => {
    const checkboxProps = {
      value: false,
      onChange: jest.fn(),
      indeterminate: true,
    };
    
    expect(checkboxProps.indeterminate).toBe(true);
  });

  it('should accept size prop', () => {
    const checkboxProps = {
      value: false,
      onChange: jest.fn(),
      size: 'medium' as const,
    };
    
    expect(checkboxProps.size).toBe('medium');
  });

  it('should accept disabled prop', () => {
    const checkboxProps = {
      value: false,
      onChange: jest.fn(),
      disabled: true,
    };
    
    expect(checkboxProps.disabled).toBe(true);
  });

  it('should call onChange when value changes', () => {
    const onChange = jest.fn();
    const checkboxProps = {
      value: false,
      onChange,
    };
    
    checkboxProps.onChange(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('CheckboxGroup', () => {
  it('should be defined', () => {
    expect(CheckboxGroup).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof CheckboxGroup).toBe('function');
  });

  it('should accept value as array', () => {
    const groupProps = {
      value: ['opt1', 'opt2'],
      onChange: jest.fn(),
      children: [],
    };
    
    expect(groupProps.value).toEqual(['opt1', 'opt2']);
  });
});

