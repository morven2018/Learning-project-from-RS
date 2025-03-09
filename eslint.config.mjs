import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    rules: {
      "prettier/prettier": "error",
      semi: "error",
      "prefer-const": "error",
      "no-console": "warn",
      noInlineConfig: "error",
      reportUnusedDisableDirectives: "error",
    },
  },
  eslintConfigPrettier,
];
