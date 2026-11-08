/**
 * AV-008 — Comprobación estática de fronteras de importación.
 * Ejecutar con: npm run arch:check
 * No ejecuta código de la extensión ni solicita red.
 */
import { builtinModules } from 'node:module';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const PROJECT_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
export const SRC_ROOT = path.join(PROJECT_ROOT, 'src');

const LAYERS = [
  'core/crypto',
  'core/domain',
  'core/storage',
  'core/session',
  'extension/background',
  'extension/content',
  'ui/popup',
  'ui/vault',
  'shared',
  'tooling', // AV-007: diagnóstico temporal, no lógica de aplicación.
];

export const ALLOWED = Object.freeze({
  'core/domain': ['core/domain'],
  shared: ['shared'],
  'core/crypto': ['core/crypto', 'shared'],
  'core/storage': ['core/storage', 'core/domain', 'core/crypto', 'shared'],
  'core/session': ['core/session', 'core/domain', 'core/crypto', 'shared'],
  'extension/background': [
    'extension/background',
    'core/domain',
    'core/crypto',
    'core/storage',
    'core/session',
    'shared',
  ],
  'extension/content': ['extension/content', 'shared'],
  'ui/popup': ['ui/popup', 'shared'],
  'ui/vault': ['ui/vault', 'shared'],
  tooling: ['tooling', 'shared'],
});

// Pureza estricta para el dominio y tipos/mensajes compartidos.
const PURE_LAYERS = new Set(['core/domain', 'shared', 'core/crypto']);
const BROWSER_SYMBOLS = new Set([
  'chrome',
  'browser',
  'window',
  'document',
  'navigator',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'HTMLElement',
  'HTMLInputElement',
  'Window',
  'Document',
  'self',
  'DOMParser',
  'MutationObserver',
  'FileReader',
]);
const NATIVE_MODULES = new Set(builtinModules.map((name) => name.replace(/^node:/, '')));
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']);

function isWithin(file, base) {
  const rel = path.relative(base, file);
  return rel === '' || (rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel));
}

export function getLayer(file) {
  if (!isWithin(file, SRC_ROOT)) return null;
  const relative = path.relative(SRC_ROOT, file).split(path.sep).join('/');
  return LAYERS.find((layer) => relative.startsWith(`${layer}/`)) ?? null;
}

function ignoredPropertyName(node) {
  const parent = node.parent;
  // x.window es una propiedad del objeto x; window como variable global se rechaza.
  if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
    // globalThis.chrome sigue siendo un acceso directo a un global prohibido.
    return !(ts.isIdentifier(parent.expression) && parent.expression.text === 'globalThis');
  }
  if (ts.isPropertyAssignment(parent) && parent.name === node) return true;
  if (ts.isPropertySignature(parent) && parent.name === node) return true;
  if (ts.isMethodDeclaration(parent) && parent.name === node) return true;
  return false;
}

/**
 * Inspecciona una fuente virtual o real. No importa ni ejecuta el código inspeccionado.
 * @returns {string[]} Mensajes de error; arreglo vacío cuando cumple.
 */
export function inspectSource(file, source) {
  const layer = getLayer(file);
  if (!layer)
    return [`${path.relative(PROJECT_ROOT, file)}: archivo fuera de las capas reconocidas`];
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const errors = [];
  const printError = (node, message) => {
    const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
    errors.push(`${path.relative(PROJECT_ROOT, file)}:${line}: ${message}`);
  };
  const checkSpecifier = (node, rawSpecifier) => {
    // '?' es posible en imports de assets (p. ej. .svg?raw), la ruta sigue siendo local.
    const specifier = rawSpecifier.startsWith('#')
      ? rawSpecifier
      : rawSpecifier.split('?')[0].split('#')[0];
    if (/^(?:https?:|data:|blob:|chrome-extension:)/i.test(specifier)) {
      printError(node, `Código remoto o URL no permitida: ${rawSpecifier}`);
      return;
    }
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      const target = path.resolve(path.dirname(file), specifier);
      if (!isWithin(target, SRC_ROOT)) {
        printError(node, `Importación fuera de src/: ${rawSpecifier}`);
        return;
      }
      const targetLayer = getLayer(target);
      if (!targetLayer || !ALLOWED[layer].includes(targetLayer)) {
        printError(
          node,
          `Dependencia no permitida: ${layer} -> ${targetLayer ?? 'ruta desconocida'} (${rawSpecifier})`,
        );
      }
      return;
    }
    // Evitar que aliases propios eludan la resolución de fronteras.
    if (
      specifier.startsWith('/') ||
      specifier.startsWith('#') ||
      specifier.startsWith('@/') ||
      specifier.startsWith('src/') ||
      specifier.startsWith('@aegisvault/') ||
      specifier.startsWith('file:')
    ) {
      printError(node, `Importación interna no relativa o no permitida: ${rawSpecifier}`);
      return;
    }
    const nativeName = specifier.replace(/^node:/, '');
    if (specifier.startsWith('node:') || NATIVE_MODULES.has(nativeName)) {
      printError(node, `Módulo de Node no permitido en el bundle del navegador: ${rawSpecifier}`);
      return;
    }
    if (PURE_LAYERS.has(layer) && (layer === 'core/domain' || layer === 'shared')) {
      printError(node, `La capa ${layer} no puede importar paquetes externos: ${rawSpecifier}`);
    }
    if (specifier === 'webextension-polyfill' && PURE_LAYERS.has(layer)) {
      printError(node, `API de extensión no permitida en ${layer}`);
    }
  };
  const checkDynamic = (node, expression) => {
    if (!expression || !ts.isStringLiteralLike(expression)) {
      printError(node, 'Importación dinámica/require sin literal: frontera no verificable');
      return;
    }
    checkSpecifier(node, expression.text);
  };
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      if (ts.isStringLiteralLike(node.moduleSpecifier))
        checkSpecifier(node, node.moduleSpecifier.text);
    }
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      checkDynamic(node, node.moduleReference.expression);
    }
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      checkDynamic(node, node.argument.literal);
    }
    if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword)
        checkDynamic(node, node.arguments[0]);
      if (ts.isIdentifier(node.expression) && node.expression.text === 'require') {
        checkDynamic(node, node.arguments[0]);
      }
    }
    if (
      PURE_LAYERS.has(layer) &&
      ts.isElementAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'globalThis' &&
      node.argumentExpression &&
      ts.isStringLiteralLike(node.argumentExpression) &&
      BROWSER_SYMBOLS.has(node.argumentExpression.text)
    ) {
      printError(
        node,
        `Símbolo de navegador prohibido en ${layer}: ${node.argumentExpression.text}`,
      );
    }
    if (PURE_LAYERS.has(layer) && ts.isIdentifier(node) && BROWSER_SYMBOLS.has(node.text)) {
      if (!ignoredPropertyName(node))
        printError(node, `Símbolo de navegador prohibido en ${layer}: ${node.text}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return errors;
}

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(target));
    else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(target);
  }
  return files;
}

export function checkRepository(root = SRC_ROOT) {
  const errors = [];
  const files = walk(root);
  for (const file of files) errors.push(...inspectSource(file, readFileSync(file, 'utf8')));
  return { files: files.length, errors };
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const result = checkRepository();
  if (result.errors.length) {
    console.error(`AV-008: ${result.errors.length} violaciones de arquitectura:`);
    for (const error of result.errors) console.error(` - ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`AV-008: límites de importación verificados (${result.files} archivo(s) fuente).`);
  }
}
