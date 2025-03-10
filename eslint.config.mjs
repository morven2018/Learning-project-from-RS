import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
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
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: "warn",
    },
  },

  {
    ignores: ["webpack.*.js", "node_modules/", "dist/", "build/"],
  },

  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
      },
    },
  },

  eslintConfigPrettier,
];
