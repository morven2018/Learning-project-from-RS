import { defineConfig } from 'eslint/config';
import globals from 'globals';
// import js from '@eslint/js';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts}'] },

  {
    languageOptions: {
      globals: globals.builtin,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // {
  //   files: ['**/*.{js,mjs,cjs,ts}'],
  //   plugins: { js },
  //   extends: ['js/recommended', 'plugin:prettier/recommended'],
  // },
  {
    languageOptions: {
      globals: globals.builtin,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
  },
  {
    extends: ['prettier'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      unicorn,
      prettier,
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      semi: 'error',
      'prefer-const': 'error',
      'no-console': 'warn',

      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/member-ordering': 'error',

      'class-methods-use-this': 'error',

      'unicorn/better-regex': 'warn',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/no-array-reduce': 'error',

      'max-lines-per-function': [
        'error',
        {
          max: 40,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],

      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],
      'unicorn/no-useless-undefined': 'off',

      linterOptions: {
        noInlineConfig: true,
        reportUnusedDisableDirectives: 'warn',
      },
    },
  },
  {
    ignores: ['webpack.*.js', 'node_modules/', 'dist/', 'build/'],
  },

  {
    files: ['eslint.config.mjs'],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
    },
  },

  eslintConfigPrettier,
]);
