# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

## [2.2.0] - 2026-07-22

### Agregado
- **`Theme`**: nuevos tokens `skeletonBase`/`skeletonHighlight` (colores del placeholder de `SkeletonLoader`, antes hardcodeados como hex fijo por modo). Disponibles también en `defineTheme()`.
- **`Sheet`**: prop `dismissLabel?: string` (default `'Cerrar'`) para overridear el `accessibilityLabel` del backdrop, antes hardcodeado.
- **`ToastProvider`**: prop `closeAccessibilityLabel?: string` para overridear el label del botón de cierre del toast. Se exporta el tipo `ToastProviderProps`.
- Tests reales (antes ausentes o smoke) para `ErrorBoundary`, `useAsync`, `useDebounce`, `usePrevious`. Cobertura global: 93.18% líneas / 90.64% branches (por encima del `coverageThreshold: 70%` declarado, ahora real).
- `ListItem` ahora expone `forwardRef` (ref del `Pressable`/`View` subyacente).

### Cambiado
- `SkeletonLoader` usa `theme.skeletonBase`/`theme.skeletonHighlight` en vez de hex hardcodeados (`'#2A2A2A'`/`'#E0E0E0'`, `rgba` blancos) — ahora tokenizado igual que el resto de la librería.
- `Checkbox`: el color del ícono de check (`✓`) ahora resuelve contraste real cuando se pasa un `color` custom, en vez de asumir siempre `theme.onPrimary` (pensado solo para `theme.primary`). Sin `color` custom, comportamiento idéntico al anterior.
- `ToastProvider`: el default del label de cierre pasa de inglés (`'Close notification'`) a español (`'Cerrar notificación'`) por consistencia con el resto de la librería (overrideable con `closeAccessibilityLabel`).

### Migración para apps consumidoras
No hay breaking changes de API — todos los cambios son aditivos u opcionales.
```bash
npm update nexus-ui
# o si no refresca por cache:
rm -rf node_modules/nexus-ui && npm install
```
- Si la app define temas custom vía `createTheme`/`defineTheme` con acceso directo al objeto (no a través de `useTheme()`), TypeScript exigirá los nuevos campos `skeletonBase`/`skeletonHighlight` en el tipo `Theme`. Si usás `defineTheme()`, son opcionales y ya tienen default — no requiere cambios.
- Si algún test/snapshot de consumidor depende del texto exacto `'Close notification'` en un `Toast`, actualizar a `'Cerrar notificación'` o pasar `closeAccessibilityLabel` explícito.

## [2.1.0] - 2026-07-02

### Agregado
- **`Chip` / `ChipGroup`** (`inputs`) — etiqueta seleccionable compacta para filtros o selección simple/múltiple. `ChipGroup` soporta scroll horizontal (`scrollable`) o wrap.
- **`Sheet`** (`overlay`) — bottom sheet con backdrop y animación deslizante desde abajo, respeta `SafeAreaInsets` y usa `getShadow('xl', isDark)`.
- **`AlertProvider` + `useAlert`** — puente imperativo sobre `Alert`, mismo patrón que `ToastProvider`/`useToast`. Permite disparar confirmaciones con `confirm(config)` sin manejar estado `visible` a mano.
- Prop `icon` en `Alert` y prop `icons` en `ToastProvider`/`AlertProvider` para reemplazar los emojis por defecto (ej. con `@expo/vector-icons`).

### Cambiado
- `Modal`, `Alert` y `Sheet` ahora usan `theme.overlay` para el color del backdrop en vez de `rgba(0,0,0,0.5)` hardcodeado — el backdrop ahora respeta dark mode.
- `Alert` usa colores semánticos del tema (`theme.success/warning/error/info`) en vez de hex hardcodeados para variantes y botón `destructive`.
- Componentes tokenizados con `borderRadius`/`shadows` centralizados (Button, Card, Toast, Switch, ErrorState, Checkbox, RadioButton, ListItem, SkeletonLoader, SkeletonList, Alert, Modal, Badge, Avatar). Elementos circulares usan `borderRadius.full` en vez de `size/2` calculado.
- `textVariants` ampliado con `display`, `h1`, `h2`, `h3`, `subtitle`, `button`, `overline` (se mantienen `title`/`body`/`caption` sin cambios).

### Migración para apps consumidoras
No hay breaking changes de API. Para tomar los cambios:
```bash
npm update nexus-ui
# o si no refresca por cache:
rm -rf node_modules/nexus-ui && npm install
```
Nada obliga a adoptar los componentes nuevos, pero si la app define temas custom via `defineTheme`/`createTheme`, verificar que la paleta cubra `overlay`/`success`/`warning`/`error`/`info` (ya son parte del tipo `ThemeColors`, así que TypeScript lo hubiera marcado si faltaban).
