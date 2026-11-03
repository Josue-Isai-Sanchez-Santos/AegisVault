# AegisVault — Modelo de amenazas v1.0

| Campo | Valor |
| --- | --- |
| Proyecto | AegisVault |
| Documento | `docs/security/threat-model.md` |
| Identificador de trabajo | **AV-002** |
| Versión del documento | **1.0 — borrador de diseño** |
| Estado | **Amenazas y controles propuestos; implementación y pruebas pendientes** |
| Plataformas | Chrome y Brave, extensión Chromium Manifest V3 |
| Alcance | Bóveda local cifrada, gestión de credenciales, rellenado manual, respaldos cifrados |
| Dependencia | AV-001 — [`docs/scope.md`](../scope.md) |
| Revisión obligatoria | AV-004 (arquitectura), AV-029/031 (sesiones), AV-046/051 (sitios), AV-066/069 (auditoría) |

> **Advertencia:** este es un modelo de riesgos, no evidencia de controles implementados ni una auditoría. No usar AegisVault para contraseñas reales en esta etapa. Todas las pruebas se harán con cuentas ficticias y sitios de ensayo bajo nuestro control. No se debe probar una página ajena mediante acciones que alteren su funcionamiento.

## 1. Propósito y metodología

**Propósito:** identificar qué debemos proteger, de quién, en qué fronteras de confianza y con qué controles comprobables. El objetivo de AV-002 no es implementar seguridad, sino dejar **criterios verificables** para los puntos posteriores del roadmap.

Usamos el método recomendado por **OWASP Threat Modeling**: representar el sistema, identificar amenazas y respuestas, y mantener el modelo actualizado. Empleamos **STRIDE** como lista de comprobación: suplantación (S), manipulación (T), repudio (R), divulgación de información (I), denegación de servicio (D) y elevación de privilegios (E). No pretende ser una evaluación estadística ni asigna probabilidades sin datos [REF-01].

### 1.1 Convenciones

- **P0 / bloqueante:** incumplir el control o no declarar una limitación asociada impide dar por seguro el flujo afectado y, si pertenece al MVP, impide aprobar la v1.0.
- **P1 / alto:** debe tratarse antes del lanzamiento o justificarse explícitamente como riesgo residual aceptado en revisión independiente.
- **P2 / seguimiento:** seguimiento documentado; puede pasar a P0/P1 si cambia el contexto.
- **Mitigable:** AegisVault puede aplicar un control técnico y demostrar que reduce el riesgo bajo los supuestos del sistema.
- **Parcial:** puede reducir exposición o consecuencias, pero no eliminar el riesgo.
- **No mitigable por la extensión:** exige medidas externas o es una limitación del modelo de confianza. No se afirmará protección que no existe.
- **Pendiente de verificación:** todo control indicado aquí hasta que exista código, pruebas repetibles y evidencias.

La **prioridad** refleja importancia de diseño y consecuencias potenciales, **no** una probabilidad numérica calculada. Un riesgo parcialmente mitigable puede seguir siendo P0 si se debe limitar antes de lanzar.

## 2. Límites del producto y supuestos

### 2.1 Dentro del alcance

- Una bóveda por instalación/perfil de navegador; funcionamiento local y sin servidor ni telemetría propia.
- Contraseña maestra, derivación Argon2id, clave de datos aleatoria protegida mediante clave derivada y AES-256-GCM; los parámetros/formatos exactos se decidirán y probarán posteriormente.
- Datos de credenciales cifrados en reposo: **títulos, orígenes, usuarios, contraseñas y notas**; búsqueda tras desbloqueo, sin índice sensible persistente en claro.
- Alta, consulta, cambio, eliminación, generación y copia explícita de contraseñas; bloqueo manual/por inactividad.
- Rellenado **manual y autorizado** en páginas HTTPS compatibles, sin autoenvío y sin guardar automáticamente los formularios.
- Exportación/importación de **respaldo cifrado y autenticado**, con verificación previa a restaurar.

### 2.2 Fuera del alcance, de acuerdo con AV-001

Sin servidor, sincronización, aplicación móvil, Firefox como objetivo de v1.0, passkeys, TOTP, guardado silencioso de credenciales, inicio de sesión automático, importación/exportación ordinaria en texto plano, recuperación remota de contraseña maestra ni protección garantizada de un sistema operativo/navegador comprometido.

### 2.3 Supuestos de confianza **condicionales**

1. El usuario instaló una copia auténtica de AegisVault y un navegador actualizado, y el paquete no fue alterado.
2. El sistema operativo, el navegador y el mecanismo criptográfico proporcionan las garantías habituales **mientras no estén comprometidos**.
3. El perfil local no es un límite de seguridad frente a administradores del sistema, malware con privilegios o procesos que puedan leer/modificar sus archivos o memoria.
4. La contraseña maestra la conoce el usuario; una contraseña débil puede ser adivinada mediante ataques offline si un adversario obtiene el archivo cifrado.
5. Un sitio legítimo puede ser malicioso o estar comprometido: la coincidencia exacta de origen **no** garantiza la honestidad de su contenido.
6. No se presume que otras extensiones instaladas sean benignas. Sus permisos y aislamiento pueden variar, y una extensión especialmente privilegiada puede observar formularios o interacciones.
7. La extensión no controla el portapapeles global, el historial del portapapeles, el teclado físico, capturas, copias del sistema ni los respaldos que el usuario guarde fuera de ella.

