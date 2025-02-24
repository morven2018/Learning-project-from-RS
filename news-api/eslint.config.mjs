/* import globals from 'globals';

@type {import('eslint').Linter.Config[]} 
export default [{ languageOptions: { globals: globals.browser } }];*/
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended);
