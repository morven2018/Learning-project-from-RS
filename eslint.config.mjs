import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },

  eslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
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
      linterOptions: {
        noInlineConfig: true,
        reportUnusedDisableDirectives: true,
      },
    },
  },

  {
    plugins: {
      prettier: prettier,
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
      'max-lines-per-function': [
        'error',
        { max: 40, skipBlankLines: true, skipComments: true },
      ],
      'no-magic-numbers': [
        'warn',
        {
          detectObjects: false,
          enforceConst: false,
          ignore: [0, 1],
          ignoreArrayIndexes: false,
          ignoreClassFieldInitialValues: true,
          ignoreDefaultValues: true,
        },
      ],
      'unicorn/no-lonely-if': 'warn',
      'unicorn/no-nested-ternary': 'warn',
      'unicorn/no-useless-undefined': 'warn',
      'unicorn/prefer-ternary': 'warn',
    },

    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'warn',
    },
  },

  {
    ignores: ['webpack.*.js', 'node_modules/', 'dist/', 'build/'],
  },
  {
    files: ['src/lib/types/enums.ts'],
    rules: {
      'no-magic-numbers': 'off',
    },
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
];