**Consecuencia:** AegisVault protege principalmente **datos en reposo** y reduce la entrega inadvertida de secretos a **orígenes distintos**. No puede garantizar confidencialidad de una contraseña **después de insertarla en el DOM de un sitio**, ni frente al control completo de su entorno de ejecución.

## 3. Activos y propiedades de seguridad

| ID | Activo | Exposición posible | Propiedad requerida |
| --- | --- | --- | --- |
| A-01 | Contraseña maestra | Entrada de interfaz, memoria durante derivación | No persistir, transmitir, registrar ni enviar a scripts de contenido |
| A-02 | KEK (clave derivada) | Memoria del contexto criptográfico | Uso limitado, vida corta; nunca persistir en claro |
| A-03 | DEK (clave de datos) | Memoria del contexto autorizado / envoltura cifrada | Persistir solo protegida; nunca entregar a content scripts |
| A-04 | Credenciales y notas | Bóveda cifrada, memoria al desbloquear, DOM al rellenar | Confidencialidad en reposo, integridad, acceso condicionado |
| A-05 | Metadatos (título, usuario, origen, identificadores) | Almacenamiento, interfaz, búsquedas | Cifrar también los metadatos privados; minimizar metadatos públicos |
| A-06 | Base de datos local y versiones de formato | IndexedDB y archivos del perfil | Integridad autenticada, transacciones, compatibilidad controlada |
| A-07 | Estado de sesión / material de desbloqueo | Memoria y mecanismo de sesión pendiente de diseño | Bloqueo efectivo, expiración, no otorgar capacidades por mensaje forjado |
| A-08 | Respaldos cifrados | Descargas, USB, servicios externos elegidos por el usuario | Cifrado, autenticación, portabilidad, validación y restauración segura |
| A-09 | Autorización para rellenar | Popup, pestaña, frame, mensajes y permisos | Gesto inequívoco, vinculación a origen/pestaña/documento, uso acotado |
| A-10 | Integridad del código y dependencias | Paquete instalado, npm, CI, actualizaciones | Evitar código remoto; validar procedencia, dependencias y artefactos |
| A-11 | Disponibilidad de la bóveda | Datos y respaldos locales | Recuperación probada, errores seguros, no sobrescritura destructiva |
| A-12 | Portapapeles | Aplicaciones ajenas e historial del SO | Exposición consciente y transitoria cuando el usuario copia |

### 3.1 Qué datos podrán permanecer sin cifrar

Solo los **metadatos técnicos indispensables** para interpretar y desbloquear el contenedor: versión del esquema criptográfico, identificador de algoritmo, `salt`, parámetros Argon2id, IV/nonce necesarios y otros encabezados no privados explícitamente justificados. El formato exacto se definirá en AV-016/AV-019. Se evitará exponer en claro dominio, usuario, título, nota, número de cuentas si no es necesario, y cualquier dato de comportamiento.

Los `salt` y los IV/nonce **no son contraseñas**; su publicidad no invalida por sí misma el cifrado, pero deben utilizarse de acuerdo con el diseño del algoritmo. Se autenticarán los encabezados y la versión pertinentes (por ejemplo como datos asociados) para impedir sustituciones no detectadas cuando corresponda.

## 4. Adversarios y capacidades

| ID | Adversario | Capacidades consideradas | Capacidad que **no** suponemos |
| --- | --- | --- | --- |
| ADV-01 | Sitio web hostil / comprometido | Controla su DOM, scripts, eventos, formularios, navegación y valores insertados | No lee directamente la memoria aislada de una extensión sana por diseño |
| ADV-02 | Operador de phishing | Controla dominio similar, redirecciones, subdominios y formularios engañosos | No posee automáticamente las claves de AegisVault |
| ADV-03 | Extensión maliciosa o comprometida | Puede tener permisos para observar/modificar páginas, formularios o navegación; quizá perfil/navegador según privilegios | No tiene acceso universal garantizado a todo almacenamiento aislado de otras extensiones |
| ADV-04 | Malware local / usuario privilegiado del SO | Puede copiar archivos, registrar teclas, capturar pantalla, inyectar código o leer memoria según privilegios | No se considera un adversario derrotado por la extensión |
| ADV-05 | Persona que roba un respaldo o archivo de bóveda | Posee una copia de los datos cifrados y puede probar contraseñas offline, modificar o reemplazar archivos | No conoce la contraseña maestra inicialmente |
| ADV-06 | Dependencia/actualización maliciosa | Introduce código ejecutable en build o paquete, altera generación o salida de secretos | No se asume detección infalible mediante análisis de dependencias |
| ADV-07 | Usuario legítimo bajo error o engaño | Puede aprobar un sitio equivocado, copiar al portapapeles, olvidar la clave o borrar datos | No se asume que siempre identificará un ataque visual |
| ADV-08 | Proceso concurrente/fallo no malicioso | Reinicio del worker, cierre de navegador, escrituras fallidas, corrupción accidental | No hay intención de ataque, pero puede causar pérdida o fallo inseguro |

## 5. Límites de confianza y flujos de datos

### 5.1 Vista lógica de confianza (propuesta, pendiente de AV-004)

```text
[Persona usuaria]
    | contraseña maestra / confirmación explícita
    v
[UI de extensión: popup / página de bóveda]     [Página web NO CONFIABLE]
    | solicitud autorizada                       ^ DOM visible/controlable
    v                                             |
[Orquestador privilegiado / motor criptográfico]  [Content script: FRONTERA NO CONFIABLE]
    |              ^                             ^  |
    | cifrado     | lectura cifrada               |  | mensajes limitados / campos
    v              |                             |  |
[IndexedDB: solo contenedores cifrados]            |  |
    |                                           protocolo restringido
    |                                          (sin KEK, DEK ni clave maestra)
    +-- [Exportación cifrada] -> [Archivo de respaldo FUERA de la extensión]

[Otro software, otras extensiones, SO, navegador, dependencias]
        = superficies externas con confianza condicionada
```

