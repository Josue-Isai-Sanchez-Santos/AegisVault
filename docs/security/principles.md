# AegisVault — Principios de seguridad y privacidad

| Campo | Valor |
| --- | --- |
| Identificador | **AV-003** |
| Documento | `docs/security/principles.md` |
| Versión | 1.0 (normativa de diseño) |
| Aplicación | Extensión de Chrome y Brave basada en Manifest V3, MVP/v1.0 |
| Estado | **Reglas documentadas; revisión y aceptación del mantenedor pendientes** |
| Fuente interna | [AV-001 — Alcance](../scope.md) y [AV-002 — Modelo de amenazas](threat-model.md) |
| Documento público complementario | [SECURITY.md](../../SECURITY.md) |

> **Advertencia obligatoria:** AegisVault no está auditado ni implementa todavía las garantías descritas aquí. Hasta superar revisión de seguridad independiente, solo se desarrollará y probará con cuentas y datos ficticios. Esta política define prohibiciones y criterios de aceptación, no resultados de pruebas ya ejecutadas.

## 1. Finalidad y vocabulario normativo

Este documento convierte el alcance y las amenazas identificadas en AV-001/AV-002 en **reglas que deberán aplicar a todo cambio de código**, documentación, pruebas, distribución y comunicación de AegisVault. Si un requisito técnico entra en conflicto con una regla P0, **se detiene su aceptación** y se decide formalmente antes de continuar.

- **DEBE / PROHIBIDO**: obligatorio, incumplimiento **P0 (bloqueante)** para la fase o funcionalidad afectada.
- **DEBERÍA**: recomendación justificada; omitirla exige registrar la razón y verificar que no rompe un P0.
- **PENDIENTE**: política acordada a nivel de diseño pero no implementada, probada ni verificada.
- **Secreto:** contraseña maestra, credencial de sitio, clave/derivado criptográfico, token, registro descifrado, archivo de backup descifrado y material que permite autenticarse.
- **Dato privado:** título de registro, sitio/URL/origen, nombre de usuario, nota, identificador asociable y demás contenidos de la bóveda, aunque por sí solos no sean contraseñas.
- **Metadatos técnicos públicos del contenedor:** versión de formato, identificadores de algoritmo, sal y parámetros de KDF, IV/nonce y etiqueta de autenticación conforme al formato. **No se confunden con secretos**, aunque el tamaño y patrones del contenedor puedan revelar información limitada y deben reconocerse como riesgo residual.
- **Consentimiento explícito de operación:** interacción inequívoca que autoriza una acción concreta; no se deduce por visitar una web, colocar foco en un campo o desbloquear la bóveda.

## 2. Principios rectores

1. **Privacidad por diseño:** mínima recolección y mínima exposición. Una extensión de contraseñas no necesita conocer toda la navegación del usuario.
2. **Local-first verificable:** las operaciones sobre la bóveda no dependen de Internet; el código de la extensión no inicia conexiones externas en el MVP.
3. **Cifrado reconocido y autenticado:** nunca inventar primitivas, modos de operación ni combinaciones ad hoc sin respaldo. Parámetros, biblioteca y formato se determinarán y probarán en AV-012–018.
4. **Separación de privilegios:** la página web y el content script son fronteras menos confiables que el núcleo; jamás reciben contraseña maestra, KEK o DEK.
5. **Acción expresa:** copiar, mostrar, rellenar, respaldar, restaurar y borrar secretos deben obedecer controles explícitos y el estado de desbloqueo aplicable.
6. **Fallar de forma segura:** origen dudoso, permiso ausente, sesión expirada, error de red interna de la extensión (no debe haber red externa), registro manipulado o backup inválido → denegar o cancelar, sin filtrar datos ni afirmar éxito.
7. **Transparencia del riesgo residual:** proteger datos cifrados en reposo no protege un sistema operativo ya comprometido ni el secreto cuando aparece en una web autorizada.
8. **Prueba antes de afirmación:** las políticas y pruebas propuestas no permiten anunciar «seguridad auditada» o «listo para producción».

## 3. Matriz normativa de reglas verificables

**Estado inicial de todas las reglas: PENDIENTE DE IMPLEMENTACIÓN/PRUEBA.** La prioridad P0 expresa una obligación para el MVP, no que ya se cumpla.

