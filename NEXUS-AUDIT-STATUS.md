# Estado del barrido /nexus-audit — plan reconstruido

> Reconstruido desde `git diff main..chore/nexus-audit-wip` + re-verificación, después de que
> el chat original se perdiera y el barrido se cortara por límite de tokens.
> **`main` intacta en `6bc9bdc`. Todo el trabajo del audit vive en la rama `chore/nexus-audit-wip`.**
>
> Fuente de verdad de "qué falta": volver a correr `/nexus-audit` (es idempotente).

## ✅ Hecho (verificado en el código)

| Ítem del backlog | Estado | Evidencia |
|---|---|---|
| **Bug Checkbox `theme.textContrast`** | ✅ corregido | `Checkbox.tsx:94` ya no lee `textContrast` (usaba `undefined`). Ver stopgap ⚠️ abajo. |
| **`React.memo` + `displayName`** | ✅ ~23 componentes | Button, Avatar, Badge, EmptyState, ErrorState, Toast, Checkbox, Chip, Input, RadioButton, Switch, Card, Divider, ListItem, Skeleton*, Alert, Modal, Sheet, Text |
| **`forwardRef`** | ✅ ~14 componentes | Button, Input, Card, Checkbox, Chip, Text, Avatar, RadioButton, Switch |
| **Accesibilidad (role/state/label)** | ✅ barrido amplio | agregada en casi todos los componentes + sus tests |
| **Button: hardcode `'#fff'` / font sizes** | ✅ tokenizado | `Button.tsx:26` usa `palette.neutral[0]` (stopgap ⚠️). |
| **Tests nuevos** | ✅ parcial | nuevos `__tests__` para EmptyState, ErrorState, Toast, Input, Card, Divider, ListItem, Modal, Alert, AlertProvider, Text, Skeleton*, + hooks (useAlert, useToast, useKeyboard, useMediaQuery) y theme. Migrados a `@testing-library/react-native`. **Incompleto**, ver ❌ abajo. |

## ⚠️ Decisión de diseño pendiente (el "unresolved" que el agente iba a entregar)

**Falta un token semántico de contraste en el `Theme`** (`onPrimary` / `contrastText`).
Hoy no existe, así que el fix quedó con **stopgaps**:
- `Checkbox.tsx` → color del check usa `theme.background`.
- `Button.tsx` → texto sobre primario usa `palette.neutral[0]` (`ON_PRIMARY_FALLBACK`).

**Acción correcta:** agregar `onPrimary`/`contrastText` a `Theme` (`createTheme.ts`) y a los defaults light/dark, y reemplazar ambos stopgaps. Es un cambio de API de theme → menor/major + nota de migración.

## ❌ Pendiente / incompleto (lo que el token-out cortó)

1. **`jest.setup.js` sin reconciliar para RTL** → **23 tests fallan** en 2 suites (**Badge**, **Chip**) con *"Element type is invalid"*. El agente empezó a migrar tests a render real de RTL pero no ajustó el setup (que mockea react-native como strings). **Es el pedazo central que quedó a medias.**
2. **`Modal.tsx:89`** → error tsc: `width: modalWidth` (string) no encaja en `DimensionValue`. Fix chico (tipar/castear `modalWidth`).
3. **Drift del README** → badge sigue en `version-2.0.0` (package.json = 2.1.0). No lo tocó.

## 🟡 Deuda pre-existente (fuera del scope del audit)

Errores tsc que **ya existían** antes del barrido (archivos no modificados): `useAsync.ts:77`, `usePrevious.ts:9`, `ThemeProvider.tsx:109`. Abordar por separado.

## Verificación

```bash
cd /mnt/d/Apps/packages/nexus-ui
git switch chore/nexus-audit-wip
npx tsc --noEmit     # esperar: Modal.tsx + 3 pre-existentes
npx jest --silent    # esperar: 420 pass / 23 fail (Badge, Chip)
```

## Cómo cerrar (en tandas commiteadas — no todo de una)

1. Reconciliar `jest.setup.js`/`jest.config.js` para RTL → que Badge y Chip pasen → **commit**.
2. Fix `Modal.tsx:89` → **commit**.
3. Sync README badge 2.0.0→2.1.0 → **commit**.
4. (Diseño) agregar token `onPrimary`/`contrastText` y quitar stopgaps → **commit**.
5. Re-correr `/nexus-audit` para el backlog restante → `/nexus-release`.
