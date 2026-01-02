/**
 * Animation Tokens
 * Duraciones y easings consistentes para animaciones
 */

/**
 * Duraciones de animación (en ms)
 * Basado en Material Design motion system
 */
export const duration = {
  /** Transiciones muy rápidas (75ms) - micro interacciones */
  instant: 75,
  
  /** Transiciones rápidas (150ms) - hover, ripple */
  fast: 150,
  
  /** Transiciones normales (250ms) - la mayoría de transiciones */
  normal: 250,
  
  /** Transiciones moderadas (350ms) - modales, drawers */
  moderate: 350,
  
  /** Transiciones lentas (500ms) - transiciones complejas */
  slow: 500,
  
  /** Transiciones muy lentas (700ms) - efectos especiales */
  slower: 700,
} as const;

/**
 * Easing functions
 * Curvas de animación para diferentes tipos de movimiento
 */
export const easing = {
  /** Linear - Sin aceleración */
  linear: [0.0, 0.0, 1.0, 1.0],
  
  /** Ease - Aceleración suave */
  ease: [0.25, 0.1, 0.25, 1.0],
  
  /** Ease In - Comienza lento */
  easeIn: [0.42, 0.0, 1.0, 1.0],
  
  /** Ease Out - Termina lento */
  easeOut: [0.0, 0.0, 0.58, 1.0],
  
  /** Ease In Out - Comienza y termina lento */
  easeInOut: [0.42, 0.0, 0.58, 1.0],
  
  /** Sharp - Movimiento rápido y decidido */
  sharp: [0.4, 0.0, 0.6, 1.0],
  
  /** Spring - Efecto de rebote suave */
  spring: [0.5, 1.5, 0.5, 1.0],
} as const;

/**
 * Presets de animación completos
 * Combinan duración + easing para casos comunes
 */
export const animations = {
  /** Fade in/out */
  fade: {
    duration: duration.fast,
    easing: easing.ease,
  },
  
  /** Slide in/out */
  slide: {
    duration: duration.normal,
    easing: easing.easeOut,
  },
  
  /** Scale up/down */
  scale: {
    duration: duration.fast,
    easing: easing.easeOut,
  },
  
  /** Bounce effect */
  bounce: {
    duration: duration.moderate,
    easing: easing.spring,
  },
  
  /** Modal aparecer/desaparecer */
  modal: {
    duration: duration.moderate,
    easing: easing.easeInOut,
  },
  
  /** Drawer abrir/cerrar */
  drawer: {
    duration: duration.moderate,
    easing: easing.sharp,
  },
  
  /** Toast notification */
  toast: {
    duration: duration.normal,
    easing: easing.easeOut,
  },
  
  /** Ripple effect */
  ripple: {
    duration: duration.fast,
    easing: easing.linear,
  },
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type AnimationPreset = keyof typeof animations;

/**
 * Utility para crear config de animación custom
 * 
 * @example
 * ```typescript
 * Animated.timing(value, {
 *   ...createAnimation('fast', 'easeOut'),
 *   toValue: 1,
 *   useNativeDriver: true,
 * });
 * ```
 */
export function createAnimation(
  durationKey: Duration = 'normal',
  easingKey: Easing = 'ease'
) {
  return {
    duration: duration[durationKey],
    easing: easing[easingKey],
  };
}