**Nota de diseño:** el orquestador privilegiado es **un rol**, no una decisión definitiva de proceso o archivo. Chrome puede suspender el service worker, por lo que AV-004 y AV-029 deben determinar el mecanismo real de sesiones, vida de las claves y aislamiento. Los content scripts no se consideran equivalentes a una zona de secretos segura aunque tengan un mundo de ejecución aislado [REF-02, REF-03].

### 5.2 Fronteras numeradas

| ID | De → a | Riesgo de cruzar frontera | Regla prevista |
| --- | --- | --- | --- |
| TB-01 | Usuario → UI de extensión | Captura de contraseña maestra, engaño visual | Solo UI propia; nunca pedir clave maestra en una página web |
| TB-02 | UI → servicio privilegiado | Solicitudes no autorizadas o falsificadas | Canal tipado, validación de emisor y permiso por operación |
| TB-03 | Servicio privilegiado ↔ IndexedDB | Fuga de claro, manipulación, corrupción | Persistir solo datos cifrados y autenticados; fail closed |
| TB-04 | Servicio privilegiado → content script | Exposición de una credencial | Entregar exclusivamente valores autorizados para un relleno concreto; jamás claves |
| TB-05 | Content script ↔ DOM de página | Phishing, manipulación de DOM, exfiltración, cambios durante relleno | Validación de origen y documento, campos permitidos, sin autosubmit; asumir que el sitio ve la contraseña insertada |
| TB-06 | Bóveda → archivo de respaldo | Robo, modificación, sustitución | Contenedor cifrado/autenticado; importación defensiva y transaccional |
| TB-07 | Credencial → portapapeles | Lectura por apps/historial | Copiar solo por gesto explícito; advertencia; sin prometer borrado global |
| TB-08 | npm/CI/actualización → extensión ejecutada | Código malicioso o dependencia comprometida | Versiones fijadas, revisión, sin código remoto en ejecución, reproducibilidad |
| TB-09 | Memoria de sesión ↔ ciclo de vida MV3 | Estado obsoleto o material de clave expuesto | Sesiones invalidadas; no confiar en variables globales del worker |

### 5.3 Flujos legítimos de interés

1. **Crear:** contraseña maestra → KDF → KEK → proteger DEK aleatoria → guardar solo bóveda/DEK cifradas y metadatos mínimos.
2. **Desbloquear:** contraseña maestra → KDF → recuperar DEK autenticada → habilitar únicamente acciones de sesión permitidas.
3. **Consultar/editar:** sesión autorizada → descifrado del registro en contexto privilegiado → UI propia → cifrado nuevo con IV/nonce seguro antes de persistir.
4. **Rellenar:** acción explícita en popup → validar pestaña, origen, frame y estado de sesión → resolver credencial → entregar el secreto mínimo al script que rellena → comprobar contexto inmediatamente antes de aplicarlo → no enviar formulario.
5. **Respaldar/restaurar:** autorización explícita → contenedor cifrado y autenticado → validación de formato, límites, contraseña, integridad y previsualización segura → restauración atómica confirmada.

**Punto ineludible:** al rellenar un campo, la página legítima puede leer su valor por diseño. El relleno manual reduce exposición involuntaria, pero **no puede impedir que el sitio receptor recopile la contraseña que se le entrega**.

## 6. Registro de amenazas y respuestas

Cada amenaza tiene: escenario, prioridad, clasificación de tratabilidad, control esperado, prueba futura y riesgo residual. **Ningún control de la tabla figura como implementado**.