| ID | Regla obligatoria (P0) | Verificación prevista | Vinculación |
| --- | --- | --- | --- |
| **POL-01** | Probar **únicamente con cuentas ficticias**, sitios propios/de laboratorio y archivos sintéticos; excluir datos reales de ejemplos, CI, screenshots, logs y commits. | Revisar fixtures y artefactos; ejecutar suite con datos centinela sintéticos. | T-17/T-19 · AV-063–069 |
| **POL-02** | **Nunca** implementar telemetría, analítica, tracking, crash reporting remoto ni registro de secretos. | Revisar fuentes, dependencias, bundle, tráfico y errores. | T-11/T-23 · ST-02/ST-12/ST-25 |
| **POL-03** | **Ninguna solicitud de red propia en ejecución del MVP:** sin servidor, sync, API, CDN, consulta de reputación, actualización remota, fetch ni WebSocket de la extensión. | Operar offline y vigilar tráfico saliente atribuible a la extensión. | EX-001 · T-23 · ST-25 · AV-067 |
| **POL-04** | Usar **criptografía reconocida**: Argon2id y AES-256-GCM con generación aleatoria segura; no diseñar cifrados, KDF o PRNG propios. | Revisión de dependencias, vectores criptográficos y uso de Web Crypto. | T-02/T-03/T-22 · AV-012–018 |
| **POL-05** | Prohibido persistir en claro la contraseña maestra, KEK, DEK o material equivalente. **Solo almacenar DEK protegida/envolvida**, nunca su versión descifrada. | Inspección de IndexedDB, preferencias, variables persistentes y backup. | T-01/T-10/T-13 · ST-01/ST-02 |
| **POL-06** | Cifrar títulos, dominios/URL, usuarios, contraseñas y notas; evitar índices sensibles persistentes en claro. | Buscar cadenas centinela en almacenamiento y exportaciones. | T-01 · ST-01/ST-15 · AV-016–024 |
| **POL-07** | Rellenar **solo con acción del usuario**, bóveda desbloqueada, permiso suficiente y origen completo `scheme://host:port` coincidente. | Sitios parecidos, HTTP, puertos, cambios de documento y frames. | T-05–T-09 · ST-06–ST-10 |
| **POL-08** | No enviar formularios automáticamente ni rellenar al cargar, enfocar o visitar una página. | Verificar que solo cambia campos y el sitio no recibe un submit provocado por AegisVault. | EX-007 · AV-045–052 |
| **POL-09** | No guardar contraseñas automáticamente, ni capturar registros de una página en segundo plano. Una sugerencia contextual futura debe exigir aceptación **inequívoca**. | Probar rechazo/cancelación, ausencia de escrituras y flujo de alta manual. | EX-006 · RF-020(P1) · AV-032/AV-052 |
| **POL-10** | No enviar contraseña maestra, KEK ni DEK a content scripts, DOM, mensajes de página u otros orígenes. | Mensajes adversariales y auditoría de datos serializados. | T-08/T-09 · ST-09 · AV-004/049 |
| **POL-11** | Pedir permisos mínimos y preferir `activeTab`/permisos temporales. No exigir acceso permanente `*://*/*` para el MVP. | Inspeccionar `manifest.json`, prompts de permisos y comportamiento con denegación. | T-08/T-19 · AV-009/044 |
| **POL-12** | Empaquetar el código de ejecución y dependencias localmente; no incluir JavaScript/WASM remotos, `eval` ni ejecución dinámica insegura. | Revisar CSP, bundle y dependencias; análisis estático. | T-12/T-19/T-23 · ST-21 |
| **POL-13** | No colocar secretos o datos privados en logs, excepciones, *console*, mensajes de error, URLs, telemetría, CI ni informes de soporte. | Inspeccionar errores forzados, trazas y artefactos. | T-11 · ST-02/ST-12 |
| **POL-14** | Exportación solo **cifrada y autenticada**; nunca CSV/JSON en claro como función ordinaria. Importar con validación y confirmación, sin dañar la bóveda al fallar. | Inspección de archivos y pruebas de corrupción/restauración. | T-14/T-15/T-21 · ST-15–ST-17 |
| **POL-15** | Bloquear por acción/inactividad; tras bloqueo ningún contexto puede ver, copiar o rellenar sin nuevo desbloqueo. No dar por seguro `storage.session` sin modelar su riesgo. | Reinicios de worker, cambios de pestaña, expiración y denegación. | T-10/T-13 · ST-13/ST-14 |
| **POL-16** | Copiar contraseñas **solo tras gesto explícito** y advertir que portapapeles e historial quedan fuera de control completo. | Probar copia manual y texto de advertencia. | T-16 · ST-18 |
| **POL-17** | No prometer protección contra malware local, keyloggers, otras extensiones capaces de observar el DOM o un sitio autorizado comprometido. | Revisión de README, pantallas, avisos y comunicación pública. | T-17/T-18/T-24 · ST-19/ST-20/ST-26 |
| **POL-18** | No prometer recuperación de contraseña maestra en v1.0; advertir pérdida irreversible posible y exigir flujo de respaldo verificado. | Mensajes de inicio y restauración en instalación de prueba. | T-20/T-21 · ST-22/ST-23 |
| **POL-19** | No declarar «auditado», «certificado», «impenetrable» ni «seguro para contraseñas reales» sin evidencia específica e independiente. | Revisar descripción, README, releases y página de distribución. | AV-069–073 · SECURITY.md |
| **POL-20** | No publicar secretos, archivos privados de bóveda, claves ni reportes sensibles en GitHub. Divulgación coordinada mediante canal privado **verificado**, cuando exista. | Checklist de revisión de commits e instrucciones del canal. | AV-006/067/071 |
| **POL-21** | No operar sobre formularios dentro de `iframes` en el MVP; incumplimiento de origen, documento o visibilidad válida debe **rechazar el relleno**. | Páginas de prueba con iframes y navegación. | T-06/T-09 · ST-08/ST-10 · AV-051 |
| **POL-22** | No asumir compatibilidad de incógnito ni actuar sobre orígenes especiales/locales sin diseño, permiso y pruebas explícitas; **rechazar por defecto**. | Pruebas de permisos/incógnito y páginas restringidas. | DEC-09 · AV-009/044/051 |
| **POL-23** | Antes de distribuir: inspeccionar el artefacto compilado, dependencias y tráfico; ejecutar pruebas P0 en Chrome y Brave y documentar riesgos sin resolver. | Informe de AV-063–069 y checklist de entrega AV-072/073. | AT-14/AT-15/AT-16 · ST-21/ST-25 |

