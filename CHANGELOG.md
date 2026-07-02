# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

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
