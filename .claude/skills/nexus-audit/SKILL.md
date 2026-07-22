---
name: nexus-audit
description: Reporte priorizado de calidad de la librería nexus-ui — verifica contra el código real la deuda técnica conocida (lecturas theme.* inválidas, falta de memo/forwardRef/displayName, a11y, tests faltantes, tokens hardcodeados, drift de docs) y devuelve una tabla priorizada. Invocar cuando el usuario pide auditar, revisar calidad o el estado de deuda de nexus-ui.
---

# nexus-audit

Produce un reporte priorizado del estado de calidad de `/mnt/d/Apps/packages/nexus-ui`.

Orquestás; el subagente `nexus-expert` (modo MANTENER) hace el barrido. **Verificar contra el código real, no asumir** — el backlog de abajo es baseline, puede haber cambiado.

## Delegar a `nexus-expert` un barrido de estos ejes

**(a) Lecturas `theme.*` fuera del schema `Theme`**
Buscar accesos a propiedades que no existen en el tipo `Theme` (TS no las cacha porque `ThemeWithCustomColors` tipa keys desconocidas como `string|undefined`).
- Bug conocido: `src/components/inputs/Checkbox/Checkbox.tsx` (~línea 82) lee `theme.textContrast` → `undefined`.
- Grep por lecturas `theme.<key>` y cotejar cada key contra `src/theme/` (el tipo `Theme`/`ThemeColors`).

**(b) Componentes sin `React.memo` / `forwardRef` / `displayName`**
Hoy: ninguno los usa. Listar cada componente que falte cada uno, priorizando los que envuelven un primitivo con ref útil (Input→TextInput, Button→TouchableOpacity).

**(c) A11y faltante**
Solo `Checkbox` y `Chip` la tienen. Detectar componentes interactivos sin `accessibilityRole` / `accessibilityState` / `accessibilityLabel` (Button, Input, Switch, RadioButton, Modal, Sheet, Alert…). Marcar también labels hardcodeados en español.

**(d) Componentes / hooks sin test**
Listar los `.tsx` de componente y los hooks sin `__tests__`. Marcar además los tests que son smoke (como `Button.test.tsx`: solo `toBeDefined`/`typeof`, sin `render`). Notar que `coverageThreshold: 70%` está declarado en `jest.config.js` pero no es real.

**(e) Tokens hardcodeados**
Grep por hex (`'#fff'`, `#000`, `rgba(...)`) y font sizes literales (`14`/`16`/`18`) que deberían venir de `theme.*` / `fontSizes` / `textVariants`. Conocido: `Button.tsx` usa `'#fff'` (getTextColor) y font sizes 14/16/18 (getFontSize).

**(f) Drift de docs**
- Badge de versión del `README` vs `version` de `package.json` (conocido: README 2.0.0 vs package 2.1.0).
- Nombre del paquete inconsistente: `nexus-ui` vs `@nexus-ui/design-system` (aparece en `jest.config.js` y docs).
- Conteo de componentes/hooks del README vs el real.

## Salida — tabla priorizada

Devolver una única tabla, ordenada por severidad:

| Prioridad | Eje | Archivo:línea | Problema | Fix propuesto |
|-----------|-----|---------------|----------|---------------|
| 🔴 | ... | `src/.../X.tsx:82` | ... | ... |

Criterio de prioridad:
- 🔴 **Bug funcional** (color roto, valor `undefined`, algo que falla en runtime).
- 🟠 **Riesgo real** (a11y ausente en componente interactivo, tests faltantes en código con lógica, tokens que rompen theming/dark mode).
- 🟡 **Higiene** (falta de `memo`/`displayName` sin ref, drift de docs, smoke tests).

Cada fila con `archivo:línea` concreto (verificado) y un fix accionable. Cerrar con un resumen de 2-3 líneas y sugerir qué atacar primero.
