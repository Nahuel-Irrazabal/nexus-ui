/**
 * Z-Index Tokens Tests
 */

import { zIndex } from '../zIndex';

describe('zIndex', () => {
  it('has all required z-index levels', () => {
    expect(zIndex.behind).toBeDefined();
    expect(zIndex.base).toBeDefined();
    expect(zIndex.dropdown).toBeDefined();
    expect(zIndex.sticky).toBeDefined();
    expect(zIndex.overlay).toBeDefined();
    expect(zIndex.modal).toBeDefined();
    expect(zIndex.popover).toBeDefined();
    expect(zIndex.toast).toBeDefined();
    expect(zIndex.max).toBeDefined();
  });

  it('z-index values are in ascending order', () => {
    expect(zIndex.behind).toBe(-1);
    expect(zIndex.base).toBe(0);
    expect(zIndex.dropdown).toBe(10);
    expect(zIndex.sticky).toBe(20);
    expect(zIndex.overlay).toBe(30);
    expect(zIndex.modal).toBe(40);
    expect(zIndex.popover).toBe(50);
    expect(zIndex.toast).toBe(60);
    expect(zIndex.max).toBe(100);
  });

  it('z-index values respect stacking order', () => {
    expect(zIndex.behind).toBeLessThan(zIndex.base);
    expect(zIndex.base).toBeLessThan(zIndex.dropdown);
    expect(zIndex.dropdown).toBeLessThan(zIndex.sticky);
    expect(zIndex.sticky).toBeLessThan(zIndex.overlay);
    expect(zIndex.overlay).toBeLessThan(zIndex.modal);
    expect(zIndex.modal).toBeLessThan(zIndex.popover);
    expect(zIndex.popover).toBeLessThan(zIndex.toast);
    expect(zIndex.toast).toBeLessThan(zIndex.max);
  });

  it('all values are numbers', () => {
    Object.values(zIndex).forEach((value) => {
      expect(typeof value).toBe('number');
    });
  });
});