| ID | Escenario de amenaza | STRIDE | Prioridad | Tratabilidad | Control obligatorio / limitación | Prueba prevista / roadmap |
| --- | --- | --- | --- | --- | --- | --- |
| **T-01** | Robo de IndexedDB o perfil: lectura de credenciales en reposo | I | **P0** | Mitigable parcialmente | Cifrar todos los campos privados; nunca persistir KEK/DEK en claro; revisión de residuos | ST-01, ST-02 · AV-015–024, AV-066 |
| **T-02** | Ataque offline de diccionario contra contraseña maestra débil | I | **P0** | Parcial | Argon2id con parámetros evaluados y salt aleatorio; guía sobre frase maestra robusta; **sin promesa de resistencia infinita** | ST-03 · AV-012–015, AV-026 |
| **T-03** | Manipulación de ciphertext, IV, etiquetas o metadatos | T / D | **P0** | Mitigable | AES-GCM autenticado, encabezados asociados y rechazo sin texto parcial; no confirmar operaciones fallidas | ST-04 · AV-016–018, AV-024 |
| **T-04** | Sustitución por una copia antigua pero criptográficamente válida (rollback) | T / D | **P1** | Parcial | AES-GCM por sí solo **no** impide rollback; documentar límites y estudiar versión/antirretroceso sin servidor | ST-05 · AV-023, AV-068 |
| **T-05** | Phishing en dominio parecido, subdominio erróneo o HTTP | S / I | **P0** | Mitigable parcialmente | Coincidencia de **origen completo** (esquema+host+puerto) contra la autorización; HTTPS por defecto; fail closed; selección expresa | ST-06 · AV-046–049, AV-065 |
| **T-06** | Página hostil manipula DOM, eventos o campos antes/después del relleno | I / T | **P0** | Parcial | No confiar en campos o valores DOM, validar contexto, relleno mínimo; **una página autorizada maliciosa puede leer lo rellenado** | ST-07 · AV-045, AV-048–051 |
| **T-07** | `iframe` malicioso recibe datos o simula formulario | S / I | **P0** | Mitigable parcialmente | En MVP, **rechazar relleno en iframes por defecto**; cualquier excepción exige decisión adicional y pruebas de origen del frame | ST-08 · AV-051, AV-065 |
| **T-08** | Content script envía mensajes maliciosos o falsifica solicitud de secreto | S / E / I | **P0** | Mitigable | Content script es menos confiable; validar emisor, esquema, acción y autorización de UI; **no** API «dame contraseña por ID» accesible desde él | ST-09 · AV-011, AV-049 |
| **T-09** | Navegación o cambio de documento entre autorización y entrega (TOCTOU) | S / I | **P0** | Mitigable parcialmente | Vincular autorización a pestaña y documento/frame/origen; revalidar justo antes del relleno; cancelar si cambian; reconocer carreras restantes | ST-10 · AV-046, AV-049–050 |
| **T-10** | XSS/HTML inyectado en popup, listado, notas o nombre de sitio | T / I / E | **P0** | Mitigable | Tratar todo texto como no confiable, usar `textContent`, evitar `innerHTML` no sanitizado y ejecución dinámica; CSP restrictiva | ST-11 · AV-009, AV-053–056, AV-067 |
| **T-11** | Persistencia accidental de secretos en `storage.local`, logs, errores o métricas | I | **P0** | Mitigable | Prohibir secretos en almacenamiento no cifrado, consola, excepciones y telemetría; revisar artefactos | ST-02, ST-12 · AV-003, AV-066 |
| **T-12** | Sesión desbloqueada indebidamente después de bloqueo, inactividad o reinicio | E / I | **P0** | Mitigable parcialmente | Invalidación efectiva, controles por acción, bloqueo por inactividad; definir modelo de reanudación para MV3 | ST-13 · AV-029–031, AV-064 |
| **T-13** | Reinicio del service worker provoca pérdida de estado o restauración insegura de sesión | D / E | **P0** | Mitigable | No depender de globales; recuperación segura o bloqueo explícito; jamás persistir clave maestra/DEK sin protección | ST-14 · AV-029–031, AV-064 |
| **T-14** | Robo de archivo de respaldo cifrado | I | **P0** | Parcial | Respaldo cifrado/autenticado con KDF/versión; contraseña robusta; el robo permite intentos offline | ST-15 · AV-058–060 |
| **T-15** | Respaldo corrupto/malicioso intenta sobrescribir o agotar recursos | T / D | **P0** | Mitigable | Validar tamaño, formato, versión, campos, límites, autenticidad; restauración transaccional y confirmada | ST-16, ST-17 · AV-060–061, AV-068 |
| **T-16** | Contraseña copiada queda visible en portapapeles o historial | I | **P0** | Parcial | Copiar solo tras gesto; informar exposición; considerar borrado condicional como mejor esfuerzo **sin garantía sobre historial** | ST-18 · AV-036, AV-041, AV-056 |
| **T-17** | Malware local obtiene teclado, memoria, pantalla o archivos | I / E | **P0** | **No mitigable por la extensión** | Documentar limitación inequívoca; cifrado en reposo solo eleva coste si la bóveda está bloqueada y las claves no se obtuvieron | ST-19 (documental) · AV-003, AV-069 |
| **T-18** | Extensión con permisos amplios observa DOM, campos rellenados o captura acciones | I / E | **P0** | **No mitigable completamente** | Nunca exponer KEK/DEK a página; advertir que el secreto insertado puede ser observado; minimizar tiempo y superficie de exposición | ST-20 (documental/integración) · AV-049, AV-069 |
| **T-19** | Paquete, dependencia o actualización maliciosa roba secretos | I / E | **P0** | Parcial | Fijar dependencias, revisión de cambios, análisis de paquetes/CI, políticas MV3 sin código remoto, procedencia de artefactos | ST-21 · AV-007, AV-009, AV-067, AV-072 |
| **T-20** | Pérdida u olvido de contraseña maestra | D | **P0** | **No recuperable en v1.0** | Aviso explícito antes de crear; insistir en resguardo seguro de clave y respaldo; no prometer recuperación sin clave | ST-22 (aceptación) · AV-025–028, AV-058–062 |
| **T-21** | Borrado del perfil, desinstalación, fallo de disco o restauración incompleta | D / T | **P0** | Parcial | Respaldo cifrado exportable, restauración en perfil limpio, transacciones y errores de escritura claros | ST-23 · AV-024, AV-058–062, AV-068 |
| **T-22** | IV/nonce repetido, RNG débil o parámetros inválidos | I / T | **P0** | Mitigable | `crypto.getRandomValues`/Web Crypto, generación y control de IV según diseño; límites de uso, vectores de prueba | ST-24 · AV-013–018 |
| **T-23** | La extensión transmite datos o carga código remoto contra la política offline | I | **P0** | Mitigable | Sin backend, telemetría ni recursos ejecutables remotos; inspección de red y empaquetado | ST-25 · AV-003, AV-009, AV-067 |
| **T-24** | Navegador/sitio correcto, pero sitio genuino hackeado roba contraseña introducida | I / S | **P0** | **No mitigable por la extensión** | Validar origen evita sitios distintos, no demuestra legitimidad del código del servidor; explicitar limitación | ST-26 (documental) · AV-051, AV-069 |
| **T-25** | Captura de pantalla, vista previa de secretos o observación física | I | **P1** | Parcial | Ocultar contraseñas por defecto y revelar solo a demanda, bloqueo por inactividad; no controlar capturas del SO | ST-27 · AV-036, AV-053–056 |

