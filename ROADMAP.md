# AegisVault — ROADMAP DE DESARROLLO v1.0

**Modalidad:** Extensión local para Google Chrome y Brave (Chromium, Manifest V3).  **Idioma de documentación:** español.  **Código:** TypeScript.  **Estado:** especificación de tareas conservada; AV-001 a AV-004 cuentan con documentos preparados fuera del repositorio, pendientes de aceptación/integración. AV-005 se documenta en esta entrega y queda pendiente de aceptación/integración. Ningún requisito de implementación se considera verificado. **Seguimiento:** 2026-11-02.

## Cómo usar este documento

Los identificadores `AV-001` a `AV-073` son **permanentes**. Para continuar basta indicar «Continuemos con AV-0XX». Cada punto tiene acciones, archivos orientativos y una condición de terminado. Las rutas son nombres propuestos y podrán ajustarse en AV-008 si registramos el cambio en un ADR, sin cambiar identificadores.

**Regla de cierre de cada punto:** implementar únicamente su alcance; explicar qué se hizo y por qué; ejecutar las verificaciones; revisar errores contigo; actualizar documentación y marcar el punto terminado solo al comprobarlo. No confundir comandos propuestos con comandos ejecutados.

## Principios no negociables

- Prototipo y pruebas con **contraseñas ficticias** hasta superar revisión de seguridad. No es un gestor auditado.
- Arquitectura **local-first, offline**; sin backend, base de datos remota, telemetría ni sincronización en la v1.0.
- Argon2id (KDF) + AES-256-GCM (cifrado autenticado); DEK aleatoria y KEK derivada. No diseñar criptografía propia.
- Abarcar también URL/título/usuario/notas en el cifrado; no solo la contraseña.
- Claves **en claro** nunca en `storage.local` ni IndexedDB (sí se permite almacenar la DEK **envuelta/cifrada**); evaluar el riesgo residual de secretos de sesión en `storage.session` en AV-029; los content scripts jamás reciben claves maestras o DEK.
- Autocompletar **solo con selección expresa**, comprobación estricta de origen y sin envío automático del formulario.
- Permisos mínimos. Evitar `host_permissions` globales y scripts remotos; el código debe venir empaquetado.
- Pruebas de respaldo/restauración antes de cualquier publicación; la pérdida de contraseña maestra puede implicar pérdida definitiva de acceso.
- No usar el repositorio GitHub para guardar contraseñas reales, respaldos, claves ni datos personales.

## Estructura inicial orientativa

```text
AegisVault/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── core/
│   │   ├── crypto/
│   │   ├── domain/
│   │   ├── storage/
│   │   ├── session/
│   │   ├── vault/
│   │   ├── generator/
│   │   ├── audit/
│   │   └── backup/
│   ├── extension/
│   │   ├── background/
│   │   └── content/
│   ├── ui/
│   │   ├── popup/
│   │   ├── vault/
│   │   ├── generator/
│   │   └── settings/
│   └── shared/
├── tests/
│   ├── crypto/
│   ├── storage/
│   ├── unit/
│   ├── security/
│   ├── e2e/
│   └── resilience/
├── test-sites/
├── docs/
│   ├── decisions/
│   ├── security/
│   └── formats/
├── .github/workflows/
├── package.json
├── ROADMAP.md
├── README.md
└── SECURITY.md
```

## Contrato de continuidad, trazabilidad y control (AV-005)

**Fuente de verdad:** las 73 fichas bajo «Fases y puntos ejecutables», conservadas del roadmap base. Sus títulos, acciones, archivos previstos y criterios de aceptación **no se han reinterpretado**. El documento [CONTRIBUTING.md](CONTRIBUTING.md) establece cómo ejecutar y cerrar cada ficha y [CHANGELOG.md](CHANGELOG.md) registra los cambios incorporados.

### Identificadores inmutables

- El formato obligatorio es `AV-NNN` con tres dígitos y prefijo en mayúsculas. `AV-001` … `AV-073` quedan reservados permanentemente. **No** se reasignan, renumeran, duplican ni reutilizan, incluso si una tarea se cancela.
- Cada ficha conserva el identificador, texto base, entregables previstos y prueba de aceptación. Si la implementación requiere otros archivos, se añaden en la evidencia de la tarea, sin reemplazar silenciosamente los previstos.
- Las aclaraciones o cambios materiales de alcance requieren una anotación fechada al final de la ficha o un nuevo ADR enlazado, además de entrada en CHANGELOG. No se reescribe el historial para ocultar decisiones.
- Cualquier tarea nueva posterior lleva `AV-074`, `AV-075`, etc., siguiendo el orden de creación; si es una subtarea interna se usa `AV-021/S1` solamente como referencia, no como identificador independiente ni como sustituto de `AV-021`.
- La cadena exacta `AV-NNN` debe figurar en rama, descripción del cambio, pruebas relevantes y registro de cierre. Un `AV-NNN` en un commit **no** significa que el punto esté terminado.

### Semántica de estados

| Estado | Significado | ¿Se marca `[x]`? |
| --- | --- | --- |
| `Pendiente` | Sin trabajo iniciado | No |
| `Documentado / sin integrar ni aprobar` | Existe un archivo entregado aparte, pero no consta aceptación o integración en el repo | No |
| `Propuesto para revisión / sin integrar` | Entregable preparado, sujeto a revisión del mantenedor | No |
| `En curso` | Trabajo efectuándose; aún falta verificación | No |
| `En revisión` | Material integrado, falta evidencia o aprobación | No |
| `Bloqueado` | Riesgo crítico, dependencia o prueba fallida impide avanzar | No |
| `Completado` | Pasa el Definition of Done (DoD), evidencia verificable y aceptación del mantenedor | **Sí** |
| `Cancelado (ID reservado)` | Se decidió no ejecutar; causa y ADR registrados | No |

**Única regla de cierre:** cambiar `#### [ ]` a `#### [x]` **solo** al cumplirse el DoD y quedar evidencia de aceptación. Si la documentación existe pero no consta en Git o no se ha revisado, permanece `[ ]`. No se declara ejecutado, subido a GitHub, probado o aprobado por el mero hecho de proporcionar un ZIP.

### Estado inicial de todos los puntos (2026-11-02)

