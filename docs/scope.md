# AegisVault — Alcance funcional de la versión 1.0

| Campo | Valor |
| --- | --- |
| Proyecto | AegisVault |
| Documento | `docs/scope.md` |
| Identificador de trabajo | **AV-001** |
| Versión del documento | 1.0 |
| Estado | **Alcance definido; implementación pendiente** |
| Plataforma objetivo | Extensión de navegador **Google Chrome y Brave**, basada en Chromium y Manifest V3 |
| Enfoque | **Local-first, offline, sin cuentas remotas** |
| Propósito | Delimitar requisitos, casos de uso, exclusiones y condiciones medibles de aceptación de la v1.0 |

> **Importante:** este documento define objetivos y criterios de validación, **no** certifica que AegisVault ya los cumpla. Durante el desarrollo solo se utilizarán credenciales ficticias. No debe usarse para secretos reales antes de completar las verificaciones y una revisión de seguridad independiente.

## 1. Objetivo del producto

AegisVault v1.0 será una extensión que permita a una persona administrar **una bóveda de credenciales cifrada en su navegador**, desbloqueada mediante una contraseña maestra, sin depender de conexión a Internet ni de un servidor propio. La persona podrá añadir, localizar, modificar, eliminar, generar y utilizar credenciales para completar formularios de acceso **solo tras una acción explícita**. También deberá poder crear y restaurar **respaldos cifrados**.

**Problema que resuelve:** reducir la necesidad de recordar y reutilizar contraseñas, evitando que el proyecto dependa de un servicio de almacenamiento remoto.

**No promete:** protección frente a un equipo infectado, otras extensiones privilegiadas o un navegador comprometido; compatibilidad universal con todos los formularios; recuperación de la contraseña maestra perdida; auditoría criptográfica superada.

## 2. Usuarios, condiciones y supuestos

### 2.1 Actor principal

- **Propietario de la bóveda:** persona que utiliza AegisVault en un perfil local de Chrome o Brave; conoce su contraseña maestra y autoriza acciones sensibles.

No existen cuentas remotas, administradores, organizaciones ni funciones multiusuario en la v1.0. Cada perfil de navegador se considera una instalación independiente.

### 2.2 Supuestos explícitos

1. El usuario controla el perfil del navegador, el sistema operativo y la instalación de la extensión.
2. El usuario conserva su contraseña maestra. **Sin ella, no se ofrece mecanismo de recuperación del contenido cifrado.**
3. El usuario es responsable de conservar copias de respaldo fuera del navegador.
4. El navegador ofrece las APIs requeridas de Manifest V3; se validará la compatibilidad real con las versiones objetivo al implementar AV-009 y al probar AV-064.
5. Los sitios web de terceros pueden tener formularios incompatibles o maliciosos; no se garantiza funcionamiento universal.
6. El usuario no debe considerar un dato disponible solo porque aparece listado: su persistencia y recuperación deberán probarse.

## 3. Límites del sistema

| Dentro de AegisVault v1.0 | Fuera de AegisVault v1.0 |
| --- | --- |
| Extensión instalable en Chrome/Brave | Aplicación móvil, de escritorio o Firefox como objetivo de lanzamiento |
| Bóveda local cifrada y contraseña maestra | Cuenta en la nube, API remota, PostgreSQL, servidor y sincronización |
| CRUD, búsqueda local y generación de contraseñas | Gestión empresarial, bóvedas compartidas o acceso multiusuario |
| Selección y rellenado **manual** de credenciales en páginas compatibles | Autocompletado silencioso, envío automático de formularios y acceso global permanente a sitios |
| Exportación y restauración de **respaldos cifrados** | Sincronización de respaldos, recuperación remota y exportación ordinaria en texto plano |
| Bloqueo manual y automático de la sesión | Desbloqueo biométrico, SSO y autenticación remota |
| Funciones de contraseña tradicional (usuario y secreto) | TOTP, passkeys/WebAuthn, tarjetas bancarias, identidades y adjuntos |
| Guardado **manual** desde el formulario de la propia extensión | Guardado automático de contraseñas interceptadas de páginas web |

