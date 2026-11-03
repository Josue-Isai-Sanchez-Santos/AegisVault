# AegisVault

**Gestor local de contraseñas para Chrome y Brave — extensión Manifest V3.**

> **Estado: documentación de AV-001 a AV-005 preparada; AV-006 (inicialización Git local) pendiente de ejecutar y verificar en el equipo del mantenedor.** Todavía no existe una extensión funcional ni se ha realizado una auditoría de seguridad. **No usar con contraseñas reales.**

## ¿Qué es AegisVault?

AegisVault es un proyecto de software **en desarrollo**, con intención de publicación como código abierto tras elegir expresamente una licencia, para construir una extensión que gestione credenciales en una bóveda local cifrada, accesible mediante contraseña maestra, sin servidor, cuentas remotas ni sincronización en la versión 1.0.

Sus objetivos son:

- Crear, bloquear y desbloquear una bóveda local protegida.
- Añadir, buscar, consultar, editar y eliminar credenciales.
- Generar contraseñas mediante aleatoriedad criptográficamente segura.
- **Rellenar manualmente** formularios compatibles tras la selección expresa de una cuenta, con validación del origen y sin enviar automáticamente el formulario.
- Exportar e importar **respaldos cifrados** y verificar su recuperación.
- Funcionamiento local y offline para la gestión de credenciales.

**No se incluye en v1.0:** servidor, sincronización, aplicación móvil, TOTP, passkeys, guardado automático desde páginas web ni autoenvío de formularios.

## Documentación

Los siguientes archivos están incluidos en el paquete de inicialización de AV-006; su existencia en el paquete **no demuestra** que ya se hayan integrado o aprobado en un repositorio local:

- [ROADMAP.md](ROADMAP.md): 73 puntos inmutables, Definition of Done y registro de riesgos.
- [CONTRIBUTING.md](CONTRIBUTING.md): flujo de trabajo, revisión, ramas y commits.
- [CHANGELOG.md](CHANGELOG.md): historial de cambios documentados y liberaciones reales.
- [SECURITY.md](SECURITY.md): política de seguridad y reporte de vulnerabilidades.
- [docs/scope.md](docs/scope.md): alcance y criterios del MVP.
- [docs/security/threat-model.md](docs/security/threat-model.md): activos, adversarios, riesgos y mitigaciones.
- [docs/security/principles.md](docs/security/principles.md): políticas y controles obligatorios.
- [docs/architecture.md](docs/architecture.md): componentes, mensajes y fronteras de confianza.
- [docs/decisions/ADR-001.md](docs/decisions/ADR-001.md): decisión inicial sobre el service worker y claves.

**Licencia:** todavía sin seleccionar. No se incluye archivo `LICENSE` ni se concede una licencia open source hasta tomar una decisión consciente, revisar dependencias y añadir su texto íntegro.

## Decisiones técnicas previstas

| Área | Propuesta inicial |
| --- | --- |
| Lenguaje | TypeScript |
| Plataforma | Google Chrome y Brave (Chromium / Manifest V3) |
| Persistencia | IndexedDB, con datos privados cifrados |
| Derivación de clave | Argon2id, parámetros pendientes de validar |
| Cifrado autenticado | AES-256-GCM |
| Interacción web | Permisos mínimos y relleno manual autorizado |
| Almacenamiento remoto | Ninguno en v1.0 |

Estas elecciones son decisiones de diseño pendientes de implementación y validación. Los detalles criptográficos, modelo de amenazas, dependencias y arquitectura se documentarán en los puntos correspondientes del roadmap.

## Progreso

| Fase/punto | Estado |
| --- | --- |
| AV-001 a AV-005 | Documentos preparados e incluidos en el paquete; aceptación del mantenedor por verificar |
| AV-006 | Archivos preparados; Git y primer commit locales aún por verificar |
| AV-007 a AV-073 | Pendientes |

**Puerta de fase:** antes de dar por cerrada la fase 01, revisar formalmente y aceptar los criterios de AV-001 a AV-005. No marcar puntos `[x]` ni anunciar un commit si no existe evidencia local.

## ¿Cómo sabremos que se alcanzó el MVP?

La v1.0 exige demostrar, en Chrome y Brave y usando **solo datos ficticios**, los flujos de creación/desbloqueo, CRUD, búsqueda, generación, bloqueo, rellenado manual, persistencia local, exportación y restauración cifradas, rechazo ante phishing y errores, uso offline y verificación de seguridad.

La definición exacta incluye **22 requisitos funcionales (19 P0 y 3 P1)**, **12 controles no funcionales** y **16 pruebas de aceptación**: [ver `docs/scope.md`](docs/scope.md).

La publicación de código en GitHub no implica que sea seguro usarlo para almacenar contraseñas reales.

## Desarrollo y pruebas

Aún no se ha configurado el entorno de compilación ni se ha implementado código. La instalación de dependencias, el manifest y los comandos de ejecución se documentarán conforme avance la **FASE 02**.

## Referencias

- [Chrome Extensions — Developer Documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome — Declaración de permisos](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
- [OWASP — Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
