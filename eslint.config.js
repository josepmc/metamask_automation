import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    ignores: [
      'eslint.config.js',
      '**/dist/*',
      'node_modules/*',
      'tmp/**/*',
      'test-results*',
      '.vscode/*',
      '.env',
      'playwright-report*',
      '.DS_Store',
      'pnpm-lock.yaml',
    ], // Replace .eslintignore
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          legacyDecorators: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    rules: {
      // ...tseslint.configs.recommended.rules,  // Applying recommended rules for TypeScript
      // ...tseslint.configs['strict-type-checked'].rules,  // Strict TypeScript rules
      // ...tseslint.configs['stylistic-type-checked'].rules,  // Stylistic rules
      'import/no-cycle': 'error',
      'no-duplicate-imports': 'error',
      'unicorn/no-await-expression-member': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
];