### 6.1 Análisis ampliado de las amenazas más delicadas

#### T-01 / T-02 / T-03 — Robo de datos y protección criptográfica

**Ataque:** alguien copia la base de datos cerrada, extrae contenedores, intenta adivinar la contraseña maestra o altera ciphertext. **Defensa esperada:** KEK derivada mediante Argon2id, DEK aleatoria envuelta, AES-256-GCM autenticado y datos sensibles íntegramente cifrados. **Límite:** el cifrado no elimina el ataque offline si la contraseña maestra es adivinable, ni protege cuando la sesión y las claves ya están comprometidas. Tampoco detecta por sí solo un archivo antiguo íntegro (T-04). Los parámetros Argon2id, salt, IV, AAD y límites de uso deben documentarse y probarse antes de implementar [REF-04, REF-05].

**Condición de rechazo:** aparece algún campo privado en claro en IndexedDB/respaldo; una modificación criptográfica se acepta; o se promete recuperación a partir solo de un archivo cifrado sin contraseña.

#### T-05 / T-06 / T-07 / T-09 / T-24 — Rellenar contraseñas en una página

**Ataque:** se abre `login.ejemplo-falso.test` mientras el secreto corresponde a `login.ejemplo.test`; o el formulario cambia de origen, se inserta un iframe o el script de la página registra los valores. La regla **no** se basa en partes del nombre, similitud visual ni en `includes()` sobre cadenas. En v1.0 el relleno se limita al origen explícitamente registrado y autorizado (esquema + host + puerto); los cambios de origen o documento hacen fallar la acción, incluso si ello reduce compatibilidad.

**Defensa esperada:** selección desde la UI de AegisVault, autorización vinculada a la pestaña/documento, permisos de sitio limitados, comprobaciones antes de entregar el secreto y al aplicar el relleno. **Límite fundamental:** una vez insertada la contraseña, el sitio receptor y otros scripts con acceso al mismo DOM pueden observarla. No afirmar que la extensión puede impedirlo. Por esta razón **no** se autorrrellenan campos en la navegación ni se envían formularios automáticamente [REF-02, REF-06, REF-07].

**Condición de rechazo:** cualquier relleno sin selección, en origen no autorizado, en iframe no aprobado o después de navegar a otro documento.

#### T-08 / T-10 / T-12 / T-13 — Privilegios, mensajes y sesión

**Ataque:** un content script presenta mensajes fabricados o una entrada de título maliciosa acaba ejecutándose como HTML en la UI; un reinicio del worker deja un estado de sesión incoherente. **Defensa esperada:** servicio privilegiado sin operaciones arbitrarias abiertas al content script, contrato tipado de mensajes, validación de emisor y campos, escape correcto del DOM, CSP y bloqueo verificable. No se entregarán la contraseña maestra ni las claves al content script.

**Decisión aplazada:** el mecanismo concreto de conservación de sesión se evaluará en AV-029. `chrome.storage.session` es memoria de sesión del navegador, **no** un enclave de seguridad ni una garantía frente a procesos comprometidos; el diseño elegirá minimizar el tiempo de vida de claves y el acceso por contextos, o bloquear de nuevo si no puede mantener garantías [REF-02, REF-03, REF-08, REF-09].

**Condición de rechazo:** mensajes desde content scripts provocan descifrado/exportación arbitrarios; secretos permanecen accesibles después de bloquear; HTML de registros ejecuta código.

#### T-14 / T-15 / T-20 / T-21 — Respaldo, restauración y disponibilidad

**Ataque o fallo:** se pierde el perfil; el respaldo cae en manos ajenas; el archivo fue editado; un importador acepta tamaños imposibles o destruye la bóveda existente; la persona olvidó la clave maestra. **Defensa esperada:** formato versionado, cifrado autenticado, lectura limitada y validada, autenticación previa, confirmación y transacción sin sobrescritura prematura.

**Límite:** no existe «Olvidé mi contraseña» basado en servidor. Un respaldo cifrado es inútil sin su material de desbloqueo. Mantener al menos una copia externa recuperable es responsabilidad explícita del usuario.

**Condición de rechazo:** una importación inválida modifica la bóveda actual; una exportación contiene información privada en claro; una restauración confirmada pierde registros silenciosamente.

#### T-16 / T-17 / T-18 / T-19 — Canales fuera del control de la extensión

**Portapapeles:** una vez copiada la contraseña, otras aplicaciones o el historial del sistema pueden conservarla. Limpiarlo luego puede reducir exposición puntual, **no prueba** que se haya eliminado de todos los sistemas.

**Malware local:** un keylogger puede capturar la contraseña maestra al introducirla o leer información desbloqueada; ninguna decisión criptográfica dentro de la misma sesión arregla por completo esta situación.

**Extensiones maliciosas:** aunque no tengan derecho a extraer directamente IndexedDB de AegisVault, podrían ver el DOM de sitios donde se rellena o comprometer al usuario mediante permisos amplios. El nivel real depende de sus capacidades.

**Cadena de suministro:** una dependencia que se ejecuta dentro de la extensión obtiene la confianza del código en que se integra. Evitar CDN y auditar dependencias reduce superficie, pero no da garantía absoluta.