### 3.1 Qué significa «manual»

- **Rellenado manual:** la extensión solo transfiere la credencial elegida al formulario del sitio después de que el usuario accione el botón o seleccione una cuenta concreta, con comprobación del origen del sitio. Nunca pulsa «Iniciar sesión» automáticamente.
- **Guardado manual:** la credencial se crea o actualiza desde la interfaz de AegisVault a solicitud del usuario. Detectar un formulario no da permiso para almacenar su contenido.
- **AV-052 (roadmap):** puede investigar una sugerencia contextual de guardado **con confirmación explícita**, pero **no forma parte de los criterios obligatorios del MVP**. Cualquier captura automática o silenciosa permanece excluida. Si la propuesta introduce riesgos injustificables, se limitará a guardar desde la interfaz.

### 3.2 Qué significa «offline»

El gestor y sus operaciones sobre la bóveda deben funcionar sin Internet. En operación normal, AegisVault no requiere enviar las credenciales, la contraseña maestra ni el contenido de la bóveda a servicios remotos. Esto **no** significa que los sitios web donde el usuario inicia sesión funcionen offline, ni que un navegador conectado no genere otro tráfico propio.

## 4. Casos de uso (CU)

Los casos siguientes describen comportamientos deseados. No son evidencias de implementación.

### CU-01 — Crear bóveda

- **Actor:** propietario.
- **Precondición:** extensión instalada y sin bóveda inicializada en el perfil.
- **Flujo principal:** abrir extensión → elegir crear bóveda → ingresar y confirmar contraseña maestra → mostrar información sobre recuperación y respaldo → inicializar la bóveda protegida → presentar la bóveda vacía desbloqueada.
- **Alternativas/errores:** contraseñas diferentes o contraseña no válida: se rechaza sin crear bóveda parcial. Error de escritura: se informa el fallo y no se declara creación exitosa.
- **Resultado:** la bóveda inicializada persiste tras cerrar y reabrir el navegador; no contiene credenciales en texto plano.

### CU-02 — Desbloquear bóveda

- **Precondición:** existe una bóveda cifrada y está bloqueada.
- **Flujo:** abrir extensión → introducir contraseña maestra → validar y desbloquear → mostrar contenidos disponibles.
- **Errores:** contraseña errónea o datos manipulados: no se revelan registros ni secretos; mensaje de error sin filtrar material sensible.
- **Resultado:** solo una sesión autorizada permite acceder a registros descifrados.

### CU-03 — Bloquear bóveda

- **Precondición:** existe sesión desbloqueada.
- **Flujo:** seleccionar «Bloquear» o alcanzar el intervalo de inactividad configurado → invalidar la sesión y limitar acceso a información sensible.
- **Resultado:** tras el bloqueo se exige volver a introducir contraseña maestra para ver, copiar, editar o rellenar secretos.
- **Nota:** la estrategia para reanudación y reinicio del *service worker* se definirá en AV-029/AV-030.

### CU-04 — Crear, consultar, editar y eliminar credenciales

- **Precondición:** bóveda desbloqueada.
- **Flujo:** añadir un registro con título, sitio/origen, nombre de usuario, contraseña y nota opcional → guardar → consultar detalles → editar → eliminar tras confirmación.
- **Errores:** datos inválidos, fallos de escritura o operación cancelada: se conserva el estado anterior; no se confirma una acción fallida.
- **Resultado:** cada operación es persistente, verificable y protegida por cifrado.

### CU-05 — Listar y buscar credenciales

- **Precondición:** bóveda desbloqueada con registros.
- **Flujo:** abrir lista → buscar por título, nombre de usuario o sitio → consultar coincidencias → limpiar búsqueda.
- **Resultado:** resultados correctos sin enviar consultas a Internet; no se presenta contenido privado mientras la bóveda esté bloqueada.
- **Nota:** al estar cifrados los campos, la búsqueda se hará tras desbloquear, sin índice persistente en claro de dominios o usuarios.

### CU-06 — Generar contraseña