### 3.1 Reglas adicionales recomendadas (P1)

| ID | Recomendación | Límite |
| --- | --- | --- |
| **REC-01** | Minimizar el tiempo de vida del texto claro y limpiar referencias cuando sea posible. | JavaScript, recolector de basura, SO y memoria no ofrecen garantía de borrado físico completo. |
| **REC-02** | Dejar los mensajes de errores suficientemente informativos para depurar sin incluir secretos ni datos identificativos. | Un reporte no debe convertirse en canal de exfiltración. |
| **REC-03** | Adoptar actualizaciones de dependencias revisadas con lockfile y pruebas de regresión. | Una dependencia popular o firmada no está libre de vulnerabilidades. |
| **REC-04** | Diseñar una notificación clara cuando la contraseña sea visible o copiada. | Mostrar/ocultar no impide capturas del sistema operativo. |
| **REC-05** | Dar instrucciones para almacenar un respaldo cifrado fuera del perfil del navegador. | No garantiza recuperación si se pierde la contraseña maestra. |

## 4. Tratamiento de datos y privacidad por categoría

| Categoría | Uso autorizado en MVP | Persistencia permitida | Transferencia de red propia |
| --- | --- | --- | --- |
| Contraseña maestra | Derivar material de desbloqueo localmente | **No en claro**; sal/parámetros/KDF y datos cifrados según diseño | **Prohibida** |
| KEK/DEK descifradas | Descifrado/cifrado y operación durante sesión autorizada | **No en claro en persistencia**; tratamiento temporal sujeto a AV-029 | **Prohibida** |
| Credenciales, usuarios, títulos, sitios, notas | CRUD, búsqueda tras desbloqueo, relleno manual | **Solo cifradas** | **Prohibida**, salvo entrega puntual al DOM del sitio autorizado por acción del usuario (no es una llamada de red de la extensión) |
| Datos públicos de cabecera criptográfica | Descifrado compatible, migración, integridad | En claro si el diseño formal lo permite y autentica lo necesario | **Prohibida** |
| Preferencias no privadas | Tema y parámetros de UI no sensibles | Local en claro solo tras clasificación | **Prohibida** |
| Diagnóstico | Errores genéricos y contadores no identificativos en entorno de pruebas | Solo datos no sensibles, preferentemente efímeros | **Prohibida** |
| Archivo de respaldo | Recuperación solicitada por el usuario | Exportación cifrada y autenticada | **Prohibida** |

