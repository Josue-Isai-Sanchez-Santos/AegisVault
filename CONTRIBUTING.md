# AegisVault — Contrato de contribución y trabajo (AV-005)

> **Estado (2026-11-02):** guía propuesta, pendiente de aprobación del mantenedor e incorporación al repositorio. AegisVault está en etapa de diseño: **no es un gestor auditado** y se prueba **solo con credenciales ficticias**.

## 1. Documentos vinculantes y orden de consulta

1. [ROADMAP.md](ROADMAP.md): **fuente de verdad** de los 73 identificadores permanentes `AV-001`–`AV-073`, con título, «Trabajo concreto», «Archivos previstos» y «Terminado cuando».
2. [SECURITY.md](SECURITY.md) y [docs/security/principles.md](docs/security/principles.md): políticas P0, prohibiciones y divulgación de hallazgos (cuando se habilite un canal privado verificado).
3. [docs/security/threat-model.md](docs/security/threat-model.md) y [docs/architecture.md](docs/architecture.md): amenazas, límites de confianza, mensajes y responsabilidades.
4. [docs/decisions/ADR-001.md](docs/decisions/ADR-001.md): decisión vigente sobre worker, claves y sesión; futuros ADR no pueden reemplazarla silenciosamente.
5. [CHANGELOG.md](CHANGELOG.md): cambios relevantes incorporados, no tareas futuras ni log automático de Git.

Si un documento no está integrado aún, **no se presume aprobado**. Las referencias de AV-001 a AV-004 fueron entregadas por separado y deben copiarse antes de declarar cerrada la fase 01.

## 2. Regla de oro: identificador `AV-NNN` inmutable

- La ficha original gobierna el alcance; **no** renombrar, reutilizar, fusionar ni renumerar los 73 puntos.
- Una aclaración se documenta como nota fechada **sin borrar el texto original**. Un cambio de arquitectura, nivel de privilegio, política de seguridad, exclusión o criterio de salida exige ADR nuevo y actualización de riesgos y CHANGELOG.
- Si hay trabajo nuevo, numerar consecutivamente desde `AV-074`. No crear puntos con números reciclados.
- Cada reporte/issue/PR debe mencionar exactamente un `AV-NNN` principal; otros IDs solo como dependencias.
- Un commit o archivo entregado no cierra automáticamente un punto. El criterio es **DoD + revisión + aceptación**.

## 3. Flujo de trabajo por punto

### 3.1 Antes de escribir código o documentación

1. Abrir la ficha `AV-NNN` en `ROADMAP.md` y transcribir literalmente objetivo, archivos y «Terminado cuando».
2. Verificar dependencias, políticas `POL-xx`, ADR aplicables y el riesgo `RSK-NNN` asociado.
3. Inspeccionar el estado real del repositorio (`git status -sb`, si Git ya existe); **no atribuir commits ni pruebas no realizados**.
4. Limitar el cambio al punto en curso. Si otra tarea aparece durante el trabajo, anotarla para después.

### 3.2 Durante el trabajo

1. Explicar qué se construye, para qué sirve y los supuestos de diseño.
2. Entregar archivos completos y comandos reproducibles. En correcciones, identificar el archivo completo modificado y las razones, sin esconder cambios.
3. Usar **únicamente datos ficticios** (`example.test`, `user@example.test`, `TEST-ONLY-NOT-A-PASSWORD-123!`, etc.) en pruebas/capturas. Nunca copiar credenciales reales al chat, Git o artefactos.
4. Trabajar sin telemetría, solicitudes de red propias de la extensión, scripts remotos, contraseñas maestras en almacenamiento ni autocompletado desatendido (ver `POL-01`–`POL-23`).
5. Añadir pruebas normales, negativas y de regresión relevantes; no confundir teoría/documentación con implementación validada.

### 3.3 Revisión antes del cierre

- Comprobar las rutas realmente presentes, enlaces y documentación que remita a ellas.
- Revisar cambios y excluir secretos (`git diff --check`, `git diff --stat`, `git status -sb`; comandos **solo cuando el repositorio esté inicializado**).
- Ejecutar verificaciones reales disponibles en la etapa correspondiente: Markdown/consistencia en puntos documentales; typecheck/lint/tests/build para código a partir de AV-007; pruebas manuales en Chrome/Brave en los puntos que las requieran. Registrar resultados exactos.
- Documentar errores o pruebas imposibles, sin dar por ejecutado lo que solo se planificó.
- Actualizar `[Unreleased]` en `CHANGELOG.md` si se incorporó un cambio relevante; actualizar `RSK-NNN` y, de proceder, ADR.
- Obtener aceptación explícita del mantenedor. Solo entonces marcar `[x]` y anotarlo en el cierre; si no está integrado o validado, dejar `[ ]`.

## 4. Definition of Done (DoD)