- **Precondición:** extensión accesible; si se desea almacenar el resultado, bóveda desbloqueada.
- **Flujo:** abrir generador → elegir longitud y conjuntos de caracteres → generar → copiar por acción explícita o utilizar en un registro.
- **Resultado:** la contraseña respeta las opciones seleccionadas y procede de un generador aleatorio criptográficamente seguro.
- **Advertencia:** copiar una contraseña la expone al portapapeles del sistema; no se promete borrado universal del historial del portapapeles.

### CU-07 — Rellenar manualmente un formulario web

- **Precondición:** bóveda desbloqueada, sitio HTTPS compatible y coincidencia segura del origen autorizado.
- **Flujo:** usuario navega al sitio → abre AegisVault → la extensión identifica el origen → muestra cuentas compatibles → el usuario elige una → se rellenan usuario y contraseña en el formulario **sin enviarlo**.
- **Errores:** sitio no coincidente, origen ambiguo, formulario no admitido, `iframe` no autorizado o bóveda bloqueada: no se entrega la contraseña al documento.
- **Resultado:** únicamente se rellenan campos del sitio autorizado tras una acción directa del usuario.

### CU-08 — Exportar respaldo cifrado

- **Precondición:** bóveda desbloqueada.
- **Flujo:** elegir exportar → confirmar acción → generar archivo cifrado versionado → guardarlo en un destino elegido por el usuario.
- **Resultado:** el respaldo no expone contraseñas, títulos, dominios, usuarios ni notas en texto claro; un archivo manipulado no se considera válido al restaurar.

### CU-09 — Importar y restaurar respaldo

- **Precondición:** archivo de respaldo compatible y contraseña necesaria para descifrarlo.
- **Flujo:** seleccionar archivo → validar su formato y autenticidad → autenticar/desbloquear el respaldo → mostrar consecuencias de restaurar → solicitar confirmación → aplicar una restauración atómica.
- **Errores:** contraseña incorrecta, archivo corrupto o formato incompatible: no altera la bóveda existente.
- **Regla MVP:** se garantiza recuperación **en una bóveda vacía o mediante reemplazo expresamente confirmado**; fusionar múltiples bóvedas y resolver duplicados automáticamente **no** es requisito del MVP. AV-061 deberá detallar el tratamiento de conflictos sin introducir cambios silenciosos.
- **Resultado:** registros restaurados íntegramente, verificables tras cerrar y reabrir la extensión.

### CU-10 — Cerrar y reabrir el navegador

- **Precondición:** bóveda con registros guardados.
- **Flujo:** bloquear o cerrar navegador → abrirlo de nuevo → abrir AegisVault → introducir contraseña maestra → comprobar que existen los registros.
- **Resultado:** persistencia correcta, sin requerir un servidor ni una conexión activa.

## 5. Prioridades y definición de versión

- **P0 — Obligatorio:** sin este requisito la **versión 1.0/MVP no se acepta**.
- **P1 — Mejora posterior (1.x):** deseable, pero **no condiciona** la entrega de la versión 1.0.
- **P2 — Futuro o excluido:** no debe incorporarse a la versión 1.0.

**Decisión de alcance:** en este proyecto **MVP y v1.0 comparten el mismo conjunto mínimo obligatorio P0**. No publicaremos una «v1.0» que carezca de exportación/restauración cifrada o controles básicos de bloqueo solo por disponer de una interfaz atractiva.

## 6. Matriz de requisitos funcionales

