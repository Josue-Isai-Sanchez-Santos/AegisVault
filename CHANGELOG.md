# Changelog — AegisVault

Todos los cambios **incorporados** a este proyecto deberán documentarse aquí con referencias `AV-NNN`.

Este archivo sigue [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) y el plan de versionado definido en [CONTRIBUTING.md](CONTRIBUTING.md), basado en [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

> **Estado al 2026-11-03:** AegisVault continúa en fase documental y preparación del repositorio local; **no existe una versión de software liberada, una etiqueta Git verificada, una auditoría ni una extensión lista para contraseñas reales**. Este contenido funcionará como historial del repositorio **cuando el mantenedor incorpore estos archivos**. Los documentos AV-001–004 se elaboraron en entregas anteriores, pero su integración al repositorio sigue pendiente de verificación.

## [Unreleased]

### Added

- **AV-005:** `ROADMAP.md` como especificación maestra de los 73 puntos estables `AV-001` a `AV-073`, con control de estado y registro operativo de riesgos `RSK-001` a `RSK-010`.
- **AV-005:** `CONTRIBUTING.md` con Definition of Done, estados, nombres de ramas, Conventional Commits, procedimiento de reanudación y política de versiones.
- **AV-005:** `CHANGELOG.md` para registrar cambios documentales y técnicos sin simular versiones publicadas.
- **AV-006 (preparación):** se reunió la documentación de AV-001 a AV-005 y se añadió `.gitignore` para iniciar el repositorio local; el commit inicial y la aceptación de la puerta de fase requieren verificación por el mantenedor.
- **AV-007:** Configurado el entorno de desarrollo con TypeScript estricto, Vite 8, ESLint 10 y Prettier.
- **AV-007:** Incorporados scripts de desarrollo, compilación, análisis estático y verificación.
- **AV-007:** Generado package-lock.json para instalaciones reproducibles mediante npm ci.
- **AV-007:** Verificadas instalaciones y compilaciones en WSL Ubuntu y Windows nativo.
- **AV-007:** Auditoría npm completada sin vulnerabilidades reportadas; se mantienen overrides de minimatch sujetos a pruebas de regresión.
- **AV-008:** Creada la estructura modular de core, extension, ui y shared, con directorio independiente de pruebas.
- **AV-008:** Incorporado un verificador de dependencias entre capas y 29 pruebas automatizadas de arquitectura.
### Security

- **AV-005:** todo cierre debe comprobar políticas `POL-01` a `POL-23`, revisar riesgos y evitar cualquier afirmación de seguridad auditada sin revisión independiente. La obligación documental **no significa** que los controles ya estén implementados.

## Regla de mantenimiento

Al finalizar cada punto:

1. Si hay cambio relevante **realmente incorporado**, añadir en `[Unreleased]` una línea de la categoría adecuada que cite `AV-NNN`; si el punto solo reorganiza una nota menor, justificar la ausencia de entrada.
2. Si cambia el perfil de riesgo, enlazar `RSK-NNN` y/o `ADR-NNN` y revisar documentos de seguridad afectados.
3. Al crear una **liberación real** después de pruebas, mover entradas a `## [X.Y.Z] - AAAA-MM-DD`, crear el tag `vX.Y.Z` desde el mismo commit y anotar el resultado. No añadir versiones futuras por adelantado.
4. No insertar secretos, contraseñas, tokens, claves de cifrado, respaldos reales ni datos privados en el changelog.

### Ejemplo de una entrada futura (NO es una liberación)

```text
### Fixed
- AV-049: se rechazan mensajes de emisores no autorizados; pruebas de regresión documentadas.
```

### Estados de documentos previos (informativos; NO son funcionalidades publicadas)

| Punto | Material preparado en entregas anteriores | Integración/aceptación verificada |
| --- | --- | --- |
| AV-001 | `docs/scope.md`, `README.md` | No |
| AV-002 | `docs/security/threat-model.md` | No |
| AV-003 | `SECURITY.md`, `docs/security/principles.md` | No |
| AV-004 | `docs/architecture.md`, `docs/decisions/ADR-001.md` | No |
| AV-005 | `ROADMAP.md`, `CONTRIBUTING.md`, `CHANGELOG.md` | Integración local no verificada |