Cada punto exige **todos** los criterios aplicables. Indicar `N/A` solamente con razón concreta.

| ID DoD | Comprobación obligatoria | Evidencia mínima |
| --- | --- | --- |
| DOD-01 | Alcance de la ficha respetado; sin adelantar otras tareas | diff/relación de archivos tocados |
| DOD-02 | Entregables previstos existen en rutas correctas o sustituciones formalmente justificadas | listado verificable de archivos y ADR si aplica |
| DOD-03 | Criterio «Terminado cuando» de la ficha satisfecho | prueba objetiva/documental específica |
| DOD-04 | Pruebas relevantes ejecutadas y resultado registrado; fallos abiertos explícitos | comando, entorno, salida resumida o informe; `N/A` para código no existente |
| DOD-05 | Seguridad y privacidad compatibles con POL-01…23; sin riesgos P0 sin gestionar | revisión breve, tests y hallazgos |
| DOD-06 | Documentación, vínculos, decisiones y riesgos reflejan el cambio | enlaces a artefactos, ADR/RSK si procede |
| DOD-07 | Git y CHANGELOG reflejan la realidad (sin inventar commits, tags, pushes) | `git status` cuando aplique, entrada `[Unreleased]` |
| DOD-08 | Mantenedor revisó y aceptó explícitamente el resultado | confirmación y fecha referidas al punto |
| DOD-09 | Estado actualizado sin renumerar ficha; próxima tarea y bloqueos indicados | `[x]` solo si DOD-01…08 cumplen |

**Bloqueadores P0:** fuga de secretos, vulneración de reglas de seguridad, error criptográfico, pérdida de datos, acceso no autorizado o condición específica de salida incumplida. No se esquivan pasando a la fase siguiente. Ante discrepancia entre comodidad y seguridad, documentar alternativa/ADR y mantener tarea bloqueada.

## 5. Convenciones de ramas Git

Ramas en minúsculas excepto identificador `AV-NNN` canónico; un tema corto en `kebab-case`:

```text
<tipo>/AV-NNN-<tema>
```

| Tipo | Uso | Ejemplo |
| --- | --- | --- |
| `docs` | Documentación o ADR | `docs/AV-005-workflow-contract` |
| `feat` | Funcionalidad | `feat/AV-033-create-credential` |
| `fix` | Corrección | `fix/AV-049-message-validation` |
| `test` | Pruebas | `test/AV-065-phishing-boundaries` |
| `chore` | Infraestructura/herramientas | `chore/AV-007-tooling` |
| `refactor` | Reestructuración interna | `refactor/AV-020-storage-adapter` |

- Rama principal propuesta: `main` (**verificar la rama real al inicializar AV-006**).
- Crear una rama desde la rama base actualizada para cada punto; no mezclar distintas tareas salvo dependencia formal y descrita.
- Preferir PR para revisión; proponer protección de `main` y checks una vez exista CI en AV-011. Los requisitos exactos dependen de la configuración real del repo, no se presuponen activos.
- Nunca realizar `push --force` a `main`. No subir backups, claves, `.env`, volcado IndexedDB ni configuraciones privadas.

### Comandos orientativos (NO ejecutados)

A partir de AV-006, una vez que el repositorio exista:

```bash
git status -sb
git switch main
git pull --ff-only            # únicamente si hay remoto configurado y procede
git switch -c docs/AV-005-workflow-contract
git add ROADMAP.md CONTRIBUTING.md CHANGELOG.md
git diff --cached --check
git diff --cached --stat
git commit -m "docs(workflow): define AV-005 tracking contract" -m "Refs: AV-005"
# git push -u origin docs/AV-005-workflow-contract  # SOLO si el mantenedor lo autoriza
```

Si `git switch main` o `git pull` no son aplicables, inspeccionar ramas/remotos antes de adaptar comandos; no forzar el estado de Git.

## 6. Mensajes de commit

Adoptamos **Conventional Commits 1.0.0**:

```text
<tipo>(<ámbito>): <acción corta en imperativo> [opcional]

<explicación de por qué y decisiones relevantes, si hace falta>

Refs: AV-NNN
```

Tipos preferidos: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build`, `ci`, `perf`, `revert`. Ámbitos sugeridos: `crypto`, `vault`, `storage`, `session`, `extension`, `ui`, `workflow`, `security`, `backup`.

Ejemplos:

```text
docs(workflow): establish development contract

Refs: AV-005
```

```text
feat(crypto): wrap vault data key using derived key

Refs: AV-015
```

```text
fix(extension): reject unauthorized sender origins

