---
name: nexus-add-component
description: Scaffold de un componente nuevo en la librería nexus-ui siguiendo el template canónico (carpeta Componente/Componente.tsx + index.ts barrel + __tests__), corrigiendo la deuda técnica del repo. Invocar cuando el usuario pide agregar, crear o scaffoldear un componente nuevo dentro de nexus-ui.
---

# nexus-add-component

Crea un componente nuevo en `/mnt/d/Apps/packages/nexus-ui` con el template canónico ya corregido — no copiar los gaps de los componentes viejos (`Button` hardcodea `'#fff'` y font sizes 14/16/18; ningún componente usa `React.memo`/`forwardRef`/`displayName`).

Orquestás; el subagente `nexus-expert` (modo MANTENER) ejecuta. No escribas el componente vos.

## Paso 1 — Recolectar inputs

Preguntar al usuario (o inferir de su pedido):
- **Nombre** del componente en PascalCase (ej. `Stepper`).
- **Categoría** — una de las carpetas de `src/components/` (`buttons`, `inputs`, `layout`, `overlay`, `feedback`, etc.). Si no encaja en ninguna, proponer la más cercana o una nueva.
- **Primitivo RN base** que envuelve (`TouchableOpacity`, `TextInput`, `View`, `Pressable`, `Text`…) — determina de qué extiende `Props` y si lleva `forwardRef`.
- Props/variantes/sizes que necesita.

## Paso 2 — Delegar la generación a `nexus-expert`

Pasarle nombre, categoría, primitivo y props. Exigir que el componente cumpla el estándar corregido:
- **`React.memo` + `displayName`** siempre.
- **`forwardRef`** cuando envuelve un primitivo con ref útil (ej. `TextInput`, `TouchableOpacity`).
- **Props extienden el primitivo RN** (`extends TouchableOpacityProps`, etc.). Sin `types.ts` — la `interface <X>Props` va arriba del `.tsx`.
- **A11y completa**: `accessibilityRole`, `accessibilityState`, `accessibilityLabel` como prop (no hardcode en español). Referencia: `src/components/inputs/Checkbox/Checkbox.tsx`.
- **Colores siempre de `theme.*`** (`const { theme, isDark } = useTheme()`, import relativo desde `../../../hooks/useTheme`). **Nunca** `'#fff'` ni hex.
- **Medidas de tokens** (`spacing`, `borderRadius`, `getShadow`, `fontSizes`, `textVariants`) — nunca 14/16/18 sueltos.
- **Estilos híbridos**: `StyleSheet.create({...})` estático al fondo + getters `get*()` para lo que depende del theme, mergeados inline.
- **Test real** con `@testing-library/react-native` (`render` + assert de rendering + variantes + theming), **no smoke** como el de `Button.test.tsx`.

Estructura de salida esperada:
```
src/components/<categoría>/<Componente>/
  ├── <Componente>.tsx
  ├── index.ts            # export { X } + export type { XProps }
  └── __tests__/<X>.test.tsx
```

## Paso 3 — Registrar en los barrels

Que `nexus-expert` re-exporte el componente:
- `src/components/<categoría>/index.ts` — barrel de la categoría.
- `src/index.ts` — API público. Agregar el `export` del componente y su tipo `Props` en la sección de componentes. Si el componente tiene alias (patrón `CustomButton/CustomInput/CustomText`), agregarlo también.

Verificar contra los barrels reales antes de editar — no asumir la forma.

## Paso 4 — Verificar

Correr los tests desde la raíz de la librería:
```bash
cd /mnt/d/Apps/packages/nexus-ui && npm test
```
Si falla, `nexus-expert` corrige hasta verde. Reportar al usuario el path del componente creado y el resultado de los tests.

## Cierre

Recordar que el cambio es publicable → sugerir `/nexus-release` cuando corresponda.
