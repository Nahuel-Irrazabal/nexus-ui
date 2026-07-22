/**
 * Animation Tokens Tests
 */

import { duration, easing, animations, createAnimation } from '../animations';

describe('duration', () => {
  it('has all required duration levels', () => {
    expect(duration.instant).toBeDefined();
    expect(duration.fast).toBeDefined();
    expect(duration.normal).toBeDefined();
    expect(duration.moderate).toBeDefined();
    expect(duration.slow).toBeDefined();
    expect(duration.slower).toBeDefined();
  });

  it('duration values are in ascending order', () => {
    expect(duration.instant).toBe(75);
    expect(duration.fast).toBe(150);
    expect(duration.normal).toBe(250);
    expect(duration.moderate).toBe(350);
    expect(duration.slow).toBe(500);
    expect(duration.slower).toBe(700);
  });

  it('all durations are positive numbers', () => {
    Object.values(duration).forEach((value) => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    });
  });
});

describe('easing', () => {
  it('has all required easing curves', () => {
    expect(easing.linear).toBeDefined();
    expect(easing.ease).toBeDefined();
    expect(easing.easeIn).toBeDefined();
    expect(easing.easeOut).toBeDefined();
    expect(easing.easeInOut).toBeDefined();
    expect(easing.sharp).toBeDefined();
    expect(easing.spring).toBeDefined();
  });

  it('easing values are arrays of 4 numbers', () => {
    Object.values(easing).forEach((curve) => {
      expect(Array.isArray(curve)).toBe(true);
      expect(curve).toHaveLength(4);
      curve.forEach((value) => {
        expect(typeof value).toBe('number');
      });
    });
  });

  it('linear curve has expected values', () => {
    expect(easing.linear).toEqual([0.0, 0.0, 1.0, 1.0]);
  });

  it('ease curve is different from linear', () => {
    expect(easing.ease).not.toEqual(easing.linear);
  });
});

describe('animations', () => {
  it('has all required animation presets', () => {
    expect(animations.fade).toBeDefined();
    expect(animations.slide).toBeDefined();
    expect(animations.scale).toBeDefined();
    expect(animations.bounce).toBeDefined();
    expect(animations.modal).toBeDefined();
    expect(animations.drawer).toBeDefined();
    expect(animations.toast).toBeDefined();
    expect(animations.ripple).toBeDefined();
  });

  it('all animation presets have duration and easing', () => {
    Object.values(animations).forEach((anim) => {
      expect(anim.duration).toBeDefined();
      expect(anim.easing).toBeDefined();
      expect(typeof anim.duration).toBe('number');
      expect(Array.isArray(anim.easing)).toBe(true);
    });
  });

  it('animations use valid duration values', () => {
    const validDurations = Object.values(duration);
    Object.values(animations).forEach((anim) => {
      expect(validDurations).toContain(anim.duration);
    });
  });

  it('modal and drawer use moderate duration', () => {
    expect(animations.modal.duration).toBe(duration.moderate);
    expect(animations.drawer.duration).toBe(duration.moderate);
  });

  it('fade and ripple use fast duration', () => {
    expect(animations.fade.duration).toBe(duration.fast);
    expect(animations.ripple.duration).toBe(duration.fast);
  });

  it('bounce uses spring easing', () => {
    expect(animations.bounce.easing).toEqual(easing.spring);
  });
});

describe('createAnimation', () => {
  it('returns animation config with default values', () => {
    const config = createAnimation();
    expect(config.duration).toBe(duration.normal);
    expect(config.easing).toEqual(easing.ease);
  });

  it('returns animation config with specified duration', () => {
    const config = createAnimation('fast');
    expect(config.duration).toBe(duration.fast);
    expect(config.easing).toEqual(easing.ease);
  });

  it('returns animation config with specified easing', () => {
    const config = createAnimation('normal', 'easeOut');
    expect(config.duration).toBe(duration.normal);
    expect(config.easing).toEqual(easing.easeOut);
  });

  it('returns animation config with both duration and easing', () => {
    const config = createAnimation('slow', 'easeInOut');
    expect(config.duration).toBe(duration.slow);
    expect(config.easing).toEqual(easing.easeInOut);
  });

  it('handles all duration keys', () => {
    Object.keys(duration).forEach((key) => {
      const config = createAnimation(key as any, 'ease');
      expect(config.duration).toBe(duration[key as keyof typeof duration]);
    });
  });

  it('handles all easing keys', () => {
    Object.keys(easing).forEach((key) => {
      const config = createAnimation('normal', key as any);
      expect(config.easing).toEqual(easing[key as keyof typeof easing]);
    });
  });
});