| ID | Requisito comprobable | Prioridad | CU | Roadmap | Criterio de aceptación resumido |
| --- | --- | :---: | --- | --- | --- |
| RF-001 | Inicializar una bóveda con contraseña maestra | P0 | 01 | AV-025–027 | Se crea y persiste; entradas inválidas no crean estado parcial |
| RF-002 | Desbloquear con contraseña maestra correcta | P0 | 02 | AV-028 | Clave correcta da acceso; clave incorrecta no revela registros |
| RF-003 | Bloqueo manual | P0 | 03 | AV-031 | Tras bloquear no se puede ver ni usar un secreto sin volver a desbloquear |
| RF-004 | Bloqueo automático por inactividad | P0 | 03 | AV-029–031 | El bloqueo ocurre según política y se invalida acceso a secretos |
| RF-005 | Crear credenciales manualmente | P0 | 04 | AV-032–033 | Registro completo se persiste cifrado |
| RF-006 | Listar y visualizar credenciales desbloqueadas | P0 | 04, 05 | AV-034, AV-036 | Los registros se muestran únicamente tras desbloqueo |
| RF-007 | Editar credenciales | P0 | 04 | AV-037 | El cambio persiste sin alterar otros registros |
| RF-008 | Eliminar con confirmación | P0 | 04 | AV-038 | Cancelar conserva; confirmar elimina el registro indicado |
| RF-009 | Buscar localmente por título, usuario o sitio | P0 | 05 | AV-035 | Coincidencias correctas sin consulta remota ni índice sensible persistido en claro |
| RF-010 | Generar contraseñas con opciones configurables | P0 | 06 | AV-039–041 | Longitud y tipos solicitados se cumplen usando aleatoriedad segura |
| RF-011 | Copiar una contraseña mediante acción expresa | P0 | 04, 06 | AV-036, AV-041 | Nunca se copia sin interacción del usuario |
| RF-012 | Identificar origen de la pestaña activa | P0 | 07 | AV-044–046 | Se rechazan orígenes que no coinciden exactamente con los autorizados |
| RF-013 | Mostrar cuentas candidatas para el sitio activo | P0 | 07 | AV-047 | Solo aparecen credenciales que cumplen reglas de coincidencia |
| RF-014 | Rellenar usuario/contraseña **manualmente** | P0 | 07 | AV-048–051 | Solo tras selección y validación, sin autoenvío |
| RF-015 | Exportar respaldo cifrado y autenticado | P0 | 08 | AV-058–059 | Archivo recuperable y sin datos sensibles legibles |
| RF-016 | Importar respaldo válido de manera segura | P0 | 09 | AV-060–061 | Rechazo sin cambios ante archivo inválido; restauración confirmada conserva registros |
| RF-017 | Conservar datos al cerrar/reabrir navegador | P0 | 01, 10 | AV-019–024 | Persistencia íntegra y desbloqueo posterior requerido |
| RF-018 | Mostrar estados y errores comprensibles | P0 | Todos | AV-025–038, AV-056 | No hay falsas confirmaciones ni detalles secretos en mensajes de error |
| RF-019 | Permisos de sitio limitados a acción/autorización | P0 | 07 | AV-009, AV-044 | No se requiere acceso permanente y global a todos los sitios para el MVP |
| RF-020 | Proponer guardar credenciales detectadas con confirmación | P1 | — | AV-052 | Investigación posterior; **no** guardar sin aceptación inequívoca |
| RF-021 | Informe de contraseñas reutilizadas | P1 | — | AV-042–043 | Procesamiento solo local, con bóveda desbloqueada |
| RF-022 | Personalización visual y preferencias ampliadas | P1 | — | AV-053–057 | No bloquea el flujo P0 ni la seguridad básica |

### 6.1 Requisitos no funcionales y controles mínimos

