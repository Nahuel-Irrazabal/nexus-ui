---
name: nexus-release
description: Flujo de release de la librería nexus-ui — determina el bump SemVer, actualiza package.json y CHANGELOG.md (Keep-a-Changelog en español con bloque de migración), sincroniza el badge del README, corre los tests y recuerda el cache-bust al consumidor. Invocar cuando el usuario pide releasear, publicar una versión o bumpear nexus-ui.
---

# nexus-release

Prepara una release publicable de `/mnt/d/Apps/packages/nexus-ui`.

Orquestás; el subagente `nexus-expert` (modo MANTENER) ejecuta los cambios. No editar los archivos vos.

## Paso 1 — Determinar el bump SemVer

Que `nexus-expert` revise los cambios desde el último tag/versión (`git log --oneline`, diff sobre `src/`) y clasifique:
- **patch** (`x.y.Z`) — fix de bug, sin cambios de API (ej. arreglar `theme.textContrast` de Checkbox).
- **minor** (`x.Y.0`) — componentes/props nuevos, retrocompatibles (ej. agregar `Chip`, `Sheet`).
- **major** (`X.0.0`) — breaking changes de API pública (`src/index.ts`).

Confirmar el nivel con el usuario si hay ambigüedad. Versión actual: leer de `package.json` (`version`), no asumir.

## Paso 2 — Actualizar `package.json`

Subir el campo `version` al nuevo número.

## Paso 3 — Agregar entrada en `CHANGELOG.md`

Respetar el formato Keep-a-Changelog en español que ya usa el repo. Entrada nueva arriba de todo:

```markdown
## [x.y.z] - YYYY-MM-DD

### Agregado
- ...

### Cambiado
- ...

### Migración para apps consumidoras
No hay breaking changes de API. Para tomar los cambios:
```bash
npm update nexus-ui
# o si no refresca por cache:
rm -rf node_modules/nexus-ui && npm install
```
<notas de migración si aplica: temas custom, props obligatorias, etc.>
```

Usar la fecha real (hoy). Incluir `### Agregado` y/o `### Cambiado` según corresponda. El bloque **"Migración para apps consumidoras"** es obligatorio — si hay breaking changes, documentarlos ahí explícitamente.

## Paso 4 — Sincronizar el badge del README

Actualizar el badge de versión del `README` para que coincida con `package.json` (deuda conocida: solían desincronizarse). Verificar que el nombre del paquete sea `nexus-ui` y no `@nexus-ui/design-system`.

## Paso 5 — Correr los tests

```bash
cd /mnt/d/Apps/packages/nexus-ui && npm test
```
No cerrar la release con tests en rojo. Si fallan, `nexus-expert` corrige antes de continuar.

## Cierre

Reportar al usuario: versión nueva, tipo de bump, resumen del CHANGELOG y resultado de los tests. Recordar el cache-bust para las apps consumidoras:
```bash
rm -rf node_modules/nexus-ui && npm install
```