## 7. Reglas obligatorias derivadas del modelo

| ID | Política de diseño / prohibición | Razón | Se concreta en |
| --- | --- | --- | --- |
| C-01 | Nunca inventar algoritmos de cifrado ni usar `Math.random()` para claves | Reducir fallos criptográficos | AV-012–018 |
| C-02 | Jamás persistir clave maestra, KEK o DEK en claro | Robo del perfil/almacenamiento | AV-015–024, AV-066 |
| C-03 | Cifrar también dominio, usuario, título y notas | Evitar filtración de metadatos | AV-016, AV-019, AV-035 |
| C-04 | Prohibir exponer KEK/DEK/clave maestra en content scripts y mensajes | Frontera menos confiable | AV-004, AV-011, AV-049 |
| C-05 | Relleno solo tras selección explícita y coincidencia de origen completo | Phishing y entregas involuntarias | AV-044–051 |
| C-06 | Denegar iframes por defecto en MVP | Minimizar confusiones entre orígenes | AV-051 |
| C-07 | Nunca enviar formularios automáticamente | Mantener control del usuario | AV-048–052 |
| C-08 | Bloqueo efectivo y permisos por operación, resistentes a reinicios | Sesión MV3 | AV-029–031 |
| C-09 | Prohibir secretos en logs, errores y telemetría | Fugas indirectas | AV-003, AV-066 |
| C-10 | Evitar `innerHTML` con datos no confiables, `eval` y código remoto | XSS / supply chain | AV-009, AV-056, AV-067 |
| C-11 | Backups solo cifrados y restauración validada sin sobrescritura en fallo | Robo/corrupción/pérdida | AV-058–062 |
| C-12 | Sin promesa de protección contra SO/navegador/extensiones comprometidos | Límites físicos y del runtime | AV-003, AV-069–073 |
| C-13 | No pedir acceso permanente a todos los sitios como requisito del MVP | Reducir impacto de abuso de permisos | AV-009, AV-044 |
| C-14 | Pruebas solo con credenciales ficticias, sitios propios y datos sintéticos | No crear incidentes reales | AV-003, AV-063–069 |
| C-15 | Actualizar este documento ante cambio de arquitectura, permisos o superficie | Amenazas evolucionan | AV-004, AV-005, AV-067 |

## 8. Plan de pruebas de seguridad (todavía **NO ejecutadas**)

Las pruebas indican **qué validar** y **cuándo**. Su inclusión no implica cobertura automatizada ni éxito. Cada resultado deberá guardar fecha, versión/navegador, escenario, esperado, observado, responsable y referencia a pruebas/commit.

| ID | Prueba verificable con datos ficticios | Aprobación observable | Roadmap |
| --- | --- | --- | --- |
| **ST-01** | Crear bóveda con nombres, dominios, usuarios y notas centinela y examinar IndexedDB | Ninguna cadena privada aparece persistida en claro | AV-019–024, AV-066 |
| **ST-02** | Inspeccionar almacenamiento, logs, errores y contenido de backup tras operaciones | No hay claves ni secretos en claro fuera de contextos temporales necesarios | AV-024, AV-066 |
| **ST-03** | Probar contraseña errónea, parámetros Argon2id modificados, vectores y benchmark | No desbloquea; esquema KDF reproducible y parámetros documentados | AV-012–015, AV-028 |
| **ST-04** | Cambiar bits de ciphertext, IV, etiqueta, identificador y encabezados autenticados | Operación falla sin descifrado parcial ni sobrescritura | AV-016–018, AV-024 |
| **ST-05** | Sustituir un archivo cifrado por versión anterior válida | Documentar si rollback es detectable; nunca describir AES-GCM como antirrollback | AV-023, AV-068 |
| **ST-06** | Abrir origen correcto y falsos: host parecido, subdominio, HTTP, puerto diferente | Solo se propone y rellena el origen autorizado compatible | AV-046–049, AV-065 |
| **ST-07** | Sitio de prueba que altera campos, atributos y listeners antes/después del relleno | No hay autorización accidental ni fuga a origen distinto; registrar límites DOM | AV-045–051, AV-065 |
| **ST-08** | Formularios en iframe del mismo origen y de origen distinto | No rellenar ningún iframe en v1.0 salvo cambio formal de política | AV-051, AV-065 |
| **ST-09** | Mensajes tipados inválidos, emisor no autorizado, petición directa de secreto | Se rechaza la operación privilegiada sin revelar datos | AV-011, AV-049, AV-063 |
| **ST-10** | Navegar/cambiar frame mientras se elige credencial y antes de ejecutar relleno | Relleno cancelado y sin secretos en documento nuevo | AV-049–050, AV-065 |
| **ST-11** | Guardar títulos/notas con HTML/JS como texto de prueba y mostrarlos | La UI presenta texto literal y no ejecuta script | AV-053–056, AV-065 |
| **ST-12** | Revisar consola de errores ante claves incorrectas, registros corruptos, backup inválido | Errores sin secretos, KDF intermedios o dumps de registro | AV-066 |
| **ST-13** | Bloquear manualmente, agotar inactividad e intentar ver/copiar/editar/rellenar | Toda operación sensible exige desbloqueo nuevo | AV-029–031, AV-064 |
| **ST-14** | Terminar/reiniciar worker antes y después de desbloqueo | Ningún acceso indebido; datos persistentes íntegros | AV-029–031, AV-064 |
| **ST-15** | Exportar respaldo, inspeccionarlo y restaurarlo en perfil limpio | No hay campos privados en claro y los registros son idénticos tras restaurar | AV-058–062 |
| **ST-16** | Importar respaldos truncados, con campos exagerados, versión desconocida y falsos tags | Rechazo con límites de recursos, sin bloqueo permanente ni sustitución de datos | AV-060–061, AV-068 |
| **ST-17** | Forzar cierre o fallo de escritura durante restauración | O permanece bóveda original o existe restauración completa; nunca estado parcial confirmado | AV-061, AV-068 |
| **ST-18** | Copiar contraseña ficticia y verificar UI/advertencia | Copia únicamente bajo gesto, sin afirmación falsa sobre borrado de historial | AV-036, AV-041 |
| **ST-19** | Revisar instrucciones ante equipo infectado y keylogger hipotético | Se documenta explícitamente que no existe protección garantizada | AV-003, AV-069 |
| **ST-20** | Página de prueba observa cambios de campo realizados por AegisVault | Se reconoce/documenta que el sitio receptor puede leer el secreto insertado | AV-049, AV-069 |
| **ST-21** | Revisar lockfile, permisos, bundle final, CSP y solicitudes de red | Sin código ejecutable remoto, cambios injustificados o permisos globales | AV-007, AV-009, AV-067 |
| **ST-22** | Crear bóveda y simular «olvidé contraseña» | Advertencia clara: no hay recuperación de clave maestra ni desbloqueo sin ella | AV-025, AV-058 |
| **ST-23** | Eliminar instalación de prueba y restaurar desde backup externo | Recuperación completa solo con archivo válido y credencial correcta | AV-058–062, AV-068 |
| **ST-24** | Vectores de prueba RNG/KDF/AES-GCM, nonces únicos conforme al diseño | Sin `Math.random` secreto ni reutilización indebida del nonce con misma clave | AV-013–018 |
| **ST-25** | Usar extensión desconectada y revisar tráfico saliente al operar la bóveda | Sin llamadas de telemetría, carga remota ni dependencia de servidor | AV-009, AV-067 |
| **ST-26** | Simular sitio de ensayo con origen autorizado y script hostil | El script puede observar el dato en DOM: limitación registrada sin promesas falsas | AV-051, AV-069 |
| **ST-27** | Abrir detalle con contraseña; ocultar/revelar y bloquear | Oculta por defecto; bloqueo invalida exposición desde la UI propia | AV-036, AV-053–056 |