| ID | Control esperado | Prioridad | Evidencia de aceptación | Roadmap |
| --- | --- | :---: | --- | --- |
| RNF-001 | Confidencialidad en reposo | P0 | Inspección de IndexedDB/respaldo: **título, sitio, usuario, contraseña y notas** nunca persistidos en claro | AV-015–024, AV-066 |
| RNF-002 | Cifrado autenticado | P0 | Cambiar bytes cifrados/etiquetas provoca fallo sin exposición parcial | AV-016–018 |
| RNF-003 | Derivación de clave resistente a ataques de diccionario | P0 | Argon2id con parámetros documentados y pruebas reproducibles; no algoritmos caseros | AV-012–015 |
| RNF-004 | Separación de confianza | P0 | Los scripts inyectados jamás reciben contraseña maestra ni clave maestra de datos; solo valor autorizado para un sitio validado | AV-004, AV-049 |
| RNF-005 | Funcionamiento local y sin telemetría | P0 | Casos de uso sobre bóveda se completan con conexión deshabilitada; sin peticiones salientes de la extensión para telemetría | AV-003, AV-063–067 |
| RNF-006 | Comportamiento seguro ante errores | P0 | Fallos de almacenamiento, bloqueo, corrupción y restauración no pierden ni revelan secretos silenciosamente | AV-024, AV-068 |
| RNF-007 | Seguridad ante phishing y orígenes falsos | P0 | No se rellena en dominio parecido, subdominio no autorizado, origen cambiado o `iframe` no aprobado | AV-046, AV-049–051, AV-065 |
| RNF-008 | Sesión resistente al reinicio del worker | P0 | Suspender/reiniciar el worker no concede acceso sin autorización ni destruye la bóveda | AV-029–031, AV-064 |
| RNF-009 | Compatibilidad verificable | P0 | Casos del MVP pasan en versiones objetivo de Chrome y Brave; versiones mínimas se registran durante pruebas | AV-009, AV-064, AV-072 |
| RNF-010 | Respaldo y restauración verificados | P0 | Exportación → importación en instalación limpia → igualdad de registros; un archivo corrupto no sustituye datos | AV-058–062, AV-068 |
| RNF-011 | Revisión de seguridad previa a usos reales | P0 | Hallazgos críticos corregidos, riesgos residuales documentados y revisión independiente; sin prometer auditoría o certificación inexistente | AV-069–073 |
| RNF-012 | Accesibilidad básica | P0 | Flujos esenciales completables con teclado y mensajes comprensibles | AV-056 |

**Nota técnica:** Argon2id se utilizará para **derivar una clave de protección** a partir de la contraseña maestra y AES-256-GCM para el cifrado autenticado de registros. Una contraseña que el gestor necesita rellenar no se puede almacenar únicamente como hash irreversible. La elección de parámetros concretos se validará en AV-012/AV-014.

## 7. Exclusiones explícitas / control de cambios

| ID | Excluido de v1.0 | Razón o condición para reconsiderar |
| --- | --- | --- |
| EX-001 | Backend, servidor propio, PostgreSQL, API de sincronización | Evitar superficie remota antes de validar seguridad local |
| EX-002 | Sincronización entre equipos o perfiles | Requiere estrategia de claves, conflictos y recuperación adicional |
| EX-003 | Aplicaciones Android/iOS, escritorio y extensión Firefox como objetivo v1.0 | Primero estabilizar el núcleo Chromium |
| EX-004 | Generación/almacenamiento de códigos TOTP | Requiere diseño adicional de secretos, reloj y UX |
| EX-005 | Passkeys/WebAuthn y autenticador externo | APIs y modelo de confianza distintos |
| EX-006 | Guardar automáticamente credenciales capturadas | Prohibido guardar sin petición y confirmación explícita |
| EX-007 | Autorrellenado silencioso o envío automático de login | Riesgo de filtración a formularios, orígenes y páginas hostiles |
| EX-008 | Importar CSV o exportar contraseñas en texto claro como vía ordinaria | Riesgo de dejar secretos en disco sin cifrado; no necesario para MVP |
| EX-009 | Compartir credenciales, organizaciones y múltiples usuarios | Diseño de permisos e intercambio remoto no contemplado |
| EX-010 | Recuperación de contraseña maestra desde correo, soporte o cuenta | No existe servicio remoto capaz de restablecer los secretos |
| EX-011 | Almacenamiento de tarjetas, documentos adjuntos e identidades completas | Extiende el modelo de datos y amenazas fuera del MVP |
| EX-012 | Garantizar compatibilidad con todos los sitios, `iframes` y aplicaciones SPA | Los formularios varían; siempre se prioriza no revelar un secreto |

**Regla:** cualquier solicitud fuera de estos límites se registra para una fase futura o se formaliza con una decisión de cambio; no se incorpora silenciosamente al MVP.

## 8. Definición verificable de MVP (v1.0)

