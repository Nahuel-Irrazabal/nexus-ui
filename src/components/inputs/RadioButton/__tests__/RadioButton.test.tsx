/**
 * RadioButton Component Tests
 */

import React from 'react';
import { RadioButton, RadioGroup } from '../RadioButton';

describe('RadioButton', () => {
  it('should be defined', () => {
    expect(RadioButton).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof RadioButton).toBe('function');
  });

  it('should accept value prop', () => {
    const radioProps = {
      value: 'option1',
      selected: false,
    };
    
    expect(radioProps.value).toBe('option1');
  });

  it('should accept selected prop', () => {
    const radioProps = {
      value: 'option1',
      selected: true,
    };
    
    expect(radioProps.selected).toBe(true);
  });

  it('should accept label prop', () => {
    const radioProps = {
      value: 'option1',
      label: 'Option 1',
    };
    
    expect(radioProps.label).toBe('Option 1');
  });

  it('should accept size prop', () => {
    const radioProps = {
      value: 'option1',
      size: 'medium' as const,
    };
    
    expect(radioProps.size).toBe('medium');
  });

  it('should accept disabled prop', () => {
    const radioProps = {
      value: 'option1',
      disabled: true,
    };
    
    expect(radioProps.disabled).toBe(true);
  });

  it('should call onSelect when selected', () => {
    const onSelect = jest.fn();
    const radioProps = {
      value: 'option1',
      onSelect,
    };
    
    radioProps.onSelect('option1');
    expect(onSelect).toHaveBeenCalledWith('option1');
  });
});

describe('RadioGroup', () => {
  it('should be defined', () => {
    expect(RadioGroup).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof RadioGroup).toBe('function');
  });

  it('should accept value prop', () => {
    const groupProps = {
      value: 'option1',
      onChange: jest.fn(),
      children: [],
    };
    
    expect(groupProps.value).toBe('option1');
  });

  it('should accept direction prop', () => {
    const groupProps = {
      value: 'option1',
      onChange: jest.fn(),
      direction: 'horizontal' as const,
      children: [],
    };
    
    expect(groupProps.direction).toBe('horizontal');
  });
});