| ID | Estado de seguimiento | Evidencia documental preparada (no implica integración) |
| --- | --- | --- |
| AV-001 | Documentado / integración y aceptación locales pendientes de verificar | `docs/scope.md`, `README.md` |
| AV-002 | Documentado / integración y aceptación locales pendientes de verificar | `docs/security/threat-model.md` |
| AV-003 | Documentado / integración y aceptación locales pendientes de verificar | `SECURITY.md`, `docs/security/principles.md` |
| AV-004 | Documentado / integración y aceptación locales pendientes de verificar | `docs/architecture.md`, `docs/decisions/ADR-001.md` |
| AV-005 | Documentado / integración y aceptación locales pendientes de verificar | `ROADMAP.md`, `CONTRIBUTING.md`, `CHANGELOG.md` |
| AV-006 | Archivos preparados / commit y revisión pendientes | `.gitignore`, `README.md`, documentos AV-001 a AV-005 |
| AV-007 | En revisión — pruebas superadas, pendiente de aceptación | Instalación y compilación correctas en WSL y Windows; commit f3b7b48 |
| AV-008 | En revisión — PR #1 abierta; pruebas superadas; pendiente de integración y aceptación | 29/29 pruebas de arquitectura; npm run check correcto en WSL |
| AV-009 | Pendiente | — |
| AV-010 | Pendiente | — |
| AV-011 | Pendiente | — |
| AV-012 | Pendiente | — |
| AV-013 | Pendiente | — |
| AV-014 | Pendiente | — |
| AV-015 | Pendiente | — |
| AV-016 | Pendiente | — |
| AV-017 | Pendiente | — |
| AV-018 | Pendiente | — |
| AV-019 | Pendiente | — |
| AV-020 | Pendiente | — |
| AV-021 | Pendiente | — |
| AV-022 | Pendiente | — |
| AV-023 | Pendiente | — |
| AV-024 | Pendiente | — |
| AV-025 | Pendiente | — |
| AV-026 | Pendiente | — |
| AV-027 | Pendiente | — |
| AV-028 | Pendiente | — |
| AV-029 | Pendiente | — |
| AV-030 | Pendiente | — |
| AV-031 | Pendiente | — |
| AV-032 | Pendiente | — |
| AV-033 | Pendiente | — |
| AV-034 | Pendiente | — |
| AV-035 | Pendiente | — |
| AV-036 | Pendiente | — |
| AV-037 | Pendiente | — |
| AV-038 | Pendiente | — |
| AV-039 | Pendiente | — |
| AV-040 | Pendiente | — |
| AV-041 | Pendiente | — |
| AV-042 | Pendiente | — |
| AV-043 | Pendiente | — |
| AV-044 | Pendiente | — |
| AV-045 | Pendiente | — |
| AV-046 | Pendiente | — |
| AV-047 | Pendiente | — |
| AV-048 | Pendiente | — |
| AV-049 | Pendiente | — |
| AV-050 | Pendiente | — |
| AV-051 | Pendiente | — |
| AV-052 | Pendiente | — |
| AV-053 | Pendiente | — |
| AV-054 | Pendiente | — |
| AV-055 | Pendiente | — |
| AV-056 | Pendiente | — |
| AV-057 | Pendiente | — |
| AV-058 | Pendiente | — |
| AV-059 | Pendiente | — |
| AV-060 | Pendiente | — |
| AV-061 | Pendiente | — |
| AV-062 | Pendiente | — |
| AV-063 | Pendiente | — |
| AV-064 | Pendiente | — |
| AV-065 | Pendiente | — |
| AV-066 | Pendiente | — |
| AV-067 | Pendiente | — |
| AV-068 | Pendiente | — |
| AV-069 | Pendiente | — |
| AV-070 | Pendiente | — |
| AV-071 | Pendiente | — |
| AV-072 | Pendiente | — |
| AV-073 | Pendiente | — |

### Registros de ejecución por punto

Al reanudar una tarea, utilizar siempre esta plantilla en la respuesta, descripción de PR o nota de cierre. Las rutas `docs/` y `tests/` del punto son fuente primaria; no crear archivos extra sin necesidad.

```text
Punto: AV-NNN — <título exacto de la ficha>
Estado: Pendiente | En curso | En revisión | Bloqueado | Completado
Objetivo textual: <copia exacta del «Trabajo concreto» del roadmap>
Dependencias: <IDs previos y decisiones ADR aplicables>
Archivos previstos: <rutas del roadmap>
Archivos efectivamente tocados: <rutas comprobadas>
Implementación/documentación: <qué cambió y por qué>
Pruebas: <comando o procedimiento, resultado y evidencia; o «no aplica» justificado>
Seguridad: <POL-xx y amenazas relevantes, riesgos nuevos>
Git: <rama, commit y PR si existen; «no ejecutado» cuando corresponda>
Criterio «Terminado cuando»: <cita de la ficha>
Resultado: APTO | NO APTO; observaciones
Aceptación del mantenedor: PENDIENTE | ACEPTADO (fecha y evidencia)
Siguiente punto recomendado: AV-NNN
```

Para retomar basta pedir **«Continuemos con AV-021»**. Se toma literalmente la ficha original: primero contexto y riesgos; luego implementación, pruebas y revisión; por último registro de estado. **No adelantar tareas** aunque compartan archivos. Para puntos documentales, las pruebas aplicables son integridad, enlaces, referencias, consistencia, trazabilidad y revisión humana; no se inventan resultados de ejecución.

### Puertas entre fases

Se habilita una fase posterior solo si todos los puntos obligatorios de la fase previa están `Completado` o si existe una excepción formal, fechada, con riesgo evaluado y aceptación explícita. Una excepción **no** puede saltarse las políticas P0 de [principles.md](docs/security/principles.md), las pruebas de seguridad exigidas o el gate de lanzamiento AV-073.

### Registro operativo de riesgos (complementario al modelo de amenazas)

El registro siguiente representa **riesgos del proyecto**, no sustituye [threat-model.md](docs/security/threat-model.md). `P0` = bloquea el punto/fase afectado o la distribución; `P1` = requiere mitigación planificada. Son valoraciones iniciales, no pruebas de vulnerabilidad explotable. Responsable predeterminado: mantenedor del proyecto (sin designación nominal). Se actualiza al cambiar estado, alcance o probabilidad.