El MVP está **terminado** únicamente cuando **todas** las condiciones siguientes son demostrables con credenciales ficticias en un perfil limpio de Chrome y Brave:

| Prueba de aceptación | Procedimiento observable | Resultado requerido |
| --- | --- | --- |
| AT-01 Crear | Instalar → crear bóveda con contraseña maestra → cerrar/reabrir extensión | Bóveda disponible y protegida |
| AT-02 Error de contraseña | Bloquear → usar contraseña incorrecta → intentar consultar | Acceso denegado y cero secretos visibles |
| AT-03 CRUD | Crear 2 registros → editar 1 → eliminar el otro → reabrir | Estado final exacto, sin cambios inesperados |
| AT-04 Búsqueda | Crear registros con diferentes títulos, usuarios y sitios → filtrar | Se listan solo las coincidencias esperadas |
| AT-05 Generador | Pedir diferentes longitudes y clases de caracteres | Salidas con las propiedades seleccionadas y fuente aleatoria segura |
| AT-06 Bloqueo | Bloquear manualmente y esperar expiración automática en pruebas separadas | Operaciones sensibles exigen desbloqueo nuevamente |
| AT-07 Rellenado correcto | Abrir sitio HTTPS de pruebas con origen autorizado → seleccionar credencial | Se rellenan campos correctos; no se envía formulario |
| AT-08 Rellenado incorrecto | Abrir dominio parecido, `iframe` no autorizado o pestaña que cambió de origen | No se entrega contraseña a un origen no autorizado |
| AT-09 Persistencia | Crear registros → cerrar/reabrir navegador → desbloquear | Todos los registros siguen disponibles íntegros |
| AT-10 Confidencialidad | Inspeccionar contenido persistente IndexedDB y archivo exportado | Ningún campo privado aparece en texto claro |
| AT-11 Respaldo | Exportar bóveda cifrada → restaurar en instalación limpia y autorizada | Registros completos, sin pérdida ni alteración |
| AT-12 Corrupción | Alterar respaldo → intentar restaurar en bóveda con datos | Se rechaza y la bóveda original queda intacta |
| AT-13 Sin red | Desconectar Internet → crear, editar, buscar, generar, exportar/importar localmente | Operaciones de bóveda siguen funcionando |
| AT-14 Permisos y sesiones | Revisar permisos; reiniciar *service worker*; volver a probar acceso | No hay permiso global innecesario ni acceso indebido a secretos |
| AT-15 Calidad | Ejecutar pruebas automáticas, análisis de dependencias y revisión de seguridad | Sin fallos bloqueantes ni vulnerabilidades críticas conocidas abiertas |
| AT-16 Documentación | Instalar desde instrucciones, reproducir pruebas y comprender limitaciones | Usuario técnico independiente puede repetir las comprobaciones |

### 8.1 Regla de aprobación

`MVP APROBADO = RF P0 implementados + RNF P0 verificados + AT-01..AT-16 aprobadas + revisión de seguridad de AV-069 sin bloqueos críticos.`

- Una prueba no ejecutada se considera **pendiente**, nunca «aprobada».
- Una prueba que funcione solo en Chrome o solo en Brave **no** acredita compatibilidad de v1.0.
- El MVP no se aprueba si el respaldo no puede restaurarse aunque el resto de las funciones opere.
- El MVP tampoco se aprueba si la extensión rellena un secreto en un origen no autorizado.
- Publicar el repositorio **no** equivale a publicar una versión segura para almacenar contraseñas reales.

## 9. Trazabilidad entre etapas

| Necesidad | Desarrollo | Verificación principal |
| --- | --- | --- |
| Crear/desbloquear/bloquear | AV-025–031 | AT-01, AT-02, AT-06 |
| Cifrado y persistencia | AV-012–024 | AT-09, AT-10, AT-12 |
| Gestión y búsqueda | AV-032–038 | AT-03, AT-04 |
| Generación | AV-039–041 | AT-05 |
| Detección y rellenado manual | AV-044–051 | AT-07, AT-08, AT-14 |
| Respaldos y recuperación | AV-058–062 | AT-11, AT-12 |
| Robustez, documentación y lanzamiento | AV-063–073 | AT-13, AT-15, AT-16 |