### 8.1 Correspondencia con AV-001 (criterios P0)

| Pruebas AV-001 | Amenazas/control relevante |
| --- | --- |
| AT-01, AT-02, AT-06 | T-02, T-11, T-12, T-13, T-20 / ST-03, ST-13, ST-14, ST-22 |
| AT-03, AT-04, AT-09, AT-10 | T-01, T-03, T-10, T-11, T-21 / ST-01, ST-02, ST-04, ST-11, ST-23 |
| AT-05 | T-22 / ST-24 |
| AT-07, AT-08 | T-05–T-09, T-24 / ST-06–ST-10, ST-26 |
| AT-11, AT-12 | T-14, T-15, T-20, T-21 / ST-15–ST-17, ST-23 |
| AT-13 | T-23 / ST-25 |
| AT-14 | T-08, T-12, T-13, T-19 / ST-09, ST-13, ST-14, ST-21 |
| AT-15, AT-16 | Todo el registro y límites de alcance; auditoría y documentación |

## 9. Riesgos residuales que no se deben ocultar

| ID | Riesgo residual | Resultado / decisión propuesta |
| --- | --- | --- |
| RR-01 | Robo de bóveda cifrada + contraseña maestra débil | Mitigado en coste, **no eliminado**; una contraseña adivinable puede comprometer todo el contenido |
| RR-02 | Página autorizada que recibe un secreto es maliciosa | La página puede leer lo que se rellena; AegisVault no determina la seguridad de su backend |
| RR-03 | Malware, keylogger, depurador o navegador comprometido | Fuera de la garantía de la extensión; requiere protección del dispositivo y respuesta a incidente |
| RR-04 | Otra extensión capaz de observar formularios | No hay aislamiento universal para secretos ya insertados en páginas web |
| RR-05 | Portapapeles, sincronización del SO o historial | No se promete borrado seguro ni control de copias ajenas |
| RR-06 | Usuario pierde contraseña maestra y respaldos útiles | Posible pérdida definitiva de acceso; no hay puerta trasera de recuperación |
| RR-07 | Rollback a versión antigua de contenedor íntegro | AES-GCM no demuestra frescura; pendiente decisión específica sobre detección de retroceso |
| RR-08 | Fallos de proveedor criptográfico, navegador o cadena de suministro | Dependencia de entorno; exige revisión recurrente y controles de actualización |
| RR-09 | Metadatos técnicos, tamaño de archivo, tiempos de operación | Puede filtrarse información lateral aun con contenidos cifrados; minimizar, documentar y evaluar |
| RR-10 | Contraseña descifrada transitoriamente en memoria de UI o durante relleno | Se reduce duración y alcance; no se garantiza borrado determinista del recolector de basura de JavaScript |

## 10. Registro de decisiones abiertas (para **no inventar arquitectura** en AV-002)