| Riesgo | Prioridad | Desencadenante / impacto | Tratamiento y punto dueño | Estado |
| --- | --- | --- | --- | --- |
| RSK-001 | P0 | Cifrado incorrecto o claves persistidas en claro → fuga masiva | Revisión de primitivas, vectores y auditoría; AV-012–018, AV-066 | Abierto |
| RSK-002 | P0 | Relleno a origen incorrecto o DOM hostil → exposición | Coincidencia exacta, aprobación, anti-TOCTOU; AV-044–051, AV-065 | Abierto |
| RSK-003 | P1 | Terminación del worker provoca múltiples desbloqueos → UX inviable | Medir la frecuencia, debatir cambio de ADR-001 antes de cambiar almacenamiento de claves; AV-029–031 | Abierto |
| RSK-004 | P0 | Respaldo inválido o importación destructiva → pérdida de bóveda | Exportación autenticada, importación transaccional y restore de prueba; AV-058–061, AV-068 | Abierto |
| RSK-005 | P0 | Credenciales reales, backups o secretos llegan al repositorio/CI | Fixtures ficticios, inspección de cambios y bloqueo de publicación; AV-006, AV-067 | Abierto |
| RSK-006 | P1 | Roadmap renumerado o cambios sin rastreo → imposibilidad de retomar | Inmutabilidad AV-NNN, ADR y revisión de diffs; AV-005 | En tratamiento documental |
| RSK-007 | P0 | Se comunica seguridad auditada sin revisión externa → confianza infundada | Mensajes limitados, informe AV-069 y gate AV-073 | Abierto |
| RSK-008 | P0 | Dependencia o bundle comprometido → ejecución de código ajeno | Lockfile, revisión manual, sin CDN ni código remoto; AV-007, AV-012, AV-067 | Abierto |
| RSK-009 | P1 | Permisos MV3 o diferencias de navegador → fallos de integración | Privilegios mínimos y pruebas en Chrome/Brave; AV-009, AV-044, AV-064 | Abierto |
| RSK-010 | P1 | Entregables documentados no integrados → estado del proyecto engañoso | Verificar rutas y aceptación antes de marcar `[x]`; AV-001–005, AV-006 | En tratamiento documental |

**Actualización mínima de un riesgo:** registrar fecha `AAAA-MM-DD`, `RSK-NNN`, descripción/cambio, prioridad, estado, decisión y `AV-NNN` implicado. Si afecta a claves, DOM o privacidad, actualizar AV-002/003 y considerar un ADR. Nunca registrar contraseñas reales en la evidencia.

### Convenciones Git, versiones y bitácora

- **Ramas:** `docs/AV-005-workflow`, `feat/AV-032-create-credential`, `fix/AV-049-validate-sender`, `test/AV-065-phishing`. La rama `main` permanece estable; los PR se usan cuando GitHub esté disponible, sin inventar aprobaciones.
- **Commits:** Conventional Commits con `Refs: AV-NNN` en el cuerpo o al pie; los mensajes que cierran puntos deben mencionar el resultado, no declarar auditorías inexistentes. Ver ejemplos y comandos en [CONTRIBUTING.md](CONTRIBUTING.md).
- **Versiones de software:** SemVer `MAJOR.MINOR.PATCH`. Desarrollo previo a la primera liberación bajo `0.y.z` y prereleases (p. ej. `0.1.0-alpha.1`) **solo cuando exista un artefacto compilado y probado**. La versión de un documento (como v1.0 del roadmap) **no equivale** a release de software. `1.0.0` requiere superar AV-073.
- **CHANGELOG:** cambios significativos en sección `[Unreleased]` hasta crear la etiqueta correspondiente. Fechas ISO `AAAA-MM-DD` para liberaciones reales, nunca fechas o tags simulados.
- **Operaciones Git:** `git push`, merges, etiquetas o cambios remotos solo mediante acción explícita; los documentos entregados por el asistente pueden copiarse manualmente.

