# Estado del barrido /nexus-audit

> Rama de trabajo: `chore/nexus-audit-wip` (base `main` = `6bc9bdc`).
> Suite completa: **443/443 tests ✅** · tsc: solo deuda pre-existente (ver abajo).

## ✅ Cerrado

| Ítem | Estado | Commit |
|---|---|---|
| Bug `Checkbox.theme.textContrast` | ✅ usa `theme.onPrimary` | `991a60d` |
| `React.memo` + `displayName` | ✅ ~23 componentes | (barrido) |
| `forwardRef` | ✅ ~14 componentes | (barrido) |
| Accesibilidad (role/state/label) | ✅ barrido amplio | (barrido) |
| Button hardcode `'#fff'`/font sizes | ✅ tokenizado + `theme.onPrimary` | `991a60d` |
| Tests nuevos (componentes/hooks/theme) | ✅ migrados a RTL, verde | (barrido) |
| **Token `onPrimary`** (era el "unresolved") | ✅ en Theme, defaults y `defineTheme` | `991a60d` |
| `Modal.tsx` tsc (`DimensionValue`) | ✅ | `0e29ff6` |
| Drift badge README 2.0.0→2.1.0 | ✅ | `0e29ff6` |
| Chip: mock local incompleto → RTL roto | ✅ usa mock global | (lote C) |

## 🟡 Deuda pre-existente (NO del audit — fuera de scope)

tsc sigue reportando 3 errores en archivos que el audit no tocó:
- `src/hooks/useAsync.ts:77`
- `src/hooks/usePrevious.ts:9`
- `src/theme/ThemeProvider.tsx:109`

Abordar en un fix aparte (tipos genéricos de hooks + `ThemeWithCustomColors`).

## Pendiente para cerrar el ciclo

1. Correr `/nexus-audit` de nuevo (idempotente) para confirmar que no queda backlog nuevo.
2. Decidir el merge de `chore/nexus-audit-wip` → `main`.
3. `/nexus-release`: bump SemVer (nuevo token `onPrimary` = **minor**, 2.1.0 → 2.2.0) + CHANGELOG con bloque de migración (nota: apps con theme custom heredan `onPrimary` por default; documentarlo).

## Verificación

```bash
cd /mnt/d/Apps/packages/nexus-ui && git switch chore/nexus-audit-wip
npx jest --silent      # 443/443 ✅
npx tsc --noEmit       # solo useAsync / usePrevious / ThemeProvider (pre-existente)
```