**Importante:** una página web de login puede transmitir por sus propios medios la contraseña que el usuario decidió rellenar. No puede bloquearse esa posibilidad desde el gestor; AegisVault nunca deberá activar por su cuenta el envío del formulario. Tampoco se confunde el tráfico de instalación/actualización del navegador o el gestor de paquetes de desarrollo con solicitudes ejecutadas por la extensión.

### 4.1 Prohibición de registro accidental

Nunca hacer `console.log` de objetos de credencial, llamadas completas a APIs de cifrado, tokens de sesión, errores que incluyan un registro descifrado ni mensajes con clave/contraseña. Los casos de prueba deben usar **valores sintéticos** y verificar que no aparecen en logs, informes de CI ni reportes de fallos. El análisis manual debe revisar además capturas de pantalla, herramientas de desarrollo y artefactos de compilación.

### 4.2 Sin envío de datos por diseño

La versión 1.0 **no** tendrá endpoints externos, SDK de analítica, verificaciones en la nube, comprobadores externos de contraseñas filtradas, URL de monitoreo ni dependencias que descarguen código en ejecución. Si se detecta una solicitud originada por código de AegisVault, se considera un **incumplimiento P0** hasta demostrar su origen y corregirlo. La v1.0 puede operar en un navegador con Internet, pero el funcionamiento local de la bóveda no debe depender de Internet.

### 4.3 Permisos y DOM

- No leer formularios ajenos para crear registros sin una acción autorizada.
- No inyectarse masivamente en todos los sitios por conveniencia; justificar cada permiso.
- Validar siempre esquema, host y puerto completos **antes** de seleccionar credencial e inmediatamente **antes** de rellenar.
- En un fallo de validación o salto de documento, no entregar el secreto.
- Los valores insertados pueden ser leídos por scripts de la página; el consentimiento de relleno se limita a **ese origen** y operación.
- Evitar ejecutar datos de registros como HTML/JS; renderizarlos como texto.

## 5. Reglas específicas para repositorio, incidencias y documentación

| Superficie | Permitido | Prohibido |
| --- | --- | --- |
| Repositorio | Código, ejemplos ficticios, fixtures sintéticos, documentación | `.env` con secretos reales, respaldos privados, capturas reales, tokens, claves o credenciales reales |
| CI/CD | Pruebas sintéticas, escaneos, resumen de fallos sin secretos | Impresión de variables sensibles o fixtures reales |
| Issues/PR públicos | Descripciones sin datos sensibles, bugs reproducibles con demo | Pasos que revelen explotación no corregida, archivos de bóveda y secretos |
| Consola | Identificadores genéricos de estado de prueba, sin contenido privado | Dump de objetos de sesión, contraseña maestra, credenciales y ciphertext con material de depuración sensible |
| README/releases | Estado real, limitaciones, evidencias verificables | Promesa de auditoría o seguridad no demostradas |

En AV-006/AV-071 se deberá habilitar, verificar y documentar un **canal privado** de reportes de vulnerabilidades; hasta entonces no se publicará ninguna dirección inventada en `SECURITY.md`.

## 6. Gestión de cambios y excepciones

**No se permiten excepciones silenciosas a POL-01 a POL-23.** Si una nueva funcionalidad necesita red, sincronización, autoguardado, formularios automáticos, permisos globales u otro cambio que contradiga AV-001:

1. **Detener** la implementación de la parte afectada.
2. Proponer una decisión técnica (`docs/decisions/ADR-xxx.md` en AV-004 o posterior) que explique motivo, alternativas, riesgos, datos tocados y consentimiento.
3. Actualizar primero `docs/scope.md`, `docs/security/threat-model.md`, este documento y `SECURITY.md`.
4. Diseñar nuevos controles y pruebas de aceptación, con revisión independiente cuando se trate de nuevos riesgos P0.
5. Aprobar explícitamente la variación de alcance; no atribuirla automáticamente al MVP/v1.0.

**No es una excepción admisible** saltarse cifrado, insertar claves en el DOM, guardar secretos silenciosamente ni ocultar limitaciones por rapidez de desarrollo.

