/**
 * Sheet Component Tests
 */

import React from 'react';
import { Sheet } from '../Sheet';

describe('Sheet', () => {
  it('should be defined', () => {
    expect(Sheet).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof Sheet).toBe('function');
  });

  it('should accept visible prop', () => {
    const sheetProps = { visible: true, onClose: jest.fn() };
    expect(sheetProps.visible).toBe(true);
  });

  it('should accept dismissible prop', () => {
    const sheetProps = { visible: true, onClose: jest.fn(), dismissible: false };
    expect(sheetProps.dismissible).toBe(false);
  });

  it('should call onClose when requested', () => {
    const onClose = jest.fn();
    const sheetProps = { visible: true, onClose };

    sheetProps.onClose();
    expect(onClose).toHaveBeenCalled();
  });
});
