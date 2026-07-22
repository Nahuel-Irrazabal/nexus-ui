# nexus-ui — Design System React Native

> Instalado con **rn-team-kit** (perfil `rn-library`). Este CLAUDE.md orquesta; el `nexus-expert` ejecuta.

## Qué es
Librería de diseño RN (TypeScript, distribuida como fuente vía Metro — sin build). ~20 componentes en 10 categorías, sistema de theming de 3 niveles, 8 hooks, tokens. Ver `package.json` para la versión actual.

## Regla de orquestación
El contexto principal orquesta. Todo trabajo sobre la librería (componente, mejora, perf, test, release) → delegar al **`nexus-expert`** en modo MANTENER. Review → `rn-reviewer`. Implementación de UI compleja → `rn-frontend`.

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
Correr `/nexus-audit` para el reporte actualizado. Deuda conocida:
1. **BUG** `Checkbox.tsx` lee `theme.textContrast` (no existe → `undefined`).
2. Cero `memo`/`forwardRef`/`displayName` en la librería.
3. A11y ausente salvo Checkbox/Chip.
4. Tests solo smoke; `createTheme`/`defineTheme`/`ThemeProvider` sin cubrir; `coverageThreshold: 70%` no real.
5. Button hardcodea `'#fff'` y font sizes 14/16/18.
6. Drift de docs (README 2.0.0 vs package 2.1.0; nombre `@nexus-ui/design-system`).

## Skills
- `/nexus-add-component` — scaffold de componente nuevo con el template canónico (ya corregido).
- `/nexus-audit` — reporte priorizado de calidad (tests, a11y, tokens, drift).
- `/nexus-release` — bump SemVer + CHANGELOG + checklist.

## Release
SemVer manual en `package.json` + `CHANGELOG.md` (Keep-a-Changelog en español, con bloque "Migración para apps consumidoras"). `npm test` verde. Sincronizar badge del README. Consumidores actualizan con `npm update nexus-ui` (+ cache-bust si hace falta).
