/**
 * Sizes Tokens Tests
 */

import { iconSizes, avatarSizes, buttonSizes, inputSizes, touchTargets } from '../sizes';

describe('sizes', () => {
  describe('iconSizes', () => {
    it('has all required icon sizes', () => {
      expect(iconSizes.xs).toBeDefined();
      expect(iconSizes.sm).toBeDefined();
      expect(iconSizes.md).toBeDefined();
      expect(iconSizes.lg).toBeDefined();
      expect(iconSizes.xl).toBeDefined();
      expect(iconSizes.xxl).toBeDefined();
      expect(iconSizes.xxxl).toBeDefined();
      expect(iconSizes.huge).toBeDefined();
      expect(iconSizes.massive).toBeDefined();
    });

    it('icon sizes are in ascending order', () => {
      expect(iconSizes.xs).toBeLessThan(iconSizes.sm);
      expect(iconSizes.sm).toBeLessThan(iconSizes.md);
      expect(iconSizes.md).toBeLessThan(iconSizes.lg);
      expect(iconSizes.lg).toBeLessThan(iconSizes.xl);
      expect(iconSizes.xl).toBeLessThan(iconSizes.xxl);
      expect(iconSizes.xxl).toBeLessThan(iconSizes.xxxl);
      expect(iconSizes.xxxl).toBeLessThan(iconSizes.huge);
      expect(iconSizes.huge).toBeLessThan(iconSizes.massive);
    });

    it('icon sizes are positive numbers', () => {
      Object.values(iconSizes).forEach((size) => {
        expect(typeof size).toBe('number');
        expect(size).toBeGreaterThan(0);
      });
    });
  });

  describe('avatarSizes', () => {
    it('has all required avatar sizes', () => {
      expect(avatarSizes.xs).toBeDefined();
      expect(avatarSizes.sm).toBeDefined();
      expect(avatarSizes.md).toBeDefined();
      expect(avatarSizes.lg).toBeDefined();
      expect(avatarSizes.xl).toBeDefined();
      expect(avatarSizes.xxl).toBeDefined();
      expect(avatarSizes.xxxl).toBeDefined();
    });

    it('avatar sizes are in ascending order', () => {
      expect(avatarSizes.xs).toBeLessThan(avatarSizes.sm);
      expect(avatarSizes.sm).toBeLessThan(avatarSizes.md);
      expect(avatarSizes.md).toBeLessThan(avatarSizes.lg);
      expect(avatarSizes.lg).toBeLessThan(avatarSizes.xl);
      expect(avatarSizes.xl).toBeLessThan(avatarSizes.xxl);
      expect(avatarSizes.xxl).toBeLessThan(avatarSizes.xxxl);
    });

    it('avatar sizes match or exceed icon sizes at same scale level', () => {
      expect(avatarSizes.xs).toBeGreaterThanOrEqual(iconSizes.md);
      expect(avatarSizes.sm).toBeGreaterThanOrEqual(iconSizes.md);
    });
  });

  describe('buttonSizes', () => {
    it('has all required button sizes', () => {
      expect(buttonSizes.sm).toBeDefined();
      expect(buttonSizes.md).toBeDefined();
      expect(buttonSizes.lg).toBeDefined();
      expect(buttonSizes.xl).toBeDefined();
    });

    it('button sizes are in ascending order', () => {
      expect(buttonSizes.sm).toBeLessThan(buttonSizes.md);
      expect(buttonSizes.md).toBeLessThan(buttonSizes.lg);
      expect(buttonSizes.lg).toBeLessThan(buttonSizes.xl);
    });

    it('larger button sizes meet minimum touch target', () => {
      // md and above meet the 44px minimum
      expect(buttonSizes.md).toBeGreaterThanOrEqual(touchTargets.min);
      expect(buttonSizes.lg).toBeGreaterThanOrEqual(touchTargets.min);
      expect(buttonSizes.xl).toBeGreaterThanOrEqual(touchTargets.min);
    });
  });

  describe('inputSizes', () => {
    it('has all required input sizes', () => {
      expect(inputSizes.sm).toBeDefined();
      expect(inputSizes.md).toBeDefined();
      expect(inputSizes.lg).toBeDefined();
    });

    it('input sizes are in ascending order', () => {
      expect(inputSizes.sm).toBeLessThan(inputSizes.md);
      expect(inputSizes.md).toBeLessThan(inputSizes.lg);
    });

    it('larger input sizes meet minimum touch target', () => {
      // md and above meet the 44px minimum
      expect(inputSizes.md).toBeGreaterThanOrEqual(touchTargets.min);
      expect(inputSizes.lg).toBeGreaterThanOrEqual(touchTargets.min);
    });
  });

  describe('touchTargets', () => {
    it('has all required touch target sizes', () => {
      expect(touchTargets.min).toBeDefined();
      expect(touchTargets.comfortable).toBeDefined();
      expect(touchTargets.large).toBeDefined();
    });

    it('touch targets are in ascending order', () => {
      expect(touchTargets.min).toBeLessThan(touchTargets.comfortable);
      expect(touchTargets.comfortable).toBeLessThan(touchTargets.large);
    });

    it('touch targets meet accessibility minimum (44px)', () => {
      expect(touchTargets.min).toBeGreaterThanOrEqual(44);
    });

    it('all sizes are positive numbers', () => {
      Object.values(touchTargets).forEach((size) => {
        expect(typeof size).toBe('number');
        expect(size).toBeGreaterThan(0);
      });
    });
  });
});
