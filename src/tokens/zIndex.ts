/**
 * Sistema de z-index
 * Define capas consistentes para elementos superpuestos
 */

export const zIndex = {
  /** Elementos por debajo del contenido normal */
  behind: -1,
  
  /** Nivel base */
  base: 0,
  
  /** Elementos ligeramente elevados (cards, dropdowns) */
  dropdown: 10,
  
  /** Sticky headers, elementos fijos */
  sticky: 20,
  
  /** Overlays, backdrops */
  overlay: 30,
  
  /** Modales, dialogs */
  modal: 40,
  
  /** Popovers, tooltips */
  popover: 50,
  
  /** Toasts, notificaciones */
  toast: 60,
  
  /** Máximo - elementos críticos */
  max: 100,
} as const;

export type ZIndex = keyof typeof zIndex;

