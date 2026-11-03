# AegisVault — Política de seguridad

> **Estado del proyecto:** diseño y prototipo. **No existe una versión auditada ni aprobada para proteger credenciales reales.** No introduzcas contraseñas de servicios reales en el software o en pruebas mientras no se haya completado la revisión de seguridad independiente.
>
> **Identificador:** AV-003 · **Ámbito:** AegisVault v1.0, extensión local para Chrome y Brave (Manifest V3) · **Estado del documento:** política definida, pendiente de aceptación e integración en el repositorio.

Esta página describe las reglas públicas de seguridad, el tratamiento de vulnerabilidades y los límites de las garantías de AegisVault. Las disposiciones técnicas verificables y su trazabilidad se encuentran en [`docs/security/principles.md`](docs/security/principles.md). El alcance y las amenazas están en [`docs/scope.md`](docs/scope.md) y [`docs/security/threat-model.md`](docs/security/threat-model.md).

## 1. Estado de versiones y soporte

| Versión | Estado | Soporte de seguridad |
| --- | --- | --- |
| Diseño y prototipos anteriores a v1.0 | En desarrollo, solo laboratorio | No se promete mantenimiento, auditoría ni protección apta para uso real |
| v1.0 | **No publicada** | Por determinar tras pruebas y revisión independiente |

**El repositorio abierto, un ZIP descargable, una compilación correcta o una beta no certifican seguridad.** Antes de anunciar una versión apta para uso real deben documentarse límites, resultados de pruebas, vulnerabilidades conocidas y el dictamen de revisión independiente. Incluso una revisión satisfactoria no significa seguridad absoluta.

## 2. Reglas innegociables de desarrollo y pruebas

1. **Solo credenciales ficticias y entornos autorizados.** Usar cuentas, sitios y bóvedas sintéticas; nunca cuentas personales, institucionales, productivas o de terceros. No copiar datos reales a issues, commits, capturas o adjuntos.
2. **Sin telemetría ni fuga de secretos.** No recopilar ni transmitir contraseña maestra, contraseñas guardadas, claves criptográficas, tokens, contenido de bóveda o metadatos privados. No incluirlos en logs, analíticas, mensajes de error ni reportes.
3. **Sin red iniciada por AegisVault en el MVP.** Ningún backend, API, sincronización, CDN, telemetría, actualización de listas remotas ni solicitudes HTTP(S) propias del código de la extensión. El uso de sitios web y el tráfico del navegador son externos a esta restricción; descargar dependencias durante *desarrollo* no implica que el producto las consulte en ejecución.
4. **Sin criptografía propia.** Utilizar primitivas y bibliotecas conocidas, revisadas y empaquetadas localmente; Argon2id para derivación de material de clave y AES-256-GCM para cifrado autenticado según el diseño pendiente de validación. No usar `Math.random()` para secretos, nonces o claves.
5. **Sin secretos persistidos en claro.** Credenciales, usuarios, títulos, dominios/URL y notas se protegen cifrados en reposo; ningún respaldo exportado expone esos campos. La contraseña maestra ni las claves descifradas se almacenan persistentemente en claro.
6. **Sin autorrelleno ni autoenvío.** Rellenar un sitio requiere desbloqueo, selección expresa de credencial, permiso apropiado y validación estricta de origen/documento. AegisVault **nunca** envía automáticamente el formulario de autenticación.
7. **Sin guardado silencioso.** Las credenciales se crean o modifican por acción expresa en la interfaz. Una propuesta contextual futura solo podrá guardar después de confirmación inequívoca; no es obligatoria en el MVP.
8. **Permisos mínimos y código local.** No solicitar acceso global permanente a todas las páginas; usar `activeTab` o permisos específicos cuando corresponda. No ejecutar scripts remotos, CDN o código dinámico ajeno a la extensión.
9. **Sin falsas garantías.** No afirmar que AegisVault está «auditado», «invulnerable», «imposible de hackear» ni que protege de un sistema operativo, navegador o extensión hostil comprometidos.
10. **Sin recuperación engañosa.** En v1.0 no existe servidor, cuenta remota ni recuperación de la contraseña maestra. Perderla puede volver irrecuperable el contenido de la bóveda, incluso si existe un respaldo cifrado.

El detalle de controles, excepciones, responsables de verificación y evidencias está en `docs/security/principles.md`. Estas son **obligaciones de diseño**, no funcionalidades ya implementadas.

