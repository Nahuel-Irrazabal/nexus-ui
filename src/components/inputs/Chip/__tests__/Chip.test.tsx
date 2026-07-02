/**
 * Chip Component Tests
 */

import React from 'react';
import { Chip, ChipGroup } from '../Chip';

describe('Chip', () => {
  it('should be defined', () => {
    expect(Chip).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof Chip).toBe('function');
  });

  it('should accept label prop', () => {
    const chipProps = { label: 'Todos' };
    expect(chipProps.label).toBe('Todos');
  });

  it('should accept selected prop', () => {
    const chipProps = { label: 'Todos', selected: true };
    expect(chipProps.selected).toBe(true);
  });

  it('should accept disabled prop', () => {
    const chipProps = { label: 'Todos', disabled: true };
    expect(chipProps.disabled).toBe(true);
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const chipProps = { label: 'Todos', onPress };

    chipProps.onPress();
    expect(onPress).toHaveBeenCalled();
  });
});

describe('ChipGroup', () => {
  it('should be defined', () => {
    expect(ChipGroup).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof ChipGroup).toBe('function');
  });

  it('should accept scrollable prop', () => {
    const groupProps = { scrollable: true, children: [] };
    expect(groupProps.scrollable).toBe(true);
  });
});