**Referencias de las convenciones:** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html), [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), [GitHub: ramas protegidas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

---

## Fases y puntos ejecutables

### FASE 01 — Alcance, amenazas y diseño

#### [ ] AV-001 — Definir alcance funcional v1.0

**Trabajo concreto:** Documentar casos de uso: crear bóveda, desbloquear, gestionar credenciales, generar, buscar, rellenar manualmente, exportar e importar; enumerar exclusiones (servidor, sincronización, móvil, TOTP, passkeys y guardado automático).

**Archivos previstos:** `docs/scope.md, README.md`

**Terminado cuando:** Existe una matriz de requisitos con prioridades y una definición comprobable del MVP.

#### [ ] AV-002 — Modelo de amenazas

**Trabajo concreto:** Listar activos, adversarios y límites: páginas hostiles, phishing, extensiones comprometidas, malware local, robo de respaldo, fuga por portapapeles, errores de DOM y pérdida de contraseña maestra. Distinguir ataques mitigables y no mitigables.

**Archivos previstos:** `docs/security/threat-model.md`

**Terminado cuando:** Cada amenaza crítica tiene mitigación y prueba prevista, o una limitación declarada.

#### [ ] AV-003 — Política de seguridad y privacidad

**Trabajo concreto:** Fijar reglas: solo pruebas con cuentas ficticias; nunca telemetría de secretos; sin red en el MVP; sin cifrado inventado; sin autoenvío de formularios; sin guardar automáticamente sin consentimiento; sin prometer seguridad auditada.

**Archivos previstos:** `SECURITY.md, docs/security/principles.md`

**Terminado cuando:** Checklist de reglas aceptado y reflejado en la documentación.

#### [ ] AV-004 — Arquitectura y límites de confianza

**Trabajo concreto:** Dibujar popup, pestaña bóveda, service worker, content script, motor criptográfico, almacenamiento, mensajes. Definir qué componente puede ver claves y qué componente solo recibe credenciales aprobadas.

**Archivos previstos:** `docs/architecture.md, docs/decisions/ADR-001.md`

**Terminado cuando:** Diagrama y contrato de confianza concretos, sin secretos persistentes en componentes de página.

#### [ ] AV-005 — Contrato de trabajo y seguimiento

**Trabajo concreto:** Establecer convención AV-NNN, Definition of Done, nombres de ramas, mensajes de commit, convenciones de versiones, registro de riesgos y CHANGELOG. Mantener los números estables.

**Archivos previstos:** `ROADMAP.md, CONTRIBUTING.md, CHANGELOG.md`

**Terminado cuando:** Se puede retomar cualquier punto por identificador sin reinterpretarlo.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 02 — Repositorio y extensión mínima

#### [ ] AV-006 — Inicializar repositorio

**Trabajo concreto:** Crear repo AegisVault en local y, cuando se indique, enlazarlo a GitHub. Agregar .gitignore, README, licencia tras elegirla conscientemente y estructura documental; nunca subir secretos ni .env.

**Archivos previstos:** `README.md, .gitignore, LICENSE (si se elige)`

**Terminado cuando:** Git limpio, primer commit documentado y sin datos sensibles.

#### [ ] AV-007 — Entorno TypeScript y herramientas

**Trabajo concreto:** Configurar npm, TypeScript estricto, Vite, scripts dev/build/check, formato, lint y fijación reproducible de dependencias.

**Archivos previstos:** `package.json, package-lock.json, tsconfig.json, eslint.config.*, vite.config.ts`

**Terminado cuando:** Instalación desde cero y compilación sin errores en Windows/WSL.

#### [ ] AV-008 — Estructura modular de carpetas

**Trabajo concreto:** Separar core/crypto, core/domain, core/storage, core/session, extension/background, extension/content, ui/popup, ui/vault, shared y tests; establecer reglas de importación.

**Archivos previstos:** `src/, tests/, docs/`

**Terminado cuando:** Ningún módulo dependiente del navegador invade el núcleo de dominio.

#### [ ] AV-009 — Manifest V3 y permisos mínimos

**Trabajo concreto:** Declarar manifest, iconos, action, service worker, CSP sin código remoto y permisos mínimos. Dejar acceso a páginas mediante activeTab + scripting y no solicitar <all_urls> de entrada.

**Archivos previstos:** `public/manifest.json, public/icons/*`

**Terminado cuando:** Chrome/Brave cargan la extensión unpacked sin permisos excesivos.

#### [ ] AV-010 — Popup, bóveda y worker vacíos

**Trabajo concreto:** Construir popup básico, página de bóveda y worker orientado a eventos. Verificar apertura/cierre y reinicio del worker sin pérdida de estado persistido.

**Archivos previstos:** `src/ui/popup/*, src/ui/vault/*, src/extension/background/*`

**Terminado cuando:** Las tres vistas funcionan y no presentan errores en DevTools.

#### [ ] AV-011 — Protocolo interno y CI inicial

**Trabajo concreto:** Definir mensajes tipados, validación de origen/emisor, respuestas y errores; añadir ejecución de typecheck, lint y pruebas vacías en CI.

**Archivos previstos:** `src/shared/messages.ts, src/shared/errors.ts, .github/workflows/ci.yml`

**Terminado cuando:** Mensajes no reconocidos se rechazan y CI reproduce verificaciones locales.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 03 — Motor criptográfico aislado

#### [ ] AV-012 — Elegir e integrar Argon2id

**Trabajo concreto:** Evaluar implementación mantenida y auditable (WASM empaquetado localmente); verificar licencias, compatibilidad CSP y vectores de prueba; nada descargado desde CDN en ejecución.

**Archivos previstos:** `src/core/crypto/kdf.ts, docs/decisions/ADR-002.md`

**Terminado cuando:** Derivación determinista con parámetros guardados y funcionamiento offline.

#### [ ] AV-013 — Aleatoriedad y codificación

**Trabajo concreto:** Crear utilidades con crypto.getRandomValues / crypto.subtle.generateKey, generación de salt/IV, codificación binaria y errores tipados; prohibir Math.random para material secreto.

**Archivos previstos:** `src/core/crypto/random.ts, encoding.ts`

**Terminado cuando:** Pruebas demuestran formatos correctos y ausencia de generadores inseguros.

#### [ ] AV-014 — KDF con sal y parámetros versionados

**Trabajo concreto:** Derivar KEK desde contraseña maestra y salt único de bóveda; fijar parámetros Argon2id con benchmark y mínimos OWASP; conservar m/t/p en encabezado versionado.

**Archivos previstos:** `src/core/crypto/kdf.ts, tests/crypto/kdf.test.ts`

**Terminado cuando:** Misma entrada produce la misma KEK; salt diferente cambia resultado; benchmark documentado.

#### [ ] AV-015 — Clave de datos y envoltura de clave

**Trabajo concreto:** Generar DEK aleatoria AES-256 y envolverla mediante una KEK derivada, con AES-GCM y IV único. Definir por qué cambiar la maestra solo reenvuelve DEK, sin descifrar todo el conjunto.

**Archivos previstos:** `src/core/crypto/keys.ts, docs/security/key-hierarchy.md`

**Terminado cuando:** Unwrap correcto con maestra válida; error autenticado con maestra incorrecta.

#### [ ] AV-016 — Formato cifrado autenticado

**Trabajo concreto:** Definir esquema JSON binario versionado: version, kdf, salt, wrap, IV, ciphertext/tag, AAD (identidad/tipo/versión). Asegurar IV nuevo de 96 bits para cada operación AES-GCM con la misma clave.

**Archivos previstos:** `src/core/crypto/envelope.ts, docs/formats/vault-v1.md`

**Terminado cuando:** Formato serializable y validado; cambio de campos protegidos se detecta.

#### [ ] AV-017 — Cifrado/descifrado de registros

**Trabajo concreto:** Implementar encryptRecord/decryptRecord usando AES-256-GCM, AAD ligado al id de registro y esquema; todos los campos sensibles (título, dominio, usuario, secreto, notas) cifrados.

**Archivos previstos:** `src/core/crypto/records.ts, tests/crypto/records.test.ts`

**Terminado cuando:** Roundtrip exacto y fallo ante adulteración o sustitución entre registros.

#### [ ] AV-018 — Pruebas criptográficas adversariales

**Trabajo concreto:** Agregar vectores conocidos, pruebas de salt distinto, IV no reutilizado, contraseña errónea, bytes truncados, etiquetas alteradas, payloads enormes y errores previsibles.

**Archivos previstos:** `tests/crypto/*, docs/test-matrix.md`

**Terminado cuando:** Toda prueba automatizada pasa; ninguna excepción muestra material secreto.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 04 — Persistencia cifrada y confiabilidad

#### [ ] AV-019 — Esquema IndexedDB

**Trabajo concreto:** Diseñar stores vault-header, encrypted-records, metadata técnica y schema-version; documentar qué metadatos quedan visibles y por qué.

**Archivos previstos:** `src/core/storage/schema.ts`

**Terminado cuando:** DB se crea/abre y el esquema es reproducible en reinicios.

#### [ ] AV-020 — Adaptador transaccional de almacenamiento

**Trabajo concreto:** Implementar acceso IndexedDB aislado de core/domain, manejo de errores/quota, transacciones, cierre y operaciones tipadas.

**Archivos previstos:** `src/core/storage/indexeddb.ts, repository.ts`

**Terminado cuando:** Pruebas de lectura, escritura, borrado y rollback correctas.

#### [ ] AV-021 — Guardar y recuperar solo cifrado

**Trabajo concreto:** Persistir encabezado y registros cifrados, sin contraseña maestra ni claves en disco; comprobar manualmente DevTools IndexedDB para detectar texto visible.

**Archivos previstos:** `src/core/storage/vault-repository.ts`

**Terminado cuando:** Ninguna URL, usuario, contraseña o nota es legible en almacenamiento en reposo.

#### [ ] AV-022 — Consistencia ante concurrencia

**Trabajo concreto:** Serializar escrituras autorizadas, gestionar revisiones, cambios entre pestañas, operaciones simultáneas y cierre en mitad de una operación; evitar sobrescrituras silenciosas.

**Archivos previstos:** `src/core/storage/write-queue.ts, tests/storage/concurrency.test.ts`

**Terminado cuando:** Dos acciones simultáneas no pierden cambios y un fallo no corrompe la bóveda.

#### [ ] AV-023 — Versiones y migraciones

**Trabajo concreto:** Definir migraciones explícitas de esquema y formato cifrado con copias recuperables y política fail-closed ante versiones desconocidas.

**Archivos previstos:** `src/core/storage/migrations.ts, docs/formats/migration-policy.md`

**Terminado cuando:** La versión desconocida se rechaza sin modificar datos.

#### [ ] AV-024 — Recuperación ante fallos de almacenamiento

**Trabajo concreto:** Simular cuota llena, DB incompleta, transacción abortada, registro adulterado y cierre inesperado. Mostrar error sin borrar datos válidos.

**Archivos previstos:** `tests/storage/failure.test.ts, docs/recovery.md`

**Terminado cuando:** Bóveda intacta o recuperación guiada; nunca reinicialización silenciosa.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 05 — Contraseña maestra, desbloqueo y sesiones

#### [ ] AV-025 — Pantalla de bienvenida

**Trabajo concreto:** UI para crear primera bóveda, advertir almacenamiento local y explicar que desinstalar extensión/perder perfil puede eliminarla; mostrar ruta de backup.

**Archivos previstos:** `src/ui/onboarding/*`

**Terminado cuando:** Un usuario nuevo entiende qué se guardará y que no existe recuperación por servidor.

#### [ ] AV-026 — Validar contraseña maestra

**Trabajo concreto:** Solicitar contraseña + confirmación, permitir frases largas, mostrar guía de robustez sin reglas absurdas de caracteres, evitar exponerla a logs o persistencia.

**Archivos previstos:** `src/ui/onboarding/master-password.ts, src/core/domain/password-policy.ts`

**Terminado cuando:** Contraseñas cortas/confirmaciones diferentes se rechazan claramente.

#### [ ] AV-027 — Crear bóveda cifrada

**Trabajo concreto:** Integrar salt + KDF + DEK + wrap + encabezado autenticado; guardar solo datos cifrados y parámetros públicos; prevenir creación sobre bóveda existente.

**Archivos previstos:** `src/core/vault/create-vault.ts`

**Terminado cuando:** Se crea una bóveda válida que puede volver a abrirse después de reiniciar.

#### [ ] AV-028 — Desbloquear y validar maestra

**Trabajo concreto:** Desenvolver DEK con la maestra y validar integridad; diferenciar incorrecta/corrupción sin filtrar datos; no incluir reintentos que simulen proteger un archivo robado contra ataque offline.

**Archivos previstos:** `src/core/vault/unlock-vault.ts, src/ui/popup/unlock/*`

**Terminado cuando:** Contraseña incorrecta no desbloquea; correcta sí; reinicio exige desbloqueo.

#### [ ] AV-029 — Diseño de sesión desbloqueada

**Trabajo concreto:** Documentar estrategia para MV3: service worker se suspende. Evaluar almacenamiento temporal chrome.storage.session con acceso TRUSTED_CONTEXTS para material de sesión de corta vida, caducidad verificable y riesgo residual; no usar storage.local ni content scripts para claves.

**Archivos previstos:** `docs/decisions/ADR-003-session.md`

**Terminado cuando:** Modelo de sesión y amenazas revisados antes de escribir código.

#### [ ] AV-030 — Implementar sesión y controles de mensajes

**Trabajo concreto:** Guardar exclusivamente estado temporal imprescindible en contexto privilegiado; comprobar quién solicita cada operación, pestaña y gesto explícito; nunca exponer clave a content scripts.

**Archivos previstos:** `src/core/session/session-manager.ts, src/extension/background/session.ts`

**Terminado cuando:** Reinicio del worker manejado, content script sin acceso a clave o lista completa.

#### [ ] AV-031 — Bloqueo explícito y por inactividad

**Trabajo concreto:** Botón bloquear, expiración mediante tiempo absoluto + alarmas/idle según aplique, y limpieza de sesión al cerrar navegador, actualizar o recargar extensión; cerrar vistas sensibles.

**Archivos previstos:** `src/core/session/lock-policy.ts, src/ui/popup/lock.ts`

**Terminado cuando:** Al expirar nunca se descifra ni autocompleta sin introducir de nuevo la maestra.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 06 — Gestión manual de credenciales

#### [ ] AV-032 — Modelo validado de credencial

**Trabajo concreto:** Definir id, título, URL(s) permitida(s), usuario, contraseña, notas, createdAt/updatedAt y versión; normalización de URL separada de las comparaciones de origen.

**Archivos previstos:** `src/core/domain/credential.ts, validators.ts`

**Terminado cuando:** Entradas inválidas no alcanzan el cifrado ni el DOM.

#### [ ] AV-033 — Formulario de alta

**Trabajo concreto:** Capturar manualmente título, URL/origen, usuario, secreto y notas, con confirmaciones mínimas; no guardar sin acción explícita.

**Archivos previstos:** `src/ui/vault/components/credential-form.ts`

**Terminado cuando:** Crear una cuenta de prueba produce un único registro cifrado.

#### [ ] AV-034 — Listar credenciales desbloqueadas

**Trabajo concreto:** Leer, descifrar en contexto privilegiado y mostrar resumen en UI confiable; estado vacío, cargando y error. Nunca entregar la lista completa al content script.

**Archivos previstos:** `src/core/vault/list-credentials.ts, src/ui/vault/list.ts`

**Terminado cuando:** Bóveda bloqueada no muestra títulos o dominios; desbloqueada sí.

#### [ ] AV-035 — Buscar y filtrar localmente

**Trabajo concreto:** Búsqueda por título, nombre de usuario y origen solo en memoria desbloqueada; no publicar índice de sitios en texto plano en IndexedDB.

**Archivos previstos:** `src/core/domain/search.ts, src/ui/vault/search.ts`

**Terminado cuando:** Se encuentran cuentas correctas sin filtrar metadatos al almacenamiento.

#### [ ] AV-036 — Consultar, revelar y copiar

**Trabajo concreto:** Vista detallada con contraseña oculta por defecto; revelar/copia bajo gesto explícito y aviso del riesgo de portapapeles; no asumir que limpiar portapapeles sea garantía de eliminación.

**Archivos previstos:** `src/ui/vault/detail.ts, src/ui/shared/copy.ts`

**Terminado cuando:** No hay revelación ni copia automática; UI se oculta al bloquear.

#### [ ] AV-037 — Editar credenciales

**Trabajo concreto:** Permitir cambiar campos, generar nuevo ciphertext/IV y actualizar fecha; comprobar integridad y conflictos antes de persistir.

**Archivos previstos:** `src/core/vault/update-credential.ts, src/ui/vault/edit.ts`

**Terminado cuando:** Una edición sobrevive reinicio; ciphertext cambia aunque algunos campos no cambien.

#### [ ] AV-038 — Eliminar credenciales

**Trabajo concreto:** Confirmación de borrado y transacción atómica; documentar límites de borrado seguro en almacenamiento flash y copias del navegador.

**Archivos previstos:** `src/core/vault/delete-credential.ts, src/ui/vault/delete.ts`

**Terminado cuando:** Registro desaparece de la lista y no puede descifrarse desde el almacén activo.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 07 — Generador y análisis local

#### [ ] AV-039 — Generador criptográfico

**Trabajo concreto:** Implementar selección sin sesgo apreciable usando CSPRNG, letras, números y símbolos; no usar Math.random, no guardar historiales de lo generado.

**Archivos previstos:** `src/core/generator/password-generator.ts`

**Terminado cuando:** Pruebas de longitud, alfabetos, entropía teórica y propiedades pasan.

#### [ ] AV-040 — Configuración del generador

**Trabajo concreto:** UI con longitud configurable, grupos de caracteres, evitar ambiguos y validación de combinaciones imposibles.

**Archivos previstos:** `src/ui/generator/generator-controls.ts`

**Terminado cuando:** Toda combinación permitida genera secretos válidos y no produce resultados vacíos.

#### [ ] AV-041 — Integración generador–credencial

**Trabajo concreto:** Generar al crear/editar, insertar solo tras confirmación y permitir regenerar antes de guardar.

**Archivos previstos:** `src/ui/vault/components/credential-form.ts`

**Terminado cuando:** Registro final queda cifrado; no persiste la contraseña descartada.

#### [ ] AV-042 — Detección de reutilización

**Trabajo concreto:** Comparar contraseñas localmente únicamente al desbloquear, con resultados en memoria; evitar registrar valores y no enviar hashes a servicios externos.

**Archivos previstos:** `src/core/audit/reuse.ts`

**Terminado cuando:** Se detectan dos registros con el mismo secreto sin exponerlo en logs.

#### [ ] AV-043 — Informe local de higiene

**Trabajo concreto:** Avisos sobre duplicadas, vacías, muy cortas u orígenes inseguros; separar indicadores heurísticos de certezas, sin afirmar detección de filtraciones.

**Archivos previstos:** `src/ui/vault/security-audit.ts`

**Terminado cuando:** Panel advierte problemas de cuentas ficticias con explicaciones verificables.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 08 — Navegador: detección y autocompletado

#### [ ] AV-044 — Permisos bajo demanda

**Trabajo concreto:** Pedir acceso mediante activeTab/scripting por gesto del usuario; no lectura constante de todas las pestañas ni permisos globales salvo necesidad futura justificada.

**Archivos previstos:** `public/manifest.json, src/extension/background/permissions.ts`

**Terminado cuando:** Sin acceso a una página no hay lectura o inyección; se solicita solo al activar la función.

#### [ ] AV-045 — Detector seguro de formularios

**Trabajo concreto:** Detectar inputs de usuario/contraseña visibles, editables y relevantes; soportar formularios básicos, labels y autocompletes HTML; no leer otras contraseñas de la página para almacenarlas.

**Archivos previstos:** `src/extension/content/form-detector.ts`

**Terminado cuando:** Encuentra formularios de prueba sin leer ni transmitir campos ajenos.

#### [ ] AV-046 — Normalización y coincidencia de orígenes

**Trabajo concreto:** Parsear URL con URL API, exigir HTTPS por defecto (excepción explícita para laboratorios locales en 127.0.0.1 durante desarrollo), coincidencia exacta de esquema+host+puerto o alias aprobados explícitamente; no equiparar subdominios ni ignorar homógrafos/punycode.

**Archivos previstos:** `src/core/domain/origin-policy.ts`

**Terminado cuando:** github.com.ejemplo.com no coincide con github.com; http no coincide con https.

#### [ ] AV-047 — Credenciales asociadas a la pestaña

**Trabajo concreto:** Desde popup confiable, obtener URL de pestaña activa y filtrar dentro de contexto privilegiado; devolver al usuario solo opciones permitidas para ese origen.

**Archivos previstos:** `src/extension/background/match-credentials.ts, src/ui/popup/site-matches.ts`

**Terminado cuando:** Solo aparecen cuentas para origen autorizado y bóveda desbloqueada.

#### [ ] AV-048 — Autocompletado manual

**Trabajo concreto:** El usuario elige una credencial y pulsa Rellenar; enviar solo los valores específicos al content script de la pestaña/origen verificados, mediante mensaje tipado y una única operación; no autoenviar formulario.

**Archivos previstos:** `src/extension/background/fill.ts, src/extension/content/form-filler.ts`

**Terminado cuando:** Formulario ficticio se rellena tras gesto; sitio incorrecto, origen cambiado o bóveda bloqueada se rechazan.

#### [ ] AV-049 — Protección ante navegación y mensajes falsos

**Trabajo concreto:** Volver a comprobar tabId/frameId/documentId y origen inmediatamente antes de rellenar, validar remitente/estructura y prevenir respuestas reutilizadas o operaciones en pestañas equivocadas.

**Archivos previstos:** `src/extension/background/authorization.ts, tests/security/messaging.test.ts`

**Terminado cuando:** Carreras de navegación y mensajes malformados no liberan credenciales.

#### [ ] AV-050 — Sitios dinámicos y SPA

**Trabajo concreto:** Adaptar detector a elementos insertados tras carga, formularios en diálogos, cambios de rutas y controles JS; evitar observadores permanentes innecesarios.

**Archivos previstos:** `src/extension/content/dynamic-forms.ts`

**Terminado cuando:** Funciona en 2–3 páginas locales SPA sin observar toda la navegación.

#### [ ] AV-051 — Iframes y casos no compatibles

**Trabajo concreto:** Decidir explícitamente política para marcos: denegar cross-origin y frames no autorizados por defecto; documentar web components, shadow DOM y formularios no soportados.

**Archivos previstos:** `src/extension/content/frame-policy.ts, docs/compatibility.md`

**Terminado cuando:** Iframes de terceros no reciben claves; incompatibilidades están documentadas.

#### [ ] AV-052 — Propuesta de guardar nueva contraseña

**Trabajo concreto:** Detectar una credencial introducida por el usuario solamente durante flujo autorizado, proponer guardarla mediante UI de extensión y requerir confirmación; no capturar ni subir automáticamente secretos de otras páginas.

**Archivos previstos:** `src/extension/content/save-detection.ts, src/ui/popup/save-prompt.ts`

**Terminado cuando:** Se solicita consentimiento y ningún dato se conserva si el usuario rechaza.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 09 — Experiencia de uso y configuración

#### [ ] AV-053 — Popup definitivo

**Trabajo concreto:** Pantallas bloqueado, desbloqueado, coincidencias del sitio, agregar, generar y bloquear. Navegación rápida sin mostrar datos antes de desbloquear.

**Archivos previstos:** `src/ui/popup/*`

**Terminado cuando:** Flujo completo sin abrir consola y sin errores de accesibilidad importantes.

#### [ ] AV-054 — Bóveda de página completa

**Trabajo concreto:** Listado, detalle, edición, búsqueda, configuración y estado de seguridad en vista extensiva responsive, conservando autorizaciones por operación.

**Archivos previstos:** `src/ui/vault/*`

**Terminado cuando:** 100+ credenciales ficticias se gestionan sin degradación significativa.

#### [ ] AV-055 — Preferencias locales seguras

**Trabajo concreto:** Configurar bloqueo, confirmación de llenado, opciones del generador y apariencia; distinguir preferencias no sensibles de material secreto.

**Archivos previstos:** `src/core/settings/*, src/ui/settings/*`

**Terminado cuando:** Preferencias sobreviven reinicio y nunca desactivan salvaguardas críticas silenciosamente.

#### [ ] AV-056 — Accesibilidad, textos y errores

**Trabajo concreto:** Etiquetas, tabulación, enfoque, contraste, estados accesibles, no revelar contraseñas en notificaciones y mensajes claros sobre datos corruptos o permisos denegados.

**Archivos previstos:** `src/ui/shared/*, docs/ux-guidelines.md`

**Terminado cuando:** Operación con teclado y pruebas básicas de accesibilidad superadas.

#### [ ] AV-057 — Rendimiento y carga

**Trabajo concreto:** Optimizar cifrado y búsquedas según tamaño; evitar derivar Argon2 en cada operación; medir latencias de apertura y tareas en Chrome/Brave.

**Archivos previstos:** `tests/performance/*, docs/performance.md`

**Terminado cuando:** Mediciones documentadas con volumen de datos ficticios y sin congelar la UI.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 10 — Respaldos, restauración y cambio de maestra

#### [ ] AV-058 — Formato de exportación cifrada

**Trabajo concreto:** Diseñar contenedor exportable con versión y KDF/wrap, datos cifrados, integridad y advertencia: el archivo permite ataques offline si la maestra es débil.

**Archivos previstos:** `src/core/backup/format.ts, docs/formats/backup-v1.md`

**Terminado cuando:** Exportación es portable y no contiene ningún secreto en texto claro.

#### [ ] AV-059 — Exportar desde UI

**Trabajo concreto:** Generar respaldo bajo gesto explícito y bóveda desbloqueada, nombres seguros, manejo de errores y avisos de almacenamiento de archivos.

**Archivos previstos:** `src/core/backup/export.ts, src/ui/settings/export.ts`

**Terminado cuando:** Archivo se descarga, se valida y no contiene strings de cuentas de prueba.

#### [ ] AV-060 — Importar y validar respaldo

**Trabajo concreto:** Leer archivo sin ejecutarlo; limitar tamaños/estructuras, validar versión e integridad antes de tocar datos; pedir contraseña maestra del respaldo si corresponde.

**Archivos previstos:** `src/core/backup/import.ts, src/ui/settings/import.ts`

**Terminado cuando:** Archivos corruptos, enormes o maliciosos se rechazan sin alterar bóveda existente.

#### [ ] AV-061 — Restauración y resolución de conflictos

**Trabajo concreto:** Implementar restauración en bóveda vacía y política explícita para reemplazar/fusionar; respaldo previo y transacción segura, sin pérdida silenciosa.

**Archivos previstos:** `src/core/backup/restore.ts, tests/backup/restore.test.ts`

**Terminado cuando:** Exportar→borrar perfil de pruebas→restaurar recupera todos los registros exactos.

#### [ ] AV-062 — Cambiar contraseña maestra

**Trabajo concreto:** Con bóveda desbloqueada verificar maestra actual, derivar nueva KEK con salt nuevo, reenvolver DEK y persistir de manera segura; invalidar sesiones previas; documentar impacto en backups antiguos.

**Archivos previstos:** `src/core/vault/change-master-password.ts, src/ui/settings/master-password.ts`

**Terminado cuando:** Maestra antigua deja de desbloquear bóveda actual, nueva sí; backup antiguo conserva su contraseña anterior.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 11 — Pruebas de integración y seguridad

#### [ ] AV-063 — Matriz de pruebas unitarias

**Trabajo concreto:** Cobertura de dominio, aleatoriedad, cifrado, almacenamiento, sesión, validación de orígenes, búsqueda, generador y migraciones.

**Archivos previstos:** `tests/unit/*, docs/test-matrix.md`

**Terminado cuando:** CI pasa con pruebas en casos normales, límites y errores.

#### [ ] AV-064 — Pruebas E2E con navegador

**Trabajo concreto:** Automatizar instalación unpacked y recorridos: onboarding, altas, editar, bloquear, desbloquear, copiar, generar y rellenar en formularios locales.

**Archivos previstos:** `tests/e2e/*, test-sites/*`

**Terminado cuando:** Recorridos repetibles pasan en Chromium y revisión manual en Brave.

#### [ ] AV-065 — Pruebas de phishing y aislamiento

**Trabajo concreto:** Sitios falsos, subdominios adversarios, unicode/punycode, redirecciones, iframes, sitio que cambia después del clic, inyección de mensajes, contenido hostil y formularios invisibles.

**Archivos previstos:** `tests/security/phishing.test.ts, tests/security/content-boundary.test.ts`

**Terminado cuando:** No hay divulgación a origen distinto ni sin gesto explícito; se reconoce que el sitio legítimo puede leer su propio formulario rellenado.

#### [ ] AV-066 — Auditoría de almacenamiento y secretos

**Trabajo concreto:** Examinar IndexedDB, storage.local/session, network, console, extensiones y cierre de procesos; verificar que nada sensible aparece persistentemente o en logs.

**Archivos previstos:** `docs/security/storage-audit.md, tests/security/no-plaintext.test.ts`

**Terminado cuando:** No aparecen credenciales o claves persistidas en claro; riesgos residuales declarados.

#### [ ] AV-067 — Auditoría de dependencias y CSP

**Trabajo concreto:** npm audit como señal, revisión manual de librerías críticas, hashes/licencias de WASM, ausencia de código remoto, innerHTML peligroso/eval, permisos excesivos.

**Archivos previstos:** `docs/security/dependency-review.md`

**Terminado cuando:** Vulnerabilidades críticas aplicables resueltas o release bloqueado con justificación.

#### [ ] AV-068 — Pruebas de resiliencia y pérdida de datos

**Trabajo concreto:** Forzar suspensión del worker, reiniciar navegador, actualizar extensión, operación interrumpida, cuota agotada, archivo corrupto y perfil de pruebas restaurado.

**Archivos previstos:** `tests/resilience/*, docs/recovery.md`

**Terminado cuando:** Sin pérdida de datos silenciosa, secretos inaccesibles tras lock y backups recuperables.

#### [ ] AV-069 — Revisión de seguridad independiente

**Trabajo concreto:** Checklist manual por alguien diferente al autor o revisión externa del código crypto/messaging/autofill; registrar hallazgos, severidad y remedios; evitar etiquetar como auditado sin auditoría real.

**Archivos previstos:** `docs/security/review-report.md`

**Terminado cuando:** No hay hallazgos críticos sin remediar y las limitaciones están publicadas.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

### FASE 12 — Documentación y distribución controlada

#### [ ] AV-070 — Documentación de instalación y uso

**Trabajo concreto:** README con requerimientos, instalación developer mode, capturas propias, advertencias, tutorial de respaldo, recuperación y guía de desarrolladores.

**Archivos previstos:** `README.md, docs/installation.md, docs/user-guide.md`

**Terminado cuando:** Un tercero puede compilar y probar con credenciales ficticias siguiendo la guía.

#### [ ] AV-071 — Licencia, versiones y publicación de código

**Trabajo concreto:** Elegir licencia OSS conscientemente, completar CHANGELOG, semver, etiquetas y política de reporte privado de vulnerabilidades; no confundir licencia permisiva con garantía de seguridad.

**Archivos previstos:** `LICENSE, CHANGELOG.md, SECURITY.md`

**Terminado cuando:** Release tag corresponde al commit probado y documentación coincide con artefacto.

#### [ ] AV-072 — Paquete local y beta cerrada

**Trabajo concreto:** Build de producción sin sourcemaps públicos involuntarios ni archivos privados, ZIP instalable unpacked y pruebas con cuentas ficticias de pocos usuarios.

**Archivos previstos:** `dist/, scripts/package-release.*, docs/beta-test.md`

**Terminado cuando:** Instalación limpia en Chrome y Brave con checklist de regresión completada.

#### [ ] AV-073 — Criterio de salida v1.0 y siguiente roadmap

**Trabajo concreto:** Evaluar pruebas, riesgo, datos recuperables, permisos, compatibilidad, revisión independiente, issues pendientes; decidir si solo beta o posible publicación tienda. Documentar backlog posterior Firefox, escritorio, passkeys, TOTP, sincronización.

**Archivos previstos:** `docs/release-gate.md, docs/roadmap-post-v1.md`

**Terminado cuando:** Decisión de publicación justificada; si falla algún control crítico permanece como prototipo.

**Puerta de fase:** se pasan todos los criterios de los puntos anteriores antes de entrar en la fase siguiente.

## Criterios para declarar un punto terminado

1. Código o documento del alcance completado y revisado; sin cambios ajenos al punto.
2. Instrucciones de ejecución reproducibles; comandos exactos cuando pasemos a implementar.
3. Pruebas relevantes pasadas, con evidencia cuando corresponda y sin datos reales.
4. Amenazas/limitaciones actualizadas si cambia la superficie de ataque.
5. Estado de Git comprobado; commit/push solo cuando lo autorices o lo ejecutemos expresamente.
6. Estado de avance anotado en ROADMAP y CHANGELOG; siguiente número indicado.

## Referencias oficiales consultadas al diseñar este roadmap (2026-10-31)

- [Chrome — Service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- [Chrome — Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [Chrome — Improve extension security](https://developer.chrome.com/docs/extensions/develop/migrate/improve-security)
- [Chrome — Offscreen API (alternativa documentada, NO requerida en MVP)](https://developer.chrome.com/docs/extensions/reference/api/offscreen)
- [MDN — AES-GCM params e IV](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams)
- [MDN — crypto.getRandomValues](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
- [OWASP — Password Storage Cheat Sheet (Argon2id)](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

> **Aviso:** Este es un plan de ingeniería, no una certificación de seguridad. Cualquier cambio en APIs o bibliotecas debe verificarse en el momento de implementación. La revisión externa en AV-069 es un requisito recomendable antes de usar contraseñas reales, no una promesa de que la revisión encontrará todos los defectos.