Los ítems AV-042–043 (análisis de contraseñas duplicadas), AV-052 (sugerencia contextual de guardado) y AV-053–057 (mejoras de interfaz) pueden implementarse conforme al roadmap, pero **no sustituyen** ninguna condición P0; el análisis de contraseñas duplicadas y la sugerencia contextual no bloquean la aceptación del MVP.

## 10. Decisiones reservadas para fases posteriores

Estas cuestiones **no deben inventarse ni darse por resueltas en AV-001**:

| Tema pendiente | Punto donde se resuelve | Restricción ya fijada |
| --- | --- | --- |
| Modelo exhaustivo de amenazas | AV-002 | Reconocer riesgos de malware local y sitios hostiles |
| Política de tratamiento de secretos, auditoría y reportes | AV-003 | No telemetría ni contraseñas reales en pruebas |
| Contratos entre componentes y modelo de confianza | AV-004 | Content scripts no reciben claves maestras |
| Versiones exactas de navegador y esquema de permisos | AV-009 y AV-064 | Chromium MV3 con permisos mínimos |
| Implementación Argon2id, parámetros, claves, formato | AV-012–018 | Criptografía estándar, autenticada, versionada |
| Índices, transacciones y formato IndexedDB | AV-019–024 | Campos sensibles cifrados en reposo |
| Política exacta de bloqueo y ubicación de claves de sesión | AV-029–031 | Sin persistencia de clave maestra en claro |
| Regla exacta de origen y `iframes` | AV-044–051 | Ningún llenado sin autorización de sitio y usuario |
| Formato de respaldo, reemplazo/compatibilidad | AV-058–062 | Respaldos solo cifrados y restauración segura |
| Matriz de navegadores, auditoría y lanzamiento | AV-063–073 | Sin utilizar credenciales reales antes de revisión |

## 11. Checklist de cierre de AV-001 (solo documentación)

- [x] Se definió el objetivo de la v1.0 y el perfil de usuario.
- [x] Se describieron los casos de uso CU-01 a CU-10, con errores y resultados esperados.
- [x] Se registraron los requisitos RF/RNF y prioridades P0, P1, P2.
- [x] Se enumeraron las exclusiones EX-001 a EX-012.
- [x] Se estableció la definición concreta del MVP y las pruebas AT-01 a AT-16.
- [x] Se definió la separación entre guardado manual y guardado automático.
- [x] Se añadieron referencias técnicas de respaldo.
- [ ] Los archivos fueron incorporados y revisados en el repositorio Git del usuario (requiere acción posterior).

**Estado de AV-001:** **documentación preparada**. La verificación de AV-001 se limita a los documentos; todavía no existen tests funcionales ejecutados ni una extensión implementada.

## 12. Referencias técnicas consultadas

1. Chrome for Developers — [Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions). Fundamenta el uso de permisos mínimos y concesión por sitio.
2. Chrome for Developers — [Scripting API](https://developer.chrome.com/docs/extensions/reference/api/scripting). Describe permisos de `scripting` y `activeTab` para inyección bajo demanda.
3. Chrome for Developers — [Storage and cookies](https://developer.chrome.com/docs/extensions/develop/concepts/storage-and-cookies). Explica uso de IndexedDB en el origen de la extensión.
4. Chrome for Developers — [Extension service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle). Explica la suspensión y pérdida de variables globales del worker.
5. OWASP — [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html). Base de la confidencialidad en reposo y autenticación de datos.
6. OWASP — [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Base de la selección y ajuste de Argon2id; distingue hashing de cifrado recuperable.

> **Uso de las fuentes:** las referencias fundamentan decisiones técnicas y limitaciones de plataformas; los códigos CU, RF, RNF, EX y AT, las prioridades y la delimitación del MVP son decisiones del proyecto AegisVault, no requisitos oficiales de Chrome ni de OWASP.