Refs: AV-049
```

- No incorporar contraseñas, tokens ni datos personales en el mensaje.
- Un `feat` no implica que el módulo haya pasado auditoría.
- Cambios incompatibles de contrato/documento público requieren justificación y convención `!` o `BREAKING CHANGE:` cuando corresponda, además de ADR si afecta arquitectura.
- No modificar o reescribir arbitrariamente commits ya compartidos.

## 7. Versiones, etiquetas y compatibilidad

Aplicamos **Semantic Versioning 2.0.0**, separado del avance de tareas:

| Aspecto | Norma |
| --- | --- |
| Roadmap/documentos | Su revisión documental es independiente del software y de AV-NNN |
| Desarrollo inicial | Serie `0.y.z` (interfaz aún inestable) |
| Primer artefacto experimental | Puede etiquetarse `0.1.0-alpha.1` tras compilar y probar; NO se ha creado |
| Nuevas capacidades compatibles | Subida de `MINOR` cuando corresponda según contrato público |
| Correcciones compatibles | Subida de `PATCH` cuando corresponda |
| Cambios incompatibles | Subida de `MAJOR` tras 1.0.0; durante `0.y.z` registrar incompatibilidad explícita |
| Primera versión estable | `1.0.0` solo con revisión de AV-069 y gate AV-073 satisfactorios |
| Tags Git | `vX.Y.Z` / `vX.Y.Z-alpha.N`; solo se crean si apuntan al commit probado |
| Formato de fecha | ISO `AAAA-MM-DD` en CHANGELOG y liberaciones |

**Cuidado:** `0.1.0` o `1.0.0` no se asignan por terminar documentación; tampoco se afirma cumplimiento de pruebas de seguridad sin evidencia. La versión de `manifest.json` cuando exista debe mantenerse consistente con la versión distribuida y sus restricciones de formato, que se verificarán en la fase de empaquetado.

## 8. CHANGELOG y documentos de decisiones

- Seguir el formato [Keep a Changelog](https://keepachangelog.com/en/1.1.0/): encabezado `[Unreleased]`, después entradas de versiones **realmente publicadas**, en orden inverso, secciones `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed` o `Security` (pueden redactarse en español, conservar categorías).
- `CHANGELOG.md` describe cambios efectivamente incorporados al código o documentos, **no** lista los 73 pendientes como funcionalidades ya creadas.
- Toda entrada relevante referencia `AV-NNN` y, para una decisión de seguridad, `ADR-NNN`/`RSK-NNN`.
- Para decisiones, un ADR es inmutable en lo sustancial tras aceptarse; un ADR posterior puede **reemplazar** su vigencia mediante referencias cruzadas. No borrar ni reescribir decisiones históricas.
- Los riesgos operativos `RSK-001`… están en `ROADMAP.md`; las amenazas técnicas pertenecen a `docs/security/threat-model.md`.

## 9. Informe obligatorio para continuar un punto

El siguiente formato evita perder contexto entre conversaciones o sesiones. Copiarlo con valores reales, sin inventar evidencias:

```text
AegisVault | AV-NNN — [título idéntico a ROADMAP]
Estado anterior: ...
Objetivo / criterio de salida (texto literal): ...
Dependencias: ...
Archivos previstos / archivos realizados: ...
Resumen de cambios: ...
Pruebas ejecutadas: ...
Fallos pendientes y nivel P0/P1: ...
Archivos/URLs de evidencia: ...
Estado Git/PR/commit: ...
CHANGELOG actualizado: Sí | No (por qué)
Revisión y aceptación del mantenedor: ...
Estado posterior: ...
Siguiente punto: ...
```

### Ejemplo de reanudación

**Usuario:** «AegisVault, continuemos con AV-021».

**Respuesta esperada:** usar `AV-021 — Guardar y recuperar solo cifrado` con el objetivo y criterio literalmente recogidos en ROADMAP; identificar primero si AV-019/020 se cerraron; luego desarrollar solo los archivos requeridos, ejecutar pruebas de persistencia y de ausencia de texto claro, registrar riesgos, y cerrar únicamente con aceptación. No confundir *mensajes de ejemplo* con pruebas efectivamente ejecutadas.

## 10. Aceptación de este contrato (AV-005)

- [x] Convención AV-NNN y no renumeración documentadas.
- [x] DoD con evidencia mínima definido.
- [x] Convenciones de ramas y mensajes documentadas.
- [x] Política de versionado/tags y CHANGELOG definida.
- [x] Registro de riesgos y estados incorporado en ROADMAP.
- [ ] Revisión y aceptación explícita del mantenedor.
- [ ] Archivos incorporados a la copia local y comprobados contra documentos previos.
- [ ] Estado de Git/commit real verificado en AV-006 (cuando corresponda).

## 11. Referencias públicas utilizadas

- [Conventional Commits — 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- [Semantic Versioning — 2.0.0](https://semver.org/spec/v2.0.0.html)
- [Keep a Changelog — 1.1.0](https://keepachangelog.com/en/1.1.0/)
- [GitHub Docs — About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