| ID | Pregunta a resolver | Punto responsable | Criterio de decisión |
| --- | --- | --- | --- |
| DEC-01 | ¿Qué contexto conserva claves/sesión cuando MV3 suspende el worker? | AV-004, AV-029, AV-030 | Menor exposición, bloqueo real, pruebas de reinicio |
| DEC-02 | ¿Cómo se identifica la sesión por pestaña/documento y se evita TOCTOU? | AV-004, AV-046, AV-049 | Autorización explícita verificable sin fuga entre orígenes |
| DEC-03 | ¿Cuál es el esquema de encabezados, AAD, IV, versión y cifrado de metadatos? | AV-016, AV-019, AV-023 | Autenticidad, migración segura y pruebas reproducibles |
| DEC-04 | ¿Qué parámetros Argon2id y límites razonables de derivación usar? | AV-012, AV-014 | Medición en equipos objetivo; resistencia vs. accesibilidad |
| DEC-05 | ¿Se implementa protección adicional contra rollback y cómo? | AV-023, AV-068 | No prometer protección de frescura inexistente |
| DEC-06 | ¿Cómo se define el contenedor de backup y la política de reemplazo? | AV-058–061 | Validación robusta, integridad y restauración sin pérdida |
| DEC-07 | ¿Borrado condicional del portapapeles? ¿Qué significa «caducidad»? | AV-036, AV-041, AV-056 | No destruir contenido ajeno ni fingir limpieza garantizada |
| DEC-08 | ¿Qué versiones mínimas verificables de Chrome y Brave soportamos? | AV-009, AV-064 | APIs disponibles y pruebas de compatibilidad |
| DEC-09 | ¿Debemos restringir la operación en incógnito, páginas especiales y orígenes locales? | AV-009, AV-044–051 | Default deny, necesidad explícita y pruebas |

No debemos «resolver» estas preguntas con una suposición de seguridad: si un control no puede implementarse como se propone, se registra una decisión técnica y se **actualiza este documento**.

## 11. Condiciones de cierre de AV-002

La documentación de AV-002 podrá marcarse como **completada (diseño)** únicamente cuando:

- [x] Están identificados los activos de información y sus propiedades de seguridad.
- [x] Están identificados adversarios, capacidades y supuestos de confianza.
- [x] Están representadas las fronteras de confianza y los flujos que manejan secretos.
- [x] Se incluyen explícitamente páginas hostiles, phishing, extensiones comprometidas, malware, robo de respaldo, portapapeles, DOM y pérdida de contraseña maestra.
- [x] Cada amenaza de prioridad P0 tiene **mitigación propuesta + prueba prevista** o una **limitación no mitigable declarada**.
- [x] Hay una matriz que enlaza amenazas con tareas AV-NNN, pruebas ST-NN y aceptación AT-NN de AV-001.
- [x] No se afirma que pruebas futuras ya estén ejecutadas ni que una arquitectura provisional esté validada.
- [ ] El archivo está integrado y revisado en el repositorio del usuario (pendiente de acción del usuario).

**Criterio no incluido en AV-002:** que las mitigaciones estén implementadas, que el navegador esté probado, que las pruebas ST-01..ST-27 pasen o que el proyecto haya superado una auditoría. Eso corresponde a etapas posteriores.

### 11.1 Puerta de seguridad para desarrollos posteriores

Si en una fase futura una prueba P0 falla, se detiene la aceptación de la funcionalidad afectada. Si una limitación declarada resulta incompatible con el alcance AV-001, se reabre el diseño antes de implementar una solución engañosa. Cualquier cambio que autorice iframe, autorrrelleno, sincronización, conexión de red o exportación en claro obliga a revisar formalmente el modelo.

## 12. Fuentes técnicas consultadas

Se usaron documentos primarios y guías de desarrollo para sustentar **riesgos de plataforma** y buenas prácticas, no para afirmar que AegisVault implementa o cumple estos controles.

- **[REF-01] OWASP, Threat Modeling Cheat Sheet:** enfoque de identificación/mitigación y clasificación STRIDE. <https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html>
- **[REF-02] Chrome for Developers, Stay secure:** riesgos de DOM, content scripts y validación de mensajes. <https://developer.chrome.com/docs/extensions/develop/security-privacy/stay-secure>
- **[REF-03] Chrome for Developers, Service worker lifecycle:** suspensión y pérdida de variables globales del worker. <https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle>
- **[REF-04] OWASP, Cryptographic Storage Cheat Sheet:** selección de algoritmos AEAD y gestión de claves. <https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html>
- **[REF-05] OWASP, Password Storage Cheat Sheet:** parámetros y amenazas de Argon2id; aquí se aplica como referencia para derivación de clave de la contraseña maestra. <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- **[REF-06] Chrome for Developers, Message passing:** content scripts menos confiables y mensajes con datos no confiables. <https://developer.chrome.com/docs/extensions/develop/concepts/messaging>
- **[REF-07] Chrome for Developers, Scripting API:** permisos `scripting` + `activeTab` o permisos de host. <https://developer.chrome.com/docs/extensions/reference/api/scripting>
- **[REF-08] Chrome for Developers, Storage API:** áreas `local` y `session`, acceso desde content scripts y su configuración; no implica cifrado automático. <https://developer.chrome.com/docs/extensions/reference/api/storage>
- **[REF-09] Chrome for Developers, StorageArea.setAccessLevel:** control de acceso de contextos a áreas de storage. <https://developer.chrome.com/docs/extensions/reference/api/storage/StorageArea>
- **[REF-10] Chrome for Developers, Improve extension security:** CSP y restricción de código remoto en MV3. <https://developer.chrome.com/docs/extensions/develop/migrate/improve-security>

---

**Siguiente punto:** **AV-003 — Política de seguridad y privacidad**, para convertir estas respuestas previstas y limitaciones en reglas obligatorias, comunicables y revisables (`SECURITY.md` y `docs/security/principles.md`).
