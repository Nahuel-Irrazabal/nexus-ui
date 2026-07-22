# nexus-ui — Design System React Native

> Instalado con **rn-team-kit** (perfil `rn-library`). Este CLAUDE.md orquesta; el `nexus-expert` ejecuta.

## Qué es
Librería de diseño RN (TypeScript, distribuida como fuente vía Metro — sin build). ~20 componentes en 10 categorías, sistema de theming de 3 niveles, 8 hooks, tokens. Ver `package.json` para la versión actual.

## Regla de orquestación
El contexto principal orquesta. Todo trabajo sobre la librería (componente, mejora, perf, test, release) → delegar al **`nexus-expert`** en modo MANTENER. Review → `rn-reviewer`. Implementación de UI compleja → `rn-frontend`.

## 🎟️ Gestión de tokens — reglas duras
Un barrido de la librería toca decenas de archivos. Sin control agota el presupuesto y corta a la mitad. Reglas:

1. **Máximo 3–4 subagentes en paralelo.** Nunca decenas. Barridos grandes → **olas de 3–4**, no todo de una.
2. **Commit después de cada ola/tanda.** Es el checkpoint: si se agotan los tokens, no se pierde nada. *(Un `/nexus-audit` que corrigió 30+ componentes con 25 agentes en paralelo, sin commits, consumió 2.5M tokens y quedó a medias — no repetir.)*
3. **Modelo explícito SIEMPRE.** Fixes mecánicos (memo, displayName, a11y, tokens) → `haiku`. Nunca una flota en el modelo de sesión.
4. **Estimá antes de un barrido.** Si son >6 componentes o >10 archivos: proponé tandas commiteadas y confirmá con el usuario. NO "corregí todo" de una pasada.
5. **Umbral de contexto 85%** → checkpointeá (commit + estado a un `.md`) y frená.
6. **`/nexus-audit` REPORTA; corregir es aparte, por lotes.** Ver la propia skill.

## Convención canónica de componente
```
src/components/<categoría>/<Componente>/
  ├── <Componente>.tsx     # impl + interface Props + StyleSheet
  ├── index.ts             # export { X } + export type { XProps }
  └── __tests__/<X>.test.tsx
```
- Props extienden el primitivo RN. Sin `types.ts`.
- Theming: `const { theme, isDark } = useTheme()`. Colores de `theme.*`, medidas de tokens (`spacing`, `getShadow`, `textVariants`).
- Estilos híbridos: `StyleSheet.create` estático + getters `get*()` dinámicos.
- **Componentes nuevos corrigen la deuda del repo**: `React.memo` + `displayName`, `forwardRef` donde aplique, a11y completa, colores/medidas siempre tokenizados, test real (no smoke).

Detalle completo y archivos de referencia: agente `nexus-expert` y `.claude/rules.md`.

## Backlog de calidad (estado vivo)
Correr `/nexus-audit` para el reporte actualizado. Última auditoría (2026-07-22): librería en buen estado, sin bugs funcionales ni riesgos altos abiertos. Deuda restante:
1. `forwardRef` opcional en wrappers de `View`/overlay sin ref útil (`Badge`, `Divider`, `Modal`, `Sheet`, `Alert`, `Toast`, `EmptyState`, `ErrorState`, `SkeletonLoader/List`).
2. `Input.tsx` sin `accessibilityRole` explícito (cosmético; RN lo infiere de `TextInput`).
3. Cobertura real: 93.18% líneas / 90.64% branches (por encima del `coverageThreshold: 70%` declarado en `jest.config.js`, ahora real).

## Skills
- `/nexus-add-component` — scaffold de componente nuevo con el template canónico (ya corregido).
- `/nexus-audit` — reporte priorizado de calidad (tests, a11y, tokens, drift).
- `/nexus-release` — bump SemVer + CHANGELOG + checklist.

## Release
SemVer manual en `package.json` + `CHANGELOG.md` (Keep-a-Changelog en español, con bloque "Migración para apps consumidoras"). `npm test` verde. Sincronizar badge del README. Consumidores actualizan con `npm update nexus-ui` (+ cache-bust si hace falta).