## 7. Plan de verificación y evidencias por etapa

| Cuándo | Qué comprobar | Registro de evidencia |
| --- | --- | --- |
| **AV-003 (ahora)** | Existencia de `SECURITY.md` y este archivo, reglas POL-01..POL-23, referencias y checklist | Revisión documental; **no** se ejecutan pruebas de software |
| AV-006–011 | Paquete, permisos mínimos, CSP y ausencia de peticiones/código remoto | Manifiesto, lockfile, informe de revisión |
| AV-012–024 | KDF/AEAD, tratamiento de claves y almacenamiento cifrado | Pruebas ST-01..ST-05, ST-24 |
| AV-025–043 | Bloqueo, logs, manejo manual y portapapeles | ST-12..ST-14, ST-18, ST-22 |
| AV-044–052 | Origen, permiso, protección de mensajes y DOM, ausencia de autoenvío/autoguardado | ST-06..ST-11, ST-20, ST-26 |
| AV-058–062 | Respaldo cifrado, restauración y pérdida de clave maestra | ST-15..ST-17, ST-23 |
| AV-063–069 | Suite de seguridad, revisión de dependencias y limitaciones | ST-01..ST-27; revisión independiente |
| AV-070–073 | Comunicación de riesgo, política de publicación, beta y gate final | Informe de release, condiciones AV-073 |

## 8. Checklist formal para aceptar AV-003

Estas casillas evalúan **documentación**, no controles ya implementados:

- [x] `SECURITY.md` advierte que el proyecto no está auditado ni listo para contraseñas reales.
- [x] Se prohíbe usar credenciales reales durante desarrollo y pruebas.
- [x] Se prohíben telemetría de secretos, logging de secretos y solicitudes de red propias en ejecución del MVP.
- [x] Se obliga a criptografía conocida y se prohíbe inventar cifrados/PRNG.
- [x] Se prohíben autoenvío de formularios y autorrelleno silencioso.
- [x] Se prohíbe guardar credenciales sin consentimiento explícito.
- [x] Se exige cifrado de metadatos privados y de respaldos.
- [x] Se establece mínimo privilegio y separación de claves frente a content scripts.
- [x] Se declaran límites frente a malware, páginas autorizadas hostiles y portapapeles.
- [x] Se establece divulgación responsable **sin inventar un canal de reporte**.
- [x] Se incluye matriz de políticas, etapas de verificación y control de cambios.
- [x] Se vincula con `docs/scope.md`, `docs/security/threat-model.md` y `SECURITY.md`.
- [ ] **El mantenedor revisó y aceptó expresamente estas reglas.**
- [ ] **Los dos archivos se incorporaron al repositorio del proyecto.**

**Resultado de AV-003:** documentación elaborada y lista para aceptación. No se debe marcar «completado e integrado» hasta confirmar las dos casillas finales. Ningún requisito POL-xx se declara implementado o probado en esta etapa.

## 9. Fuentes y justificación técnica

Estas fuentes sustentan controles generales; no certifican AegisVault.

- **[REF-01]** [OWASP — Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html): modelado y control de amenazas.
- **[REF-02]** [OWASP — Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html): excluir contraseñas, claves y datos sensibles de logs.
- **[REF-03]** [OWASP — Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html): selección de criptografía y cifrado autenticado.
- **[REF-04]** [Chrome — Protect user privacy](https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy): mínimos permisos y tratamiento de datos.
- **[REF-05]** [Chrome — Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions): `activeTab` y permisos de acceso por sitio.
- **[REF-06]** [Chrome — Improve extension security](https://developer.chrome.com/docs/extensions/develop/migrate/improve-security): código empaquetado y restricciones Manifest V3.
- **[REF-07]** [Chrome — Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage): almacenamiento local, session y contextos de extensión.
- **[REF-08]** [Chrome Web Store — Program policies](https://developer.chrome.com/docs/webstore/program-policies/policies): divulgación y privacidad si se decide publicar la extensión.
- **[REF-09]** [GitHub — Private vulnerability reporting](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately): canal privado **solo si está habilitado**.

---

**Siguiente punto:** **AV-004 — Arquitectura y límites de confianza**, con diagrama y contrato de mensajes entre popup, bóveda, worker, content script y núcleo criptográfico. La elección de componentes debe respetar POL-01..POL-23.
