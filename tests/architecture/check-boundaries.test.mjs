import { strict as assert } from 'node:assert';
import path from 'node:path';
import { test } from 'node:test';
import { PROJECT_ROOT, checkRepository, inspectSource } from '../../scripts/check-boundaries.mjs';

const source = (folder, content) =>
  inspectSource(path.join(PROJECT_ROOT, 'src', folder, 'example.ts'), content);

const accepts = (label, folder, content) => {
  test(label, () => assert.deepEqual(source(folder, content), []));
};
const rejects = (label, folder, content, expected) => {
  test(label, () => {
    const errors = source(folder, content);
    assert.ok(errors.length > 0, 'Debe rechazar el caso');
    assert.ok(
      errors.some((error) => error.includes(expected)),
      errors.join('\n'),
    );
  });
};

accepts(
  'dominio puede usar tipos propios',
  'core/domain',
  "import type { A } from './types'; export type B = A;",
);
accepts('shared solo importa shared', 'shared', "export * from './messages';");
accepts(
  'crypto puede importar shared puro',
  'core/crypto',
  "import type { A } from '../../shared/a'; export type B = A;",
);
accepts(
  'worker puede consumir servicios del núcleo',
  'extension/background',
  "import type { A } from '../../core/domain/types'; export type B = A;",
);
accepts(
  'content script puede importar shared',
  'extension/content',
  "import type { A } from '../../shared/messages'; export type B = A;",
);
accepts(
  'propiedades con nombre window no implican API global',
  'core/domain',
  'export type A = { window: string };',
);

rejects(
  'dominio no importa content script',
  'core/domain',
  "import '../../extension/content/inject';",
  'Dependencia no permitida',
);
rejects(
  'dominio no importa componentes UI',
  'core/domain',
  "export * from '../../ui/popup/main';",
  'Dependencia no permitida',
);
rejects(
  'shared no importa worker',
  'shared',
  "import '../extension/background/start';",
  'Dependencia no permitida',
);
rejects(
  'content script no importa claves de crypto',
  'extension/content',
  "import '../../core/crypto/keys';",
  'Dependencia no permitida',
);
rejects(
  'popup no importa repositorio de credenciales',
  'ui/popup',
  "import '../../core/storage/db';",
  'Dependencia no permitida',
);
rejects(
  'storage no importa una UI',
  'core/storage',
  "import '../../ui/vault/view';",
  'Dependencia no permitida',
);
rejects(
  'dominio no importa paquetes de terceros',
  'core/domain',
  "import x from 'some-package';",
  'paquetes externos',
);
rejects('dominio no importa Node', 'core/domain', "import fs from 'node:fs';", 'Módulo de Node');
rejects(
  'dominio no importa globales web',
  'core/domain',
  'export const a = window.location;',
  'Símbolo de navegador',
);
rejects(
  'dominio no usa chrome aunque sea globalThis.chrome',
  'core/domain',
  'export const a = globalThis.chrome;',
  'Símbolo de navegador',
);
rejects(
  'alias package imports se rechaza',
  'core/domain',
  "import '#internal/crypto';",
  'no relativa',
);
rejects(
  'acceso global por clave computada se rechaza',
  'core/domain',
  "export const x = globalThis['chrome'];",
  'Símbolo de navegador',
);
rejects(
  'imports remotos se rechazan',
  'extension/content',
  "import 'https://example.test/x.js';",
  'Código remoto',
);
rejects('shared no usa DOM', 'shared', 'export type A = HTMLElement;', 'Símbolo de navegador');
rejects(
  'reexport type no evade reglas',
  'core/domain',
  "export type { X } from '../../extension/content/types';",
  'Dependencia no permitida',
);
rejects(
  'import type dinámico no evade',
  'core/domain',
  "type X = import('../../extension/content/types').X;",
  'Dependencia no permitida',
);
rejects(
  'import() literal no evade',
  'core/domain',
  "const p = import('../../extension/content/start');",
  'Dependencia no permitida',
);
rejects(
  'import() variable se rechaza',
  'core/domain',
  'const p = import(variable);',
  'frontera no verificable',
);
rejects(
  'require() variable se rechaza',
  'core/domain',
  'const p = require(variable);',
  'frontera no verificable',
);
rejects(
  'alias de proyecto no evade',
  'core/domain',
  "import '@aegisvault/extension/content';",
  'no relativa',
);
rejects(
  'salir de src se rechaza',
  'core/domain',
  "import '../../../scripts/verify-build.mjs';",
  'fuera de src',
);
rejects(
  'archivos fuera de capas registradas se rechazan',
  'unknown',
  'export const ok = true;',
  'fuera de las capas',
);

test('fuentes actuales cumplen arquitectura', () => {
  const result = checkRepository();
  assert.deepEqual(result.errors, [], result.errors.join('\n'));
  assert.ok(result.files >= 1);
});