## 3. Límites de protección

AegisVault busca reducir la exposición de secretos almacenados **en reposo** y el riesgo de entregar contraseñas a orígenes incorrectos. No puede garantizar que:

- un sitio legítimo o comprometido deje de leer una contraseña que el usuario decidió introducir en sus formularios;
- malware local, keyloggers, administradores hostiles o extensiones con capacidades de observar formularios no accedan a secretos mostrados, escritos o rellenados;
- el portapapeles del sistema y su historial eliminen todas las copias de un secreto;
- una contraseña maestra débil resista un ataque offline contra una copia de la bóveda;
- un respaldo perdido se recupere sin el material legítimo de desbloqueo.

Estos límites no desaparecen por emplear un algoritmo de cifrado reconocido. Ver [modelo de amenazas](docs/security/threat-model.md).

## 4. Notificación responsable de vulnerabilidades

**Actualmente no hay un canal privado de reporte confirmado.** No publicar pruebas de explotación, contraseñas, archivos de bóveda ni datos personales en issues públicos, discusiones o solicitudes de incorporación.

Cuando exista un repositorio público:

1. Comprobar si está habilitado **GitHub → Security → Advisories → Report a vulnerability**. **Utilizarlo únicamente si está disponible**.
2. Si no se ofrece esa opción, no publicar los detalles sensibles en un issue público. El mantenedor debe habilitar primero un canal privado verificado y actualizar este documento.
3. En un reporte privado, utilizar **solo datos ficticios** y adjuntar: versión o commit, navegador y versión, impacto, pasos mínimos de reproducción, resultado esperado y observado, y archivos de prueba sin secretos reales.
4. Evitar pruebas destructivas, acceso a cuentas ajenas, extracción de información y divulgación pública previa a la coordinación del arreglo.

**Proceso previsto del mantenedor (no un compromiso de plazo):** recibir y clasificar el reporte; reproducirlo con datos sintéticos; evaluar gravedad e impacto; preparar corrección y pruebas de regresión; revisar dependencias; coordinar comunicación y, si procede, publicar un aviso de seguridad. No se prometen tiempos de respuesta mientras no exista infraestructura ni equipo de mantenimiento.

## 5. Divulgación, privacidad y publicación

- La arquitectura v1.0 está prevista como **local, sin servidor y sin telemetría**. No se recopilará analítica de uso, historial de navegación ni información de credenciales para el desarrollador.
- El usuario inicia localmente exportaciones de respaldos cifrados; la custodia del archivo es responsabilidad de quien lo exporta. Importaciones inválidas no deberán modificar la bóveda existente.
- **No se enviarán contraseñas ni metadatos a servicios externos** para comprobar fortaleza, filtraciones, dominios o errores en la v1.0.
- Antes de solicitar publicación en una tienda de extensiones se revisarán sus políticas de privacidad, permisos y divulgación; la documentación deberá describir fielmente el comportamiento implementado, no solo las intenciones del proyecto.
- Cualquier cambio que habilite red, sincronización, telemetría o nuevas clases de datos requiere una nueva decisión de arquitectura, actualización de `docs/scope.md`, del modelo de amenazas y de esta política **antes de programarse**. Esos cambios no se aprueban tácitamente para la v1.0.

## 6. Puerta de seguridad para la versión 1.0

No declarar el producto listo para contraseñas reales ni «auditado» salvo que exista evidencia de:

- pruebas funcionales y de seguridad completas en Chrome y Brave, con cuentas ficticias;
- validación de cifrado, bloqueo, aislamiento, origen y rechazo de archivos manipulados;
- exportación y restauración de un respaldo cifrado en instalación limpia;
- inspección de tráfico y del paquete final, sin solicitudes propias de red o código remoto;
- evaluación de dependencias, controles P0 y limitaciones residuales;
- **revisión independiente de seguridad** con resultados documentados y resolución o aceptación explícita de hallazgos.

Completar estas tareas no constituye por sí mismo una certificación formal. La decisión de uso real será separada y documentada.

## 7. Referencias

- [AegisVault — Principios obligatorios](docs/security/principles.md)
- [AegisVault — Modelo de amenazas](docs/security/threat-model.md)
- [OWASP — Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Chrome — Protect user privacy](https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy)
- [Chrome — Improve extension security](https://developer.chrome.com/docs/extensions/develop/migrate/improve-security)
- [GitHub — Privately reporting a security vulnerability](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately)

---
