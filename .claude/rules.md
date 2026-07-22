# RULES — React Native / Expo / TypeScript

> Fuente única de reglas del kit. Se copia a cada proyecto como `.claude/rules.md`.
> Los subagentes la citan; no la dupliquen inline.

## Estado — Árbol de Decisión
```
Datos del servidor    → React Query (useQuery / useMutation)
UI state global       → Zustand
UI state local        → useState / useReducer
Form state            → react-hook-form
Datos derivados       → useMemo (no crear estado nuevo)
```

## Styling — depende del stack del proyecto

> **Regla 0:** leer `ai/context/stack.md` antes de decidir. El proyecto declara ahí su approach de estilos. NO asumir NativeWind.

- **nexus-ui** (design system propio): usar sus componentes (`Button`, `Input`, `Card`, `Sheet`, `Toast`...) y su theming (`useTheme()` + tokens). No re-crear componentes que ya existen en la librería. Ver el agente `nexus-expert`.
- **StyleSheet**: `StyleSheet.create()` — nunca objetos inline (crean nueva referencia por render → re-renders).
- **NativeWind** (solo si el stack lo declara): `className`.

## React Native — Anti-Patterns Prohibidos
```tsx
// ❌ Inline style object          ✅ StyleSheet.create() o componente de nexus-ui
<View style={{ padding: 16 }}>     <View style={styles.row}>

// ❌ Función anónima en prop de lista (invalida memo)
<TaskItem onPress={() => navigate(item.id)} />
// ✅
const handlePress = useCallback(() => navigate(item.id), [item.id]);

// ❌ FlatList para listas largas    ✅ FlashList con estimatedItemSize medido (> 20 items)
// ❌ Item de lista sin memo         ✅ memo() + displayName
// ❌ index como key                 ✅ key estable (t.id)
// ❌ TouchableOpacity               ✅ Pressable
// ❌ SafeAreaView de react-native   ✅ SafeAreaView de react-native-safe-area-context
// ❌ KeyboardAvoidingView sin behavior por plataforma
// ✅ behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
```

## TypeScript
```typescript
// ❌ as Type sin validación         ✅ Zod parse (valida en runtime)
const t = api as Task               const t = taskSchema.parse(api)
// ❌ any                            ✅ unknown + type guard, o generics
// ❌ queryKey hardcodeado           ✅ factory (taskKeys.lists())
```

## Zustand — Selectores estables
```typescript
// ❌ Selector inline (nueva función por render)   ✅ Selector fuera del componente
const u = useAuthStore(s => s.user)               const selectUser = (s) => s.user
                                                   const u = useAuthStore(selectUser)
```

## Feature Modules
- `app/` screens: solo imports de `features/` y routing (máx ~30 líneas).
- `features/X` **nunca** importa de `features/Y` — si lo necesita, va a `shared/` o prop drilling desde `app/`.
- `shared/` no conoce ningún dominio de negocio.
- Imports cross-feature siempre desde el barrel público (`@/features/tasks`), nunca rutas internas.

## Accesibilidad (obligatoria en componentes interactivos)
- `accessibilityRole`, `accessibilityLabel`, `accessibilityState` en todo elemento presionable/input.
- Labels no hardcodeados por idioma cuando el componente es reutilizable → prop.

## New Architecture (Expo SDK 51+, newArchEnabled)
- Sin string refs (`ref="x"`) → `useRef`.
- Antes de agregar cualquier lib con código nativo: verificar soporte en reactnative.directory.

## Performance — Checklist pre-PR
```
[ ] Lista > 20 items usa FlashList con estimatedItemSize medido
[ ] Items de lista con memo() + displayName
[ ] Callbacks a hijos con useCallback
[ ] Sin inline styles en componentes de lista
[ ] useMemo en datos filtrados/mapeados dentro de render
[ ] Animaciones con Reanimated (no Animated del core) salvo casos simples
[ ] Imágenes con expo-image + placeholder
```

## 🎟️ Economía de contexto (para agentes)
Sos un subagente: el orquestador recibe tu **resultado**, no tu proceso. Cuidá el presupuesto de tokens:
- Devolvé un **resumen compacto y accionable**, no volcados crudos de archivos ni logs completos.
- **Leé on-demand** solo lo que la tarea necesita. No cargues módulos enteros "por las dudas".
- **No re-leas** un archivo que ya está en contexto.
- Al buscar, usá grep/glob dirigido antes que leer archivos completos.
- Si la tarea es más grande de lo esperado, **decilo y proponé acotarla** — no la ejecutes entera consumiendo todo el presupuesto.

## Global
- Sin `console.log` en producción.
- Sin `any` explícito ni implícito.
- Tokens/secrets en `expo-secure-store` — nunca AsyncStorage; nunca en el repo (usar `eas secret` / `.env.local`).
- `useEffect` con cleanup si hay listener/subscription.
- Errores de API → transformar a `AppError` antes de la UI.
