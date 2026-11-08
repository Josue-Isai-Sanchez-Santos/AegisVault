import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const forbiddenBrowserGlobals = [
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
  'Document',
  'Window',
];

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**', 'public/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Solo herramientas CLI en Node. El código de la extensión no hereda estos globales.
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs', 'eslint.config.mjs', 'vite.config.ts'],
    languageOptions: {
      globals: { URL: 'readonly', console: 'readonly', process: 'readonly' },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // Defensa adicional: el verificador de arquitectura analiza importaciones reales,
    // dinámicas y módulos alcanzados; este control identifica globales comunes.
    files: [
      'src/core/domain/**/*.{ts,tsx}',
      'src/shared/**/*.{ts,tsx}',
      'src/core/crypto/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-globals': ['error', ...forbiddenBrowserGlobals],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['node:*', 'webextension-polyfill', 'webextension-polyfill/*'],
              message: 'Las capas puras no importan Node ni APIs de extensión.',
            },
          ],
        },
      ],
    },
  },
  prettier,
);
