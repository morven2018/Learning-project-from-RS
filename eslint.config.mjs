import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      prettier: prettier,
    },

    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      semi: "error",
      "prefer-const": "error",
      "no-console": "warn",
      // "no-inline-config": "error", - устарело далее замена
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'Program:has(ExpressionStatement[expression.callee.object.name="eslint"][expression.callee.property.name="disable"] ~ Comment)',
          message:
            "Disallow inline ESLint configuration comments.  Use .eslintignore or .eslintrc.js instead.",
        },
        {
          selector:
            'Program:has(ExpressionStatement[expression.callee.object.name="eslint-disable"][expression.callee.property.name="line"] ~ Comment)',
          message:
            "Disallow inline ESLint configuration comments.  Use .eslintignore or .eslintrc.js instead.",
        },
        {
          selector:
            'Program:has(ExpressionStatement[expression.callee.object.name="eslint-disable"][expression.callee.property.name="next"] ~ Comment)',
          message:
            "Disallow inline ESLint configuration comments.  Use .eslintignore or .eslintrc.js instead.",
        },
      ],
      // reportUnusedDisableDirectives: "error",
    },
  },
  {
    files: ["*.js", "*.mjs", "*.cjs"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "explicit", overrides: { constructors: "off" } },
      ],
      "@typescript-eslint/member-ordering": "error",
      "class-methods-use-this": "error",
    },
  },
  { ignores: ["webpack.*.js"] },

  eslintConfigPrettier,
];
